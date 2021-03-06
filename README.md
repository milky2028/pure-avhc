# Aspen Valley Hemp Company/Pure CBD Exchange Monorepo

## Small TODOs Before Launch

- Update all images
- Make sure Wholesale Catalog is on the latest version
- ~~Sentry~~

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
  This directory contains build workflows for GitHub Actions. On every sucessful commit to the master branch, the app is built and released to production. For this reason, once we hit 1.0.0 (possibly before), the master branch will be locked down to prevent arbitrary releases to master.

  A number of (very limited) tests are run at build time, primarily linting with ESLint and type-checking with TypeScript. If either of these fails in any build directory, the release will fail and be marked as such in GitHub Actions.

  A proper Pull Requests system will be put in place to make sure code released to master remains stable in production. If an improper release is let loose, its easy enough to rollback, but hopefully safeguards will prevent this from needing to happen.

  **As of 1/25/2020**, there is only one workflow that releases to AVHC. In the future, a Pure workflow will be triggered as well.
  
  **As of 1/25/2020**, build artifacts are now available with each deployment.

  _TODO: Add Pure CBD GitHub Actions workflow._

## .VSCode

  This directory contain various VSCode default settings and recommended extensions. It's recommended both that you use VSCode as your editor and that you install all the recommended extensions, as they'll ease the development process.

  There are duplications of these files in some relevant subdirectories. VSCode seems to struggle somewhat with the monorepo nature of this project. For this reason, sometimes its recommended that you navigate to a subdirectory and launch VSCode inside that specific folder. TypeScript sometimes has issues inferring types if you do not do this. There's a way I remember finding in the past to mitigate this by settings tsdk root or something, but I haven't had the time to properly configure it.

  ESLint is configured in this repo to automatically format code on save. ESLint configs are similarly duplicated across directories.

  _TODO: Unify VSCode settings files under one package to prevent mistakes in repeated code or increased maintenance. Configure mutli-root workspace or set tsdk root for proper type inference._

  _TODO: Unify ESLint config files, perhaps as an npm package._

## Build

  Contains the main build script for building on your local machine (details above), as well as node scripts for compiling the application for different environments.  

  There are three main build scripts:

  - **createManifest**  
      This dynamically creates the web app manifest that allows the app to run as a standalone application if needed. It also does some other things that aren't so obvious given the name, like copying image and test files to the build directory.

  - **createSitemap**  
      This crawls the router index file and generates a sitemap for search engines based on the the application's routes as well as test files dumped into assets after the build.  Sitemaps are very important for SEO.

      _TODO: This currently uses the Firebase Rest API, but there's really no reason for it to. Switch this to use the Firebase Node SDK._
      
  - **prerenderAllPages**  
      After the build is complete and has deployed, this script crawls each page and generates a statically rendered page using puppeteer. This is done at build time to make dynamic renders faster. When a user visits the site, if they're categorized as a bot, they're sent the dynamically rendered version. If they're a user, they're sent the full application. This has worked out pretty well thus far and enables the same type of SEO-friendly site without the pain of SSR.
## Firebase HTML Docs
  Some data in the app is stored as HTML in Firebase and injected via v-html. The documents in this folder are saved here for version control and just the ease of editing HTML in an editor vs editing it inside the very small Firebase input box.
## Functions
## Public
## Shared
## SW
## Tests
## Utils


_... To Be Continued_
