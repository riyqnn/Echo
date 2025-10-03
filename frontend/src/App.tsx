import Header from './components/Header';
import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from './pages/Home';
import Mint from './pages/Mint';
import Explore from './pages/Explore';
import Vouchers from './pages/Vouchers';
import MyHotspot from './pages/MyHotspot';
import CaptivePortal from './pages/Captive';

import { config } from './config/wagmi';

function App() {
  const queryClient = new QueryClient();
  
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <Router>
            <Header />
            
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/mint" element={<Mint />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/vouchers" element={<Vouchers />} />
              <Route path="/my-hotspots" element={<MyHotspot />} />
              <Route path="/captive" element={<CaptivePortal />} />
            </Routes>
            
            <Toaster position="top-center" />
          </Router>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;