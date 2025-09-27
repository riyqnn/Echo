import { Globe } from "@/components/ui/globe";
import { Link } from "react-router-dom";
import { Wifi, Zap, Shield, DollarSign, Users, ArrowRight, CheckCircle } from "lucide-react";

function Home() {
  return (
    <main className="min-h-screen bg-white font-mono font-bold pt-20 border-4 border-black">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Hero Section */}
        <div className="text-center mb-16 p-8 bg-white border-5 border-black shadow-brutal-xl">
          <div className="max-w-4xl mx-auto">
            
            <h1 className="text-black font-black tracking-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight mb-8 uppercase">
              Reimagining{" "}
              <span className="text-purple-600">
                WiFi Sharing
              </span>{" "}
              with Blockchain & DePIN
            </h1>
            
            <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-3xl mx-auto leading-relaxed mb-12 font-bold">
              Turn idle WiFi hotspots into a decentralized network. 
              Secure, transparent, and powered by on-chain registry — 
              making connectivity a shared global resource.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/explore"
                className="px-8 py-4 bg-black text-white border-4 border-black font-black uppercase tracking-wide hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center gap-3"
              >
                <Wifi className="w-5 h-5" />
                EXPLORE NETWORKS
              </Link>
              
              <Link
                to="/mint"
                className="px-8 py-4 bg-white text-black border-4 border-black font-black uppercase tracking-wide hover:bg-black hover:text-white transition-all duration-300 flex items-center justify-center gap-3"
              >
                <Zap className="w-5 h-5" />
                MINT HOTSPOT
              </Link>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="bg-white border-5 border-black shadow-brutal-xl hover:shadow-brutal hover:transform hover:-translate-x-1 hover:-translate-y-1 transition-all duration-300">
            <div className="p-6 border-b-5 border-black bg-blue-200">
              <div className="w-12 h-12 bg-black border-4 border-black flex items-center justify-center shadow-brutal mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-black text-black uppercase tracking-wide border-b-2 border-black pb-1">
                SECURE
              </h3>
            </div>
            <div className="p-6">
              <p className="text-black font-bold uppercase text-sm">
                BLOCKCHAIN-SECURED CONNECTIONS WITH SMART CONTRACT VERIFICATION
              </p>
            </div>
          </div>

          <div className="bg-white border-5 border-black shadow-brutal-xl hover:shadow-brutal hover:transform hover:-translate-x-1 hover:-translate-y-1 transition-all duration-300">
            <div className="p-6 border-b-5 border-black bg-yellow-200">
              <div className="w-12 h-12 bg-black border-4 border-black flex items-center justify-center shadow-brutal mb-4">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-black text-black uppercase tracking-wide border-b-2 border-black pb-1">
                EARN
              </h3>
            </div>
            <div className="p-6">
              <p className="text-black font-bold uppercase text-sm">
                MONETIZE YOUR WIFI AND EARN ETH FROM USERS CONNECTING TO YOUR NETWORK
              </p>
            </div>
          </div>

          <div className="bg-white border-5 border-black shadow-brutal-xl hover:shadow-brutal hover:transform hover:-translate-x-1 hover:-translate-y-1 transition-all duration-300">
            <div className="p-6 border-b-5 border-black bg-green-200">
              <div className="w-12 h-12 bg-black border-4 border-black flex items-center justify-center shadow-brutal mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-black text-black uppercase tracking-wide border-b-2 border-black pb-1">
                COMMUNITY
              </h3>
            </div>
            <div className="p-6">
              <p className="text-black font-bold uppercase text-sm">
                JOIN A GLOBAL NETWORK OF WIFI PROVIDERS AND USERS WORLDWIDE
              </p>
            </div>
          </div>

          <div className="bg-white border-5 border-black shadow-brutal-xl hover:shadow-brutal hover:transform hover:-translate-x-1 hover:-translate-y-1 transition-all duration-300">
            <div className="p-6 border-b-5 border-black bg-pink-200">
              <div className="w-12 h-12 bg-black border-4 border-black flex items-center justify-center shadow-brutal mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-black text-black uppercase tracking-wide border-b-2 border-black pb-1">
                INSTANT
              </h3>
            </div>
            <div className="p-6">
              <p className="text-black font-bold uppercase text-sm">
                INSTANT ACCESS TO WIFI NETWORKS WITH CRYPTO PAYMENTS
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-16 p-8 bg-white border-5 border-black shadow-brutal-xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-black uppercase tracking-wider border-b-4 border-black pb-4 inline-block">
              NETWORK STATS
            </h2>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-purple-200 border-4 border-black shadow-brutal">
              <div className="text-4xl font-black text-black mb-2">100%</div>
              <div className="text-sm text-black font-bold uppercase tracking-wide">DECENTRALIZED</div>
            </div>
            <div className="text-center p-6 bg-blue-200 border-4 border-black shadow-brutal">
              <div className="text-4xl font-black text-black mb-2">0%</div>
              <div className="text-sm text-black font-bold uppercase tracking-wide">PLATFORM FEES</div>
            </div>
            <div className="text-center p-6 bg-green-200 border-4 border-black shadow-brutal">
              <div className="text-4xl font-black text-black mb-2">24/7</div>
              <div className="text-sm text-black font-bold uppercase tracking-wide">AVAILABLE</div>
            </div>
            <div className="text-center p-6 bg-yellow-200 border-4 border-black shadow-brutal">
              <div className="text-4xl font-black text-black mb-2">∞</div>
              <div className="text-sm text-black font-bold uppercase tracking-wide">SCALABLE</div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16 p-8 bg-white border-5 border-black shadow-brutal-xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-black uppercase tracking-wider border-b-4 border-black pb-4 inline-block">
              HOW IT WORKS
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-400 border-4 border-black flex items-center justify-center shadow-brutal mx-auto mb-6">
                <span className="text-2xl font-black text-black">1</span>
              </div>
              <h3 className="text-xl font-black text-black uppercase tracking-wide mb-4 border-b-3 border-black pb-2 inline-block">
                MINT HOTSPOT
              </h3>
              <p className="text-black font-bold uppercase text-sm p-4 bg-gray-100 border-4 border-black shadow-brutal">
                REGISTER YOUR WIFI NETWORK AS AN NFT ON THE BLOCKCHAIN
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-400 border-4 border-black flex items-center justify-center shadow-brutal mx-auto mb-6">
                <span className="text-2xl font-black text-black">2</span>
              </div>
              <h3 className="text-xl font-black text-black uppercase tracking-wide mb-4 border-b-3 border-black pb-2 inline-block">
                SET PRICING
              </h3>
              <p className="text-black font-bold uppercase text-sm p-4 bg-gray-100 border-4 border-black shadow-brutal">
                CHOOSE YOUR RATE PER MEGABYTE AND START EARNING FROM DAY ONE
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-400 border-4 border-black flex items-center justify-center shadow-brutal mx-auto mb-6">
                <span className="text-2xl font-black text-black">3</span>
              </div>
              <h3 className="text-xl font-black text-black uppercase tracking-wide mb-4 border-b-3 border-black pb-2 inline-block">
                EARN CRYPTO
              </h3>
              <p className="text-black font-bold uppercase text-sm p-4 bg-gray-100 border-4 border-black shadow-brutal">
                USERS PAY IN ETH TO ACCESS YOUR NETWORK. WITHDRAW ANYTIME
              </p>
            </div>
          </div>
        </div>

        {/* Globe Background */}
        <div className="relative min-h-[400px] p-8 bg-white border-5 border-black shadow-brutal-xl overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <Globe className="scale-150" />
          </div>
          
          <div className="relative z-10 text-center">
            <h2 className="text-3xl font-black text-black uppercase tracking-wider mb-8 border-b-4 border-black pb-4 inline-block">
              JOIN THE REVOLUTION
            </h2>
            
            <div className="max-w-2xl mx-auto space-y-4 mb-8">
              <div className="flex items-center gap-4 p-4 bg-gray-100 border-4 border-black shadow-brutal">
                <CheckCircle className="w-6 h-6 text-green-600 border-2 border-black rounded-full flex-shrink-0" />
                <span className="text-black font-bold uppercase text-sm">NO MIDDLEMEN, NO FEES, NO CENSORSHIP</span>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gray-100 border-4 border-black shadow-brutal">
                <CheckCircle className="w-6 h-6 text-green-600 border-2 border-black rounded-full flex-shrink-0" />
                <span className="text-black font-bold uppercase text-sm">POWERED BY U2U  BLOCKCHAIN</span>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gray-100 border-4 border-black shadow-brutal">
                <CheckCircle className="w-6 h-6 text-green-600 border-2 border-black rounded-full flex-shrink-0" />
                <span className="text-black font-bold uppercase text-sm">GLOBAL COMMUNITY OF PROVIDERS</span>
              </div>
            </div>
            
            <Link
              to="/explore"
              className="px-12 py-6 bg-black text-white border-5 border-black font-black text-xl uppercase tracking-wider shadow-brutal-xl hover:shadow-brutal hover:bg-white hover:text-black hover:transform hover:translate-x-2 hover:translate-y-2 transition-all duration-300 inline-flex items-center gap-4"
            >
              GET STARTED NOW
              <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Home;