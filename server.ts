import 'zone.js/dist/zone-node';

import { APP_BASE_HREF } from '@angular/common';
import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { existsSync } from 'fs';
import { join } from 'path';

import { AppServerModule } from './src/main.server';
import fetch from 'node-fetch';
import { environment } from 'src/environments/environment';
import { ApiUrl } from 'src/app/constant/app-url';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
    const server = express();
    const distFolder = join(process.cwd(), 'dist/the-secretariat-website/browser');
    const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';
    const ARTICLE_PATH = '/article/';
    const CATEGORY_PATH = '/article/category/';

    // Our Universal express-engine (found @ https://github.com/angular/universal/tree/main/modules/express-engine)
    server.engine(
        'html',
        ngExpressEngine({
            bootstrap: AppServerModule,
        })
    );

    server.set('view engine', 'html');
    server.set('views', distFolder);

    server.get('/robots.txt', (request, response) => {
        response.type('text/plain');
        response.send(environment.robots);
    });

    server.get('/sitemap.xml', (req, res) => {
        fetch(environment.sitemapUrl)
            .then(response => {
                return response.text();
            })
            .then(body => {
                res.type('application/xml');
                res.send(body);
            })
            .catch(err => {
                console.error('Error while fetching the XML:', err);
                res.status(500).send('Internal Server Error');
            });
    });

    server.get('/googlenews.xml', (req, res) => {
        fetch(environment.googleNewsUrl)
            .then(response => {
                return response.text();
            })
            .then(body => {
                res.type('application/xml');
                res.send(body);
            })
            .catch(err => {
                console.error('Error while fetching the XML:', err);
                res.status(500).send('Internal Server Error');
            });
    });

    // Example Express Rest API endpoints
    // server.get('/api/**', (req, res) => { });
    // Serve static files from /browser
    server.get(
        '*.*',
        express.static(distFolder, {
            maxAge: '1y',
        })
    );

    // All regular routes use the Universal engine
    server.get('*', (req, res) => {
        if (!req.url.includes(ARTICLE_PATH)) {
            responseRender(req, res, indexHtml);
            return;
        }

        if (req.url == '/article/category/top-story-8') {
            return res.redirect(301, `${environment.website}${CATEGORY_PATH}spotlight-8`);
        }

        const segments = getPathSegments(req.url);
        if (segments.length != 2) {
            responseRender(req, res, indexHtml);
            return;
        }

        fetch(`${ApiUrl.ARTICLE_REDIRECT}${[...segments].pop()}`, { method: 'GET' })
            .then(response => {
                return response.json();
            })
            .then((data: any) => {
                if (data.view.required) {
                    return res.redirect(302, `${environment.website}${ARTICLE_PATH}${data.view.slug}`);
                } else {
                    responseRender(req, res, indexHtml);
                }
            });
    });

    return server;
}

function getPathSegments(pathName: string): string[] {
    return pathName.split('/').filter(segment => segment !== '');
}

function responseRender(req: any, res: any, indexHtml: any) {
    res.render(indexHtml, { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] });
}

function run(): void {
    const port = process.env['PORT'] || 4200;

    // Start up the Node server
    const server = app();
    server.listen(port, () => {
        console.log(`Node Express server listening on http://localhost:${port}`);
    });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = (mainModule && mainModule.filename) || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
    run();
}

export * from './src/main.server';
