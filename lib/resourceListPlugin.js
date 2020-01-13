import { readdirSync, statSync } from 'fs';
import path from 'path';

function deepFolderRead(folderPath) {
  return readdirSync(folderPath).flatMap((innerPath) => {
    const fullPath = path.join(folderPath, innerPath);
    return statSync(fullPath).isFile() ? fullPath : deepFolderRead(fullPath);
  });
}

function createResourceList() {
  const fullPath = path.join(__dirname, 'public/dist');
  const resources = deepFolderRead(fullPath)
    .map((p) => p.split('dist')[1])
    .filter(
      (p) =>
        !/.gif|.pdf|.xml|.txt|legacy|og-image|publisher-logo|sw\.js|\.ttf/.test(
          p
        )
    );

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
