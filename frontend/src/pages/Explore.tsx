import React, { useState, useMemo } from 'react';
import { Search, MapPin, Wifi, Zap, Clock, Filter, Star, Shield, AlertCircle, Loader2, CheckCircle, X } from 'lucide-react';
import { useWifiRegistry } from '../hooks/useWifiRegistry';

function Explore() {
  const {
    hotspots,
    isLoading,
    error,
    isBuying,
    buyAccess,
    formatPrice,
    calculateTotalPrice
  } = useWifiRegistry();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState('all');
  const [sortBy, setSortBy] = useState('price');
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [quotaMB, setQuotaMB] = useState(100);
  const [duration, setDuration] = useState(3600); // 1 hour
  const [purchaseSuccess, setPurchaseSuccess] = useState(null);

  // Filter and sort hotspots
  const filteredHotspots = useMemo(() => {
    let filtered = hotspots.filter(hotspot => {
      const matchesSearch = hotspot.ssid.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           hotspot.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterActive === 'all' || 
                           (filterActive === 'active' && hotspot.active) ||
                           (filterActive === 'inactive' && !hotspot.active);
      return matchesSearch && matchesFilter;
    });

    // Sort hotspots
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return Number(a.pricePerMB) - Number(b.pricePerMB);
        case 'name':
          return a.ssid.localeCompare(b.ssid);
        case 'location':
          return a.location.localeCompare(b.location);
        default:
          return 0;
      }
    });

    return filtered;
  }, [hotspots, searchTerm, filterActive, sortBy]);

  const handleBuyAccess = async (hotspotId) => {
    try {
      const hash = await buyAccess(Number(hotspotId), quotaMB, duration);
      setPurchaseSuccess(hotspotId);
      setSelectedHotspot(null);
      setTimeout(() => setPurchaseSuccess(null), 3000);
    } catch (err) {
      console.error('Purchase failed:', err);
    }
  };

  const formatDuration = (seconds) => {
    if (seconds < 3600) return `${Math.floor(seconds / 60)} MIN`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} HOUR${Math.floor(seconds / 3600) > 1 ? 'S' : ''}`;
    return `${Math.floor(seconds / 86400)} DAY${Math.floor(seconds / 86400) > 1 ? 'S' : ''}`;
  };

  const durationOptions = [
    { value: 1800, label: '30 MINUTES' },
    { value: 3600, label: '1 HOUR' },
    { value: 7200, label: '2 HOURS' },
    { value: 21600, label: '6 HOURS' },
    { value: 43200, label: '12 HOURS' },
    { value: 86400, label: '24 HOURS' }
  ];

  if (error) {
    return (
      <div className="min-h-screen bg-white font-mono font-bold pt-24 border-4 border-black">
        <div className="max-w-4xl mx-auto px-4 py-8">
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 p-8 bg-white border-5 border-black shadow-brutal-xl">
          <div className="flex items-center gap-4 border-b-4 border-black pb-4 mb-6">
            <div className="w-16 h-16 bg-black border-4 border-black flex items-center justify-center shadow-brutal">
              <Wifi className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-black text-black uppercase tracking-wider">
                EXPLORE WIFI
              </h1>
              <p className="text-lg text-black font-bold uppercase tracking-wide mt-2">
                DISCOVER AND CONNECT TO PREMIUM NETWORKS
              </p>
            </div>
          </div>

          {/* Stats Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border-4 border-black shadow-brutal p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 font-bold uppercase text-sm tracking-wide mb-2">TOTAL HOTSPOTS</p>
                  <p className="text-3xl font-black text-black">{hotspots.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500 border-4 border-black flex items-center justify-center shadow-brutal">
                  <Wifi className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white border-4 border-black shadow-brutal p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 font-bold uppercase text-sm tracking-wide mb-2">ACTIVE NETWORKS</p>
                  <p className="text-3xl font-black text-green-500">{hotspots.filter(h => h.active).length}</p>
                </div>
                <div className="w-12 h-12 bg-green-500 border-4 border-black flex items-center justify-center shadow-brutal">
                  <Zap className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white border-4 border-black shadow-brutal p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 font-bold uppercase text-sm tracking-wide mb-2">AVG PRICE</p>
                  <p className="text-xl font-black text-black">
                    {hotspots.length > 0 ? 
                      `${parseFloat(formatPrice(
                        hotspots.reduce((sum, h) => sum + h.pricePerMB, BigInt(0)) / BigInt(hotspots.length)
                      )).toFixed(4)} ETH/MB` : '0 ETH/MB'}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-500 border-4 border-black flex items-center justify-center shadow-brutal">
                  <Star className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 p-6 bg-white border-5 border-black shadow-brutal-xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-6 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black" />
              <input
                type="text"
                placeholder="SEARCH BY SSID OR LOCATION..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 px-4 py-3 border-4 border-black bg-white text-black font-mono font-bold placeholder-gray-600 uppercase tracking-wide focus:outline-none focus:bg-yellow-300 focus:text-black transition-all duration-300 shadow-brutal"
              />
            </div>
            
            <div className="md:col-span-3">
              <select
                value={filterActive}
                onChange={(e) => setFilterActive(e.target.value)}
                className="w-full px-4 py-3 border-4 border-black bg-white text-black font-mono font-bold uppercase tracking-wide focus:outline-none focus:bg-green-300 focus:text-black transition-all duration-300 shadow-brutal"
              >
                <option value="all">ALL NETWORKS</option>
                <option value="active">ACTIVE ONLY</option>
                <option value="inactive">INACTIVE ONLY</option>
              </select>
            </div>

            <div className="md:col-span-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 border-4 border-black bg-white text-black font-mono font-bold uppercase tracking-wide focus:outline-none focus:bg-blue-300 focus:text-black transition-all duration-300 shadow-brutal"
              >
                <option value="price">SORT BY PRICE</option>
                <option value="name">SORT BY NAME</option>
                <option value="location">SORT BY LOCATION</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="p-8 bg-white border-5 border-black shadow-brutal-xl">
            <div className="flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-black animate-spin" />
              <span className="ml-4 text-black font-black uppercase tracking-wide">
                LOADING HOTSPOTS...
              </span>
            </div>
          </div>
        )}

        {/* Hotspots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredHotspots.map((hotspot) => (
            <div key={Number(hotspot.id)} className="bg-white border-5 border-black shadow-brutal-xl hover:shadow-brutal hover:transform hover:-translate-x-1 hover:-translate-y-1 transition-all duration-300 relative">
              {/* Status Badge */}
              <div className="absolute top-4 right-4 z-10">
                {hotspot.active ? (
                  <div className="px-3 py-1 bg-green-500 border-3 border-black text-white font-black text-xs uppercase tracking-wide shadow-brutal">
                    ACTIVE
                  </div>
                ) : (
                  <div className="px-3 py-1 bg-red-500 border-3 border-black text-white font-black text-xs uppercase tracking-wide shadow-brutal">
                    OFFLINE
                  </div>
                )}
              </div>

              {/* Success indicator */}
              {purchaseSuccess === hotspot.id && (
                <div className="absolute top-4 left-4 z-10">
                  <div className="px-3 py-1 bg-green-500 border-3 border-black text-white font-black text-xs uppercase tracking-wide flex items-center gap-2 shadow-brutal">
                    <CheckCircle className="w-3 h-3" />
                    PURCHASED!
                  </div>
                </div>
              )}

              {/* Header with WiFi Icon */}
              <div className={`p-6 border-b-5 border-black ${
                hotspot.active ? 'bg-green-100' : 'bg-red-100'
              }`}>
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
              </div>

              {/* Hotspot Details */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-yellow-100 border-4 border-black shadow-brutal p-4">
                    <div className="flex items-center gap-2 mb-2 border-b-2 border-black pb-1">
                      <Zap className="w-4 h-4 border-2 border-black rounded p-0.5" />
                      <span className="text-sm text-black font-bold uppercase">PRICE/MB</span>
                    </div>
                    <span className="text-lg font-black text-black p-2 bg-white border-2 border-black shadow-brutal block text-center">
                      {formatPrice(hotspot.pricePerMB)} ETH
                    </span>
                  </div>

                  <div className="bg-purple-100 border-4 border-black shadow-brutal p-4">
                    <div className="flex items-center gap-2 mb-2 border-b-2 border-black pb-1">
                      <Shield className="w-4 h-4 border-2 border-black rounded p-0.5" />
                      <span className="text-sm text-black font-bold uppercase">HOTSPOT ID</span>
                    </div>
                    <span className="text-lg font-black text-black p-2 bg-white border-2 border-black shadow-brutal block text-center">
                      #{Number(hotspot.id)}
                    </span>
                  </div>
                </div>

                {/* Buy Access Button */}
                <button
                  onClick={() => setSelectedHotspot(hotspot)}
                  disabled={!hotspot.active || isBuying}
                  className={`w-full py-4 px-6 border-4 border-black font-black uppercase tracking-wide transition-all duration-300 ${
                    !hotspot.active || isBuying 
                      ? 'bg-gray-400 text-gray-700 cursor-not-allowed shadow-brutal' 
                      : 'bg-purple-400 text-black hover:bg-purple-300 shadow-brutal-xl hover:shadow-brutal hover:transform hover:translate-x-1 hover:translate-y-1'
                  }`}
                >
                  {isBuying ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin border-2 border-black rounded-full" />
                      PROCESSING...
                    </div>
                  ) : (
                    hotspot.active ? 'BUY ACCESS' : 'OFFLINE'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {!isLoading && filteredHotspots.length === 0 && (
          <div className="text-center py-12 p-8 bg-white border-5 border-black shadow-brutal-xl">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-400 border-4 border-black mb-6 shadow-brutal">
              <Wifi className="w-10 h-10 text-black" />
            </div>
            <h3 className="text-2xl font-black text-black mb-4 uppercase tracking-wider border-b-4 border-black pb-2 inline-block">
              NO HOTSPOTS FOUND
            </h3>
            <p className="text-gray-600 font-bold uppercase tracking-wide">
              TRY ADJUSTING YOUR SEARCH OR FILTERS
            </p>
          </div>
        )}

        {/* Purchase Modal */}
        {selectedHotspot && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-white border-5 border-black shadow-brutal-xl p-8 max-w-md w-full">
              <div className="flex items-center justify-between mb-6 border-b-4 border-black pb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-black border-4 border-black flex items-center justify-center shadow-brutal">
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

              {/* Purchase Form */}
              <div className="space-y-6 mb-8">
                <div>
                  <label className="block text-black font-bold uppercase tracking-wide text-sm mb-2">DATA QUOTA (MB)</label>
                  <input
                    type="number"
                    value={quotaMB}
                    onChange={(e) => setQuotaMB(Number(e.target.value))}
                    min="1"
                    className="w-full px-4 py-3 border-4 border-black bg-white text-black font-mono font-bold focus:outline-none focus:bg-blue-200 transition-all duration-300 shadow-brutal"
                  />
                </div>

                <div>
                  <label className="block text-black font-bold uppercase tracking-wide text-sm mb-2">DURATION</label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full px-4 py-3 border-4 border-black bg-white text-black font-mono font-bold uppercase focus:outline-none focus:bg-green-200 transition-all duration-300 shadow-brutal"
                  >
                    {durationOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Calculation */}
                <div className="p-6 bg-yellow-200 border-4 border-black shadow-brutal">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b-2 border-black">
                      <span className="text-black font-bold uppercase tracking-wide">PRICE PER MB:</span>
                      <span className="text-black font-black p-2 bg-white border-2 border-black">
                        {formatPrice(selectedHotspot.pricePerMB)} ETH
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b-2 border-black">
                      <span className="text-black font-bold uppercase tracking-wide">QUOTA:</span>
                      <span className="text-black font-black p-2 bg-white border-2 border-black">{quotaMB} MB</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b-2 border-black">
                      <span className="text-black font-bold uppercase tracking-wide">DURATION:</span>
                      <span className="text-black font-black p-2 bg-white border-2 border-black">{formatDuration(duration)}</span>
                    </div>
                    <div className="pt-4 mt-4 border-t-4 border-black">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-black text-black uppercase tracking-wide">TOTAL COST:</span>
                        <span className="text-2xl font-black text-black p-3 bg-green-300 border-3 border-black shadow-brutal">
                          {formatPrice(calculateTotalPrice(Number(selectedHotspot.id), quotaMB))} ETH
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setSelectedHotspot(null)}
                  className="px-6 py-4 bg-gray-400 hover:bg-gray-300 border-4 border-black text-black font-black uppercase tracking-wider shadow-brutal hover:shadow-brutal-lg transition-all duration-300"
                >
                  CANCEL
                </button>
                <button
                  onClick={() => handleBuyAccess(selectedHotspot.id)}
                  disabled={isBuying}
                  className={`px-6 py-4 border-4 border-black font-black uppercase tracking-wider transition-all duration-300 ${
                    isBuying 
                      ? 'bg-gray-400 text-gray-700 cursor-not-allowed shadow-brutal' 
                      : 'bg-green-400 text-black hover:bg-green-300 shadow-brutal-xl hover:shadow-brutal hover:transform hover:translate-x-1 hover:translate-y-1'
                  }`}
                >
                  {isBuying ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin border-2 border-black rounded-full" />
                      PROCESSING...
                    </div>
                  ) : (
                    'BUY ACCESS'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Explore;