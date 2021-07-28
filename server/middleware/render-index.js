import fs from 'fs';
// eslint-disable-next-line import/no-extraneous-dependencies
import path from 'path';
import config from '@server/config';

function getBundleFileNames() {
  const assetMapData = JSON.parse(
    fs.readFileSync(
      path.resolve(
        path.join(process.env.ASSETS_DIR, process.env.ASSETS_MAP_FILE)
      )
    )
  );

  return {
    css: assetMapData['bundle.css'],
    runtime: assetMapData['runtime.js'],
    vendor: assetMapData['vendor.js'],
    js: assetMapData['bundle.js'],
    vendorCss: assetMapData['vendor.css']
  };
}

function getBundleURLs() {
  let bundleURLs = null;

  if (process.env.NODE_ENV === 'production') {
    bundleURLs = getBundleFileNames();
  } else {
    bundleURLs = {
      js: '/assets/bundle.js',
      css: '/assets/bundle.css'
    };
  }

  if (bundleURLs) {
    Object.keys(bundleURLs).forEach((bundleGroup) => {
      bundleURLs[bundleGroup] = `${process.env.ASSET_DOMAIN || ''}${bundleURLs[bundleGroup]
        }`;
    });
  }

  return bundleURLs;
}

export default async function renderIndex() {
  const bundleURLs = getBundleURLs();

  let vendorScripts = '';
  if (bundleURLs.vendor) {
    vendorScripts = `
      <script src="${bundleURLs.runtime}" crossorigin="anonymous"></script>
      <script src="${bundleURLs.vendor}" crossorigin="anonymous"></script>
    `;
  }

  const ASSET_DOMAIN = `${process.env.ASSET_DOMAIN || ''}/assets/`;
  let websocketEndpoint = '';
  if (config.aws.websocketDomain) {
    websocketEndpoint = `wss://${config.aws.websocketDomain}/${config.aws.stage}`;
  }

  return `
    ${process.env.NODE_ENV !== 'production' ? '<script src="http://localhost:8098"></script>' : ''}
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1.0">
        <title>AutoBook Pro</title>
        <link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900|Material+Icons" rel="stylesheet" type="text/css">
        <link href="https://cdn.jsdelivr.net/npm/quasar@1.15.2/dist/quasar.min.css" rel="stylesheet" type="text/css">
        <link href="${bundleURLs.css}" rel="stylesheet" type="text/css">
        <link href="${bundleURLs.vendorCss}" rel="stylesheet" type="text/css">
      </head>

      <body>
        <div id="q-app" />
        <script>
        window.ASSET_DOMAIN="${ASSET_DOMAIN}"
        window.BASE_URL="${config.baseUrl}"
        window.AUTH0_CLIENT_ID="${config.auth0.clientId}"
        window.AUTH0_DOMAIN="${config.auth0.domain}"
        window.GOOGLE_MAP_API_KEY_FOR_CLIENT="${config.googleMap.apiKeyForClient}"
        window.WEBSOCKET_ENDPOINT="${websocketEndpoint}"
        window.POST_TO_LOAD_BOARD_ID="${config.autobook.postToLoadBoardStatusId}"
        window.DISPATCHED_STATUS_ID="${config.autobook.dispatchedStatusId}"
        </script>
        ${vendorScripts}
        <script src="${bundleURLs.js}" crossorigin="anonymous"></script>
      </body>
    </html>
  `;
}
