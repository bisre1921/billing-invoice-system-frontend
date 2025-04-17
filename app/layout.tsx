import "./globals.css";
import { Open_Sans, Merriweather } from 'next/font/google';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Providers from "./components/Providers";  // 👈 the new wrapper
import { AuthProvider } from "./contexts/AuthContext";

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
});

const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['400', '700'],
});

export const metadata = {
  title: 'Billing & Invoice System',
  description: 'A modern billing and invoicing solution.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={openSans.className}>
        <Providers> 
          <AuthProvider>
            {/* <Navbar /> */}
            <main>{children}</main>
            <Footer />
          </AuthProvider>
          </Providers>
       
      </body>
    </html>
  );
}
