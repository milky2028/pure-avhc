import { readdirSync, statSync } from 'fs';
import path from 'path';

function deepFolderRead(folderPath) {
  return readdirSync(folderPath).flatMap((innerPath) => {
    const fullPath = path.join(folderPath, innerPath);
    return statSync(fullPath).isFile() ? fullPath : deepFolderRead(fullPath);
  });
}

function createResourceList() {
  process.chdir('../');
  const fullPath = path.join(process.cwd(), './public/dist');
  const resources = deepFolderRead(fullPath)
    .map((p) => p.split('dist')[1])
    .filter(
      (p) =>
        !/404.gif|.pdf|.xml|.txt|legacy|og-image|publisher-logo|sw\.js|\.ttf|admin/i.test(
          p
        )
    );
  
  process.chdir('./sw')
  return ['/', ...resources];
}

export default function resourceListPlugin() {
  return {
    name: 'resource-list-plugin',
    resolveId(id) {
      return id.includes('resources') ? id : null;
    },
    load(id) {
      if (id.includes('resources')) {
        return `export default ${JSON.stringify(createResourceList())}`;
      } else {
        return;
      }
    }
  };
}
