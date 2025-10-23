import { useState, useMemo } from 'react';
import { Wifi, Power, DollarSign, MapPin, Users, TrendingUp, Settings, AlertCircle, Loader2, CheckCircle, Plus, Eye, BarChart3, Zap, X } from 'lucide-react';
import { useWifiRegistry } from '../hooks/useWifiRegistry';
import { useAccount } from 'wagmi';

// Define Hotspot type
interface Hotspot {
  id: bigint | number;
  ssid: string;
  location: string;
  pricePerMB: bigint | number;
  active: boolean;
  owner: string;
}

function MyHotspot() {
  const { isConnected } = useAccount();
  const {
    getUserHotspots,
    isLoading,
    error,
    isSettingActive,
    isWithdrawing,
    setHotspotActive,
    withdrawFunds,
    formatPrice
  } = useWifiRegistry();

  const [toggleSuccess, setToggleSuccess] = useState<number | bigint | null>(null);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);

  const userHotspots = getUserHotspots();

  // Calculate stats
  const stats = useMemo(() => {
    const total = userHotspots.length;
    const active = userHotspots.filter(h => h.active).length;
    const inactive = total - active;
    
    // Calculate total potential earnings (this would be better with actual earnings data from contract)
    const totalValue = userHotspots.reduce((sum, hotspot) => {
      return sum + Number(hotspot.pricePerMB);
    }, 0);

    return { total, active, inactive, totalValue };
  }, [userHotspots]);

  const handleToggleActive = async (hotspotId: number | bigint, currentStatus: boolean) => {
    try {
      await setHotspotActive(Number(hotspotId), !currentStatus);
      setToggleSuccess(hotspotId);
      setTimeout(() => setToggleSuccess(null), 3000);
    } catch (err) {
      console.error('Failed to toggle hotspot:', err);
    }
  };

  const handleWithdrawFunds = async () => {
    try {
      await withdrawFunds();
      setWithdrawSuccess(true);
      setTimeout(() => setWithdrawSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to withdraw funds:', err);
    }
  };

  // Wallet not connected
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-white font-mono font-bold pt-24 border-4 border-black">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center py-12 p-8 bg-yellow-200 border-5 border-black shadow-brutal-xl">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500 border-4 border-black mb-6 shadow-brutal">
              <AlertCircle className="w-8 h-8 text-black" />
            </div>
            <h2 className="text-2xl font-black text-black mb-4 uppercase tracking-wider border-b-4 border-black pb-2">
              WALLET NOT CONNECTED
            </h2>
            <p className="text-black font-bold uppercase tracking-wide">
              CONNECT YOUR WALLET TO MANAGE HOTSPOTS
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
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="p-6 bg-red-500 border-5 border-black shadow-brutal-xl text-white font-black uppercase tracking-wide">
            <div className="flex items-center gap-4">
              <AlertCircle className="w-8 h-8 text-white border-3 border-white rounded-full p-1" />
              <div>
                <h3 className="text-xl font-black">ERROR LOADING HOTSPOTS</h3>
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
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 p-8 bg-purple-200 border-5 border-black shadow-brutal-xl">
          <div className="flex items-center justify-between mb-6 border-b-4 border-black pb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-black border-4 border-black flex items-center justify-center shadow-brutal">
                <Wifi className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl lg:text-5xl font-black text-black uppercase tracking-wider">
                  MY HOTSPOTS
                </h1>
                <p className="text-lg text-black font-bold uppercase tracking-wide mt-2">
                  MANAGE YOUR WIFI NETWORKS AND EARNINGS
                </p>
              </div>
            </div>

            {/* Withdraw Earnings Button */}
            <button
              onClick={handleWithdrawFunds}
              disabled={isWithdrawing || userHotspots.length === 0}
              className={`px-8 py-4 border-5 border-black font-black text-lg uppercase tracking-wider transition-all duration-300 ${
                isWithdrawing || userHotspots.length === 0
                  ? 'bg-gray-400 text-gray-700 cursor-not-allowed shadow-brutal'
                  : 'bg-green-400 text-black hover:bg-green-300 shadow-brutal-xl hover:shadow-brutal hover:transform hover:translate-x-1 hover:translate-y-1'
              }`}
            >
              {isWithdrawing ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin border-2 border-black rounded-full" />
                  PROCESSING...
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 border-2 border-black rounded p-0.5" />
                  WITHDRAW EARNINGS
                </div>
              )}
            </button>
          </div>

          {/* Success Messages */}
          {withdrawSuccess && (
            <div className="p-4 bg-green-400 border-4 border-black shadow-brutal text-black font-black uppercase tracking-wide">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-black border-2 border-black rounded-full" />
                <span>FUNDS WITHDRAWN SUCCESSFULLY!</span>
              </div>
            </div>
          )}
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-200 border-5 border-black shadow-brutal p-6">
            <div className="flex items-center justify-between border-b-3 border-black pb-3 mb-3">
              <div>
                <p className="text-black font-bold uppercase text-sm tracking-wide">TOTAL HOTSPOTS</p>
                <p className="text-3xl font-black text-black">{stats.total}</p>
              </div>
              <Wifi className="w-8 h-8 text-black border-3 border-black rounded p-1" />
            </div>
          </div>

          <div className="bg-green-200 border-5 border-black shadow-brutal p-6">
            <div className="flex items-center justify-between border-b-3 border-black pb-3 mb-3">
              <div>
                <p className="text-black font-bold uppercase text-sm tracking-wide">ACTIVE NETWORKS</p>
                <p className="text-3xl font-black text-green-700">{stats.active}</p>
              </div>
              <Zap className="w-8 h-8 text-green-700 border-3 border-black rounded p-1" />
            </div>
          </div>

          <div className="bg-red-200 border-5 border-black shadow-brutal p-6">
            <div className="flex items-center justify-between border-b-3 border-black pb-3 mb-3">
              <div>
                <p className="text-black font-bold uppercase text-sm tracking-wide">INACTIVE NETWORKS</p>
                <p className="text-3xl font-black text-red-700">{stats.inactive}</p>
              </div>
              <Power className="w-8 h-8 text-red-700 border-3 border-black rounded p-1" />
            </div>
          </div>

          <div className="bg-yellow-200 border-5 border-black shadow-brutal p-6">
            <div className="flex items-center justify-between border-b-3 border-black pb-3 mb-3">
              <div>
                <p className="text-black font-bold uppercase text-sm tracking-wide">AVG PRICE/MB</p>
                <p className="text-3xl font-black text-yellow-700">
                  {stats.total > 0 ? 
                    `${(stats.totalValue / stats.total / 1e18).toFixed(4)}` : '0.0000'
                  }
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-yellow-700 border-3 border-black rounded p-1" />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="p-8 bg-gray-200 border-5 border-black shadow-brutal-xl">
            <div className="flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-black animate-spin border-3 border-black rounded-full" />
              <span className="ml-4 text-black font-black uppercase tracking-wide">
                LOADING YOUR HOTSPOTS...
              </span>
            </div>
          </div>
        )}

        {/* No Hotspots State */}
        {!isLoading && userHotspots.length === 0 && (
          <div className="text-center py-12 p-8 bg-gray-100 border-5 border-black shadow-brutal-xl">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-400 border-4 border-black mb-6 shadow-brutal">
              <Wifi className="w-10 h-10 text-black" />
            </div>
            <h3 className="text-2xl font-black text-black mb-4 uppercase tracking-wider border-b-4 border-black pb-2 inline-block">
              NO HOTSPOTS YET
            </h3>
            <p className="text-black font-bold uppercase tracking-wide mb-6 p-4 bg-white border-3 border-black shadow-brutal">
              YOU HAVEN'T REGISTERED ANY WIFI HOTSPOTS YET
            </p>
            <button className="btn-brutal text-lg font-black uppercase tracking-wider px-8 py-4 flex items-center gap-3 mx-auto">
              <Plus className="w-5 h-5 border-2 border-white rounded p-0.5" />
              REGISTER FIRST HOTSPOT
            </button>
          </div>
        )}

        {/* Hotspots Grid */}
        {!isLoading && userHotspots.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {userHotspots.map((hotspot) => (
              <div key={Number(hotspot.id)} className="bg-white border-5 border-black shadow-brutal-xl hover:shadow-brutal hover:transform hover:-translate-x-1 hover:-translate-y-1 transition-all duration-300">
                {/* Header with Status */}
                <div className={`p-6 border-b-5 border-black ${
                  hotspot.active ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 border-4 border-black flex items-center justify-center shadow-brutal ${
                        hotspot.active ? 'bg-green-500' : 'bg-red-500'
                      }`}>
                        <Wifi className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-black uppercase tracking-wide border-b-2 border-black pb-1">
                          {hotspot.ssid}
                        </h3>
                        <div className="flex items-center gap-2 text-black mt-2">
                          <MapPin className="w-4 h-4 border-2 border-black rounded p-0.5" />
                          <span className="text-sm font-bold uppercase">{hotspot.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Toggle Success Indicator */}
                    {toggleSuccess === hotspot.id && (
                      <div className="flex items-center gap-2 px-3 py-2 bg-green-400 border-3 border-black shadow-brutal">
                        <CheckCircle className="w-4 h-4 text-black" />
                        <span className="text-xs text-black font-black uppercase">UPDATED!</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Hotspot Details */}
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-yellow-100 border-4 border-black shadow-brutal p-4">
                      <div className="flex items-center gap-2 mb-2 border-b-2 border-black pb-1">
                        <BarChart3 className="w-4 h-4 border-2 border-black rounded p-0.5" />
                        <span className="text-sm text-black font-bold uppercase">PRICE/MB</span>
                      </div>
                      <span className="text-lg font-black text-black p-2 bg-white border-2 border-black shadow-brutal block text-center">
                        {formatPrice(hotspot.pricePerMB)} U2U
                      </span>
                    </div>

                    <div className={`border-4 border-black shadow-brutal p-4 ${
                      hotspot.active ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      <div className="flex items-center gap-2 mb-2 border-b-2 border-black pb-1">
                        <Settings className="w-4 h-4 border-2 border-black rounded p-0.5" />
                        <span className="text-sm text-black font-bold uppercase">STATUS</span>
                      </div>
                      <span className={`text-lg font-black p-2 border-2 border-black shadow-brutal block text-center ${
                        hotspot.active ? 'text-black bg-green-300' : 'text-white bg-red-500'
                      }`}>
                        {hotspot.active ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </div>

                    <div className="bg-purple-100 border-4 border-black shadow-brutal p-4">
                      <div className="flex items-center gap-2 mb-2 border-b-2 border-black pb-1">
                        <Eye className="w-4 h-4 border-2 border-black rounded p-0.5" />
                        <span className="text-sm text-black font-bold uppercase">HOTSPOT ID</span>
                      </div>
                      <span className="text-lg font-black text-black p-2 bg-white border-2 border-black shadow-brutal block text-center">
                        #{Number(hotspot.id)}
                      </span>
                    </div>

                    <div className="bg-blue-100 border-4 border-black shadow-brutal p-4">
                      <div className="flex items-center gap-2 mb-2 border-b-2 border-black pb-1">
                        <Users className="w-4 h-4 border-2 border-black rounded p-0.5" />
                        <span className="text-sm text-black font-bold uppercase">USERS</span>
                      </div>
                      <span className="text-lg font-black text-black p-2 bg-white border-2 border-black shadow-brutal block text-center">
                        --
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    {/* Toggle Active/Inactive */}
                    <button
                      onClick={() => handleToggleActive(hotspot.id, hotspot.active)}
                      disabled={isSettingActive}
                      className={`flex-1 flex items-center justify-center gap-3 py-4 px-4 border-4 border-black font-black uppercase tracking-wide transition-all duration-300 ${
                        hotspot.active
                          ? 'bg-red-400 hover:bg-red-300 text-black shadow-brutal hover:shadow-brutal-lg'
                          : 'bg-green-400 hover:bg-green-300 text-black shadow-brutal hover:shadow-brutal-lg'
                      } disabled:bg-gray-400 disabled:cursor-not-allowed`}
                    >
                      {isSettingActive ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin border-2 border-black rounded-full" />
                          UPDATING...
                        </>
                      ) : (
                        <>
                          <Power className="w-4 h-4 border-2 border-black rounded p-0.5" />
                          {hotspot.active ? 'DEACTIVATE' : 'ACTIVATE'}
                        </>
                      )}
                    </button>

                    {/* View Details */}
                    <button
                      onClick={() => setSelectedHotspot(hotspot)}
                      className="px-6 py-4 bg-gray-300 hover:bg-gray-200 border-4 border-black text-black font-black uppercase shadow-brutal hover:shadow-brutal-lg transition-all duration-300"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Hotspot Details Modal */}
        {selectedHotspot && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-white border-5 border-black shadow-brutal-xl p-8 max-w-md w-full">
              <div className="flex items-center justify-between mb-6 border-b-4 border-black pb-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 border-4 border-black flex items-center justify-center shadow-brutal ${
                    selectedHotspot.active ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    <Wifi className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-black uppercase">{selectedHotspot.ssid}</h3>
                    <p className="text-black text-sm font-bold uppercase">{selectedHotspot.location}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedHotspot(null)}
                  className="w-8 h-8 bg-red-500 border-3 border-black flex items-center justify-center shadow-brutal hover:bg-red-400 transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* Detailed Info */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center py-3 border-b-3 border-black">
                  <span className="text-black font-bold uppercase">HOTSPOT ID:</span>
                  <span className="text-black font-black p-2 bg-gray-200 border-3 border-black">#{Number(selectedHotspot.id)}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b-3 border-black">
                  <span className="text-black font-bold uppercase">PRICE PER MB:</span>
                  <span className="text-black font-black p-2 bg-yellow-200 border-3 border-black">
                    {formatPrice(BigInt(selectedHotspot.pricePerMB))} U2U
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b-3 border-black">
                  <span className="text-black font-bold uppercase">STATUS:</span>
                  <span className={`font-black p-2 border-3 border-black ${
                    selectedHotspot.active ? 'text-black bg-green-300' : 'text-white bg-red-500'
                  }`}>
                    {selectedHotspot.active ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b-3 border-black">
                  <span className="text-black font-bold uppercase">OWNER:</span>
                  <span className="text-black font-black text-sm p-2 bg-purple-200 border-3 border-black">
                    {selectedHotspot.owner.slice(0, 6)}...{selectedHotspot.owner.slice(-4)}
                  </span>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setSelectedHotspot(null)}
                className="btn-brutal w-full text-lg font-black uppercase tracking-wider py-4"
              >
                CLOSE
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyHotspot;