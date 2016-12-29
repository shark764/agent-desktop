# Introduction

- [**CLI Commands**](commands.md)
- [Tool Configuration](files.md)
- [Server Configurations](server-configs.md)
- [Messaging Demo](messaging-demo.md)
- [FAQ](faq.md)
- [Gotchas](gotchas.md)

# Feature overview

## Quick scaffolding

Automate the creation of components, containers, routes, selectors and sagas -
and their tests - right from the CLI!

Run `npm run generate` in your terminal and choose one of the parts you want
to generate. They'll automatically be imported in the correct places and have
everything set up correctly.

> We use [plop] to generate new components, you can find all the logic and
templates for the generation in `internals/generators`.

[plop]: https://github.com/amwmedia/plop

## Instant feedback

Enjoy the best DX and code your app at the speed of thought! Your saved changes
to the CSS and JS are reflected instantaneously without refreshing the page.
Preserve application state even when you update something in the underlying code!

## Predictable state management

We use Redux to manage our applications state. We have also added optional
support for the [Chrome Redux DevTools Extension] – if you have it installed,
you can see, play back and change your action history!

[Chrome Redux DevTools Extension]: https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd

## Next generation JavaScript

Use ESNext template strings, object destructuring, arrow functions, JSX syntax
and more, today.

## Next generation CSS

Write composable CSS that's co-located with your components using [`Radium`]
for complete modularity. Unique generated class names keep the specificity low
while eliminating style clashes. Ship only the styles that are used on the
visible page for the best performance.

## Industry-standard routing

Thanks to [react-router] with [react-router-redux],
this is easy as pie and the url is auto-synced to your application state!

[react-router]: https://github.com/reactjs/react-router
[react-router-redux]: https://github.com/reactjs/react-router-redux

## Offline-first

The next frontier in performant web apps: availability without a network
connection from the instant your users load the app. This is done with a
ServiceWorker and a fallback to AppCache, so this feature even works on older
browsers!

> All your files are included automatically. No manual intervention needed
thanks to Webpack's [`offline-plugin`](https://github.com/NekR/offline-plugin)

## Performant Web Font Loading

If you simply use web fonts in your project, the page will stay blank until
these fonts are downloaded. That means a lot of waiting time in which users
could already read the content.

[FontFaceObserver](https://github.com/bramstein/fontfaceobserver) adds a class
to the `body` when the fonts have loaded. (see [`app.js`](../../app/app.js#L26-L36)
and [`App/styles.css`](../../app/containers/App/styles.css))

### Adding a new font

1. Either add the `@font-face` declaration to `App/styles.css` or add a `<link>`
tag to the [`index.html`](../../app/index.html). (Don't forget to remove the `<link>`
for Open Sans from the [`index.html`](../../app/index.html)!)

2. In `App/styles.css`, specify your initial `font-family` in the `body` tag
with only web-save fonts. In the `body.jsFontLoaded` tag, specify your
`font-family` stack with your web font.

3. In `app.js` add a `<fontName>Observer` for your font.

## Image optimization

Images often represent the majority of bytes downloaded on a web page, so image
optimization can often be a notable performance improvement. Thanks to Webpack's
[`image-loader`](https://github.com/tcoopman/image-webpack-loader), every PNG, JPEG, GIF and SVG images
is optimized.

See [`image-loader`](https://github.com/tcoopman/image-webpack-loader) to customize optimizations options.
