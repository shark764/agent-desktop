### [1.32.3] (2018-12-12)
* CXV1-13546 - Salesforce Classic / Lightning - Click to Email causes Blank Side Panel

### [1.33.2] (2018-12-14)
* CXV1-16285 - Hide "Loading Transfer Lists" text when no transfer lists are available

### [1.33.1] (2018-12-14)
* CXV1-16446 - Fix tags generated for hotfix branch

### [1.33.0] (2018-11-26)
* CXV1-16295 - AD/TB2 - Outbound Identification - Include Outbound ANI list in new interaction panel for SMS
* CXV1-16379 - Hide outbound ANI select when there are no outbound ANIs, add loading state for initial load

### [1.32.18] (2018-12-10)
* CXV1-12566 - When Writing a Reply to an Email, the "To:" Value Goes Off Screen if Long Enough

### [1.32.17] (2018-12-07)
* CXV1-11326 - Add tooltips to phonecontrols

### [1.32.16] (2018-12-06)
* CXV1-15185 - Hide cancel, send, and transfer buttons when sending an email

### [1.32.15] (2018-11-27)
* CXV1-16012 & CXV1-16012 - Refactor Dialpad TransferMenu & its unit tests

### [1.32.14] (2018-12-06)
* CXV1-16394 - Fixed auto internationalization file generation

### [1.32.13] (2018-12-04)
* CXV1-15243 - key is missing react component

### [1.32.12] (2018-12-05)
* CXV1-16310 - Fixed plaintext email newline formatting
* CXV1-14725 - Fixed "undefined" customer quote in replies when the original email was plaintext

### [1.32.11] (2018-12-04)
* CXV1-12156 - All Enabled Transfer Lists Show for an Agent Without being Assigned to any Agents

### [1.32.10] (2018-12-04)
* CXV1-15614 - Fixed script 400 error handling

### [1.32.9] (2018-12-03)
* CXV1-15275 - "Waiting on script/tooltip" has incorrect offset

### [1.32.8] (2018-11-30)
* CXV1-15459 - Visual notification doesn´t redirect to URL in use(Chrome)

### [1.32.7] (2018-11-29)
* CXV1-16124 - Email interaction - when replying, autofill "to" address field not using 'reply-to' 

### [1.32.6] (2018-11-28)
* CXV1-16084 - Add Participant - Second agent sees "Agent" in participants list and not the agents name

### [1.32.5] (2018-11-27)
* CXV1-16116 - Clicking Hyperlinks/Hyperlinked Images in an Email Crashes Toolbar

### [1.32.4] (2018-11-22)
* CXV1-15320 - Show that the user is currently offline instead of error banners (Re-done because we're changing the approach)

### [1.32.3] (2018-11-20)
* CXV1-16005 - AD/TB2 - Outbound Identification - Unit tests

### [1.32.2] (2018-11-23)
* CXV1-12477 - Each Outbound interaction should display the Outbound Id (Fixed some errors with script-only interactions)

### [1.32.1] (2018-11-21)
* CXV1-16001 Unit tests for transfer menu collapse/expand

### [1.32.0] (2018-11-15)
* CXV1-12477 - Each Outbound interaction should display the Outbound Id

### [1.31.5] (2018-11-19)
* CXV1-16059 - Fixed window errors being logged to sentry.

### [1.31.4] (2018-11-21) 
* CXV1-12476 - AD/TB2 - Outbound Identification - Include Outbound ANI list in new interaction panel for Voice fixed outbound ANI toolbar

### [1.31.3] (2018-11-20)
* CXV1-15868 - Click to dial is adding an extra 1 at the start when using hyphens in the number

### [1.31.2] (2018-11-20)
* CXV1-16109 - Revert CXV1-15320 (offline polling)

### [1.31.1] (2018-11-15) (Broken: CXV1-15320)
* CXV1-15887 - Fixed transfer menu height to scale with window height
* (no ticket) - Fixed missing manifest error
* (no ticket) - Updated favicon upload

### [1.31.0] (2018-11-09) (Broken: CXV1-15320)
* CXV1-15533 && CXV1-15546 - Collpase and Expand options under Transfer screen & save the status to local storage

### [1.30.0] (2018-11-08) (Broken: CXV1-15320)
* CXV1-12476 - AD/TB2 - Outbound Identification - Include Outbound ANI list in new interaction panel for Voice

### [1.29.6] (2018-11-07) (Broken: CXV1-15320)
* CXV1-14946 - Refactor email inputs into smaller component, move state directly into redux

### [1.29.5] (2018-11-08) (Broken: CXV1-15320)
* CXV1-15615 - Script will not be displayed during a work offer, only before or after.

### [1.29.4] (2018-01-08) (Broken: CXV1-15320)
* CXV1-15438 - SDK bump to return "interaction-fatal" error when their requests 404 on applicable 4xxx error codes

### [1.29.3] (2018-11-08) (Broken: CXV1-15320)
* CXV1-15964 - Customer hold button doesn't show up after (cold) transferring an outbound voice interaction

### [1.29.2] (2018-11-07) (Broken: CXV1-15320)
* CXV1-15960 - Updated how queue time stat subscriptions are added so it will not crash when there are >1000 queues

### [1.29.1] (2018-11-01) (Broken: CXV1-15948/CXV1-15960)
* CXV1-14603 - Transfer List names superimposed over each other

### [1.29.0] (2018-10-31) (Broken: CXV1-15948/CXV1-15960)
* CXV1-15450 - Added Skylight metric access restriction

### [1.28.55] (2018-11-01) (Broken: CXV1-15948/CXV1-15960)
* CXV1-14482 - Long email attachments cannot be read nor removed

### [1.28.54] (2018-10-30) (Broken: CXV1-15948/CXV1-15960)
* CXV1-15867 - Allow salesforce click to dials input to be edited

### [1.28.53] (2018-10-26) (Broken: CXV1-15867)
* CXV1-15495 - Hide hold button on outbound voice interaction until signal from flow

### [1.28.52] (2018-10-19) (Broken: CXV1-15867)
* CXV1-15418 - Opening Email Attachments After ~00:01:30 displays XML Error

### [1.28.51] (2018-10-23) (Broken: CXV1-15867)
* CXV1-15326 - Send messages to Sentry from the SDK if posting logs fails

### [1.28.50] (2018-10-23) (Broken: CXV1-15867)
* CXV1-15605 - Fixed batch requests for each queue when the transfer menu is open. Fixed the time values disappearing.

### [1.28.49] (2018-10-19) (Broken: CXV1-15867)
* CXV1-14872 - Hide spinner & display proper text for interactions without notes & dispositions

### [1.28.48] (2018-10-17) (Broken: CXV1-15867)
* CXV1-15446 - Fixed SSO non-default tenant selection

### [1.28.47] (2018-10-17) (Broken: CXV1-15867)
* CXV1-15419 - Queues are not alphabetical order when doing a transfer

### [1.28.46] (2018-10-16) (Broken: CXV1-15867)
* CXV1-15354 - Fixed critical error that happened when you received an SMS interaction while having an agent desktop contact in view

### [1.28.45] (2018-10-15) (Broken: CXV1-15867)
* CXV1-15417 - Clicking Email Attachment Navigates Away From Toolbar Page

### [1.28.44] (2018-10-09) (Broken: CXV1-15867)
* CXV1-15320 - Show that the user is currently offline instead of error banners

### [1.28.43] (2018-10-12) (Broken: CXV1-15867)
* CXV1-15467 - Fixed click to dials

### [1.28.42] (2018-10-09) (Broken: CXV1-15467)
* CXV1-15293 - Queue time bulk stat queries should be included in batch requests.

### [1.28.41] (2018-10-12) (Broken: CXV1-15467)
* CXV1-14306 - Fixed SQS on-message error retry logic

### [1.28.40] (2018-10-12) (Broken: CXV1-15467)
* CXV1-15353 - Fixed double batch request polling

### [1.28.39] (2018-10-11) (Broken: CXV1-15467)
* CXV1-13731 - Tweak Raven to log redux state as context

### [1.28.38] (2018-10-10) (Broken: CXV1-15467)
* CXV1-15348 - Visual notifications will not appear if the window is not in focus

### [1.28.37] (2018-10-02) (Broken: CXV1-15467)
* CXV1-11503 - Signing Into Same Agent Sometimes Does Not Show "Click to Reload" And Signs User Out Automatically.

### [1.28.36] (2018-10-03) (Broken: CXV1-15467)
* CXV1-15259 - Salesforce click to dials now pop to number they were clicked on

### [1.28.35] (2018-09-27)
* CXV1-14896 - Screenpop for Skylight popping 2 browser windows (1 correct, 1 blank)

### [1.28.34] (2018-09-25)
* CXV1-13732 - Make sure we catch SDK JavaScript exceptions in Sentry
* SDK version bump (CXV1-13733 - Update SDK to log errors to Kibana properly)

### [1.28.33] (2018-09-27)
* CXV1-15362 - Fixed transfer menu filter

### [1.28.32] (2018-09-25) (Broken: CXV1-15362)
* Added 15 second timeout for hold, mute, recording, wrap up, and end loading states

### [1.28.31] (2018-09-20) (Broken: CXV1-15362)
* CXV1-15284 - Hide "Failed to get available stats (code:12003) error" when hyperion is down

### [1.28.30] (2018-09-19) (Broken: CXV1-15362)
* SDK version bump (CXV1-15239 - Do not cease heatbeating until presence returns a 4xx)

### [1.28.29] (2018-09-18) (Broken: CXV1-15362)
* CXV1-13730 - Upload source maps to Sentry via Jenkins

### [1.28.28] (2018-09-18) (Broken: CXV1-15362)
* CXV1-12743 - Do not show null when customer name is not provided in the email interaction

### [1.28.27] (2018-09-17)
* CXV1-15006 - Transfer menu agent refresh button should be greyed out until response is returned

### [1.28.26] (2018-09-11)
* CXV1-15005 - Use batch requests for resource capacity. Use users route only when batches are failing

### [1.28.25] (2018-09-13)
* CXV1-15186 - Loading state for mute and hold buttons

### [1.28.24] (2018-09-12)
* CXV1-15216 - Loading state for recording and wrap up

### [1.28.23] (2018-09-05)
* SDK version bump (CXV1-15198 - Remove interaction hearbeats)

### [1.28.22] (2018-09-11)
* CXV1-15184 - Fix CSS for notes title and disposition close icon

### [1.28.21] (2018-09-11)
* CXV1-14962: Batch request logic in Agent Desktop
* CXV1-15198: Remove interaction hearbeats

### [1.28.20] (2018-09-06)
* CXV1-15217 - Loading state for end interaction button

### [1.28.19] (2018-09-04)
* CXV1-11646 - "No Results Found" is in English and NOT in The Selected Language (updated all current translations).

### [1.28.18] (2018-08-30)
* CXV1-14775 - Update ui-components to latest version

### [1.28.17] (2018-08-30)
* CXV1-14915: Items inside search field in Info Panel aren't aligned

### [1.28.16] (2018-08-22)
* CXV1-13729: Import Raven and setup Sentry client

### [1.28.15] (2018-08-20)
* CXV1-14707: Include other agents in the copied chat-transcript header

### [1.28.14] (2018-08-20)
* CXV1-14945: Remove spacing from copied chat transcript

### [1.28.13] (2018-08-17)
* CXV1-14757- North American country code is sometimes not added to Skylight dial sequence.

### [1.28.12] (2018-08-17)
* CXV1-14772: Update to webpack 4

### [1.28.11] (2018-08-16)
* CXV1-14612 - Adjust CSS for cancel text on cancel Interaction Before Active button.

### [1.28.10] (2018-08-16)
* CXV1-14521 - Skylight showing disabled transfer lists

### [1.28.9] (2018-08-15)
* CXV1-14662 - Fix SSO identity-ui error handling
* CXV1-14703 - Call apex class function to add org-id in hooks
* CXV1-14703 - Fix org-id assignment in salesforce lightning

### [1.28.8] (2018-08-15)
* CXV1-12115 - externalResource : true Do not look up agent name

### [1.28.7] (2018-08-15)
* CXV1-13015 - Skylight SSO - Choosing a tenant (NOT default) then signing in with SSO again doesnt go to the tenant select screen

### [1.28.6] (2018-07-31)
* CXV1-14773 - Update Jest to 22

### [1.28.5] (2018-07-31)
* CXV1-14406 - Unit Tests/tech debt for Copy Button

### [1.28.4] (2018-07-27)
* CXV1-14705 - Add Letters to Dialpad

### [1.28.3] (2018-07-25)
* CXV1-14274 - Email Reply Failing to Send

### [1.28.2] (2018-07-23)
* CXV1-14660 - hookBy parameter added in send-unassign-interrupt request in salesforce

### [1.28.1] (2018-07-19)
* CXV1-14502 - Zendesk - 'TypeError: Cannot read property queueName of undefined' When trying to view history.

### [1.28.0] (2018-07-17)
* CXV1-14405 - Implement Copy Button

### [1.27.2] (2018-07-19)
* CXV1-12463 - Facebook Chat - When a Facebook Interaction That is Assigned Is Transferred, Work Offer Shows Two Names.

### [1.27.1] (2018-07-19)
* CXV1-14660 - resourceId parameter added to send-unassign-interrupt request in salesforce

### [1.27.0] (2018-07-11)
* Remove agent notifications feature flag

### [1.26.3] (2018-07-09)
* CXV1-14428 - Visual notifications display banner when they are blocked and attempted to toggle
* CXV1-14471 - Audio and visual notifications for chat customer replies
* CXV1-14472 - Default audio and visual notifications on
* CXV1-14473 - Work offer visual and audio notifications only when page is not in focus
* CXV1-14505 - Hide visual notifications for IE11 (fixes it breaking the page too)

### [1.26.2] (2018-07-09)
* CXV1-13266 - Transferring Calls between agents and reporting on the last agent who handled the call as opposed to the 1st Agent

### [1.26.1] (2018-07-09)
* CXV1-14589 - Filter out "agent-initiated" agents from transfer list

### [1.26.0] (2018-07-04)
* CXV1-14206 - Added UI for new direction selector
* CXV1-14209 - Change the direction of functionality from "outbound" to "agent-initiated"

### [1.25.16] (2018-06-20)
* CXV1-12423 - Skylight for Zendesk window not properly resizing (SDK version bump)

### [1.25.15] (2018-06-27)
* CXV1-12836 - Fixed repeated Fields when handling 2 Email interactions simultaneously.

### [1.25.14] (2018-06-20)
* CXV1-14008 - SDK bump for Module to detect when the microphone is enabled within the browser

### [1.25.13] (2018-06-22)
* CXV1-11587 - Fix for Contact Input Boxes Move Off Screen When Side Panel Size is Reduced

### [1.25.12] (2018-06-22)
* CXV1-14325 - Fix for loading icon should be centered
* CXV1-14326 - Fix for login form is squished towards the top

### [1.25.11] (2018-06-20)
* CXV1-12424 - Skylight Lists (Presence/Disposition) are not ordered as configured

### [1.25.10] (2018-06-20)
* CXV1-14046 - White box for credentials is expanded into the login page using IE 11 browser.

### [1.25.9] (2018-06-20)
* CXV1-14239 - Agent Stats from Skylight toolbar does not work properly using IE11.

### [1.24.8] (2018-06-11)
* New PRs updates now automatically cancel previous pipeline builds

### [1.25.7] (2018-06-15)
* CXV1-14291 - Long time values don't display properly in transfer list

### [1.25.6] (2018-06-14)
* CXV1-14075 - Fixed cases around scripts in wrap up
* CXV1-14314 - Default script reporting to true

### [1.25.5] (2018-06-14)
* CXV1-14321 & CXV1-14322 - Fix button styling for non-tooltip buttons
* CXV1-14331 - Fix positioning of toolbar popout button

### [1.25.4] (2018-06-14)
* Revert CXV1-12532 (Needs to be reimplemented as a user preference)

### [1.25.3] (2018-06-12)
* CXV1-14338 - Show tenant selection on while logging in with deep link

### [1.25.1] (2018-06-12)
* CXV1-13852 - Scripts - Global CSS in Emails affects Skylight, fixed bug when user send answer and the email

### [1.25.0] (2018-06-11)
* Added default tenant selector on SSO login

### [1.24.5] (2018-06-11)
* CXV1-14289 - Updated button to fix dialpad, added extra message for tooltip for clarity wrapups.

### [1.24.4] (2018-06-07)
* CXV1-11144 - Script Freeform input does not show default text in agent desktop / Set default freeform textInput value to string empty on Script.js model.

### [1.24.3] (2018-06-07)
* CXV1-14061 - Current State Name seems cut off using IE11 and Edge.

### [1.24.2] (2018-06-06)
* Add testing complete step to pipeline

### [1.24.1] (2018-06-06)
* CXV1-13852 - Scripts - Global CSS in Emails affects Skylight, fixed some bug in the content area email

### [1.24.0] (2018-06-06)
* CXV1-14075 - Added in wrapup UI for scripts auto dismissal

### [1.23.24] (2018-06-06)
* Add QE step after code review

### [1.23.23] (2018-06-06)
* CXV1-14061 - Allow transfer list items to have the same name

### [1.23.22] (2018-06-06) (Broken)
* CXV1-14061 - Current State Name seems cut off using IE11 and Edge.

### [1.23.21] (2018-06-05) (Broken)
* CXV1-14057 - Home page information are not displayed well.

### [1.23.20] (2018-06-05) (Broken)
* CXV1-13900 - Allow transfer list items to have the same name

### [1.23.19] (2018-06-05)
* Allow previewing PRs to help code review

### [1.23.18] (2018-06-04)
* CXV1-11144 - Fixed Script Freeform input does not show default text in agent desktop

### [1.23.17] (2018-06-04)
* CXV1-14194 - Fixed SalesForce Welcome stats page not showing properly on lower screen resolutions (height of 768)

### [1.23.16] (2018-06-04)
* CXV1-14035 - Fix height of status menu in salesforce lightning

### [1.23.15] (2018-06-01)
* CXV1-14195 - Fix default height of notes panel for outbound interactions in toolbar mode

### [1.23.14] (2018-06-01)
* CXV1-14196 - Fix side panel overflow in toolbar mode

### [1.23.13] (2018-06-01)
* CXV1-13643 - Fixed SalesForce(Classic and Lightning) setHeight() issue where previously set heights were cached and not overwritten.

### [1.23.12] (2018-06-01)
* CXV1-13823 - Firefox - CRM Scroll bars cause entire page to move.

### [1.23.11] (2018-06-01)
* CXV1-14237 - Fix issue caused that was causing all direct deep links to force display of CxEngage Login password modal

### [1.23.10] (2018-05-31)
* CXV1-14193 - Fix popped out toolbar logo position (introduced in 1.23.9)
* CXV1-13567 - Fix tenant change after SSO login

### [1.23.9] (2018-05-30)
* CXV1-14193 - Updated login page to fit in lower screen resolution

### [1.23.8] (2018-05-29)
* CXV1-13852 - fixed bug about problem with the reply button in the email content.

### [1.23.7] (2018-05-29)
* CXV1-13852 - Scripts - Global CSS in Emails affects Skylight.

### [1.23.6] (2018-05-28)
* CXV1-13643 - Skylight toolbar cut off in SalesForce

### [1.23.5] (2018-05-25)
* CXV1-13567 - Fixed issues that were making it impossible to successfully log into tenants that required reauthentication

### [1.23.4] (2018-05-25)
* CXV1-14045 - Removed sso flag on login link, changed sso flag to a query param

### [1.23.3] (2018-05-24)
* CXV1-12664 - Fix popup blocker and non-deep link login bugs

### [1.23.2] (2018-05-24)
* CXV1-12384 - Preselect user's default tenant when logging in

### [1.23.1] (2018-05-23)
* CXV1-14045 - #sso in URL takes user directly to email-only login form

### [1.23.0] (2018-05-23)
* CXV1-13512 - Handle "Auto Dismiss" script setting + reporting signals
* CXV1-13044 - Agents can Log Out while having script submissions pending

### [1.22.1] (2018-05-23)
* CXV1-13273 - Unable to remove the Agent Stats from Skylight toolbar

### [1.22.0] (2018-05-22)
* CXV1-12664 - Implement Updated Deep Link Handling for AD/TB2

### [1.21.8] (2018-05-23)
* CXV1-13273 - Revert breaking change from [1.21.5](https://github.com/SerenovaLLC/agent-desktop/commit/c54fb41390622efc4c67725a1dc58a61162384ac)

### [1.21.7] (2018-05-21) (Broken)
* CXV1-13395 - Relaxed phone number validation

## [1.21.6] (2018-05-21) (Broken)
* CXV1-11589 - Agents weren't able to access Skylight from IE11 browsers (Finally fixed)

### [1.21.5] (2018-05-18) (Broken)
* CXV1-13273 - Unable to remove the Agent Stats from Skylight toolbar.

### [1.21.4] (2018-05-17)
* CXV1-13489 - Hold button doesn't update when mouse is over button

### [1.21.3] (2018-05-17)
* CXV1-12936 - Cannot "Scroll" when creating new contact in Skylight Desktop CRM, the CRM info in the contact menu add scroll

### [1.21.2] (2018-05-16)
* The status menu working in all heights

### [1.21.1] (2018-05-16)
* CXV1-11589 - Agents weren't able to access Skylight from IE11 browsers

### [1.21.0] (2018-05-15)
* CXV1-13940 - Preference menu
* CXV1-13941 - Moved stats menu into preference menu

### [1.20.15] (2018-05-14)
* CXV1-12532 - Filtered out Outbound-only agents from Transfer list

### [1.20.14] (2018-05-14)
* CXV1-12936 - Cannot "Scroll" when creating new contact in Skylight Desktop CRM

### [1.20.13] (2018-05-04)
* CXV1-12142 - Switching from Script Tab and Returning Causes Script to be at Top Again

### [1.20.12] (2018-05-02)
* CXV1-12083 - A Scripts Scrolling is not Interaction Specific

### [1.20.11] (2018-04-28)
* Updated the SDK to v6.20.1

### [1.20.10] (2018-04-28)
* Updated the SDK to v6.19.4

### [1.20.9] (2018-04-27)
* Updated the SDK to v6.19.3

### [1.20.8] (2018-04-27)
* Updated the SDK to v6.19.2

### [1.20.7] (2018-04-27)
* Updated the SDK to v6.19.1

### [1.20.6] (2018-04-26)
* Updated the SDK to v6.19.0

### [1.20.5] (2018-04-20)
* CXV1-13508 - Skylight - Notes text box can be dragged up and makes it cover other elements (updated)

### [1.20.4] (2018-04-13)
* CXV1-13412 - Transfer menu freezes when tenant has a lot of queues
* Removed source maps from production build

### [1.20.3] (2018-04-11)
* CXV1-13508 - Skylight - Notes text box can be dragged up and makes it cover other elements

### [1.20.2] (2018-04-09)
* CXV1-13077 - Fixed issue with SMS view not fitting properly in to 615 SF Lightning height
* CXV1-12495 - Fixed issue where SF Lightning toolbar was not popping open if a call came in while it was shut.

### [1.20.1] (2018-03-29)
* CXV1-13077 - Created and implemented new utility function to dynamically update toolbar css for CRM implementations
* CXV1-12495 - Fixed issue where interactions coming into salesforce lightning we causing the toolbar to flash out and then back in

### [1.20.0] (2018-03-22)
* CXV1-13077 - Fixed Salesforce Lightening toolbar height

### [1.19.9] (2018-03-21)
* CXV1-12424 - Fixed order for Presence Reasons within Categories

### [1.19.8] (2018-03-21)
* CXV1-13269 - Added corrected color to buttons, with hover, focus, selection changes to match Mitel branding
* CXV1-13268 - Changed page title to "MiCloud Engage" for Mitel Sites

### [1.19.7] (2018-03-19)
* CXV1-12929 - Fixed script presentation bug with outbound interactions starting with script break upon

### [1.19.6] (2018-03-20)
* CXV1-13263 - Update agent-desktop Jenkins build

### [1.19.5] (2018-03-20)(BROKEN)
* CXV1-12839 - when customer sends an email with empty subject, change subject from null to an empty empty string in the json response

### [1.19.4] (2018-03-19)(BROKEN)
* CXV1-12424 - Added code to present Presence Reasons ordered in the same way they have been previously configured by an admin.

### [1.19.2] (2018-03-14)
* CXV1-11862 - When no Language is present, searching contacts shows undefined values

### [1.19.1] (2018-03-13)
* CXV1-13204 Fixed spelling mistake in Legal Language

### [1.19.0] (2018-03-06)
* CXV1-12821/CXV1-12824  Added Legal Disclaimer links to all portal access or access related places

### [1.18.1] (2018-03-05)
* CXV1-13137 - Fixed issue that allowed the user to end wrapup without selecting a disposition - even if Flow is set to force the user to select a disposition

### [1.18.0] (2018-02-23)
* CXV1-12185 - Eckoh notification banner and hidden phone controls

### [1.17.3] (2018-02-21)
* CXV1-12837 - Fix time formatting for queue callback
* SDK bump for CXV1-12732

### [1.17.2] (2018-02-20)
* CXV1-12729 - Fix messaging text area cursor going to end of input on every change
* CXV1-12730 - Fix "undefined" being prepended to message templates

### [1.17.1] (2018-02-20)
* CXV1-12809 - Continute to show voice interactions with pending script after a new voice interaction comes in

### [1.17.0] (2018-02-15)
* CXV1-12837 - Queue callback notification

### [1.16.3] (2018-02-15)
* CXV1-12067: Adding Participant and Placing them on Hold Causes a White Button on a White Background

### [1.16.2] (2018-02-15)
* CXV1-12741: Add back in the functionality that skips tenant select if there is only 1 tenant

### [1.16.1] (2018-02-14)
* CXV1-12726: Fix onhover for PSTN pending interactions in toolbar

### [1.16.0] (2018-02-11)
* CXV1-12741: SSO - AD/TB2: Force logout upon set to "Ready" if token has 9 or less hours left on it

### [1.15.26] (2018-02-13)
* CXV1-12085 - Skylight issue - tenant drop-down list not sorted by alpha order

### [1.15.25] (2018-02-12)
* CXV1-12726 - Enable cancel button for outbound PSTN work offers

### [1.15.24] (2018-02-12)
* CXV1-12848 - Fix outbound non-voice interaction timers
* CXV1-12867, CXV1-12869, CXV1-12868 - Fix outbound voice interactions being merged into state

### [1.15.23] (2018-02-07)
* CXV1-11624 - Clicking Hold Button in TB2 makes Global Phone Controls Bar Slightly Move
* CXV1-12271 - Toolbar 2.0 - let the Agents know clearly that they are in wrapup mode

### [1.15.22] (2018-02-07)
* CXV1-12853 - Privacy policy link added to login page

### [1.15.21] (2018-02-07)
* CXV1-12848 - Fix non-voice timer being reset on interaction bar collapse

### [1.15.20] (2018-02-06)
* CXV1-12830 - Fixed display of work items (salesforce cases) with undefined subject
* CXV1-12749 - Fix timer for work items

### [1.15.19] (2018-02-05)
* SDK bump for CXV1-12834, CXV1-11915, and CXV1-12707
* README update

### [1.15.18] (2018-02-05)
* CXV1-12658 - Fix logic around adding inbound interactions

### [1.15.17] (2018-02-01)
* SDK bump for CXV1-12778

### [1.15.16] (2018-2-1)
* CXV1-11646 - Updated the noResultsText, for when there is no data to display in Select elements, and the placeholder for them as well, and to bring the information from translation files, using the react-select built-in options.

### [1.15.15] (2018-02-01)
* SDK bump for CXV1-12750

### [1.15.14] (2018-1-26)
* SDK bump for possible fix to CXV1-12715

### [1.15.13] (2018-1-26)
* CXV1-10834 - Implement ability to select ALL tenants associated with an email address regardless of IDP and all necessary reauthentication behavior

### [1.15.12] (2018-1-22)
* Run tests for PRs

### [1.15.11] (2018-1-19)
* SDK bump for fix to CXV1-11510

### [1.15.10] (2018-1-16)
* CXV1-10482 - Disable sending emails until artifact has been created

### [1.15.9] (2018-1-12)
* SDK bump for CXV1-11510

### [1.15.8] (2018-1-12)
* CXV1-12547 - interaction focus reporting time

### [1.15.7] (2018-1-11)
* SDK bump for CXV1-12010

### [1.15.6] (2018-1-10)
* TechDebt , es6 syntax for easier imports of actions

### [1.15.5] (2018-1-10)
* CXV1-11841 - Handle clearing the active tab in Zendesk when the active tab is blank

### [1.15.4] (2018-1-10)
* CXV1-12479 - Skylight - Actions Menu Should Close When "Reply" is Clicked During an Email Interaction
* CXV1-12478 - Salesforce Classic - Assigning an Interaction Takes Focus Off Script
* CXV1-12534 - Login page still remembers and goes to SSO login without SSO flag in URL
* CXV1-12511 - Toolbar popout doesn't work on SSO login

### [1.15.3] (2018-1-9)
* CXV1-12141 One Time Banner for contact translation error

### [1.15.2] (2017-12-22)
* CXV1-12330 - Fix SSO popup window from being blocked by popup blocker

### [1.15.1] (2017-12-20)
* CXV1-12292 - Salesforce lightning screen pops

### [1.15.0] (2017-12-20)
* CXV1-12292 - Salesforce lightning active tab, assign, unassign and focus

### [1.14.13] (2017-12-19)
* CXV1-12449 - A Check is NOT Made for Different Version of a Phone Number When Making a Click to SMS
* CXV1-12366 - History Tab + button should not show while in Salesforce

### [1.14.12] (2017-12-18)
* SDK bump for better fixes to CXV1-12427

### [1.14.11] (2017-12-18)
* SDK bump for fixes to CXV1-12427

### [1.14.10] (2017-12-15)
* CXV1-12378 - Salesforce Classic - Notes Section Should be Included in Skylight

### [1.14.8] (2017-12-14)
* CXV1-12344 - Auto assign interactions on screen pop
* CXV1-12366 - History Tab + button should not show while in Salesforce
* CXV1-12367 - Interaction Should Only be Unassignable While on Assigned Tab in Salesforce
* CXV1-12425 - Map sdks active tab changes in front end for auto assignments

### [1.14.7] (2017-12-13)
* SDK bump for fixes to CXV1-12238, CXV1-12238, and CXV1-12422

### [1.14.7] (2017-12-12)
* Fixed CRM assign button when script happens before interaction

### [1.14.6] (2017-12-12)
* CXV1-12411 - Click-to-Email - Cannot cancel email without error

### [1.14.5] (2017-12-11)
* CXV1-12319 - Viewing the Messaging Transcript of a Record in Zendesk and Switching Tabs Causes Critical Error

### [1.14.4] (2017-12-11)
* CXV1-12390 - Skylight Disposition List scaling

### [1.14.3] (2017-12-9)
* CXV1-12380 - Non-Voice Transfers - Transfer List Menu shrinks in Zendesk if the interaction is assigned to a contact
* CXV1-12359 - Toolbar 2.0 Zendesk - "Assigned" Button Should Not Be A Clickable Button
* CXV1-12354 - Toolbar 2.0 Zendesk - Outbound Sms Should Have Assign Button Hidden until Message is Sent

### [1.14.2] (2017-12-7)
* CXV1-11875 - SDK bump to fix zendesk results modal popping for outbound email and sms interactions

### [1.14.1] (2017-12-6)
* Proper check of crmModule !== 'none'

### [1.14.0] (2017-12-6)
* CXV1-9624 - TB2 - SF - Assign SF contact from within toolbar
* CXV1-9618 - Click on the interaction in Toolbar, tab comes in focus in service cloud
* CXV1-12088 - TB2 - SF classic resize on scripts

### [1.13.14] (2017-12-6)
* CXV1-12247 - SDK bump to fix facebook customer "from" name
* CXV1-12250 - SDK bump to fix receiving scripts before work offers and getting interactions with unsubmitted scripts back (transferred)

### [1.13.13] (2017-12-5)
* CXV1-12283 - SDK bump to fix MQTT not ending on wrapup-started
* Fix moment locale warning

### [1.13.12] (2017-12-4)
* CXV1-CXV1-12293 - Upgrade to React breaks Desktop with a critical Error

### [1.13.11] (2017-12-4)
* CXV1-12283 - SDK bump to fix MQTT not ending on work-ended

### [1.13.10] (2017-12-4)
* CXV1-12247 - Add other (transferred by) agent's name into message history

### [1.13.9] (2017-12-1)
* CXV1-12214 - Agent Messaging Content Disappears When Switching Between interactions

### [1.13.8] (2017-11-30)
* CXV1-11754 - Add non-voice transfer menu
* CXV1-11758 - Keyboard controls for transfer menu
* CXV1-12275 - Message text box in wrap up should be hidden not disabled
* CXV1-12235 - Zendesk- change Padding/Margin size of the subMenu div (i.e under the Actions Button)
* CXV1-12269 - Non-Voice Transfers - turning wrapup off breaks transfer menu content

### [1.13.7] (2017-11-30)
* CXV1-12257 - Show interaction history details for zendesk active tab

### [1.13.6] (2017-11-30)
* CXV1-11754 - Add non-voice transfer menu
* CXV1-11758 - Keyboard controls for transfer menu
* upgrading enzyme and jest test frameworks

### [1.13.5] (2017-11-29)
* CXV1-11391 - Transferring to an Agent That has Already Logged out or is Away Does Not Time Out.

### [1.13.4] (2017-11-29)
* Updated repos dependencies patch and minor version to get rolling to react 16

### [1.13.3] (2017-11-28)
* CXV1-12243 - Hide actions menu in interaction pending script state

### [1.13.2] (2017-11-28)
* CXV1-12227 - Fix console errors after non-voice transfer

### [1.13.1] (2017-11-28)
* CXV1-12147 - quick fix for missing pop out window icon
* CXV1-12222 - quick fix for transfer list not loading

### [1.13.0] (2017-11-27)
* CXV1-11754 - Add non-voice transfer menu
* CXV1-11758 - Keyboard controls for transfer menu

### [1.12.8] (2017-11-27)
* CXV1-12147 - Fix pop out button flashing on CRM reload

### [1.12.7] (2017-11-24)
* CXV1-11841 - Show assigned contact's name for email interactions

### [1.12.6] (2017-11-24)
* CXV1-11916 - TB2 - ZD - Ignore Zendesk outbound requests when one is already ongoing
* CXV1-12107 - TB2 - Proper fix for interaction popup preview

### [1.12.5] (2017-11-23)
* CXV1-12160 - Fix spacing of script checkboxes

### [1.12.4] (2017-11-23)
* CXV1-12107 - TB2 - Fix positioning of pending interaction popup (for interactions with long previews)
* Added message for SMS/messaging preview while message history is being loaded

### [1.12.3] (2017-11-22)
* CXV1-12169 - TB - ZD - Hide script tab for voice interactions in toolbar mode with assigned contact (history)
* CXV1-12128 - TB - ZD - Fix selected tab on contact assign/unassign

### [1.12.2] (2017-11-22)
* CXV1-12015 - UI Fix, When redirecting while logging in agent, do not show username/password page

### [1.12.1] (2017-11-20)
* CXV1-12166 - TB2 - ZD - SDK bump to fix the active tab being set on inital load

### [1.12.0] (2017-11-20)
* CXV1-12112 - TB2 - ZD - Interaction history for zendesk active tab

### [1.11.5] (2017-11-17)
* CXV1-12017 - Logout changes to fix bug with sso (revert refactor from 1.9.1)
* Fixed loading state bug when signing in with sso
* Refactor loading state method

### [1.11.4] (2017-11-15)
* CXV1-12124 - TB2 - ZD - Focus Zendesk user/ticket when interaction is selected

### [1.11.3] (2017-11-15)
* CXV1-12070 - TB2 - ZD - Update color of unassigned notification to red. Fix notifications dismiss sync error (when assigning too quickly).
* CXV1-11917 - TB2 - ZD - Fix username width when only history tab is present.

### [1.11.2] (2017-11-14)
* CXV1-12013 - TB2 - ZD - Update user/ticket name when updated in Zendesk

### [1.11.1] (2017-11-14)
* CXV1-12088 - TB2 - SF classic resize on scripts

### [1.11.0] (2017-11-13)
* CXV1-9688 - Dynamically load SDK CRM modules
* CXV1-9626 - TB2 - SF - Show click to dial/sms/email screen in toolbar on phone/email click
* CXV1-9621 - TB2 - SF - Show toolbar if hidden on new work offer
* CXV1-11691 - Unify UX for starting an interaction from search

### [1.10.1] (2017-11-13)
* CXV1-12079 - SDK bump for SSO fix

### [1.10.0] (2017-11-09)
* CXV1-12070 - Add ability to unassign ticket/user from interaction. Update so only unassiged interactions can be assigned ticket/user.

### [1.9.3] (2017-11-08)
* CXV1-12068 - Refactor and fix cancel button rendering for outbound voice transfers

### [1.9.2] (2017-11-08)
* CXV1-12007 - Allow the front end to handle when agent has multiple PSTN that are the same.

### [1.9.1] (2017-11-08)
* CXV1-12015 - Cached login type for logout redirect
* CXV1-12017 - Added SSO Remember me
* Login Container Refactors
* Logout Refactors

### [1.9.0] (2017-11-08)
* CXV1-11917 - Zendesk history. Updated zendesk tab change and assign.

### [1.8.14] (2017-11-08)
* CXV1-11795 - Collapsing Interaction Panel While in Interaction Causes Scroll Bars

### [1.8.13] (2017-11-07)
* CXV1-11905 - Active Voice Pathway is Missing Check Mark for Chosen Selection

### [1.8.12] (2017-11-07)
* Remove auto capitalization of strings

### [1.8.11] (2017-11-07)
* CXV1-11906 - Work Offers For Sms and Messaging Being Offered Without a Name or Message Body
* CXV1-12035 - Testing of Interactions Panel Buttons Pulse Functionality.

### [1.8.10] (2017-11-06)
* CXV1-12045 - Interactions panel updates
* CXV1-12049 - wrapupContainer Missing When In Skylight Mode

### [1.8.9] (2017-11-06)
* CXV1-12044 - Hide participant phone controls until connected

### [1.8.8] (2017-11-06)
* CXV1-12044 - Only show cancel button on initial outbound dial (not on transfers)

### [1.8.7] (2017-11-06)
* Refactor svg icons to be more consistent

### [1.8.6] (2017-11-03)
* CXV1-11917 - Refactor item component from ContactInteractionHistory

### [1.8.5] (2017-11-03)
* Fix sms conversations breaking

### [1.8.4] (2017-11-03)
* CXV1-11976 - Refactoring SSO to use separate identity window
* CXV1-12014 - Removed code that clears url hash so we do not clear '#sso' flag

### [1.8.3] (2017-11-03)
* Add iframe placeholder text

### [1.8.2] (2017-11-03)
* Fix sms issues, conversations ending

### [1.8.1] (2017-11-02)
* Fix script-only interactions critical error on render

### [1.8.0] (2017-11-01)
* CXV1-11878 - Support iframes in scripts

### [1.7.17] (2017-10-31)
* CXV1-11962 - Cancel Outbound Button Showing on Active Interaction Container on Hover
* CXV1-11975 - Accepting Multiple Interactions Causes Interaction Side Panel to Close With No Way to Access Other Interactions
* CXV1-11906 - Work Offers For Sms and Messaging Being Offered Without a Name or Message Body

### [1.7.16] (2017-10-31)
* Remove unused 'unread' property from messages
* Fix error thrown for 'script-only' interactions
* Remove unnecessary auto-accept

### [1.7.15] (2017-10-30)
* SDK bump for CXV1-11804

### [1.7.14] (2017-10-27)
* Setting interaction toggle to always on

### [1.7.13] (2017-10-25)
* Code Refactor Toolbar sizing defaults into constants

### [1.7.12] (2017-10-25)
* CXV1-11859 - Fixed Bash Script to Automate Zendesk Dev Environment Setup

### [1.7.11] (2017-10-25)
* CXV1-10844 - ZD SSO resize on login

### [1.7.10] (2017-10-25)
* CXV1-10567 - Can remove click-to-email target from To: field

### [1.7.9] (2017-10-24)
* CXV1-11757 - Confirm dialog for ending interactions now excludes wrapup

### [1.7.8] (2017-10-23)
* CXV1-11897 Open zendesk app when interaction comes in

### [1.7.7] (2017-10-23)
* Hotfix for Locale bugs

### [1.7.6] (2017-10-23)
* SSO pub sub fixes

### [1.7.5] (2017-10-20)
* SDK Bump

### [1.7.4] (2017-10-18)
* CXV1-11757 - Confirm dialog for ending interactions

### [1.7.3] (2017-10-17)
* CXV1-10844 - Single Sign On

### [1.7.2] (2017-10-13)
* CXV1-11861 - Force Agents to select a language.

### [1.7.1] (2017-10-13)
* Allow agent direction changes while ready

### [1.7.0] (2017-10-13)
* CXV1-11752 - Updated Actions Button Dropdown to rich menu

### [1.6.10] (2017-10-13)
- Attempt to accept interactions that we cannot find when doing click to dial.

### [1.6.9] (2017-10-13)
* CXV1-11858 - Enabled switch to outbound mode

### [1.6.8] (2017-10-13)
* CXV1-11859 - Create Bash Script to Automate Zendesk Dev Environment Setup

### [1.6.7] (2017-10-13)
* Un-hide languages; update translations; enable sentry for dev, qe, staging;

### [1.6.6] (2017-10-12)
* CXV1-11588 - Fixed bug with single stat getting cut off

### [1.6.5] (2017-10-11)
* CXV1-11860 - Look for desktop in url to decide if tb2

### [1.6.4] (2017-10-11)
* CXV1-11588 - Make stat details bigger, position appropriately

### [1.6.3] (2017-10-10)
* Add Fix CXV1-11849 to TB2 - Fix bug w/cancel button not appearing for outbound interactions

### [1.6.2] (2017-10-10)
* CXV1-11849 - Fix bug w/cancel button not appearing for outbound interactions

### [1.6.1] (2017-10-10)
* CXV1-11840 - Fix work items icon in contact interaction history

### [1.6.0] (2017-10-06)
* CXV1-11840 - Work items

### [1.5.4] (2017-10-06)
* CXV1-11784 - Reset agent timer when idle and keep it going while on interactions

### [1.5.3] (2017-10-05)
* CXV1-11521 - Agent gets error if they try to log into disabled default tenant

### [1.5.2] (2017-10-05)
* CXV1-11788 - Fix assigned button status on transfers

### [1.5.1] (2017-10-05)
* CXV1-11827 - Move script into main content area and remove notes for voice interactions in toolbar standlaone (like zendesk)

### [1.5.0] (2017-10-05)
* CXV1-11816 - Popup standalone toolbar link/mode

### [1.4.26] (2017-10-05)
* NO-TICKET - Remove all selectable languages except english

### [1.4.25] (2017-10-04)
* CXV1-11579 - While on call you can now use keyboard to send dtmf tones

### [1.4.24] (2017-10-04)
* CXV1-11622 - Fix resize of Zendesk toolbar modal for voice interactions with scripts
* CXV1-10523 - Bump SDK to fix zendesk focus tab

### [1.4.23] (2017-10-04)
* CXV1-11649 - No hover state on add participant

### [1.4.22] (2017-10-03)
* CXV1-11728 -Toolbar 2.0 Zendesk - Fix Outbound Assign Behavior

### [1.4.21] (2017-10-03)
* CXV1-11622 - Fix resize of Zendesk toolbar modal for scripts

### [1.4.20] (2017-10-02)
* CXV1-11727 - Fix rendering of no dispositions
* CXV1-11665 - Fix formatting of outbound numbers with '+' already in them

### [1.4.19] (2017-10-02)
* CXV1-11729 - Fix auto-hiding interactions bar logic

### [1.4.18] (2017-09-29)
* CXV1-11665 - Allow outbound SMS to perform witout manual "+" input
* CXV1-11726 - Fallback to description for Zendesk ticket name if subject is null

### [1.4.17] (2017-09-28)
* CXV1-11567 - Fix bug with disabled queue stats breaking AD upon initiating transfer

### [1.4.16] (2017-09-28)
* CXV1-9423 - Fix search queries for screen pops (encode query)
* Fix React key warning

### [1.4.15] (2017-09-27)
* CXV1-11622 - Implement auto resize of Zendesk toolbar modal when switching between interactions

### [1.4.14] (2017-09-27)
* CXV1-10521 - Show dispositions when notes are hidden in Zendesk mode
* Bump SDK version for Zendesk stuff
* Id for interaction panel button
* CXV1-11663 - Manually remove outbound interaction that customer has not yet replied to (instead of waiting for flow signal)

### [1.4.13] (2017-09-27)
* NO TICKET - Handle contact interaction history errors better

### [1.4.12] (2017-09-26)
* CXV1-10537 - Handle contact assignment on transfers in Zendesk

### [1.4.11] (2017-09-26)
* CXV1-11610 - Added names to assigned users and tickets
* CXV1-10523 - Implemented Zendesk tab experience

### [1.4.10] (2017-09-25)
* CXV1-11567 - Refresh queues on transfer popup

### [1.4.9] (2017-09-25)
* CXV1-10529 - Updated AD/TB2 to respond buttons on user widget for zendesk integration

### [1.4.8] (2017-09-25)
* CXV1-11408 - Fix AgentDesktop login

### [1.4.7] (2017-09-25)
* CXV1-10521 - Hide notes panel for zendesk

### [1.4.6] (2017-09-22)
* CXV1-11408 - Revert being able to login to Skylight (non-toolbar) without CRM permissions

### [1.4.5] (2017-09-22)
* CXV1-11406 - Pass locale to SDK for reporting translations

### [1.4.4] (2017-09-22)
* CXV1-9423 - Update screen pop (again)

### [1.4.3] (2017-09-21)
* CXV1-11622 - Implement auto resize of Zendesk toolbar modal

### [1.4.2] (2017-09-21)
* CXV1-11610 - UI for assigning zendesk

### [1.4.1] (2017-09-21)
* NO-TICKET - Handle messages with null body

### [1.4.0] (2017-09-20)
* CXV1-11610 - Add zendesk assign button

### [1.3.12] (2017-09-19)
* CXV1-11480 - Init zendesk

### [1.3.11] (2017-09-18)
* NO-TICKET - Dismiss Error Banner on Login Success

### [1.3.10] (2017-09-14)
* CXV1-11408 - Side panel adjustments for voice and hiding side panel

### [1.3.9] (2017-09-14)
* CXV1-11570 - Add + to customer for inbound SMS interactions

### [1.3.8] (2017-09-13)
* CXV1-11408 - Hide side panel when no tabs are available

### [1.3.7] (2017-09-13)
* CXV1-9423 - Revert screen pop update

### [1.3.6] (2017-09-13)
* CXV1-11570 - Fix "from" for inbound SMS interactions with no contact

### [1.3.5] (2017-09-13)
* CXV1-11566 - Fix onClick of pending PSTN interactions

### [1.3.4] (2017-09-12)
* CXV1-9423 - Update screen pop

### [1.3.3] (2017-09-12)
* CXV1-10657 - Script icon for voice pending script
* CXV1-11567 - Filter disabled queues from transfer lists and stats
* CXV1-11569 - Fix display name issues with multiple participants

### [1.3.2] (2017-09-12)
* CXV1-10658 - Status menu overflow/ellipsis fixes

### [1.3.1] (2017-09-12)
* CXV1-10657 - Toolbar view script interaction fixes

### [1.3.0] (2017-09-11)
* CXV1-11110 - Make side panel collapse interaction specific. Only automatically open side panel on accepted interaction (when CRM is enabled) and script received for interaction
* CXV1-9010 - Fix stats overflow for toolbar restricted dimensions on side panel collapse
* CXV1-10779 - Fix resize for active phone panel and scripts only
* CXV1-11423 - Replace Wrapup Toggle Switch in Toolbar with Options in Button Submenu
* CXV1-10659 - Toolbar styling of summary screen
* CXV1-10518 - Prevent ending interactions auto selecting pending interactions
* CXV1-11408 - Moved crm flag into a selector that uses agent permissions for selected tenant
* CXV1-11407 - Removed contact permissions check on tenant select
* CXV1-11204 - Toolbar mode for new interaction panel
* CXV1-11351 - Interaction from overflow
* CXV1-11481 - Update script ID passed in on submit for SDK major version bump
* CXV1-11462 - Fix contact outbound controls on small side panel
* CXV1-10589 - Fix unselected outbound contact assigning
* CXV1-10658 - Collapsible status menu dropdowns
* CXV1-10671 - Fixed error caused by deleting a contact that matches an ongoing interaction
* CXV1-10459 - Fixed wrapping issue with long strings in email subjects
* CXV1-10657 - Add new Icon for script only interactions

### [1.2.0] (2017-08-25)
* CXV1-9006 - Toolbar view of scripts
* CXV1-9011 - Toolbar view of new interaction handling
* CXV1-9005 - Created split-button with submenu for use in toolbar view of email
* CXV1-9007 - Hide interaction bar based on number of interactions
* CXV1-9014 - Added side panel styling, hide side panel when no script, and added button to open side panel when collapsed in toolbarMode
* CXV1-9013 - Toolbar view of custom fields && add custom fields to email interactions
* CXV1-10710 - Interaction bar overflow shadows and notifications for unresponded messages and pending interactions
* CXV1-10156 - Trigger end interaction when agent ends chat before receiving customer reply
* CXV1-9012 - Transfer controls UI updates for Toolbar and AgentDesktop
* CXV1-11193 - Hover box for active interactions
* CXV1-10579 - Update error banner styling
* CXV1-11075 - cleanup, not actual fix. Remove unneeded radium state from AgentScript
* SDK bump - Fixes CXV1-11151
* CXV1-9144 - Toolbar view of wrapups
* CXV1-11049 - Remove extraneous /queues calls, add excludeOffline to TransferMenu /users call
* CXV1-11131 - Fix stats issues with localisation
* CXV1-11157 - Fix contact madatory field validation
* CXV1-9003 - Fix toolbar messaging templates menu width
* CXV1-10433 - Localization validation and fallbacks for contact layouts
* CXV1-11160 - Fix "All" filter translations
* CXV1-11145 - Contact input placeholders without translations fallback
* CXV1-10779 - Add programatic resize functionality
* CXV1-9010 - Toolbar styling of stats

### [1.1.0] (2017-07-21)
* BUGFIX - SDK version bump to 5.3.27-SNAPSHOT
* CXV1-9000 - Added Context Flag based on url + tests
* CXV1-9001 - Toolbar styling for Login
* CXV1-9003 - Toolbar styling for Messaging interactions (templates)
* CXV1-9292 - Modified circle icon component so that a popup component could be inserted inside of it and retain its position relative to the button (as opposed to making dynamic positioning changes via JS if the button's position changes)
* INTERNAL - Add localization and locales
* CXV1-10646 - Fix Dialpad and TransferMenu popups
* CXV1-9002 - Toolbar styling for Voice
* INTERNAL - update dependencies
* CXV1-9004 - Added context flag for CrmEnabled, hide crm tabs in side panel, and updated url to tb2 for flags

### [1.0.2] (2017-07-19)
* CXV1-10603 - Ignore interaction-fatal errors if we do not have the interaction.

### [1.0.1] (2017-07-18)
* CXV1-10571 - Fix critical error on contact history from click to email

### [1.0.0] (2017-07-17)
* 1.0.0 !!!!!

### [0.43.45] (2017-07-17)
* CXV1-10468 - Close new interaction panel on click to email.

### [0.43.44] (2017-07-15)
* Upgrade Immutable library for improved keypath error messages.

### [0.43.43] (2017-07-14)
* BUGFIX - Focus PSTN on accept. Bring back transfer button.

### [0.43.42] (2017-07-14)
* BUGFIX - Handle voice interaction on interaction fatal gracefully

### [0.43.41] (2017-07-14)
* BUGFIX - Don't blow up on interaction history transcript/recording updates out of order.

### [0.43.40] (2017-07-14)
* CXV1-9785 - Bump SDK to 5.3.22, fixes twilio connection staying open for agent on interaction 404

### [0.43.39] (2017-07-14)
* CXV1-10434 - Fatal Error on Interactions Handling

### [0.43.38] (2017-07-14)
* BUGFIX - Fix error where messaging interactions are accepted before messaging history has arrived.

### [0.43.37] (2017-07-14)
* BUGFIX - Fix displaying of SDK errors

### [0.43.36] (2017-07-13)
* CXV1-10467 - add refresh banner to all screens on version bump

### [0.43.35] (2017-07-13)
* CXV1-10329 - fix disposition and wrapup state stuff

### [0.43.34] (2017-07-13)
* CXV1-9923 - Prevent flicker on checking contact

### [0.43.33] (2017-07-13)
* CXV1-10461 - Add no extensions error handling. Started implementing AD codes.

### [0.43.32] (2017-07-13)
* CXV1-10329 - Force agent into wrap up if force disposition is on and no disposition is selected

### [0.43.31] (2017-07-13)
* CXV1-10345 - Bump SDK to 5.3.21

### [0.43.30] (2017-07-13)
* CXV1-10395 - Auto-reject work-items

### [0.43.29] (2017-07-13)
* CXV1-10434 - Fixes issue with AD getting stuck on outbound voice failure

### [0.43.28] (2017-07-13)
* Bump SDK version to 5.3.20, fixes CXV1-10348

### [0.43.27] (2017-07-13)
* CXV1-10395 - Move permissions check to Agent Desktop

### [0.43.26] (2017-07-12)
* INTERNAL - Fix test errors

### [0.43.25] (2017-07-12)
* CXV1-10384 - Fix issue with outgoing email messages with only one message not making it into history

### [0.43.24] (2017-07-12)
* CXV1-9907 - Added flow signal for email reply cancel

### [0.43.23] (2017-07-12)
* CXV1-9950 - Handle null capacity for agents

### [0.43.22] (2017-07-12)
* CXV1-10329 - Allow work-cancel on outbound email (prevents wrap up mode)

### [0.43.21] (2017-07-12)
* CXV1-10347 - Error handling for no extensions

### [0.43.20] (2017-07-11)
* Bugfix for error banner over InfoTab

### [0.43.19] (2017-07-11)
* INTERNAL - add IDs for testing

### [0.43.18] (2017-07-11)
* Bump SDK version to 5.3.16

### [0.43.17] (2017-07-11)
* Bump SDK version to 5.3.14, fixes CXV1-10394

### [0.43.16] (2017-07-11)
* Bump SDK version to 5.3.13, temporary fix for CXV1-10345

### [0.43.15] (2017-07-11)
* INTERNAL - add IDs for testing

### [0.43.14] (2017-07-10)
* Bump SDK version to 5.3.12
* BUGFIX - available stats call error, resolved with SDK update

### [0.43.13] (2017-07-10)
* CXV1-10342 - Fix issue with outgoing SMS messages with only one message not making it into history

### [0.43.12] (2017-07-10)
* INTERNAL - run format on all files with updated deps
* INTERNAL - tweak precommit format run to only run on staged files

### [0.43.11] (2017-07-07)
* Bump SDK version to 5.3.10

### [0.43.10] (2017-07-06)
* CXV1-10348 - Fix sending scripts while being presented parallel work offer

### [0.43.9] (2017-06-30)
* CXV1-9913 - Added service error message on login

### [0.43.8] (2017-06-29)
* CXV1-9982 - Disable Filter Remove on search pending

### [0.43.7] (2017-06-29)
* BUGFIX - fix dial pad in transfer menu
* CXV1-10025 - Log all errors to kibana via sdk

### [0.43.6] (2017-06-29)
* CXV1-9785: Remove interaction on interaction-fatal error from SDK

### [0.43.5] (2017-06-29)
* CXV1-10097: Fix error with audio element causing history tab to break

### [0.43.4] (2017-06-29)
* CXV1-10218: Fixed bug that was ending interactions before required disposition was submitted when new interaction is created

### [0.43.3] (2017-06-29)
* CXV1-10159: Prevent wrap up restart on contact assignment

### [0.43.2] (2017-06-29)
* CXV1-9979: Focus script when added

### [0.43.1] (2017-06-28)
* CXV1-10075 - Got exit-search-btn working for contact search input field

### [0.43.0] (2017-06-28)
* CXV1-9981 - Show script by itself it it is received before or after an interaction.

### [0.42.14] (2017-06-28)
* BUGFIX - Ignore SDK error 14000 (failed to save logs)

### [0.42.13] (2017-06-27)
* CXV1-10143 - Changed how active resources are handled on transfers

### [0.42.12] (2017-06-27)
* CXV1-10115 - Fix error handling for selectors, mapStateToProps

### [0.42.11] (2017-06-26)
* CXV1-10121 - Bumped SDK version to 5.3.9

### [0.42.10] (2017-06-23)
* CXV1-9922 - Added locale icon to tabbing sequence on login screen

### [0.42.9] (2017-06-23)
* INTERNAL - Added prettier formatting library

### [0.42.8] (2017-06-23)
* BUGFIX - Fix keys for transfer lists

### [0.42.7] (2017-06-23)
* CXV1-10113 - Clean up checks we missed for the existence of assigned contacts

### [0.42.6] (2017-06-22)
* CXV1-9912 - New saga unit tests

### [0.42.5] (2017-06-22)
* CXV1-9976 - Fix fatal error on creating contact from new outbound sms
* Fix fatal error from viewing contact history when new interaction contact is undefined
* Clear new interaction panel when starting new interaction

### [0.42.4] (2017-06-21)
* CXV1-10076 - Clear new interaction panel on cancel
* CXV1-10076 - BUGFIX - bulk action buttons missing
* CXV1-10080 - Edit buttons available while edit already ongoing
* CXV1-10081 - Auto assign on contact merge to match create behavior and allow view

### [0.42.3] (2017-06-21)
* BUGFIX - Remove Sentry.io Logging
* BUGFIX - Shorten notification banner height, add drop shadow, adjust font size
* CXV1-9293 - Add Screen mask on dialer popup

### [0.42.2] (2017-06-21)
* CXV1-9912 - CRM Panel refactor

### [0.42.1] (2017-06-20)
* CXV1-9922 - Login and Tenant Select keyboard optimization

### [0.42.0] (2017-06-19)
* CXV1-9978 - Keep interaction alive in 'pending script' state when interaction has an unsubmitted script.

### [0.41.23] (2017-06-20)
* CXV1-9501 - Suppress error bar for failed request to get capacity (it is handled in the transfer menu)

### [0.41.22] (2017-06-20)
* CXV1-9501 - Fix handling of resource capacity error in Transfer Menu

### [0.41.21] (2017-06-19)
* CXV1-9538 - Add commas and spacing for multiple entries in 'To:' field for email

### [0.41.20] (2017-06-16)
* Add more strings for translation and refactored button messages

### [0.41.19] (2017-06-14)
* CXV1-9968 - Use SDK messages for errors. Show "error" level SDK errors as non-critical errors.

### [0.41.18] (2017-06-14)
* BUGFIX - Added Create Contact button to Contact Search when no search results

### [0.41.17] (2017-06-14)
* CXV1-9907 - Add SDK flow signals on email replys

### [0.41.16] (2017-06-14)
* CXV1-8179 - Clean up search input focus
* BUGFIX - contact search 'Result(s)' text
* BUGFIX - box shadow on agent status menu submenus
* BUGFIX - taking out download button and context menu for audio element

### [0.41.15] (2017-06-15)
* Bump the SDK version to 5.3.6

### [0.41.14] (2017-06-14)
* CXV1-8189 - Fix error when we get work-initiated without previous work-offer

### [0.41.13] (2017-06-14)
* CXV1-9925 - Fix text input padding (for Firefox)

### [0.41.12] (2017-06-14)
* BUGFIX - Email Reply name fix

### [0.41.11] (2017-06-14)
* BUGFIX - Updated Messaging model to work even if from field is null

### [0.41.10] (2017-06-14)
* CXV1-9769 - Improved handling of SDK callback so they won't continue if there was an error.
* CXV1-9501 - Handle errors in transfer agents capacity callback to handle error.
* Added versioning to README.

### [0.41.9] (2017-06-14)
* Internal - Fix test console warnings/errors

### [0.41.8] (2017-06-13)
* Bump the SDK version to 5.3.3
  * Adds email reporting functions CXV1-9907

### [0.41.7] (2017-06-13)
* CXV1-9519 - further new interaction panel / search work

### [0.41.6] (2017-06-13)
* CXV1-9407 - Added cancel button on interactions popup for click to dial calls only

### [0.41.5] (2017-06-13)
* BUGFIX - Remove error test

### [0.41.4] (2017-06-12)
* BUILDFIX - Update Jenkinsfile to support hotfix branches better and PRs

### [0.41.3] (2017-06-09)
* BUGFIX - Add legal to all JS files

### [0.41.2] (2017-06-09)
* Added Legal to prod minified js

### [0.41.1] (2017-06-09)
* CXV1-9848 - Bug prevention for click to email

### [0.41.0] (2017-06-09)
* CXV1-9519 - Updated new interaction panel to use full CRM search

### [0.40.8] (2017-06-09)
* Bump the SDK version to 5.3.2
  * Fixes CXV1-8189, CXV1-9389, CXV1-9836

### [0.40.7] (2017-06-08)
* CXV1-9497 - Character limits on notes

### [0.40.6] (2017-06-08)
* BUGFIX - Fix Contact edit/merge form radio button circle mac issue

### [0.40.5] (2017-06-08)
* BUGFIX - Hide "Forgot Password" link

### [0.40.4] (2017-06-07)
* BUGFIX - Fix Contact edit/merge form width

### [0.40.3] (2017-06-07)
* CXV1-9329 - User config fail on load handling
* Internal - Critical error banner with custom messages

### [0.40.2] (2017-06-07)
* CXV1-9641 - Added Tests for Click to Email

### [0.40.1] (2017-06-07)
* CXV1-9647 - Hide dialpad during active PSTN call

### [0.40.0] (2017-06-07)
* CXV1-9641 - Click to Email

### [0.39.1] (2017-06-06)
* CXV1-9647 - Contact screen pop and other PSTN changes

### [0.39.0] (2017-06-02)
* CXV1-9519: Added dial to SMS/call buttons to Contact panel when searching phone number and no results
* CXV1-9519: Refactored Contact component into ContactView and ContactEdit component

### [0.38.4] (2017-06-05)
* CXV1-8658 - Reverted scrollbar styles back as we cannot always determine when the scrollbar will be showing

### [0.38.3] (2017-06-05)
* CXV1-8658 - Moved scroll bar over to the side away from contact cards and removed floating extra div

### [0.38.2] (2017-06-02)
* CXV1-9443 - Handle invalid extension

### [0.38.1] (2017-06-02)
* CXV1-9592 - Hook welcome stats up to main stats system
* CXV1-9592 - Handle stat errors

### [0.38.0] (2017-06-02)
* CXV1-9519: Dial to SMS v1

### [0.37.30] (2017-06-01)
* Bump SDK to 5.2.1

### [0.37.29] (2017-05-31)
* BUGFIX - fixed typos in translations and resorted list

### [0.37.28] (2017-05-31)
* CXV1-9208 - BUGFIX - Contact Search infiniteScroll fixed

### [0.37.27] (2017-05-30)
* CXV1-8658 - BUGFIX - Contact Search resize issue fix

### [0.37.26] (2017-05-30)
* Update SDK to 5.2.0

### [0.37.25] (2017-05-30)
* CXV1-6938 - Add confirm dialog to contact merge

### [0.37.24] (2017-05-30)
* CXV1-9364 - Catch redux errors

### [0.37.23] (2017-05-26)
* CXV1-9364 - Add SDK version to Sentry config
* Updated SDK to 5.1.1

### [0.37.22] (2017-05-26)
* CXV1-9329 - Fix heartbeat 404 error handling

### [0.37.21] (2017-05-26)
* Updated SDK to 5.1.0, fixes PSTN (CXV1-9374)

### [0.37.20] (2017-05-25)
* CXV1-9329 - Contact interaction deactivation switch on layout fail

### [0.37.19] (2017-05-25)
* CXV1-6938 - Clear search filters after create or merge contact

### [0.37.18] (2017-05-25)
* CXV1-9329 - Fix login error handling

### [0.37.17] (2017-05-25)
* CXV1-8721 - Contact interaction history paging

### [0.37.16] (2017-05-25)
* Style updates for contact merge

### [0.37.15] (2017-05-25)
* Change all component non-react lifecycle functions to arrow functions
* Fixed radium warning on contact search bar

### [0.37.14] (2017-05-24)
* Update SDK URL
* Fix error banner refresh link
* CXV1-9364 - Only initialize Sentry for prod

### [0.37.13] (2017-05-24)
* CXV1-9364 - Handle render errors (show critical error bar instead of breaking/freezing the app)

### [0.37.12] (2017-05-24)
* Add merge button. Style changes on merge form.

### [0.37.11] (2017-05-23)
* Internal - move main SDK subscription block up out of AgentDesktop, prepare to split

### [0.37.10] (2017-05-23)
* Revert 0.37.8

### [0.37.9] (2017-05-23)
* BUGFIX - login input borders
* BUGFIX - contact search button
* BUGFIX - contact interaction history transcripts

### [0.37.8] (2017-05-23)
* Revert to 0.37.5 for safe fix & release

### [0.37.7] (2017-05-22)
* CXV1-9329 - SDK error handler - send to Sentry.

### [0.37.6] (2017-05-23)
* Remove dev sentry reports

### [0.37.5] (2017-05-23)
* CXV1-9406 - email inputs border cleanup

### [0.37.4] (2017-05-23)
* SDK-BUMP - 5.0.1
* CXV1-9406 - various small css bugs

### [0.37.3] (2017-05-23)
* Remove merge button

### [0.37.2] (2017-05-22)
* BUGFIX - Bug prevention for a agent selecting a status while another status is still pending

### [0.37.1] (2017-05-19)
* CXV1-9359 - Fix stat issue (convert stats to saga)

### [0.37.0] (2017-05-19)
* CXV1-6938 - Contact Merge

### [0.36.1] (2017-05-19)
* Test errors

### [0.36.0] (2017-05-18)
* CXV1-8563 - Agent capacity and Queue average time on Transfer Menu

### [0.35.11] (2017-05-18)
* Fix transfer user fetch

### [0.35.10] (2017-05-18)
* BUGFIX - contact pop search broken
* BUGFIX - Voice pathway arrow outta place
* SDK 5.0.0!
* BUGFIX - login gets stuck on incorrect password (SDK fix)
* BUGFIX - Reason codes not showing (SDK fix)
* Lil bit o' app description in readme

### [0.35.9] (2017-05-18)
* Sentry config; restrict to non-dev. Source map for non-dev.

### [0.35.8] (2017-05-18)
* CXV1-9314 - Update Dependencies (React 15.5 Prep, sanitize.css, nothing disruptive)

### [0.35.7] (2017-05-18)
* BUGFIX - Fixed button styling border in confirm dialog

### [0.35.6] (2017-05-17)
* CXV1-9062 - Refactor styles block of Avatar. Refactor styles block of Button + Tests.

### [0.35.5] (2017-05-17)
* Fixed interactions without contact assigned

### [0.35.4] (2017-05-17)
* Dependency updates - !major || (!semver && !breaking-changes)

### [0.35.3] (2017-05-17)
* Bump to SDK 5 Snapshot 301 for contact search query fixes
* Back to script tag SDK loading for the nice debugging stack
* BUGFIX: Contact editing errors out

### [0.35.2] (2017-05-17)
* CXV1-9130: Fixed contact search bar styling in Firefox.
* Fixed long tenant names in status menu.

### [0.35.1] (2017-05-16)
* Fallback to SDK from npm until https is fixed

### [0.35.0] (2017-05-16)
* Bump SDK to v5.0.0

### [0.34.12] (2017-05-16)
* CXV1-8658 - BUGFIX - contact panel resize fix

### [0.34.11] (2017-05-15)
* CXV1-8966 - BUGFIX - delete confirm dialog mask misplaced
* CXV1-8966 - BUGFIX - delete bar showing in edit

### [0.34.10] (2017-05-15)
* CXV1-6956: Reducer tests for actions involving click to SMS, QE fixes
* CXV1-9232: Fix contact edits on click to SMS interactions

### [0.34.9] (2017-05-15)
* CXV1-8784 - Checkboxes in Agent Scripts not showing up correctly

### [0.34.8] (2017-05-15)
* CXV1-8966 - various small QE fixes / improvements

### [0.34.7] (2017-05-15)
* No Ticket - BUGFIX left gutter gone on contect edit/view

### [0.34.6] (2017-05-15)
* CXV1-8705 - Fixed screen mask bug with confirm dialogs

### [0.34.5] (2017-05-12)
* CXV1-9208 - Fixed infinite scroll of searched contacts in ContactsControl

### [0.34.4] (2017-05-12)
* Replaying commits from extra version release of 33.4

### [0.34.3] (2017-05-12)
* CXV1-8202 - Updated contact search to make phone number search only return results for exact matches

### [0.34.2] (2017-05-11)
* CXV1-8705 - Fixed screen mask bugs with popup dialogs

### [0.34.1] (2017-05-11)
* CXV1-8499 - Add blue border to selected contact

### [0.34.0] (2017-05-10)
* CXV1-6956 - Click to SMS

### [0.33.4] (2017-05-12)
* CXV1-8966 - BUGFIX - lower button text stay not ready when system reason

### [0.33.3] (2017-05-11)
* CXV1-8966 - Add error & refresh if no non system reason list is set for user on tenant
* CXV1-8966 - BUGFIX - ready message change did not stick in translations
* CXV1-8966 - BUGFIX - notReady cutting off to ellip on some browsers

### [0.33.2] (2017-05-10)
* CXV1-8966 - Remove not ready button in agent status menu

### [0.33.1] (2017-05-10)
* CXV1-8315 - Corrected checkbox data structure in agentScripts and refactored agentScripts

### [0.33.0] (2017-05-10)
* CXV1-8499 - Contact delete bulk action
* BUGFIX - edit abandon dialog not hiding after cancel and reenter
* BUGFIX - edit abandon dialog showing up even when no changes made

### [0.32.8] (2017-05-08)
* CXV1-7193 - Locale Icon hover styles

### [0.32.7] (2017-05-08)
* CXV1-8498 - BUGFIX - presence flipping back to not ready when going ready

### [0.32.6] (2017-05-05)
* CXV1-7491 - Adjusted locale icon

### [0.32.5] (2017-05-05)
* CXV1-8498 - Set reason code from state change response
* SDK version bump to 4.1.1-SNAPSHOT.267

### 0.32.4 (2017-05-04)
* SDK version bump (to the version that includes click to sms & send outbound SMS functionality)

### 0.32.3 (2017-05-04)
* SDK version bump (poller fix)

### 0.32.2 (2017-05-03)
* CXV1-8230 - Changed transfer menu so that queues come from the Redux store instead of an SDK call

### 0.32.1 (2017-05-02)
* CXV1-8498 - BUGFIX - show all active reason lists, not just active && default

### 0.32.0 (2017-05-02)
* CXV1-8500 Email templates
* CXV1-7410 Update medium-draft. Move fork to liveops.

### 0.31.1 (2017-05-02)
* CXV1-8616 Fixed multiple inline email images bug

### 0.31.0 (2017-05-02)
* CXV1-8498 Not Ready Presence Reasons

### 0.30.6 (2017-05-01)
* Quick fix for react-select dependency build error
* https://github.com/JedWatson/react-select/issues/1694

### 0.30.5 (2017-04-28)
* Added email history to reply messages and added inline images to emails

### 0.30.4 (2017-04-28)
* Put max width back in interactions preview

### 0.30.3 (2017-04-28)
* Fix URL validation on contacts

### 0.30.2 (2017-04-27)
* CXV1-8608 - Interaction History note text styles

### 0.30.1 (2017-04-27)
* CXV1-8547 - Message template QE fixes (styling)

### 0.30.0 (2017-04-27)
* CXV1-7491 - Added locale switcher to login screen

### 0.29.5 (2017-04-27)
* CXV1-8547 - Message template QE fixes

### 0.29.4 (2017-04-26)
* CXV1-8671 - Truncate message preview with ellipsis

### 0.29.3 (2017-04-26)
* CXV1-8609 - Hide disposition spinner once dispo is selected. If wrap up timer is expired, end wrap up on dispo select.

### 0.29.2 (2017-04-26)
* CXV1-8671 - Give message preview in tooltip

### 0.29.1 (2017-04-26)
* Fix page favicon and title with mitel branding

### 0.29.0 (2017-04-25)
* CXV1-8547 - Message template hotkeys/shortcuts ("/" to select and filter templates while typing, arrow up and down improvements)

### 0.28.9 (2017-04-25)
* CXV1-8609 - Email wrap up

### 0.28.8 (2017-04-24)
* CXV1-8681 - Agent shouldn't be able to Logout during wrapup

### 0.28.7 (2017-04-21)
* CXV1-8665 - Custom confirmation / warning dialog

### 0.28.6 (2017-04-21)
* CXV1-8672 - Only change messaging icon after agent replies

### 0.28.5 (2017-04-20)
* CXV1-8671 - Fix CSS issues with long words in message previews

### 0.28.4 (2017-04-20)
* CXV1-8618 - Prompt before allowing page navigation/reload if there is an active interaction

### 0.28.3 (2017-04-18)
* CXV1-8466 - Move to jest + snapshot testing
* CXV1-8647 - Basic snapshot tests on all components
* CXV1-8648 - Containers - Saga tests, good start on selector tests and some basic reducer tests

### 0.28.2 (2017-04-18)
* CXV1-7531 - Cache invalidation bug fix

### 0.28.1 (2017-04-10)
* Update Cx SDK to 4.0.0-SS.253

### 0.28.0 (2017-04-10)
* CXV1-8547 - Messaging template base functionality

### 0.27.9 (2017-04-10)
* Re-brand for mitel on login screen Only
* Better error handling for agent with only 1 tenant and misssing perms

### 0.27.8 (2017-04-07)
* CXV1-8467 - remove router broke hot reload, fix and better understand webpack processes
* BUGFIX - interaction count on contact history not showing
* contact interaction transcript - Show agent name instead of 'Agent'
* Welcome stats - still hacky but no longer dangerous.

### 0.27.7 (2017-04-07)
* CXV1-8486 - Only allow one transfer resource menu open at once. Fix transfer dialpad on enter.

### 0.27.6 (2017-04-07)
* CXV1-8486 Minor transfer enhancements fixes (transfer on enter for transfer dialpad, transfer dialpad button verbage, handle multiple transfers to the same PSTN)
* Added function to log AgentDesktop state for debugging non-locally

### 0.27.5 (2017-04-07)
* BUGFIX - all messages in transcript carry name of contact

### 0.27.4 (2017-04-07)
* CXV1-8272 Enable transcript fetching
* BUGFIX - interaction history failing to load on new interaction pop

### 0.27.3 (2017-04-06)
* CXV1-8486 Disable mute button when agent is on hold. Unmute when resource is taken off hold.

### 0.27.2 (2017-04-06)
* CXV1-8486 Fix on customer hold and recoringd getting out of sync between work offer and work accepted
* CXV1-8486 New icons for dialpad buttons in transfer menu

### 0.27.1 (2017-04-05)
* CXV1-8486 Fix on hold/muted/participants getting out of sync between work offer and work accepted

### 0.27.0 (2017-04-05)
* CXV1-8260 Resume all functionality in participant controls when >1 participants on hold
* CXV1-8486 UI improvments for transfers (icon for cancel transfer, padding on participants, tool tips for participants controls, warm/cold transfer verbage)

### 0.26.5 (2017-04-05)
* Fix bug in single tenant login
* Fix bug with toggling agent menu

### 0.26.4 (2017-04-04)
* CXV1-8420 take out react router and unused async loading

### 0.26.3 (2017-04-04)
* Resource mute fix

### 0.26.2 (2017-04-04)
* Only present tenant select screen when the agent belongs to more then one tenant
* Tweak 404 error handling
* Tweak Cache invalidation to stop checking once a version bump has been detected
* Adjust config button width to match side panel
* Hide agent menu when a work offer is received
* Make dialpad textfield not editable when on a call

### 0.26.1 (2017-04-03)
* CXV1-8271 pagination (just awaiting SDK query string update)

### 0.26.0 (2017-04-03)
* Transfer enhancements (resource controls)

### 0.25.6 (2017-04-03)
* CXV1-8330 Show plain text body if there is no html body

### 0.25.5 (2017-04-03)
* Fix work offers without resources defined (emails, pre-transfer enhancements)

### 0.25.4 (2017-04-03)
* FIRST! (April)
* Restrict analytics to Prod only

### 0.25.3 (2017-03-31)
* BUGFIX - Search filters list never showing empty.
* BUGFIX - Bombing out when trying to fetch detailed history view for sms interaction

### 0.25.2 (2017-03-31)
* CXV1-8412 Remove ability to clear select since you need it to progress to next screen.
* Indicate what the agent is selecting on the tenant select screen.

### 0.25.1 (2017-03-31)
* CXV1-7949 Default search bar to All filter on enter if none selected
* CXV1-8417 BUGFIX - Contacts panel blanking if in history tab and next interaction does not have contact assigned/selected.

### 0.25.0 (2017-03-30)
* CXV1-8272 contact interaction history level 3 - recordings

### 0.24.3 (2017-03-30)
* Fix cache invalidation interval

### 0.24.2 (2017-03-30)
* Remove cache invalidation from main agent screen
* Fix css issue with cache invalidation notice on login screen
* set default to false for show notification

### 0.24.1 (2017-03-30)
* Add cache invalidation
* add heartbeat and general sdk error handling

### 0.24.0 (2017-03-29)
* Updated breaking changes by new SDK
* Add/remove transfer resource functionality

### 0.23.11 (2017-03-29)
* CXV1-8421 -update dev dependencies

### 0.23.10 (2017-03-29)
* CXV1-8421 -update dependencies

### 0.23.9 (2017-03-28)
* CXV1-8366 - Validate saved agent stats

### 0.23.8 (2017-03-27)
* adapt stats to new SDK api

### 0.23.7 (2017-03-23)
* Factor in for null on auto-answer on the pending interactions filter

### 0.23.6 (2017-03-23)
* Bump SDK version

### 0.23.5 (2017-03-23)
* Additional null checks around dispositions

### 0.23.4 (2017-03-23)
* Fixed issue w outbound click-to-dial

### 0.23.3 (2017-03-23)
* Fix customer name on facebook interactions
* Fix facebook interactions
* Bump SDK to 2.3.0

### 0.23.2 (2017-03-23)
* Cancel transfer fix

### 0.23.1 (2017-03-23)
* Game changing CSS fixes

### 0.23.0 (2017-03-23)
* Notes (level 3) added to contact interaction history

### 0.22.3 (2017-03-23)
* bump SDK version for fixes to resource hold

### 0.22.2 (2017-03-23)
* Fixed server-side resource mute

### 0.22.1 (2017-03-23)
* DTMF fix
* blastSqsOutput and logLevel added to config

### 0.22.0 (2017-03-22)
* DTMF enabled when you have an active interaction

### 0.21.1 (2017-03-22)
* Contact interaction history fixes (history refresh button, onclick only for level 1, last dispo on level 1)

### 0.21.0 (2017-03-22)
* CXV1-6296: Scripts

### 0.20.0 (2017-03-22)
* CXV1-6289: Email reply attachments

### 0.19.1 (2017-03-22)
* Fix for gmail bodies and null email names

### 0.19.0 (2017-03-22)
* CXV1-8293: Selected contact state when no interaction selected - inc. interaction history

### 0.18.3 (2017-03-21)
* CXV1-7958: Fix random loading error via more deterministic module loading

### 0.18.2 (2017-03-21)
* HACK: Attempt to fix random loading issues via force reload on state loading error

### 0.18.1 (2017-03-21)
* Add click to hide to agent config menu, add menu animations

### 0.18.0 (2017-03-21)
* CXV1-6289: Email replies

### 0.17.2 (2017-03-21)
* Fix permission error handling and error css
* Change agent status menu to require click to hide. Click anywhere on screen to hide.

### 0.17.1 (2017-03-21)
* Contact create/update confirmation messages
* New Label -> Disposition
* BUGFIX: contact creation key camel-casing (SDK fix)

### 0.17.0 (2017-03-20)
* CXV1-7154 - Email attachments on view

### 0.16.1 (2017-03-20)
* CXV1-7937 - use active layouts only

### 0.16.0 (2017-03-20)
* CXV1-6949 - Connect Notes UI to SDK

### 0.15.0 (2017-03-19)
* CXV1-6935 - Contact interaction history "level 2"

### 0.14.0 (2017-03-17)
* CXV1-6942 - Dispositions with force select

### 0.13.5 (2017-03-16)
* Add agent status menu animation
* Fix zIndex bug with stats menu

### 0.13.5 (2017-03-16)
* Version bump SDK for bugfixes.
* Hide inline image attachments in emails.

### 0.13.4 (2017-03-16)
* Refactor Tos, CCs, BCCs to work with SDK.sendReply() contract.
* Fixed duplicate emails/attachments errors.

### 0.13.3 (2017-03-16)
* Email contact pop.

### 0.13.2 (2017-03-15)
* Editable To, CC, BCC, and subject in email replies.

### 0.13.1 (2017-03-15)
* Fix select menu drawing offscreen
* Update splash

### 0.13.0 (2017-03-15)
* Email interaction view. Reply mocked.
* Fixed stop recording toggle function.

### 0.12.1 (2017-03-15)
* Fix loopy progress bar causing stack overflows >.<

### 0.12.0 (2017-03-14)
* CXV1-6937 - Realtime agent stats

### 0.11.1 (2017-03-14)
* Fixing in call timer format

### 0.11.0 (2017-03-13)
* Contact interaction history

### 0.10.5 (2017-03-13)
* SDK build with working wrapups
* BUGFIX: contact layouts loading race condition causing occasional login bomb out
* BUGFIX: messages not being marked accepted on interaction auto select
* BUGFIX: no sdk contact assign on autoassign

### 0.10.4 (2017-03-13)
* Fixing auto-deploy

### 0.10.3 (2017-03-13)
* IDs for side panel collapse icon and search bar

### 0.10.2 (2017-03-13)
* Split wrapup timeout bars
* BUGFIX: outbound calls blowing up

### 0.10.1 (2017-03-10)
* Fix work-rejected pubsub
* Fix non-local welcome stats API calls
* Temporary fix SDK log errors

### 0.10.0 (2017-03-10)
* SDK 2.0
* Custom fields on interactions

### 0.9.4 (2017-03-10)
* Notes back in

### 0.9.3 (2017-03-10)
* Connect assign contact flow to SDK
* BUGFIX: Search result count not resetting correctly
* BUGFIX: Assign button showing on assigned contact view
* BUGFIX: Shrunken search button on assigned contact view

### 0.9.2 (2017-03-09)
* Disable notes / dispositions panel until SDK functionality available
* BUGFIX: Search dropdown offset, right margin missing.

### 0.9.1 (2017-03-08)
* Fix bug in wrapup toggle
* Update index.html splash to new product name

### 0.9.0 (2017-03-08)
* Make Contacts Panel Immediately Visible Upon Login.

### 0.8.0 (2017-03-08)
* Wrapups UI and remaining logic
* BUGFIX: overzealous search result refreshing
* BUGFIX: unread message indication not showing & timer not resetting on new message

### 0.7.8 (2017-03-07)
* Mock scripts in interactions
* Maintain script values in interaction state so they persist across switching interactions

### 0.7.7 (2017-03-06)
* Script render components

### 0.7.4 (2017-03-03)
* Auto focus dialpad text input
* Call on dialpad text input enter
* Fixed outbound voice interaction being selected, hiding, the re-appearing when auto-answer is on

### 0.7.3 (2017-03-03)
* Remove analytics, leave google and mixpanel

### 0.7.2 (2017-03-03)
* Upgrade dependencies

### 0.7.1 (2017-03-03)
* Send button for messages
* Shift+enter makes new new lines on messages

### 0.7.0 (2017-03-03)
* Start of agent scripts
* Legalese typo fix

### 0.6.6 (2017-03-03)
* Email UI improvements

### 0.6.5 (2017-03-03)
* Fixing Jenkins pipeline

### 0.6.4 (2017-03-03)
* Fixing Jenkins pipeline

### 0.6.3 (2017-03-03)
* Fixing Jenkins pipeline

### 0.6.2 (2017-03-03)
* Fixing Jenkins pipeline

### 0.6.1 (2017-03-03)
* Fixing Jenkins pipeline

### 0.6.0 (2017-03-02)
* Barebones wrapup handling

### 0.5.10 (2017-03-01)
* Fixing auto-deploy

### 0.5.9 (2017-03-01)
*  Error banner for contacts panel

### 0.5.8 (2017-03-01)
* Fixing auto-deploy

### 0.5.7 (2017-03-01)
* Fixing auto-deploy

### 0.5.6 (2017-03-01)
* Fixing auto-deploy

### 0.5.5 (2017-03-01)
* Fixing auto-deploy

### 0.5.4 (2017-03-01)
* Fixing auto-deploy

### 0.5.3 (2017-03-01)
* "Notready" wording, styling

### 0.5.2 (2017-03-01)
* build breaking typo fix in validator import
* Disposition components (commented out, to be used later)

### 0.5.1 (2017-02-28)
* Link, Boolean and Number input types / validation
* Click to dial from contact phone number
* BUG: + being appended before Agent name

### 0.5.0 (2017-02-27)
* Click to dial via dialpad

### 0.4.7 (2017-02-24)
* Potential build fix

### 0.4.5 (2017-02-24)
* Browser refresh on status change to offline (workaround until SDK fix is in)

### 0.4.4 (2017-02-24)
* SDK version bump to allow SDK.init() to work on all environments (staging, prod, etc.)

### 0.4.3 (2017-02-24)
* Proper error handling for missing perms
* Add env for SDK init

### 0.4.2 (2017-02-24)
* link logout button to SDK goOffline()
* BUG: infinite scroll hangs
* BUG: active extension auto assign failing

### 0.4.1 (2017-02-24)
* Add TimeStat component

### 0.4.0 (2017-02-24)
* Ability to set extension before going ready
* Set default extension to first one in the extensions list if an active extension hadn't been previously set

### 0.3.2 (2017-02-24)
* Retrieve env from config.json, prep for prod push

### 0.3.1 (2017-02-23)
* Fix contacts panel size on window resize
* Added 'active' class names for voice buttons

### 0.3.0 (2017-02-23)
* Notes components
* Updated local NovaX (native messaging) setup

### 0.2.25 (2017-02-22)
* fix FB name on messages

### 0.2.24 (2017-02-22)
* fix email storage get typo

### 0.2.23 (2017-02-22)
* Use hotfix SDK build for quick facebook name patch

### 0.2.22 (2017-02-22)
* Format to minutes and one decimal place for avg wait time stat

### 0.2.21 (2017-02-22)
* Pad pop search number with + if not there, server currently stripping

### 0.2.20 (2017-02-22)
* Welcome status screen v1

### 0.2.19 (2017-02-22)
* Transfer lists
* Transfer to PSTN

### 0.2.18 (2017-02-22)
* Make initial contact pop search an exact match

### 0.2.17 (2017-02-21)
* Cancel transfers

### 0.2.16 (2017-02-21)
* Edit search results
* Gray out assign button on results if assigned to selected interaction
* Show placeholder / New Contact Btn on 0 results
* Loading indicator on contact search

### 0.2.15 (2017-02-21)
* New SDK for transfers
* Queue transfers
* Status indicator for when warm transfer is connecting and connected

### 0.2.14 (2017-02-21)
* Assign Contact From Search Results

### 0.2.13 (2017-02-20)
* Fix loading contact attributes/layout on tenant select.
* Reset loading state on login error.

### 0.2.12 (2017-02-20)
* Loading states for login and tenant select.

### 0.2.11 (2017-02-17)
* Disable logout button when there is an active interaction.

### 0.2.10 (2017-02-17)
* BUG: calling create instead of update on edit save

### 0.2.9 (2017-02-17)
* Show contact's name in interactions bar and main content area when a contact has been assigned to the interaction.
* Fix initial contact search for messaging interactions.

### 0.2.8 (2017-02-16)
* Start of warm transfer status in phone controls
* Prevent transfer to agents already being transferred to
* Auto refresh agents and queues every 5 seconds

### 0.2.7 (2017-02-16)
* BUG: voice interactions not triggering contact search/assign attempt.
* BUG: edit screen not clearing when changing between interactions.

### 0.2.6 (2017-02-16)
* Edit contacts.
* Always show name as contact title.
* Tweaks / improvements to contact input error display.

### 0.2.5 (2017-02-15)
* Show oldest unread customer message in interaction preview. Show most recent (non-system) message if none are unread.

### 0.2.4 (2017-02-15)
* Add copyright and legal info to login screen.

### 0.2.3 (2017-02-15)
* Select next interaction when current interaction end.

### 0.2.2 (2017-02-15)
* Queue transfers
* Refresh buttons for agents/queues in transfer menu
* Switch positions of cold/warm transfers (warm is default)
* Hide dialpad when not ready
* Refactored voice controls into their own components so that they reconstruct when starting/ending interactions
* Fixed dialpad buttons border error

### 0.2.1 (2017-02-14)
* Fix initial contact view state and SDK logs

### 0.2.0 (2017-02-13)
* Contact search and auto assign on interaction accept

### 0.1.1 (2017-02-13)`
* On hold and recording added to state on interaction start so they are in sync with values set before and during transfer.

### 0.1.0 (2017-02-10)
* Warm and cold transfers for resources (not queues or transfer lists).

### 0.0.10-SNAPSHOT (2017-02-09)
* Remove draftjs dependency that might be breaking dev.

### 0.0.9 (2017-02-09)
* Added phone number to voice interaction. Don't show interaction until 'work-initiated'. Don't show messaging interaction until we have messaging history. Fixed icon sizes.

#### Initial Commit
* Here we go!