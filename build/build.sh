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

echo "Downloading prerequisite global modules"
yarn global add firebase-tools @vue/cli @vue/cli-service-global typescript
rm -rf public/node_modules functions/node_modules build/node_modules

echo "Install build modules"
cd build
rm -rf node_modules
yarn install

echo "Install functions modules"
nvm install 8
cd ../functions
rm -rf node_modules
yarn install

echo "Install client modules"
nvm install 10
cd ../public
rm -rf node_modules
yarn install

echo "Build with Vue"
yarn build:${BUILD_TARGET}

echo "Deploy to firebase"
cd ..
firebase use ${BUILD_TARGET}
firebase deploy
