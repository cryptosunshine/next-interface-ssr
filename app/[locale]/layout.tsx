import "@/styles/globals.css";
import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Providers } from "../providers";
import { Navbar } from "@/components/navbar";

import clsx from "clsx";
import { NextIntlClientProvider } from 'next-intl';
import Footer from "@/components/footer"

export function generateStaticParams() {
	return [{ locale: 'en' }, { locale: 'zh' }];
}

const loadMessages = async (locale: any) => {
	const res = (await import(`../../locale/${locale}.json`)).default;

	return res;
};
export const metadata: Metadata = {
	title: {
		default: siteConfig.name,
		template: `%s - ${siteConfig.name}`,
	},
	description: siteConfig.description,
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "white" },
		{ media: "(prefers-color-scheme: dark)", color: "black" },
	],
	icons: {
		icon: "/favicon.ico",
	},
};

export default async function RootLayout({ children, params: { locale } }: any) {
	let messages;
	try {
		messages = await loadMessages(locale);
	} catch (error) {
		console.log(error)
	}
	return (
		<html lang={locale} suppressHydrationWarning>
			<head />
			<body
				className={clsx(
					"min-h-screen bg-background font-sans antialiased",
					fontSans.variable
				)}
			>
				<NextIntlClientProvider locale={locale} messages={messages}>
					<Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
						<div className="relative flex flex-col h-screen">
							<Navbar />
							<main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
								{children}
							</main>
							<Footer />
						</div>
					</Providers>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
