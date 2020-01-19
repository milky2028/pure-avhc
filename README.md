# Aspen Valley Hemp Company/Pure CBD Exchange

## Required Tools

- [Node Version Manager (nvm)](https://github.com/nvm-sh/nvm)  
  Firebase cloud functions currently require Node 8 (Node 10 is currently in beta for FB functions). Modern packages in Vue require Node 10. Build utilities use Array.flat (as does Rollup service worker build), so Node 12 or later is required.

  _TODO: Since build utils are already compiled with TypeScript, we could polyfill Array.flat() and compile to ES5 to reduce the number of dependent Node versions._

- [Yarn](https://yarnpkg.com/en/docs/install#alternatives-stable)

_... To Be Continued_
