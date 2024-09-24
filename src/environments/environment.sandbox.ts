import { Environment } from "src/app/common/interfaces/Environment";

export const environment: Environment = {
    production: true,
    apiUrl: 'https://test-api.thesecretariat.in//the-secretariat-api/',
    website: 'https://test-website.thesecretariat.in',
    robots: 'User-agent: *\nDisallow: /',
    sitemapUrl: 'https://test-in-thesecretariat-sitemap.s3.ap-south-1.amazonaws.com/sitemap.xml',
    googleNewsUrl: 'https://test-in-thesecretariat-sitemap.s3.ap-south-1.amazonaws.com/googlenews.xml',
};
