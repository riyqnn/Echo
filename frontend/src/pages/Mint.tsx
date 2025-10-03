import React, { useState } from 'react';
import { useWifiRegistry } from '../hooks/useWifiRegistry';
import { useAccount } from 'wagmi';
import { Wifi, MapPin, DollarSign, Loader2, CheckCircle, AlertCircle, Zap } from 'lucide-react';

function Mint() {
  const { isConnected } = useAccount();
  const { registerHotspot, isRegistering, error } = useWifiRegistry();
  
  const [formData, setFormData] = useState({
    ssid: '',
    location: '',
    pricePerMB: ''
  });
  const [success, setSuccess] = useState(false);
  const [transactionHash, setTransactionHash] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.ssid || !formData.location || !formData.pricePerMB) {
      return;
    }

    try {
      const hash = await registerHotspot(
        formData.ssid,
        formData.location,
        formData.pricePerMB
      );
      
      if (hash) {
        setTransactionHash(hash);
        setSuccess(true);
        
        // Reset form after successful registration
        setFormData({
          ssid: '',
          location: '',
          pricePerMB: ''
        });
        
        // Hide success message after 5 seconds
        setTimeout(() => setSuccess(false), 5000);
      }
      
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  const isFormValid = formData.ssid && formData.location && formData.pricePerMB && isConnected;

  return (
    <div className="min-h-screen bg-white font-mono font-bold pt-24 border-4 border-black">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 p-8 bg-white border-5 border-black shadow-brutal-xl">
          <div className="flex items-center gap-4 border-b-4 border-black pb-4 mb-6">
            <div className="w-16 h-16 bg-black border-4 border-black flex items-center justify-center shadow-brutal">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-black text-black uppercase tracking-wider">
                MINT WIFI HOTSPOT
              </h1>
              <p className="text-lg text-black font-bold uppercase tracking-wide mt-2">
                REGISTER YOUR WIFI HOTSPOT ON THE BLOCKCHAIN
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Form Card */}
          <div className="bg-white border-5 border-black shadow-brutal-xl">
            <div className="p-6 border-b-5 border-black bg-purple-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-black border-4 border-black flex items-center justify-center shadow-brutal">
                  <Wifi className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-black text-black uppercase tracking-wide border-b-2 border-black pb-1">
                  REGISTER HOTSPOT
                </h2>
              </div>
            </div>

            <div className="p-8">
              {/* Success Message */}
              {success && (
                <div className="mb-6 p-4 bg-green-400 border-4 border-black shadow-brutal text-black font-black uppercase tracking-wide">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-black border-2 border-black rounded-full" />
                    <div>
                      <p className="font-black">HOTSPOT REGISTERED!</p>
                      {transactionHash && (
                        <p className="text-xs mt-1 normal-case p-2 bg-white border-2 border-black shadow-brutal">
                          TX: {transactionHash.slice(0, 10)}...{transactionHash.slice(-8)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-500 border-4 border-black shadow-brutal text-white font-black uppercase tracking-wide">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-white border-2 border-white rounded-full" />
                    <p>{error}</p>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {/* SSID Input */}
                <div>
                  <label className="block text-black font-bold uppercase tracking-wide mb-3 flex items-center gap-2">
                    <Wifi className="w-4 h-4 border-2 border-black rounded p-0.5" />
                    NETWORK SSID
                  </label>
                  <input
                    type="text"
                    name="ssid"
                    value={formData.ssid}
                    onChange={handleInputChange}
                    placeholder="e.g., CAFEWIFI_PREMIUM"
                    className="w-full p-4 border-4 border-black font-mono font-bold bg-white shadow-brutal focus:bg-yellow-100 transition-all duration-300"
                    required
                  />
                </div>

                {/* Location Input */}
                <div>
                  <label className="block text-black font-bold uppercase tracking-wide mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4 border-2 border-black rounded p-0.5" />
                    LOCATION
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g., DOWNTOWN COFFEE SHOP, JAKARTA"
                    className="w-full p-4 border-4 border-black font-mono font-bold bg-white shadow-brutal focus:bg-blue-100 transition-all duration-300"
                    required
                  />
                </div>

                {/* Price Input */}
                <div>
                  <label className="block text-black font-bold uppercase tracking-wide mb-3 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 border-2 border-black rounded p-0.5" />
                    PRICE PER MB (U2U)
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    name="pricePerMB"
                    value={formData.pricePerMB}
                    onChange={handleInputChange}
                    placeholder="0.001"
                    className="w-full p-4 border-4 border-black font-mono font-bold bg-white shadow-brutal focus:bg-green-100 transition-all duration-300"
                    required
                  />
                  <p className="text-xs mt-3 text-gray-600 font-bold uppercase tracking-wide">
                    RECOMMENDED: 0.001 - 0.01 U2U/MB
                  </p>
                </div>

                {/* Connection Status */}
                {!isConnected && (
                  <div className="p-6 bg-red-500 border-4 border-black text-white font-black text-center uppercase tracking-wide shadow-brutal">
                    <AlertCircle className="w-6 h-6 mx-auto mb-2 border-2 border-white rounded-full" />
                    CONNECT YOUR WALLET TO REGISTER
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={!isFormValid || isRegistering}
                  className={`w-full p-6 font-black uppercase tracking-wider border-4 border-black transition-all duration-300 flex items-center justify-center gap-3 ${
                    !isFormValid || isRegistering 
                      ? 'bg-gray-400 text-gray-700 cursor-not-allowed shadow-brutal' 
                      : 'bg-purple-400 text-black hover:bg-purple-300 shadow-brutal-xl hover:shadow-brutal hover:transform hover:translate-x-1 hover:translate-y-1'
                  }`}
                >
                  {isRegistering ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin border-2 border-black rounded-full" />
                      REGISTERING...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 border-2 border-black rounded p-0.5" />
                      MINT HOTSPOT NFT
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Info Panel */}
          <div className="space-y-8">
            {/* Features Card */}
            <div className="bg-white border-5 border-black shadow-brutal-xl">
              <div className="p-6 border-b-5 border-black bg-blue-200">
                <h3 className="text-xl font-black text-black uppercase tracking-wide border-b-2 border-black pb-1">
                  WHAT YOU GET
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 border-4 border-black shadow-brutal">
                    <div className="flex items-center gap-3 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600 border-2 border-black rounded-full" />
                      <p className="text-black font-black uppercase tracking-wide">NFT OWNERSHIP</p>
                    </div>
                    <p className="text-gray-600 text-sm font-mono">
                      Your hotspot is minted as an NFT on the blockchain
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 border-4 border-black shadow-brutal">
                    <div className="flex items-center gap-3 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600 border-2 border-black rounded-full" />
                      <p className="text-black font-black uppercase tracking-wide">PASSIVE INCOME</p>
                    </div>
                    <p className="text-gray-600 text-sm font-mono">
                      Earn U2U when users purchase access to your WiFi
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 border-4 border-black shadow-brutal">
                    <div className="flex items-center gap-3 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600 border-2 border-black rounded-full" />
                      <p className="text-black font-black uppercase tracking-wide">FULL CONTROL</p>
                    </div>
                    <p className="text-gray-600 text-sm font-mono">
                      Activate/deactivate your hotspot anytime
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white border-5 border-black shadow-brutal-xl">
              <div className="p-6 border-b-5 border-black bg-green-200">
                <h3 className="text-xl font-black text-black uppercase tracking-wide border-b-2 border-black pb-1">
                  NETWORK STATS
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gray-50 border-4 border-black shadow-brutal">
                    <div className="text-2xl font-black text-black mb-2">24/7</div>
                    <div className="text-xs text-gray-600 uppercase tracking-wide font-bold">AVAILABILITY</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 border-4 border-black shadow-brutal">
                    <div className="text-2xl font-black text-green-600 mb-2">0%</div>
                    <div className="text-xs text-gray-600 uppercase tracking-wide font-bold">PLATFORM FEE</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 border-4 border-black shadow-brutal">
                    <div className="text-2xl font-black text-black mb-2">∞</div>
                    <div className="text-xs text-gray-600 uppercase tracking-wide font-bold">SCALABILITY</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 border-4 border-black shadow-brutal">
                    <div className="text-2xl font-black text-purple-600 mb-2">100%</div>
                    <div className="text-xs text-gray-600 uppercase tracking-wide font-bold">DECENTRALIZED</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing Guide */}
            <div className="bg-white border-5 border-black shadow-brutal-xl">
              <div className="p-6 border-b-5 border-black bg-yellow-200">
                <h3 className="text-xl font-black text-black uppercase tracking-wide border-b-2 border-black pb-1">
                  PRICING GUIDE
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 border-4 border-black shadow-brutal flex justify-between items-center">
                    <span className="text-black font-bold uppercase tracking-wide">BASIC WIFI</span>
                    <span className="text-black font-black p-2 bg-green-200 border-3 border-black shadow-brutal">0.001 U2U/MB</span>
                  </div>
                  <div className="p-4 bg-gray-50 border-4 border-black shadow-brutal flex justify-between items-center">
                    <span className="text-black font-bold uppercase tracking-wide">PREMIUM WIFI</span>
                    <span className="text-black font-black p-2 bg-yellow-200 border-3 border-black shadow-brutal">0.005 U2U/MB</span>
                  </div>
                  <div className="p-4 bg-gray-50 border-4 border-black shadow-brutal flex justify-between items-center">
                    <span className="text-black font-bold uppercase tracking-wide">ULTRA-FAST WIFI</span>
                    <span className="text-black font-black p-2 bg-red-200 border-3 border-black shadow-brutal">0.01 U2U/MB</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Mint;