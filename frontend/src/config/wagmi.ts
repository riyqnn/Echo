import { getDefaultConfig } from '@rainbow-me/rainbowkit';

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
  projectId: '8e1d55ef13f9605ee1e57c335e47fd53',
  chains: [u2uMainnet],
  ssr: true,
});