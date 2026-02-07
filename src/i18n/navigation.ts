import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

// Create navigation utilities with locale support
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
