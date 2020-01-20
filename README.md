# Aspen Valley Hemp Company/Pure CBD Exchange Monorepo

## Required Tools

- [Node Version Manager (nvm)](https://github.com/nvm-sh/nvm)  
  Firebase cloud functions currently require Node 8 (Node 10 is currently in beta for FB functions). Modern packages in Vue require Node 10. Build utilities use Array.flat (as does Rollup service worker build), so Node 12 or later is required.

  _TODO: Since build utils are already compiled with TypeScript, we could polyfill Array.flat() and compile to ES5 to reduce the number of dependent Node versions._

- [Yarn](https://yarnpkg.com/en/docs/install#alternatives-stable)

## Getting Started

Clone the repo, then:

```bash
cd build
./build.sh [target environment] [build] [deploy]
```

Passing just a 'target environment' command line option, assuming you have NVM and yarn, will download all the requisite versions of node and all the packages for each directory. This script also has two other arguments that can be passed, build and deploy. 'Build' will actually build a fully functional version of the app with Webpack, while 'build' and 'deploy' will build with Webpack, then actually deploy that to Firebase. Probably only I have the credentials to do deploy. 

_... To Be Continued_
