import type { MetadataRoute } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export default function sitemap(): MetadataRoute.Sitemap {
    const paths = [
        '',
        '/plan',
        '/legal/privacy',
        '/legal/terms',
        '/legal/tokushoho',
    ]
    return paths.map((path) => ({
        url: `${baseUrl}${path}`,
        lastModified: new Date(),
    }))
}
