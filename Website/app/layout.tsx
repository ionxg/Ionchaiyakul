import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: 'Ion | Software Engineering Portfolio',
  description: 'Software engineer portfolio showcasing projects, skills, and experience. Building accessible, pixel-perfect digital experiences for the web.',
  icons: {
    icon: '/icon.png',
  },
}

// Runs before first paint so the saved theme is applied without a flash of the
// wrong colours. Falls back to the OS preference, then to dark.
const themeScript = `(function(){try{var t=localStorage.getItem('ion-theme');if(!t){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'}if(t==='dark'){document.documentElement.classList.add('dark')}}catch(e){document.documentElement.classList.add('dark')}})()`

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
