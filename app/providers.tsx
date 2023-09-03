"use client";

import * as React from "react";
import { NextUIProvider } from "@nextui-org/system";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../store';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'


import {
	EthereumClient,
	w3mConnectors,
	w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { polygonMumbai } from "wagmi/chains";

type WagmiProviderType = {
	children: React.ReactNode;
};

const chains = [polygonMumbai];
const projectId: string = process.env.NEXT_PUBLIC_W3C_PID || "9b0bcbf5dbce1022f0816c703811dd1c";

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
	autoConnect: true,
	connectors: w3mConnectors({ projectId, chains }),
	publicClient,
});

const ethereumClient = new EthereumClient(wagmiConfig, chains);

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
						<QueryClientProvider client={queryClient}>
							<WagmiConfig config={wagmiConfig}>
								{children}
								<Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
							</WagmiConfig>

						</QueryClientProvider>
					</NextThemesProvider>
				</PersistGate>
			</Provider>
		</NextUIProvider>
	);
}
