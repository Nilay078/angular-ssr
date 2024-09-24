import { Environment } from "src/app/common/interfaces/Environment";

export const environment: Environment = {
  production: true,
  apiUrl: 'https://api.thesecretariat.in/the-secretariat-api',
  website: 'https://thesecretariat.in',
  robots: 'User-agent: *\nDisallow:',
  sitemapUrl: 'https://in-thesecretariat-sitemap.s3.ap-south-1.amazonaws.com/sitemap.xml',
  googleNewsUrl: 'https://in-thesecretariat-sitemap.s3.ap-south-1.amazonaws.com/googlenews.xml',
};
