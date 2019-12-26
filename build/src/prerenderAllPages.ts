import puppeteer from 'puppeteer';
import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { xml2js, ElementCompact } from 'xml-js';

async function prerenderPage(targetPage: string) {
  const browser = await puppeteer.launch({ headless: true });
  const browserPage = await browser.newPage();
  await browserPage.goto(targetPage, { waitUntil: 'networkidle0' });
  const html = await browserPage.content();
  await browser.close();
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

const main = async (buildTarget: string) => {
  if (!buildTargetArg) {
    throw new Error('Failed to provide build target');
  }
  process.chdir('../');

  const appDir = path.join(process.cwd(), 'public');
  dotenv.config({
    path: path.resolve(appDir, `.env.${buildTarget}prod`)
  });
  const allSiteUrls: string[] = await getUrlList(
    process.env.VUE_APP_SITE_URL as string
  );
  return prerenderPage(allSiteUrls[9]);
};

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
