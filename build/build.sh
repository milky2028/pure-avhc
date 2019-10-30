#!/bin/zsh
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

pwd

git status
git pull

rm -rf node_modules public/node_modules functions/node_modules build/node_modules
nvm install 10
yarn install
yarn workspace build build-manifest:avhc
yarn workspace public build:${BUILD_TARGET}

firebase use ${BUILD_TARGET}
firebase deploy
