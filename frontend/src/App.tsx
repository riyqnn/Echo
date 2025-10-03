import Header from './components/Header';
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from './pages/Home';
import Mint from './pages/Mint';
import Explore from './pages/Explore';
import Vouchers from './pages/Vouchers';
import MyHotspot from './pages/MyHotspot';
import CaptivePortal from './pages/Captive';

// 🔹 Konfigurasi Chain U2U Mainnet
const u2uMainnet = {
  id: 39,
  name: 'U2U Network Mainnet',
  network: 'u2u-mainnet',
  nativeCurrency: {
    name: 'U2U Token',
    symbol: 'U2U',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['https://rpc-mainnet.uniultra.xyz'] },
    public: { http: ['https://rpc-mainnet.uniultra.xyz'] },
  },
  blockExplorers: {
    default: { name: 'U2UScan', url: 'https://u2uscan.xyz' },
  },
  testnet: false,
};

export const config = getDefaultConfig({
  appName: 'WiFi DePIN DApp',
  projectId: '8e1d55ef13f9605ee1e57c335e47fd53', // projectId WalletConnect
  chains: [u2uMainnet],
  ssr: true,
});

function App() {
  const queryClient = new QueryClient();
  
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <Router>
            {/* Header selalu tampil di atas */}
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
