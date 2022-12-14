# Frequently Asked Questions

## Where are Babel and ESLint configured?

In package.json

## Where are the files coming from when I run `npm start`?

In development Webpack compiles your application runs it in-memory. Only when
you run `npm run build` will it write to disk and preserve your bundled
application across computer restarts.

## How do I fix `Error: listen EADDRINUSE 127.0.0.1:3000`?

This simply means that there's another process already listening on port 3000.
The fix is to kill the process and rerun `npm start`.

### OS X / Linux:

1. Find the process id (PID):
    ```Shell
    ps aux | grep node
    ```
    > This will return the PID as the value following your username:
    > ```Shell
    > janedoe    29811  49.1  2.1  3394936 356956 s004  S+    4:45pm   2:40.07 node server
    > ```
    > Note: If nothing is listed, you can try `lsof -i tcp:3000` 

1. Then run
    ```Shell
    kill -9 YOUR_PID
    ```
    > e.g. given the output from the example above, `YOUR_PID` is `29811`, hence
    that would mean you would run `kill -9 29811`

## Issue with local caching when running in production mode (F5 / ctrl+F5 / cmd+r weird behavior)

Your production site isn't working? You update the code and nothing changes? It drives you insane?

#### Quick fix on your local browser:

To fix it on your local browser, just do the following. (Suited when you're testing the production mode locally)

`Chrome dev tools > Application > Clear Storage > Clear site data` *(Chrome)*

#### Full in-depth explanation

Read more at https://github.com/NekR/offline-plugin/blob/master/docs/updates.md

## Local webfonts not working for development

In development mode CSS sourcemaps require that styling is loaded by blob://,
resulting in browsers resolving font files relative to the main document.

A way to use local webfonts in development mode is to add an absolute
output.publicPath in webpack.dev.babel.js, with protocol.

```javascript
// webpack.dev.babel.js

output: {
  publicPath: 'http://127.0.0.1:3000/',
  /* … */
},
```

## Non-route containers

> Note: Container will always be nested somewhere below a route. Even if there's dozens of components
in between, somewhere up the tree will be route. (maybe only "/", but still a route)

### Where do I put the reducer?

While you can include the reducer statically in `reducers.js`, we don't recommend this as you lose
the benefits of code splitting. Instead, add it as a _composed reducer_. This means that you
pass actions onward to a second reducer from a lower-level route reducer like so:


```JS
// Main route reducer

function myReducerOfRoute(state, action) {
  switch (action.type) {
    case SOME_OTHER_ACTION:
      return someOtherReducer(state, action);
  }
}
```

That way, you still get the code splitting at route level, but avoid having a static `combineReducers`
call that includes all of them by default.

*See [this and the following lesson](https://egghead.io/lessons/javascript-redux-reducer-composition-with-arrays?course=getting-started-with-redux) of the egghead.io Redux course for more information about reducer composition!*

### How do I run the saga?

Since a container will always be within a route, one we can simply add it to the exported array in
`sagas.js` of the route container somewhere up the tree:

```JS
// /containers/SomeContainer/sagas.js

import { someOtherSagaFromNestedContainer } from './containers/SomeNestedContainer/sagas';

function* someSaga() { /* … */ }

export default [
  someSaga,
  someOtherSagaFromNestedContainer,
];
```

Or, if you have multiple sagas in the nested container:


```JS
// /containers/SomeContainer/sagas.js

import nestedContainerSagas from './containers/SomeNestedContainer/sagas';

function* someSaga() { /* … */ }

export default [
  someSaga,
  ...nestedContainerSagas,
];
```

## Using this with WebStorm

WebStorm is a powerful IDE, and why not also use it as debugger tool? Here is the steps

1.  [Install JetBrain Chrome Extension](https://chrome.google.com/webstore/detail/jetbrains-ide-support/hmhgeddbohgjknpmjagkdomcpobmllji)
2.  [Setting up the PORT](https://www.jetbrains.com/help/webstorm/2016.1/using-jetbrains-chrome-extension.html)
3.  Change WebPack devtool config to `source-map`
4.  Run web server (`npm run start`)
5.  Create Run Configuration (Run > Edit Configurations)
6.  Add new `JavaScript Debug`
7.  Setting up URL
8.  Start Debug (Click the green bug button)
9.  Edit Run Configuration Again
10.  Mapping Url as below picture
    * Map your `root` directory with `webpack://.` (please note the last dot)
    * Map your `build` directory with your root path (e.g. `http://localhost:3000`)
11.  Hit OK and restart debugging session

![How to debug using WebStorm](webstorm-debug.png)

### Troubleshooting

1. You miss the last `.` (dot) in `webpack://.`
2. The port debugger is listening tool and the JetBrain extension is mismatch.

### Enable ESLint

ESLint help making all developer follow the same coding format. Please also setting up in your IDE, otherwise, you will fail ESLint test.
1. Go to WebStorm Preference
2. Search for `ESLint`
3. Click `Enable`

![Setting up ESLint](webstorm-eslint.png)