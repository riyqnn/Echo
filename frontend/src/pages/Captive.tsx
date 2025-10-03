import React, { useState, useEffect } from 'react';
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from 'wagmi';
import { Wifi, Clock, Database, CheckCircle, AlertCircle, Loader2, Zap } from 'lucide-react';
import { useWifiRegistry } from '../hooks/useWifiRegistry';

const CaptivePortal = () => {
  const { address, isConnected } = useAccount();
  const { 
    hotspots = [], 
    userSessions = [], 
    isLoading: isLoadingContract,
    validateVoucher,
    isValidating,
    formatPrice 
  } = useWifiRegistry() || {};
  
  const [accessCode, setAccessCode] = useState('');
  const [macAddress, setMacAddress] = useState('');
  const [validationStatus, setValidationStatus] = useState(null);
  const [validationError, setValidationError] = useState('');
  const [activeSession, setActiveSession] = useState(null);
  const [currentHotspot, setCurrentHotspot] = useState(null);

  // Get current network info from URL params or default
  const urlParams = new URLSearchParams(window.location.search);
  const hotspotId = urlParams.get('hotspot') || '1';

  // Simulated MAC address
  useEffect(() => {
    const simulatedMAC = 'AA:BB:CC:DD:EE:' + Math.random().toString(16).substr(2, 2).toUpperCase();
    setMacAddress(simulatedMAC);
  }, []);

  // Get current hotspot info
  useEffect(() => {
    if (hotspots.length > 0) {
      const hotspot = hotspots.find(h => Number(h.id) === Number(hotspotId));
      if (hotspot) {
        setCurrentHotspot(hotspot);
      }
    }
  }, [hotspots, hotspotId]);

  // Check for active session
  useEffect(() => {
    if (isConnected && userSessions && userSessions.length > 0) {
      // Find active session for this hotspot
      const session = userSessions.find(s => 
        Number(s.hotspotId) === Number(hotspotId) && 
        s.active &&
        new Date(Number(s.expiresAt) * 1000) > new Date()
      );
      
      if (session) {
        setActiveSession(session);
        setValidationStatus('success');
      }
    }
  }, [isConnected, userSessions, hotspotId]);

  const handleValidateVoucher = async () => {
    if (!accessCode || !isConnected) return;
    
    setValidationError('');
    setValidationStatus(null);

    try {
      // Call smart contract to validate voucher
      const result = await validateVoucher(accessCode, Number(hotspotId));
      
      if (result.success) {
        setValidationStatus('success');
        setActiveSession(result.session);
      } else {
        setValidationStatus('error');
        setValidationError(result.error || 'Invalid voucher code');
      }
    } catch (error) {
      console.error('Validation error:', error);
      setValidationStatus('error');
      setValidationError(error.message || 'Failed to validate voucher');
    }
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatQuota = (mb) => {
    if (mb >= 1024) {
      return `${(mb / 1024).toFixed(1)} GB`;
    }
    return `${mb} MB`;
  };

  const getRemainingTime = (expiresAt) => {
    const now = new Date();
    const expiry = new Date(Number(expiresAt) * 1000);
    const diff = Math.max(0, Math.floor((expiry - now) / 1000));
    return formatDuration(diff);
  };

  if (isLoadingContract) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-2 py-8">
        <div className="max-w-md w-full bg-white border-4 border-black shadow-brutal-xl font-mono p-8 text-center">
          <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin" />
          <p className="font-black text-lg uppercase">Loading Network Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-2 py-8 pt-32 md:pt-24">
      <div className="max-w-md w-full bg-white border-4 border-black shadow-brutal-xl font-mono">
        {/* Header */}
        <div className="bg-black text-white p-5 text-center border-b-4 border-black">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Wifi className="w-7 h-7" />
            <h1 className="text-2xl font-black uppercase tracking-wider">Captive Portal</h1>
          </div>
          <p className="text-xs opacity-80 font-bold">DePIN Hotspot Network</p>
        </div>

        {/* Network Info */}
        <div className="p-4 bg-purple-50 border-b-4 border-black">
          {currentHotspot ? (
            <>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="font-black text-lg uppercase">{currentHotspot.ssid}</h2>
                  <p className="text-xs text-gray-700">{currentHotspot.location}</p>
                </div>
                <div className="text-right">
                  <div className={`px-3 py-1 border-2 border-black font-black text-xs ${
                    currentHotspot.active ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                  }`}>
                    {currentHotspot.active ? 'ACTIVE' : 'OFFLINE'}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div className="bg-white p-2 border-2 border-black">
                  <div className="text-xs font-bold text-gray-600">PRICE/MB</div>
                  <div className="font-black text-sm">{formatPrice(currentHotspot.pricePerMB)} U2U</div>
                </div>
                <div className="bg-white p-2 border-2 border-black">
                  <div className="text-xs font-bold text-gray-600">HOTSPOT ID</div>
                  <div className="font-black text-sm">#{Number(currentHotspot.id)}</div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <AlertCircle className="w-8 h-8 mx-auto mb-2 text-red-600" />
              <p className="font-black text-sm">HOTSPOT NOT FOUND</p>
            </div>
          )}
          {macAddress && (
            <div className="text-xs bg-white p-2 border-2 border-black mt-2 font-bold tracking-wide">
              <span>Device MAC: </span>
              <span className="font-mono">{macAddress}</span>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="p-6">
          {!isConnected ? (
            <div className="text-center space-y-4">
              <div className="text-red-700 font-black">
                <AlertCircle className="w-9 h-9 mx-auto mb-2" />
                WALLET NOT CONNECTED
              </div>
              <p className="text-xs text-gray-600 mb-3 uppercase font-bold">
                Connect your wallet to access this wifi network
              </p>
              <ConnectButton.Custom>
                {({ openConnectModal }) => (
                  <button
                    onClick={openConnectModal}
                    className="w-full px-5 py-3 bg-blue-500 text-white border-4 border-black font-black uppercase tracking-wide hover:bg-blue-400 transition-all duration-150 shadow-brutal"
                  >
                    Connect Wallet
                  </button>
                )}
              </ConnectButton.Custom>
            </div>
          ) : validationStatus === 'success' && activeSession ? (
            <div className="text-center space-y-5">
              <div className="text-green-700 font-black">
                <CheckCircle className="w-9 h-9 mx-auto mb-2" />
                ACCESS GRANTED!
              </div>
              <div className="space-y-3 text-left">
                <div className="bg-green-100 p-3 border-3 border-green-400 rounded shadow-brutal">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-5 h-5" />
                    <span className="font-bold text-xs uppercase">Time Remaining</span>
                  </div>
                  <p className="text-xl font-black text-green-700 font-mono">
                    {getRemainingTime(activeSession.expiresAt)}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 border-3 border-blue-400 rounded shadow-brutal">
                  <div className="flex items-center gap-2 mb-1">
                    <Database className="w-5 h-5" />
                    <span className="font-bold text-xs uppercase">Data Quota</span>
                  </div>
                  <p className="text-xl font-black text-blue-700 font-mono">
                    {formatQuota(Number(activeSession.quotaMB))}
                  </p>
                </div>
                <div className="bg-purple-100 p-3 border-3 border-purple-400 rounded shadow-brutal">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-5 h-5" />
                    <span className="font-bold text-xs uppercase">Session ID</span>
                  </div>
                  <p className="text-sm font-black text-purple-700 font-mono break-all">
                    #{Number(activeSession.id)}
                  </p>
                </div>
              </div>
              <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded border-2 border-black mt-4">
                <p className="font-bold">Your device now has internet access.</p>
                <p className="mt-1">Session expires: {new Date(Number(activeSession.expiresAt) * 1000).toLocaleString()}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-black mb-2 uppercase tracking-wide">
                  Access Code / Voucher
                </label>
                <input
                  type="text"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                  placeholder="Enter your voucher code"
                  className="w-full p-3 border-4 border-black font-mono text-center text-lg tracking-wider uppercase bg-gray-50 focus:bg-yellow-50 focus:outline-none"
                  maxLength={16}
                  autoFocus
                  disabled={isValidating}
                />
                <p className="text-xs text-gray-600 mt-2 font-bold">
                  Enter the voucher code you purchased from the Explore page
                </p>
              </div>
              <button
                onClick={handleValidateVoucher}
                disabled={!accessCode || isValidating || !currentHotspot?.active}
                className="w-full px-4 py-3 bg-black text-white border-4 border-black font-black uppercase tracking-wider hover:bg-gray-800 transition-all duration-150 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-brutal"
              >
                {isValidating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Validating...
                  </>
                ) : (
                  'Grant Access'
                )}
              </button>
              {validationStatus === 'error' && (
                <div className="text-center text-red-700 font-black mt-2 p-3 bg-red-100 border-3 border-red-500 rounded">
                  <AlertCircle className="w-6 h-6 mx-auto mb-1" />
                  {validationError || 'Invalid Access Code'}
                  <p className="text-xs text-gray-600 mt-2 font-bold">
                    Please check your voucher and try again
                  </p>
                </div>
              )}
              {!currentHotspot?.active && (
                <div className="text-center text-orange-700 font-black mt-2 p-3 bg-orange-100 border-3 border-orange-500 rounded">
                  <AlertCircle className="w-6 h-6 mx-auto mb-1" />
                  This hotspot is currently offline
                </div>
              )}
            </div>
          )}
        </div>

        {/* Wallet Info */}
        {isConnected && (
          <div className="p-3 bg-gray-50 border-t-4 border-black">
            <div className="flex items-center justify-between text-xs font-black">
              <span className="text-gray-700">Connected:</span>
              <span className="font-mono">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
            </div>
            {userSessions && userSessions.length > 0 && (
              <div className="mt-2 text-xs font-bold text-gray-600">
                Active Sessions: {userSessions.filter(s => s.active).length}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="p-3 bg-black text-white text-center text-xs tracking-wider font-bold border-t-4 border-black">
          Powered by ECHO DePIN Network
        </div>
      </div>
    </div>
  );
};

export default CaptivePortal;