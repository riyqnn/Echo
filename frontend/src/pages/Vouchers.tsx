import { useState, useEffect } from 'react';
import { Ticket, Clock, Wifi, Shield, CheckCircle, XCircle, AlertCircle, Loader2, Copy, QrCode, Calendar, Database } from 'lucide-react';
import { useWifiRegistry } from '../hooks/useWifiRegistry';
import { useAccount } from 'wagmi';

function Vouchers() {
  const { isConnected } = useAccount();
  const {
    voucher,
    isLoading,
    error,
    isUsingVoucher,
    isVoucherValid,
    isVoucherExpired,
    useVoucher,
    formatPrice,
    hotspots
  } = useWifiRegistry();

  const [copied, setCopied] = useState(false);
  const [useSuccess, setUseSuccess] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('');

  // Get hotspot details for the voucher
  const hotspotDetails = voucher && hotspots ? 
    hotspots.find(h => Number(h.id) === Number(voucher.hotspotId)) : null;

  // Update countdown timer
  useEffect(() => {
    if (!voucher || !voucher.expiry) return;

    const updateTimer = () => {
      const now = Math.floor(Date.now() / 1000);
      const expiry = Number(voucher.expiry);
      const diff = expiry - now;

      if (diff <= 0) {
        setTimeRemaining('Expired');
        return;
      }

      const days = Math.floor(diff / 86400);
      const hours = Math.floor((diff % 86400) / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      const seconds = diff % 60;

      if (days > 0) {
        setTimeRemaining(`${days}d ${hours}h ${minutes}m`);
      } else if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
      } else if (minutes > 0) {
        setTimeRemaining(`${minutes}m ${seconds}s`);
      } else {
        setTimeRemaining(`${seconds}s`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [voucher]);

  const handleCopyAccessCode = async () => {
    if (!voucher?.accessCode) return;
    
    try {
      await navigator.clipboard.writeText(voucher.accessCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleUseVoucher = async () => {
    try {
      await useVoucher();
      setUseSuccess(true);
      setTimeout(() => setUseSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to use voucher:', err);
    }
  };

  const formatQuota = (quotaMB: number | string) => {
    const mb = Number(quotaMB);
    if (mb >= 1024) {
      return `${(mb / 1024).toFixed(1)} GB`;
    }
    return `${mb} MB`;
  };

  // Wallet not connected
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-white font-mono font-bold pt-24 border-4 border-black">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-12 p-8 bg-yellow-200 border-5 border-black shadow-brutal-xl">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500 border-4 border-black mb-6 shadow-brutal">
              <AlertCircle className="w-8 h-8 text-black" />
            </div>
            <h2 className="text-2xl font-black text-black mb-4 uppercase tracking-wider border-b-4 border-black pb-2">
              WALLET NOT CONNECTED
            </h2>
            <p className="text-black font-bold uppercase tracking-wide">
              CONNECT YOUR WALLET TO VIEW VOUCHERS
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-white font-mono font-bold pt-24 border-4 border-black">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="p-6 bg-red-500 border-5 border-black shadow-brutal-xl text-white font-black uppercase tracking-wide">
            <div className="flex items-center gap-4">
              <AlertCircle className="w-8 h-8 text-white border-3 border-white rounded-full p-1" />
              <div>
                <h3 className="text-xl font-black">ERROR LOADING VOUCHER</h3>
                <p className="mt-2 p-2 bg-white text-black border-3 border-black">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-mono font-bold pt-24 border-4 border-black">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 p-8 bg-purple-200 border-5 border-black shadow-brutal-xl">
          <div className="flex items-center gap-4 border-b-4 border-black pb-4">
            <div className="w-16 h-16 bg-black border-4 border-black flex items-center justify-center shadow-brutal">
              <Ticket className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-black text-black uppercase tracking-wider">
                MY VOUCHERS
              </h1>
              <p className="text-lg text-black font-bold uppercase tracking-wide mt-2">
                MANAGE YOUR WIFI ACCESS VOUCHERS
              </p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="p-8 bg-gray-200 border-5 border-black shadow-brutal-xl">
            <div className="flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-black animate-spin border-3 border-black rounded-full" />
              <span className="ml-4 text-black font-black uppercase tracking-wide">
                LOADING YOUR VOUCHERS...
              </span>
            </div>
          </div>
        )}

        {/* No Voucher State */}
        {!isLoading && (!voucher || !voucher.accessCode) && (
          <div className="text-center py-12 p-8 bg-gray-100 border-5 border-black shadow-brutal-xl">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-400 border-4 border-black mb-6 shadow-brutal">
              <Ticket className="w-10 h-10 text-black" />
            </div>
            <h3 className="text-2xl font-black text-black mb-4 uppercase tracking-wider border-b-4 border-black pb-2 inline-block">
              NO ACTIVE VOUCHERS
            </h3>
            <p className="text-black font-bold uppercase tracking-wide mb-6 p-4 bg-white border-3 border-black shadow-brutal">
              YOU DON'T HAVE ANY ACTIVE WIFI ACCESS VOUCHERS YET
            </p>
            <button className="btn-brutal text-lg font-black uppercase tracking-wider px-8 py-4">
              EXPLORE HOTSPOTS
            </button>
          </div>
        )}

        {/* Active Voucher */}
        {!isLoading && voucher && voucher.accessCode && (
          <div className="space-y-8">
            {/* Success Message */}
            {useSuccess && (
              <div className="p-4 bg-green-400 border-5 border-black shadow-brutal text-black font-black uppercase tracking-wide">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-black border-3 border-black rounded-full p-0.5" />
                  <span>VOUCHER USED SUCCESSFULLY!</span>
                </div>
              </div>
            )}

            {/* Main Voucher Card */}
            <div className="bg-white border-5 border-black shadow-brutal-xl">
              {/* Header with Status */}
              <div className={`p-6 border-b-5 border-black ${
                isVoucherValid && !isVoucherExpired() 
                  ? 'bg-green-200' 
                  : 'bg-red-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 border-4 border-black flex items-center justify-center shadow-brutal ${
                      isVoucherValid && !isVoucherExpired() 
                        ? 'bg-green-500' 
                        : 'bg-red-500'
                    }`}>
                      {isVoucherValid && !isVoucherExpired() ? (
                        <CheckCircle className="w-8 h-8 text-white" />
                      ) : (
                        <XCircle className="w-8 h-8 text-white" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-black uppercase tracking-wider border-b-3 border-black pb-1">
                        WIFI ACCESS VOUCHER
                      </h2>
                      <p className={`text-sm font-black uppercase tracking-wider mt-2 p-2 border-3 border-black shadow-brutal ${
                        isVoucherValid && !isVoucherExpired() 
                          ? 'bg-green-400 text-black' 
                          : 'bg-red-400 text-white'
                      }`}>
                        {isVoucherValid && !isVoucherExpired() ? 'ACTIVE & VALID' : 'EXPIRED OR INVALID'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Timer */}
                  <div className="text-right p-4 bg-white border-4 border-black shadow-brutal">
                    <div className="flex items-center gap-2 text-black mb-2 border-b-2 border-black pb-1">
                      <Clock className="w-4 h-4 border-2 border-black rounded p-0.5" />
                      <span className="text-xs font-black uppercase">TIME REMAINING</span>
                    </div>
                    <div className={`text-lg font-black uppercase ${
                      timeRemaining === 'Expired' ? 'text-red-500' : 'text-black'
                    }`}>
                      {timeRemaining}
                    </div>
                  </div>
                </div>
              </div>

              {/* Voucher Details */}
              <div className="p-8 space-y-8">
                {/* Access Code */}
                <div className="bg-gray-100 border-5 border-black shadow-brutal p-6">
                  <div className="flex items-center justify-between mb-4 border-b-4 border-black pb-3">
                    <h3 className="text-xl font-black text-black uppercase tracking-wide flex items-center gap-3">
                      <QrCode className="w-6 h-6 border-3 border-black rounded p-0.5" />
                      ACCESS CODE
                    </h3>
                    <button
                      onClick={handleCopyAccessCode}
                      className={`px-4 py-2 border-4 border-black font-black uppercase tracking-wide text-sm transition-all duration-200 ${
                        copied 
                          ? 'bg-green-400 text-black shadow-brutal' 
                          : 'bg-purple-400 text-black hover:bg-purple-300 shadow-brutal hover:shadow-brutal-lg'
                      }`}
                    >
                      <Copy className="w-4 h-4 inline mr-2" />
                      {copied ? 'COPIED!' : 'COPY'}
                    </button>
                  </div>
                 <div className="p-6 bg-black border-4 border-black text-purple-400 text-center text-3xl font-black uppercase tracking-widest font-mono border-dashed break-all overflow-hidden">
                    {voucher.accessCode}
                  </div>

                  <p className="text-sm text-black text-center mt-4 font-bold uppercase tracking-wide p-2 bg-yellow-200 border-3 border-black shadow-brutal">
                    USE THIS CODE TO CONNECT TO THE WIFI NETWORK
                  </p>
                </div>

                {/* Voucher Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Hotspot Info */}
                  {hotspotDetails && (
                    <div className="bg-blue-100 border-5 border-black shadow-brutal p-6">
                      <div className="flex items-center gap-3 mb-4 border-b-3 border-black pb-2">
                        <Wifi className="w-6 h-6 border-3 border-black rounded p-0.5" />
                        <h4 className="font-black text-black uppercase tracking-wide">NETWORK</h4>
                      </div>
                      <p className="text-black font-black text-lg uppercase mb-2 p-2 bg-white border-3 border-black shadow-brutal">
                        {hotspotDetails.ssid}
                      </p>
                      <p className="text-black font-bold uppercase text-sm mb-2 p-2 bg-gray-200 border-2 border-black">
                        {hotspotDetails.location}
                      </p>
                      <p className="text-xs text-black font-bold uppercase p-2 bg-yellow-200 border-2 border-black">
                        HOTSPOT ID: {Number(voucher.hotspotId)}
                      </p>
                    </div>
                  )}

                  {/* Data Quota */}
                  <div className="bg-green-100 border-5 border-black shadow-brutal p-6">
                    <div className="flex items-center gap-3 mb-4 border-b-3 border-black pb-2">
                      <Database className="w-6 h-6 border-3 border-black rounded p-0.5" />
                      <h4 className="font-black text-black uppercase tracking-wide">DATA QUOTA</h4>
                    </div>
                    <p className="text-3xl font-black text-black uppercase mb-2 p-3 bg-white border-4 border-black shadow-brutal text-center">
                      {formatQuota(Number(voucher.quotaMB))}
                    </p>
                    <p className="text-sm text-black font-bold uppercase text-center p-2 bg-green-200 border-2 border-black">
                      AVAILABLE DATA
                    </p>
                  </div>

                  {/* Expiry Date */}
                  <div className="bg-yellow-100 border-5 border-black shadow-brutal p-6">
                    <div className="flex items-center gap-3 mb-4 border-b-3 border-black pb-2">
                      <Calendar className="w-6 h-6 border-3 border-black rounded p-0.5" />
                      <h4 className="font-black text-black uppercase tracking-wide">EXPIRES</h4>
                    </div>
                    <p className="text-black font-bold mb-2 p-3 bg-white border-3 border-black shadow-brutal text-center">
                     {formatQuota(Number(voucher.quotaMB))}
                    </p>
                    <p className="text-sm text-black font-bold uppercase text-center p-2 bg-yellow-200 border-2 border-black">
                      LOCAL TIME
                    </p>
                  </div>

                  {/* Price Info */}
                  {hotspotDetails && (
                    <div className="bg-purple-100 border-5 border-black shadow-brutal p-6">
                      <div className="flex items-center gap-3 mb-4 border-b-3 border-black pb-2">
                        <Shield className="w-6 h-6 border-3 border-black rounded p-0.5" />
                        <h4 className="font-black text-black uppercase tracking-wide">RATE</h4>
                      </div>
                      <p className="text-black font-black text-lg mb-2 p-3 bg-white border-3 border-black shadow-brutal text-center">
                        {formatPrice(hotspotDetails.pricePerMB)} U2U/MB
                      </p>
                      <p className="text-sm text-black font-bold uppercase text-center p-2 bg-purple-200 border-2 border-black">
                        NETWORK RATE
                      </p>
                    </div>
                  )}
                </div>

                {/* Use Voucher Button */}
                <div className="flex justify-center pt-6">
                  <button
                    onClick={handleUseVoucher}
                    disabled={isUsingVoucher || !isVoucherValid || isVoucherExpired()}
                    className={`px-12 py-6 border-5 border-black font-black text-xl uppercase tracking-wider transition-all duration-300 ${
                      isVoucherValid && !isVoucherExpired()
                        ? 'bg-purple-400 text-black hover:bg-purple-300 shadow-brutal-xl hover:shadow-brutal hover:transform hover:translate-x-1 hover:translate-y-1'
                        : 'bg-gray-400 text-gray-700 cursor-not-allowed shadow-brutal'
                    }`}
                  >
                    {isUsingVoucher ? (
                      <div className="flex items-center gap-3">
                        <Loader2 className="w-6 h-6 animate-spin border-3 border-black rounded-full" />
                        PROCESSING...
                      </div>
                    ) : (
                      <>
                        {isVoucherValid && !isVoucherExpired() ? (
                          <div className="flex items-center gap-3">
                            <Wifi className="w-6 h-6 border-3 border-black rounded p-0.5" />
                            USE VOUCHER
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <XCircle className="w-6 h-6 border-3 border-black rounded p-0.5" />
                            {isVoucherExpired() ? 'EXPIRED' : 'INVALID'}
                          </div>
                        )}
                      </>
                    )}
                  </button>
                </div>

                {/* Instructions */}
                <div className="bg-blue-200 border-5 border-black shadow-brutal p-6">
                  <h4 className="font-black text-black mb-4 flex items-center gap-3 uppercase tracking-wide border-b-4 border-black pb-2">
                    <AlertCircle className="w-6 h-6 border-3 border-black rounded p-0.5" />
                    HOW TO USE YOUR VOUCHER
                  </h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-white border-3 border-black shadow-brutal">
                      <span className="text-black font-black uppercase text-sm">
                        1. CONNECT TO WIFI: <span className="p-1 bg-blue-300 border-2 border-black">{hotspotDetails?.ssid || 'NETWORK'}</span>
                      </span>
                    </div>
                    <div className="p-3 bg-white border-3 border-black shadow-brutal">
                      <span className="text-black font-black uppercase text-sm">
                        2. ENTER THE ACCESS CODE WHEN PROMPTED
                      </span>
                    </div>
                    <div className="p-3 bg-white border-3 border-black shadow-brutal">
                      <span className="text-black font-black uppercase text-sm">
                        3. CLICK "USE VOUCHER" TO ACTIVATE ACCESS
                      </span>
                    </div>
                    <div className="p-3 bg-white border-3 border-black shadow-brutal">
                      <span className="text-black font-black uppercase text-sm">
                        4. ENJOY YOUR INTERNET CONNECTION!
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Vouchers;