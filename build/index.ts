import dotenv from 'dotenv';
import path from 'path';
import { promisify } from 'util';
import { writeFile } from 'fs';

const main = async (buildTarget: string | undefined): Promise<string> => {
  if (!buildTarget) {
    throw new Error('Please specify a build target');
  }
  process.chdir('../');
  const appDir = path.join(process.cwd(), 'public');
  dotenv.config({ path: path.resolve(appDir, `.env.${buildTarget}prod`) });

  const manifest = {
    name: process.env.VUE_APP_FULL_NAME,
    short_name: process.env.VUE_APP_NAME,
    icons: [
      {
        src: '/icons/192x192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: '/icons/512x512.png',
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
