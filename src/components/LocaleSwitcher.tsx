'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';
import styles from './LocaleSwitcher.module.css';

export default function LocaleSwitcher() {
    const t = useTranslations('localeSwitcher');
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const handleChange = (newLocale: Locale) => {
        router.replace(pathname, { locale: newLocale });
    };

    return (
        <div className={styles.switcher}>
            {routing.locales.map((loc) => (
                <button
                    key={loc}
                    onClick={() => handleChange(loc)}
                    className={`${styles.localeButton} ${locale === loc ? styles.active : ''}`}
                    aria-label={t(loc)}
                >
                    {loc.toUpperCase()}
                </button>
            ))}
        </div>
    );
}
