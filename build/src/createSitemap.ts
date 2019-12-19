import { readFileSync, readdirSync } from 'fs';
import dotenv from 'dotenv';
import path from 'path';

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
  const fullPaths = [
    ...allMatches,
    ...testFiles.map((testFile) => `/test-results-files/${testFile}`)
  ]
    .filter(
      (matchedPath) => !matchedPath.includes('order') && matchedPath !== '*'
    )
    .map(
      (matchedPath) => `https://${process.env.VUE_APP_SITE_URL}${matchedPath}`
    );
  console.log(fullPaths);

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
