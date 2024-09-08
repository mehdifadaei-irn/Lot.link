"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren } from "react";

import DiscordWidget from "./container/DiscordWidget";
import { WagmiProvider } from "wagmi";
import { config } from "@/configs/wagmi-config";
import { ConnectKitProvider } from "connectkit";
import MyCustomAvatar from "./temp/CustomeAvatar";
import { Provider } from "react-redux";
import { store } from "@/redux/stores/store";

const client = new QueryClient();

const Providers = ({ children }: PropsWithChildren<{}>) => {
  return (
    <Provider store={store}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={client}>
          <ConnectKitProvider
            customTheme={{
              "--ck-connectbutton-background": "transparent",
              "--ck-connectbutton-hover-background": "transparent",
            }}
            options={{
              embedGoogleFonts: true,
              customAvatar: MyCustomAvatar,
            }}
          >
            {children}
          </ConnectKitProvider>
          <DiscordWidget />
        </QueryClientProvider>
      </WagmiProvider>
    </Provider>
  );
};

export default Providers;
