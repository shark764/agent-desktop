# Documentation

## Table of Contents

- [General](general)
  - [**CLI Commands**](general/commands.md)
  - [Tool Configuration](general/files.md)
  - [Server Configurations](general/server-configs.md)
  - [Deployment](general/deployment.md) *(currently Heroku specific)*
  - [Messaging Demo](general/messaging-demo.md)
  - [FAQ](general/faq.md)
  - [Gotchas](general/gotchas.md)
  - [Remove](general/remove.md)
- [Testing](testing)
  - [Unit Testing](testing/unit-testing.md)
  - [Component Testing](testing/component-testing.md)
  - [Remote Testing](testing/remote-testing.md)
- [CSS](css)
  - [sanitize.css](css/sanitize.md)
- [JS](js)
  - [Redux](js/redux.md)
  - [ImmutableJS](js/immutablejs.md)
  - [reselect](js/reselect.md)
  - [redux-saga](js/redux-saga.md)
  - [i18n](js/i18n.md)
  - [routing](js/routing.md)

## Overview

### Quickstart

1. First, let's kick the tyres by launching the app

    ```Shell
    npm start
    ```

1. Open [localhost:3000](http://localhost:3000) to see it in action.

1. Time to build your own app: run

    ```shell
    npm run clean
    ```

    ...and use the built-in generators to start your first feature.

### Development

Run `npm start` to see your app at `localhost:3000`

### Building & Deploying

1. Run `npm run build`, which will compile all the necessary files to the
`build` folder.

2. Upload the contents of the `build` folder to your web server's root folder.

### Structure

The [`app/`](../../../tree/master/app) directory contains your entire application code, including CSS,
JavaScript, HTML and tests.

The rest of the folders and files only exist to make your life easier, and
should not need to be touched.

### JS

We bundle all your clientside scripts and chunk them into several files using
code splitting where possible. We then automatically optimize your code when
building for production so you don't have to worry about that.

See the [JS documentation](./js/README.md) for more information about the
JavaScript side of things.

### Testing

For a thorough explanation of the testing procedure, see the
[testing documentation](./testing/README.md)!

#### Performance testing

With the production server running (i.e. while `npm run start:production` is running in
another tab), enter `npm run pagespeed` to run Google PageSpeed Insights and
get a performance check right in your terminal!

#### Browser testing

`npm run start:tunnel` makes your locally-running app globally available on the web
via a temporary URL: great for testing on different devices, client demos, etc!

#### Unit testing

Unit tests live in `test/` directories right next to the components being tested
and are run with `npm run test`.
