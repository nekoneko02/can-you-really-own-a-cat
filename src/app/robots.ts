import { MetadataRoute } from 'next'

const BASE_URL = 'https://can-you-really-own-a-cat.neko-engineer.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      disallow: [
        '/experience',
        '/nightcry-report',
        '/survey/',
        '/api/',
      ],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
