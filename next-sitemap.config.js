/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://azuretier.net',
    generateRobotsTxt: true,
    exclude: ['/images/*', '/*.png', '/*.jpg', '/net*'], // 画像除外
    sitemapSize: 7000,
    changefreq: 'daily',
    priority: 0.7
}

