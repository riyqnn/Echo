import React, { useState, useEffect } from 'react';
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from 'wagmi';
import { Wifi, Clock, Database, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const CaptivePortal = () => {
  const { address, isConnected } = useAccount();
  const [accessCode, setAccessCode] = useState('');
  const [macAddress, setMacAddress] = useState('');
  const [validationStatus, setValidationStatus] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [sessionInfo, setSessionInfo] = useState(null);
  const [networkInfo] = useState({
    ssid: 'Fanial',
    signalStrength: 85,
    location: 'East Jakarta'
  });

  // Simulated MAC address
  useEffect(() => {
    const simulatedMAC = 'AA:BB:CC:DD:EE:FF';
    setMacAddress(simulatedMAC);
  }, []);

  const validateVoucher = async () => {
    if (!accessCode || !isConnected) return;
    setIsValidating(true);
    setValidationStatus(null);

    try {
      // Simulate backend API call
      setTimeout(() => {
        if (accessCode.length >= 6) {
          setValidationStatus('success');
          setSessionInfo({
            durationSeconds: 3600, // 1 hour
            quotaMB: 1000, // 1GB
            startTime: new Date().toISOString()
          });
        } else {
          setValidationStatus('error');
        }
        setIsValidating(false);
      }, 2000);
    } catch (error) {
      setValidationStatus('error');
      setIsValidating(false);
    }
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const formatQuota = (mb) => {
    if (mb >= 1024) {
      return `${(mb / 1024).toFixed(1)} GB`;
    }
    return `${mb} MB`;
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-2 py-8">
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
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="font-black text-lg uppercase">{networkInfo.ssid}</h2>
              <p className="text-xs text-gray-700">{networkInfo.location}</p>
            </div>
            <div className="text-right">
              <div className="text-xs font-black uppercase">Signal</div>
              <div className="text-green-700 font-black text-lg">{networkInfo.signalStrength}%</div>
            </div>
          </div>
          {macAddress && (
            <div className="text-xs bg-white p-2 border-3 border-black mt-2 font-bold rounded-md tracking-wide">
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
          ) : validationStatus === 'success' ? (
            <div className="text-center space-y-5">
              <div className="text-green-700 font-black">
                <CheckCircle className="w-9 h-9 mx-auto mb-2" />
                ACCESS GRANTED!
              </div>
              {sessionInfo && (
                <div className="space-y-3 text-left">
                  <div className="bg-green-100 p-3 border-3 border-green-400 rounded shadow-brutal">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-5 h-5" />
                      <span className="font-bold text-xs uppercase">Session Duration</span>
                    </div>
                    <p className="text-xl font-black text-green-700 font-mono">
                      {formatDuration(sessionInfo.durationSeconds)}
                    </p>
                  </div>
                  <div className="bg-blue-100 p-3 border-3 border-blue-400 rounded shadow-brutal">
                    <div className="flex items-center gap-2 mb-1">
                      <Database className="w-5 h-5" />
                      <span className="font-bold text-xs uppercase">Data Quota</span>
                    </div>
                    <p className="text-xl font-black text-blue-700 font-mono">
                      {formatQuota(sessionInfo.quotaMB)}
                    </p>
                  </div>
                </div>
              )}
              <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded border mt-4">
                Your device now has internet access.<br />You may close this window.
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-black mb-2 uppercase tracking-wide">
                  Access Code
                </label>
                <input
                  type="text"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                  placeholder="Enter your voucher code"
                  className="w-full p-3 border-4 border-black font-mono text-center text-lg tracking-wider uppercase bg-gray-50 focus:bg-yellow-50 focus:outline-none"
                  maxLength={16}
                  autoFocus
                />
              </div>
              <button
                onClick={validateVoucher}
                disabled={!accessCode || isValidating}
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
                <div className="text-center text-red-700 font-black mt-2">
                  <AlertCircle className="w-6 h-6 mx-auto mb-1" />
                  Invalid Access Code
                  <p className="text-xs text-gray-600 mt-1 font-bold">
                    Please check your voucher and try again
                  </p>
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
          </div>
        )}

        {/* Footer */}
        <div className="p-3 bg-black text-white text-center text-xs tracking-wider font-bold border-t-4 border-black">
          Powered by ECHO
        </div>
      </div>
    </div>
  );
};

export default CaptivePortal;