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

yarn global add firebase-tools @vue/cli @vue/cli-service-global typescript
rm -rf public/node_modules functions/node_modules build/node_modules

cd build
yarn install

nvm install 8
cd ../functions
yarn install

nvm install 10
cd ../public
yarn install
yarn build:${BUILD_TARGET}

cd ..
firebase use ${BUILD_TARGET}
firebase deploy
