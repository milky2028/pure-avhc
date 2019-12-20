import { readFileSync, readdirSync, writeFileSync } from 'fs';
import dotenv from 'dotenv';
import path from 'path';
import axios from 'axios';
import * as convert from 'xml-js';

const main = async (buildTarget: string) => {
  process.chdir('../');

  const router = readFileSync('./public/src/router/index.ts', 'utf-8');
  const pathReg = /path: '(.+)'/gi;

  let matchResult;
  const allMatches = [];
  while ((matchResult = pathReg.exec(router)) != null) {
    allMatches.push(matchResult[1]);
  }

  const appDir = path.join(process.cwd(), 'public');
  dotenv.config({ path: path.resolve(appDir, `.env.${buildTarget}prod`) });
  const testFiles = readdirSync(path.join(process.cwd(), 'build/avhc-tests'));
  const nestedAsyncPaths = allMatches
    .filter(
      (matchedPath) => !matchedPath.includes('order') && matchedPath !== '*'
    )
    .map(async (matchedPath) => {
      if (matchedPath.includes(':')) {
        const pathChunks = matchedPath.split('/');
        const collection = pathChunks[1];
        const databaseUrl = `https://firestore.googleapis.com/v1/projects/aspe-f5783/databases/(default)/documents/${collection}/`;
        const collectionResult = await axios.get(databaseUrl);
        return collectionResult.data.documents.map(
          ({
            fields: {
              url: { stringValue }
            }
          }: {
            fields: { url: { stringValue: string } };
          }) => `/${collection}/${stringValue}`
        );
      } else {
        return matchedPath;
      }
    });
  const fullPaths = [
    ...(await Promise.all(nestedAsyncPaths)).flat(),
    ...testFiles.map((testFile) => `/test-results-files/${testFile}`)
  ].map(
    (matchedPath) => `https://${process.env.VUE_APP_SITE_URL}${matchedPath}`
  );
  const robotsTxtFile = readFileSync('./build/assets/robots.txt', 'utf-8');
  const editedRobotsTxtFile = robotsTxtFile.replace(
    '<%= SITE_URL %>',
    process.env.VUE_APP_SITE_URL as string
  );
  writeFileSync(`${appDir}/public/robots.txt`, editedRobotsTxtFile, 'utf-8');
  const sitemap = convert.js2xml({ urlset: { url: fullPaths.map((path) => ({ loc: path, lastmod: '2019-12-20' })) } }, { compact: true, spaces: 2 });
  writeFileSync(`${appDir}/public/sitemap.xml`, sitemap, 'utf-8');
  
  return 'Successfuly created sitemap';
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
