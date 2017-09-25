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
