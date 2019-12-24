// import puppeteer from 'puppeteer';
import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

// async function prerenderPage(targetPage: string) {
//   const browser = await puppeteer.launch({ headless: true });
//   const browserPage = await browser.newPage();
// }

async function getSitemap(targetSite: string) {
  const xmlSitemap = await axios.get(`https://${targetSite}/sitemap.xml`);
  return xmlSitemap.data;
}

const main = async (buildTarget: string) => {
  if (!buildTargetArg) {
    throw new Error('Failed to provide build target');
  }

  const appDir = path.join(process.cwd(), 'public');
  dotenv.config({
    path: path.resolve(appDir, `.env.${buildTarget}prod`)
  });
  const sitemap = await getSitemap(process.env.VUE_APP_SITE_URL as string);
  return sitemap;
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
