import dotenv from 'dotenv';
import path from 'path';
import { writeFile } from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const main = async (buildTarget: string | undefined): Promise<string> => {
  if (!buildTarget) {
    throw new Error('No build target specified');
  }
  process.chdir('../');
  const execAsync = promisify(exec);
  await execAsync(
    `cp -a build/${buildTarget}-tests/. public/public/test-results-files/`
  );
  console.log('Successfully copied test results files');
  await execAsync(`cp -a build/${buildTarget}-icons/. public/public/`);
  console.log('Successfully copied image files');

  const appDir = path.join(process.cwd(), 'public');
  dotenv.config({ path: path.resolve(appDir, `.env.${buildTarget}prod`) });

  const manifest = {
    name: process.env.VUE_APP_FULL_NAME,
    short_name: process.env.VUE_APP_NAME,
    icons: [
      {
        src: '/192x192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: '/512x512.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ],
    start_url: '/',
    display: 'standalone',
    background_color: process.env.VUE_APP_BG_COLOR,
    theme_color: process.env.VUE_APP_THEME_COLOR
  };

  const writeFileAsync = promisify(writeFile);
  await writeFileAsync('public/public/manifest.json', JSON.stringify(manifest));
  return 'Sucessefully wrote manifest.json';
};

const buildTarget = process.argv[2];
main(buildTarget)
  .then((res) => {
    console.log(res);
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
