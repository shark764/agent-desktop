# Zendesk local setup

## Setup local SDK (if needed)
- (If needed) Update [the link to the modal](https://github.com/liveops/cxengage-javascript-sdk/blob/master/src/cljs/cxengage_javascript_sdk/modules/zendesk.cljs#L262) to your local modal.html URL
- [Setup external URL for SDK](https://github.com/liveops/cxengage-javascript-sdk/wiki/Setup-external-URL)
- Replace the [SDK URL in Agent Desktop](https://github.com/liveops/agent-desktop/blob/master/app/index.html#L52) with the one you get from above

## Setup Agent Desktop
- `npm start`
- `ngrok http 3000`
- Copy the https URL from above and paste into the [Zendesk maifest](https://github.com/liveops/zendesk-managed-package-v2/blob/master/manifest.json#L16)
  -  Append "/tb2?crmModule=zendesk" to the URL

## Setup Zendesk widgets (if needed)
- In the [zendesk-managed-package-v2](https://github.com/liveops/zendesk-managed-package-v2) folder, run `http-server`
- Run `ngrok http <port from http-server>`
- Paste the https URL from above
  - With "/assets/ticket.html" to the [ticket_sidebar url](https://github.com/liveops/zendesk-managed-package-v2/blob/master/manifest.json#L12)
  - With "assets/user.html" to the [user_sidebar url](https://github.com/liveops/zendesk-managed-package-v2/blob/master/manifest.json#L15)
  - See Setup local SDK for changes to "modal.html"

## Add Zendesk manifest
- Make a zip file of the zendesk-managed-package-v2
- Go to https://liveops-test1.zendesk.com/agent/admin/apps/manage and update your app with the new zip file
