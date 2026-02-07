import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";
import React from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';

import Provider from '../provider';
import { VersionProvider } from '@/lib/version/context';

const geistSans = localFont({
    src: "../fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "../fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

type Props = {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
};

// Generate static params for all locales
export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

// Generate localized metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'meta' });

    const baseUrl = 'https://azuretier.net';

    return {
        title: t('title'),
        description: t('description'),
        metadataBase: new URL(baseUrl),
        alternates: {
            canonical: locale === 'ja' ? baseUrl : `${baseUrl}/en`,
            languages: {
                'ja': baseUrl,
                'en': `${baseUrl}/en`,
            },
        },
        openGraph: {
            title: t('ogTitle'),
            description: t('ogDescription'),
            locale: locale === 'ja' ? 'ja_JP' : 'en_US',
            alternateLocale: locale === 'ja' ? ['en_US'] : ['ja_JP'],
            type: 'website',
            url: locale === 'ja' ? baseUrl : `${baseUrl}/en`,
            siteName: 'Azuretia',
        },
        twitter: {
            card: 'summary_large_image',
            title: t('ogTitle'),
            description: t('ogDescription'),
        },
    };
}

export default async function LocaleLayout({ children, params }: Props) {
    const { locale } = await params;

    // Provide all messages to the client side
    const messages = await getMessages();

    return (
        <html lang={locale}>
            <head>
                <meta name="theme-color" content="#ffbd43" />
                <link rel="icon" href="/favicon.ico" />
                <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Zen+Kaku+Gothic+New:wght@300;400;700&display=swap" rel="stylesheet" />
            </head>
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} style={{ overflowX: 'hidden' }}>
                <NextIntlClientProvider messages={messages}>
                    <VersionProvider>
                        <Provider>
                            {children}
                        </Provider>
                    </VersionProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
