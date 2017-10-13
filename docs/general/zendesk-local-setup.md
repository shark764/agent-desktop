# Zendesk local setup

## REQUIRED PACKAGES ##

* http-server (`npm install http-server -g`)
* boot-cljs or some way to compile clojurescript (installation varies depending on your computer/OS)

## AUTOMATED SETUP ##

Since there are a lot of steps to the process of setting up the Zendesk development environment, there is an npm task that automates the entire setup by offering you a series of prompts in the terminal.

Once you complete the process of filling out the prompts, then your environment should be set up and ready to go.

#### Xterm ####
In addition to the 2 packages listed above as required, you'll also need to have installed the terminal software, Xterm. It's verly likely that it's already installed on your machine, but it may not be so enter into the console `xterm -v` if you want to know for sure.

### To use the automated process: ###
1. Start Agent Desktop by entering `npm start` in the console in the root directory of the repo as you would normally do.

2. Once Agent Desktop has completed the startup process, in a new terminal window/tab, enter `npm run zendesk`.

3. You'll be offered a series of prompts comprised mostly of "yes or no" questions, or requests to paste a value from another terminal window. Multiple terminal windows will be popping out as well to independently handle the multiple processes/local servers you'll need to run simultaneously.

4. At the end of the process, you'll end up with the zip file in the root of zendesk-managed-package-v2 named "zendesk.zip" which you'll be uploading to the Zendesk admin panel. Go to https://liveops-test1.zendesk.com/agent/admin/apps/manage and update your app with the new zip file.

**NOTE:**
* This task does *not* swap out the remotely-hosted modal.html file with your local one (in zendesk-managed-package-v2/assets). In order to do that, you'll need to replace the URL in the following line of code with the same domain and path (up to the file name, of course) that you're using in the manifest.json for the widgets: [the link to the modal](https://github.com/liveops/cxengage-javascript-sdk/blob/master/src/cljs/cxengage_javascript_sdk/modules/zendesk.cljs#L262)

* At the time of writing, this has only been tested on a Linux/Ubuntu and Mac systems, not 100% sure if any adjustments would need to be made for Windows(?).
---
## MANUAL SETUP ##

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
- Make a zip file of the zendesk-managed-package-v2 (if you used the automated process, a file named "zendesk.zip" should already be in the root directory of your local zendesk-managed-package-v2 repo)
- Go to https://liveops-test1.zendesk.com/agent/admin/apps/manage and update your app with the new zip file
