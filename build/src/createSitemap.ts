import { readFileSync, readdirSync, writeFileSync } from 'fs';
import dotenv from 'dotenv';
import path from 'path';
import axios from 'axios';
import { js2xml } from 'xml-js';

function datePartFinder(
  parts: { type: string; value: string }[],
  target: 'year' | 'month' | 'day'
) {
  const partValue = parts.find(({ type }) => type === target)!.value;
  return partValue.length === 1 ? `0${partValue}` : partValue;
}

function formatDate(date: Date) {
  const formatter = new Intl.DateTimeFormat('en-us');
  const parts = formatter.formatToParts(date);
  return `${datePartFinder(parts, 'year')}-${datePartFinder(
    parts,
    'month'
  )}-${datePartFinder(parts, 'day')}`;
}

const main = async (buildTarget: string) => {
  if (!buildTarget) {
    throw new Error('No build target specified');
  }
  process.chdir('../');

  const router = readFileSync('./public/src/router/index.ts', 'utf-8');
  const pathReg = /path: '(.+)'/gi;

  let matchResult;
  const allMatches = [];
  while ((matchResult = pathReg.exec(router)) != null) {
    allMatches.push(matchResult[1]);
  }

  const appDir = path.join(process.cwd(), 'public');
  dotenv.config({
    path: path.resolve(appDir, `.env.${buildTarget}prod`)
  });
  const testFiles = readdirSync(path.join(process.cwd(), 'build/avhc-tests'));
  const nestedAsyncPaths = allMatches
    .filter(
      (matchedPath) => !matchedPath.includes('order') && matchedPath !== '*'
    )
    .map(async (matchedPath) => {
      if (matchedPath.includes(':')) {
        const pathChunks = matchedPath.split('/');
        const collection = pathChunks[1];
        // TODO: This is build specific/not generic per project. Switch to using the main Firebase Node SDK with initialize app
        // and store admin credentials in GitHub Actions environment variables.
        const databaseUrl = `https://firestore.googleapis.com/v1/projects/aspe-f5783/databases/(default)/documents/${collection}/`;
        const collectionResult = await axios.get(databaseUrl);
        return collectionResult.data.documents.map(
          ({
            fields: {
              url: { stringValue }
            }
          }: {
            fields: {
              url: {
                stringValue: string;
              };
            };
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
  const newSitemap = js2xml(
    {
      _declaration: {
        _attributes: {
          version: '1.0',
          encoding: 'UTF-8'
        }
      },
      urlset: {
        _attributes: {
          xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9'
        },
        url: fullPaths.map((path) => ({
          loc: path,
          lastmod: formatDate(new Date())
        }))
      }
    },
    { compact: true, spaces: 2 }
  );
  writeFileSync(`${appDir}/public/sitemap.xml`, newSitemap, 'utf-8');

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
