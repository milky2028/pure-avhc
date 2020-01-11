import { readdirSync, statSync } from 'fs';
import path from 'path';

async function main() {
  process.chdir('../');
  const distPath = './public/dist';
  const resourceList = readdirSync(distPath)
    .flatMap((fileOrDir) => {
      const itemPath = path.join(distPath, fileOrDir);
      return statSync(itemPath).isFile()
        ? `/${fileOrDir}`
        : readdirSync(itemPath).map(
            (nestedFile) => `/${fileOrDir}/${nestedFile}`
          );
    })
    .filter((resource) => !resource.includes('legacy'));

  return resourceList;
}

main()
  .then((res) => {
    console.log(res);
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
