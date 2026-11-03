import type { MetadataRoute } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
const isProduction = process.env.APP_ENV === 'production'

export default function robots(): MetadataRoute.Robots {
    if (!isProduction) {
        return { rules: { userAgent: '*', disallow: '/' } }
    }

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/protected', '/forgot-password', '/api/', '/auth/'],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
