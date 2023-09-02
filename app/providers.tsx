"use client";

import * as React from "react";
import { NextUIProvider } from "@nextui-org/system";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { RainbowKitProvider, connectorsForWallets } from '@rainbow-me/rainbowkit';
import { metaMaskWallet, injectedWallet } from '@rainbow-me/rainbowkit/wallets';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { polygon, polygonMumbai } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

import '@rainbow-me/rainbowkit/styles.css';

const projectId = '9b0bcbf5dbce1022f0816c703811dd1c';


const appInfo = {
	appName: "NFT Marketplace",
	learnMoreUrl: "",
};

const { chains, publicClient } = configureChains(
	[process.env.NEXT_PUBLIC_CHAIN_NET == 'production' ? polygon : polygonMumbai],
	[publicProvider()]
);

const connectors = connectorsForWallets([
	{
		groupName: "Player",
		wallets: [
			metaMaskWallet({ projectId, chains }),
			injectedWallet({ chains }),
		],
	},
]);

const config = createConfig({ autoConnect: true, connectors, publicClient });

export interface ProvidersProps {
	children: React.ReactNode;
	themeProps?: ThemeProviderProps;
}



export function Providers({ children, themeProps }: ProvidersProps) {

	const queryClient = new QueryClient()

	return (
		<NextUIProvider>
			<Provider store={store}>
				<PersistGate persistor={persistor}>
					<NextThemesProvider {...themeProps}>
						<WagmiConfig config={config}>
							<RainbowKitProvider modalSize="compact" chains={chains} showRecentTransactions={true} appInfo={appInfo}>
								<QueryClientProvider client={queryClient}>
									{children}
								</QueryClientProvider>
							</RainbowKitProvider>
						</WagmiConfig>
					</NextThemesProvider>
				</PersistGate>
			</Provider>
		</NextUIProvider>
	);
}
