# Skylight
A single screen web app built in React for handling inbound and outbound interactions across multiple channels, with integrated CRM functionality.

## Quick start
1. Fork this repo using GitHub or clone by using `git clone git@github.com:liveops/agent-desktop.git`
2. run `npm install` to get your dependencies
3. run `npm start` to start a development instance

## Desktop mode
- Add "desktop" to your URL to use desktop mode (ex. http://localhost:3000/desktop)

## CRM integrations
- To use in a CRM integration, include "crmModule=your-crm-module" in the URL (ex. http://localhost:3000?crmModule=salesforce-classic)

## Documentation

- [Intro](docs/general): What's included and why
- [**Commands**](docs/general/commands.md): Don't do stuff manually!
- [Testing](docs/testing): How to work with the built-in test harness
- [Styling](docs/css): How to work with the CSS tooling
- [Framework](docs/js): Routing, Redux, simple asynchronicity helpers, etc.
- [Versioning](docs/general/versioning.md): Semantic version for UI

## Code Tips
### Use ES7 Object Rest Operator to Omit Properties
https://codeburst.io/use-es2015-object-rest-operator-to-omit-properties-38a3ecffe90

### What is "widowing" and libraries to leverage widowing on react
https://www.youtube.com/watch?v=t4tuhg7b50I

- [react-window](https://github.com/bvaughn/react-window)
- [react-virtualized](https://github.com/bvaughn/react-virtualized)

