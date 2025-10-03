// hooks/useWifiRegistry.ts
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { useState } from 'react';
import WifiRegistryABI from '../contracts/WifiRegistry.json';

// Contract address
const CONTRACT_ADDRESS = '0x582f74e5fbceC0f4c74BEBFdAd7Ea56649CFf12d' as `0x${string}`;

interface Hotspot {
  id: bigint;
  owner: `0x${string}`;
  ssid: string;
  location: string;
  pricePerMB: bigint;
  active: boolean;
}

interface AccessVoucher {
  hotspotId: bigint;
  quotaMB: bigint;
  expiry: bigint;
  accessCode: string;
}

export const useWifiRegistry = () => {
  const { address, isConnected } = useAccount();
  const [error, setError] = useState<string | null>(null);

  const contractConfig = {
    address: CONTRACT_ADDRESS,
    abi: WifiRegistryABI.abi,
  };

  // Read contract data
  const { data: hotspotsData, isLoading: hotspotsLoading, refetch: refetchHotspots } = useReadContract({
    ...contractConfig,
    functionName: 'getAllHotspots',
  });

  // Get user's voucher
  const { data: userVoucher, isLoading: voucherLoading, refetch: refetchVoucher } = useReadContract({
    ...contractConfig,
    functionName: 'getMyVoucher',
    args: [address],
    query: {
      enabled: !!address,
    },
  });

  // Check if user's voucher is valid
  const { data: isVoucherValid } = useReadContract({
    ...contractConfig,
    functionName: 'isVoucherValid',
    args: [address],
    query: {
      enabled: !!address,
    },
  });

  // Write contract functions
  const { writeContract: writeRegisterHotspot, isPending: isRegistering } = useWriteContract();
  const { writeContract: writeBuyAccess, isPending: isBuying } = useWriteContract();
  const { writeContract: writeSetHotspotActive, isPending: isSettingActive } = useWriteContract();
  const { writeContract: writeUseVoucher, isPending: isUsingVoucher } = useWriteContract();
  const { writeContract: writeWithdrawFunds, isPending: isWithdrawing } = useWriteContract();

  const hotspots = (hotspotsData as Hotspot[]) || [];
  const voucher = userVoucher as AccessVoucher;

  // Register new hotspot
  const registerHotspot = async (ssid: string, location: string, pricePerMB: string) => {
    if (!isConnected || !address) {
      throw new Error('Wallet not connected');
    }

    try {
      setError(null);
      
      const hash = await writeRegisterHotspot({
        ...contractConfig,
        functionName: 'registerHotspot',
        args: [ssid, location, parseEther(pricePerMB)],
      });

      // Refetch hotspots after successful registration
      setTimeout(() => {
        refetchHotspots();
      }, 2000);

      return hash;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to register hotspot';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  // Buy access to hotspot
  const buyAccess = async (hotspotId: number, quotaMB: number, durationSeconds: number) => {
    if (!isConnected || !address) {
      throw new Error('Wallet not connected');
    }

    try {
      setError(null);

      // Find hotspot to calculate price
      const hotspot = hotspots.find(h => Number(h.id) === hotspotId);
      if (!hotspot) {
        throw new Error('Hotspot not found');
      }

      const totalPrice = hotspot.pricePerMB * BigInt(quotaMB);

      const hash = await writeBuyAccess({
        ...contractConfig,
        functionName: 'buyAccess',
        args: [BigInt(hotspotId), BigInt(quotaMB), BigInt(durationSeconds)],
        value: totalPrice,
      });

      // Refetch voucher after purchase
      setTimeout(() => {
        refetchVoucher();
      }, 2000);

      return hash;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to buy access';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  // Set hotspot active/inactive
  const setHotspotActive = async (hotspotId: number, active: boolean) => {
    if (!isConnected || !address) {
      throw new Error('Wallet not connected');
    }

    try {
      setError(null);

      const hash = await writeSetHotspotActive({
        ...contractConfig,
        functionName: 'setHotspotActive',
        args: [BigInt(hotspotId), active],
      });

      setTimeout(() => {
        refetchHotspots();
      }, 2000);

      return hash;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update hotspot status';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  // Use voucher
  const useVoucher = async () => {
    if (!isConnected || !address) {
      throw new Error('Wallet not connected');
    }

    try {
      setError(null);

      const hash = await writeUseVoucher({
        ...contractConfig,
        functionName: 'useVoucher',
      });

      setTimeout(() => {
        refetchVoucher();
      }, 2000);

      return hash;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to use voucher';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  // Withdraw funds
  const withdrawFunds = async () => {
    if (!isConnected || !address) {
      throw new Error('Wallet not connected');
    }

    try {
      setError(null);

      const hash = await writeWithdrawFunds({
        ...contractConfig,
        functionName: 'withdrawFunds',
      });

      return hash;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to withdraw funds';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  // Format price for display
  const formatPrice = (priceInWei: bigint) => {
    return formatEther(priceInWei);
  };

  // Calculate total price for MB quota
  const calculateTotalPrice = (hotspotId: number, quotaMB: number) => {
    const hotspot = hotspots.find(h => Number(h.id) === hotspotId);
    if (!hotspot) return BigInt(0);
    return hotspot.pricePerMB * BigInt(quotaMB);
  };

  // Check if voucher is expired
  const isVoucherExpired = () => {
    if (!voucher || !voucher.expiry) return true;
    return Number(voucher.expiry) * 1000 < Date.now();
  };

  // Get user's owned hotspots
  const getUserHotspots = () => {
    if (!address) return [];
    return hotspots.filter(hotspot => hotspot.owner.toLowerCase() === address.toLowerCase());
  };

  return {
    // State
    hotspots,
    voucher,
    isLoading: hotspotsLoading || voucherLoading || isRegistering || isBuying || isSettingActive || isUsingVoucher || isWithdrawing,
    error,
    
    // Loading states
    isRegistering,
    isBuying,
    isSettingActive,
    isUsingVoucher,
    isWithdrawing,
    
    // Actions
    registerHotspot,
    buyAccess,
    setHotspotActive,
    useVoucher,
    withdrawFunds,
    refetchHotspots,
    refetchVoucher,
    
    // Utils
    formatPrice,
    calculateTotalPrice,
    isVoucherExpired,
    isVoucherValid: !!isVoucherValid,
    getUserHotspots,
    
    // Contract info
    contractAddress: CONTRACT_ADDRESS,
  };
};