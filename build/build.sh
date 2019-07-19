#!/bin/bash

BUILD_TARGET=$1

cd ..

git status
git pull

yarn global add firebase-tools @vue/cli @vue/cli-service-global typescript
rm -rf public/node_modules functions/node_modules build/node_modules

cd build
yarn install
cd ../functions
yarn install
cd ../public
yarn install
yarn build:${BUILD_TARGET}

cd ..
firebase use ${BUILD_TARGET}
firebase deploy
