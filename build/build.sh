#!/bin/bash
. ~/.nvm/nvm.sh

error_exit() {
	echo "Error! $1" 1>&2
	exit 1
}

if [ -z "$1" ]; then 
  error_exit "Failed to provide a build target"
fi

BUILD_TARGET=$1

cd ..

git status
git pull

nvm install 10
nvm use 10
yarn global add firebase-tools @vue/cli @vue/cli-service-global typescript
rm -rf public/node_modules functions/node_modules build/node_modules

nvm install 12
nvm use 12
cd build
rm -rf node_modules
yarn install
yarn create-manifest ${BUILD_TARGET} || error_exit "Create manifest failed"
yarn create-sitemap ${BUILD_TARGET} || error_exit "Create sitemap failed"

nvm install 8
nvm use 8
cd ../functions
rm -rf node_modules
yarn install

nvm use 10
cd ../public
rm -rf node_modules
yarn install
yarn build:${BUILD_TARGET} || error_exit "App build failed"

cd ..
nvm use 12
rm -rf node_modules
yarn install
echo "Building service worker..."
yarn build-sw || error_exit "Service worker build failed"
echo "Service worker built"

firebase use ${BUILD_TARGET}
firebase deploy --only functions || error_exit "Functions deploy failed"
firebase deploy --only firestore || error_exit "Firestore deploy failed"
firebase deploy --only hosting:${BUILD_TARGET} || error_exit "Hosting deploy failed"

cd build
yarn prerender-all-pages ${BUILD_TARGET} || error_exit "Prerender failed"