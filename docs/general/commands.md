# Command Line Commands

## Development

```Shell
npm run start
```

Starts the development server running on `http://localhost:3000`

## Generators

```Shell
npm run generate
```

Allows you to auto-generate boilerplate code for common parts of your
application, specifically `component`s, `container`s, and `route`s. You can
also run `npm run generate <part>` to skip the first selection. (e.g. `npm run
generate container`)

## Server

### Development

```Shell
npm start
```

Starts the development server and makes your application accessible at
`localhost:3000`. Changes in the application code will be hot-reloaded.

### Production

```Shell
npm run start:prod
```

Starts the production server, configured for optimal performance: assets are
minified and served gzipped.

### Port

To change the port the app is accessible at pass the `--port` option to the command
with `--`. E.g. to make the app visible at `localhost:5000`, run the following:
`npm start -- --port 5000`

## Building

```Shell
npm run build
```

Preps your app for deployment. Optimizes and minifies all files, piping them to
a folder called `build`. Upload the contents of `build` to your web server to
see your work live!

## Testing

See the [testing documentation](../testing/README.md) for detailed information
about our testing setup!

## Unit testing

```Shell
npm test
```

Tests your application with the unit tests specified in the `**/tests/*.js` files
throughout the application.
All the `test` commands allow an optional `-- [string]` argument to filter
the tests run by Jest. Useful if you need to run a specific test only.

```Shell
# Run only the Button component tests
npm test -- Button

# Update all snapshots
npm test -- -u
```

### Watching

```Shell
npm run test:watch
```

Watches changes to your application and reruns tests whenever a file changes.

### Remote testing

```Shell
npm run start:tunnel
```
Starts the development server and tunnels it with `ngrok`, making the website
available on the entire world. Useful for testing on different devices in different locations!

### Performance testing

```Shell
npm run pagespeed
```

With the remote server running (i.e. while `npm run start:prod` is running in
another terminal session), enter this command to run Google PageSpeed Insights
and get a performance check right in your terminal!

### Dependency size test

```Shell
npm run analyze
```

This command will generate a `stats.json` file from your production build, which
you can upload to the [webpack analyzer](https://webpack.github.io/analyse/). This
analyzer will visualize your dependencies and chunks with detailed statistics
about the bundle size.

## Formatting

```Shell
npm run format
```

Runs the prettier + eslint and writes any changes to disk.
NOTE: this runs as a precommit hook if any js is touched

## Linting

```Shell
npm run lint
```

Lints your JavaScript.
