import { getDefaultConfig } from "connectkit";
import { createConfig, http } from 'wagmi';
import { polygon } from 'wagmi/chains';

export const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [polygon],
    transports: {
      // RPC URL for each chain
      [polygon.id]: http(
        `https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`,
      ),
    },
    

    // Required API Keys
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",

    // Required App Info
    appName: "Lott.link",

    // Optional App Info
    appDescription: "decentralize chanceRoom Dapp",
    appUrl: "", // your app's url
    appIcon: "", // your app's icon, no bigger than 1024x1024px (max. 1MB)
  }),
);

// export const config = createConfig({
//   chains: [polygon],
//   transports: {
//     [polygon.id]: http(),
//   },
// })