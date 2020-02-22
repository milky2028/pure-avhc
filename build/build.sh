#!/bin/bash
. ~/.nvm/nvm.sh

error_exit() {
	echo "Error! $1" 1>&2
	exit 1
}

if [ -z "$1" ]; then 
  error_exit "Failed to provide a build target"
fi

# First argument is the build target. Currently, 'avhc' or 'pure'.
BUILD_TARGET=$1

# Second arg is whether or not the app should be built.
SHOULD_BUILD=$2

# Third argument is whether or not this package should be directly deployed from a local machine to Firebase.
SHOULD_DEPLOY=$3

cd ..

git status
git pull

nvm install 10
nvm use 10
yarn global add firebase-tools

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

cd ../sw
nvm use 12
rm -rf node_modules
yarn install

cd ../utils
rm -rf node_modules
yarn install

if [ "${SHOULD_BUILD}" == "build" ]; then
	cd ../public
	yarn build:${BUILD_TARGET} || error_exit "App build failed"

	cd ../sw
	echo "Building service worker..."
	yarn build-sw || error_exit "Service worker build failed"
	echo "Service worker built"
fi

if [ "${SHOULD_DEPLOY}" == "deploy" ]; then
	cd ..
	nvm use 8
	firebase use ${BUILD_TARGET}
	firebase deploy --only functions || error_exit "Functions deploy failed"
	firebase deploy --only firestore || error_exit "Firestore deploy failed"
	firebase deploy --only hosting:${BUILD_TARGET} || error_exit "Hosting deploy failed"

	cd build
	nvm use 12
	yarn prerender-all-pages ${BUILD_TARGET} || error_exit "Prerender failed"
fi
