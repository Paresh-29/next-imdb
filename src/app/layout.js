import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeComponent from '@/components/ThemeComponent';
import Header from "@/components/Header";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import SearchBox from "@/components/SearchBox";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata = {
	title: "Create Next App",
	description: "Generated by create next app",
};

export default function RootLayout({ children }) {
	return (
		<ClerkProvider>
			<html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<body>
					<ThemeComponent>
						<Header />
						<Navbar />
						<SearchBox />
						{children}
					</ThemeComponent>
				</body>
			</html>
		</ClerkProvider>
	);
}
