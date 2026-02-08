/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.SITE_URL || 'https://azuret.net',
    generateRobotsTxt: true,
    generateIndexSitemap: false,
    // Exclude any paths you don't want indexed
    exclude: ['/api/*', '/admin/*'],
    // Additional paths to include (static pages)
    additionalPaths: async (config) => {
        return [];
    },
    // Transform function for i18n support
    transform: async (config, path) => {
        return {
            loc: path,
            changefreq: 'weekly',
            priority: path === '/' || path === '/en' || path === '/ja' ? 1.0 : 0.7,
            lastmod: new Date().toISOString(),
        };
    },
    robotsTxtOptions: {
        policies: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/', '/admin/'],
            },
        ],
    },
};
