#!/bin/bash

echo "Hello!"
pwd
ls

# error_exit() {
# 	echo "Error! $1" 1>&2
# 	exit 1
# }

# if [ -z "$1" ]; then 
#   error_exit "Failed to provide a build target"
# fi

# BUILD_TARGET=$1

# echo "Install build modules"
# yarn install

# echo "Install functions modules"
# cd ${GITHUB_WORKSPACE}/functions
# yarn install

# echo "Install client modules"
# cd ${GITHUB_WORKSPACE}/public
# yarn install

# echo "Build with Vue"
# yarn build:${BUILD_TARGET}

# echo "Deploy to firebase"
# cd ${GITHUB_WORKSPACE}/public
# firebase use ${BUILD_TARGET}
# firebase deploy
