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

Passing just a "target environment" command line option, assuming you have nvm and yarn, will download all the requisite versions of node and all the packages for each directory. Currently, "avhc" is the only working environment. "pure" is coming soon. This script also has two other arguments that can be passed, "build" and "deploy". "Build" will actually build a fully functional version of the app with Webpack in public/dist, while "build" and "deploy" will build with Webpack, then actually deploy that to Firebase. Currently, only I have the credentials to deploy.

This script is written in Bash and only works on Unix-based systems. If you're using Windows, I'd recommend Windows Subsystem for Linux. Since this repo is dependent on [Puppeteer](https://github.com/puppeteer/puppeteer), the necessary [prerequisites for using Chrome on Linux](https://github.com/puppeteer/puppeteer/issues/3443) must be installed in order for Puppeteer to work.

_TODO: Write a Powershell script for basic installation and setup tasks._

# Subdirectories/Projects

## .GitHub
## .VSCode
## Build
## Firebase HTML Docs
## Functions
## Public
## Shared
## SW
## Tests
## Utils


_... To Be Continued_
