import puppeteer from 'puppeteer';
import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { xml2js, ElementCompact } from 'xml-js';
import url from 'url';
import * as admin from 'firebase-admin';

process.setMaxListeners(Infinity);

function stripPage() {
  const elements = document.querySelectorAll(
    'script:not([type]), script[type*="javascript"], link[rel=import], script[type*="module"], link[rel*="prefetch"], link[rel*="modulepreload"]'
  );
  for (const e of Array.from(elements)) {
    e.remove();
  }
}

function injectBaseHref(origin: string) {
  const base = document.createElement('base');
  base.setAttribute('href', origin);
  document.head.insertAdjacentElement('afterbegin', base);
}

async function prerenderPage(targetPage: string, browser: puppeteer.Browser) {
  console.log(`Prerendering ${targetPage}`);
  const page = await browser.newPage();
  await page.goto(targetPage, { waitUntil: 'networkidle0' });
  await page.waitFor(10000);
  await page.evaluate(stripPage);
  const parsedUrl = url.parse(targetPage);
  await page.evaluate(injectBaseHref, `https://${parsedUrl.host}/`);
  const html = await await page.evaluate(
    'document.firstElementChild.outerHTML'
  );
  return html;
}

async function getUrlList(targetSite: string) {
  const xmlSitemap = await axios.get(`https://${targetSite}/sitemap.xml`);
  const sitemapAsJs: ElementCompact = xml2js(xmlSitemap.data, {
    compact: true
  });
  return sitemapAsJs.urlset.url.map(
    (url: { loc: { _text: string } }) => url.loc._text
  );
}

async function main(buildTarget: string) {
  if (!buildTargetArg) {
    throw new Error('Failed to provide build target');
  }
  process.chdir('../');

  const appDir = path.join(process.cwd(), 'public');
  dotenv.config({
    path: path.resolve(appDir, `.env.${buildTarget}prod`)
  });

  const siteUrl = process.env.VUE_APP_SITE_URL;
  if (!siteUrl) {
    throw new Error('No site url environment variable found.');
  }

  const allSiteUrls: string[] = await getUrlList(siteUrl);

  const browser = await puppeteer.launch({ headless: true });
  const pages = await Promise.all(
    allSiteUrls
      .filter((pageUrl) => !pageUrl.includes('.pdf'))
      .map(async (pageUrl) => ({
        name: encodeURIComponent(pageUrl),
        render: await prerenderPage(pageUrl, browser)
      }))
  );
  await browser.close();

  const adminConfig = process.env.FIREBASE_ADMIN_CONFIG;
  if (!adminConfig) {
    throw new Error('No Firebase Admin Config environment variable found.');
  }

  const credential = JSON.parse(adminConfig);
  credential.private_key = credential.private_key.replace(/\\n/g, '\n');
  const fbApp = admin.initializeApp({
    credential: admin.credential.cert(credential)
  });

  const databaseWrites = pages.map(({ name, render }) =>
    fbApp
      .firestore()
      .collection('pageRenders')
      .doc(name)
      .set({ render, timestamp: admin.firestore.FieldValue.serverTimestamp() })
  );

  await Promise.all(databaseWrites);
  return 'Sucessfully wrote renders to Firestore';
}

const buildTargetArg = process.argv[2];
main(buildTargetArg)
  .then((res) => {
    console.log(res);
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
