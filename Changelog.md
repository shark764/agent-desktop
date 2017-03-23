<a name"0.22.3"></a>
### 0.22.3 (2017-03-23)
* bump SDK version for fixes to resource hold

<a name"0.22.2"></a>
### 0.22.2 (2017-03-23)
* Fixed server-side resource mute

<a name"0.22.1"></a>
### 0.22.1 (2017-03-23)
* DTMF fix
* blastSqsOutput and logLevel added to config

<a name"0.22.0"></a>
### 0.22.0 (2017-03-22)
* DTMF enabled when you have an active interaction

<a name"0.21.1"></a>
### 0.21.1 (2017-03-22)
* Contact interaction history fixes (history refresh button, onclick only for level 1, last dispo on level 1)

<a name"0.21.0"></a>
### 0.21.0 (2017-03-22)
* CXV1-6296: Scripts

<a name"0.20.0"></a>
### 0.20.0 (2017-03-22)
* CXV1-6289: Email reply attachments

<a name"0.19.1"></a>
### 0.19.1 (2017-03-22)
* Fix for gmail bodies and null email names

<a name"0.19.0"></a>
### 0.19.0 (2017-03-22)
* CXV1-8293: Selected contact state when no interaction selected - inc. interaction history

<a name"0.18.3"></a>
### 0.18.3 (2017-03-21)
* CXV1-7958: Fix random loading error via more deterministic module loading

<a name"0.18.2"></a>
### 0.18.2 (2017-03-21)
* HACK: Attempt to fix random loading issues via force reload on state loading error

<a name"0.18.1"></a>
### 0.18.1 (2017-03-21)
* Add click to hide to agent config menu, add menu animations

<a name"0.18.0"></a>
### 0.18.0 (2017-03-21)
* CXV1-6289: Email replies

<a name"0.17.2"></a>
### 0.17.2 (2017-03-21)
* Fix permission error handling and error css
* Change agent status menu to require click to hide. Click anywhere on screen to hide.

### 0.17.1 (2017-03-21)
* Contact create/update confirmation messages
* New Label -> Disposition
* BUGFIX: contact creation key camel-casing (SDK fix)

<a name"0.17.0"></a>
### 0.17.0 (2017-03-20)
* CXV1-7154 - Email attachments on view

<a name"0.16.1"></a>
### 0.16.1 (2017-03-20)
* CXV1-7937 - use active layouts only

<a name"0.16.0"></a>
### 0.16.0 (2017-03-20)
* CXV1-6949 - Connect Notes UI to SDK

<a name"0.15.0"></a>
### 0.15.0 (2017-03-19)
* CXV1-6935 - Contact interaction history "level 2"

<a name"0.14.0"></a>
### 0.14.0 (2017-03-17)
* CXV1-6942 - Dispositions with force select

<a name"0.13.6"></a>
### 0.13.5 (2017-03-16)
* Add agent status menu animation
* Fix zIndex bug with stats menu

<a name"0.13.5"></a>
### 0.13.5 (2017-03-16)
* Version bump SDK for bugfixes.
* Hide inline image attachments in emails.

<a name"0.13.4"></a>
### 0.13.4 (2017-03-16)
* Refactor Tos, CCs, BCCs to work with SDK.sendReply() contract.
* Fixed duplicate emails/attachments errors.

<a name"0.13.3"></a>
### 0.13.3 (2017-03-16)
* Email contact pop.

<a name"0.13.2"></a>
### 0.13.2 (2017-03-15)
* Editable To, CC, BCC, and subject in email replies.

<a name"0.13.1"></a>
### 0.13.1 (2017-03-15)
* Fix select menu drawing offscreen
* Update splash

<a name"0.13.0"></a>
### 0.13.0 (2017-03-15)
* Email interaction view. Reply mocked.
* Fixed stop recording toggle function.

<a name"0.12.1"></a>
### 0.12.1 (2017-03-15)
* Fix loopy progress bar causing stack overflows >.<

<a name"0.12.0"></a>
### 0.12.0 (2017-03-14)
* CXV1-6937 - Realtime agent stats

<a name"0.11.1"></a>
### 0.11.1 (2017-03-14)
* Fixing in call timer format

<a name"0.11.0"></a>
### 0.11.0 (2017-03-13)
* Contact interaction history

<a name"0.10.5></a>
### 0.10.5 (2017-03-13)
* SDK build with working wrapups
* BUGFIX: contact layouts loading race condition causing occasional login bomb out
* BUGFIX: messages not being marked accepted on interaction auto select
* BUGFIX: no sdk contact assign on autoassign

<a name"0.10.4"></a>
### 0.10.4 (2017-03-13)
* Fixing auto-deploy

<a name"0.10.3"></a>
### 0.10.3 (2017-03-13)
* IDs for side panel collapse icon and search bar

<a name"0.10.2"></a>
### 0.10.2 (2017-03-13)
* Split wrapup timeout bars
* BUGFIX: outbound calls blowing up

<a name"0.10.1"></a>
### 0.10.1 (2017-03-10)
* Fix work-rejected pubsub
* Fix non-local welcome stats API calls
* Temporary fix SDK log errors

<a name"0.10.0"></a>
### 0.10.0 (2017-03-10)
* SDK 2.0
* Custom fields on interactions

<a name"0.9.4"></a>
### 0.9.4 (2017-03-10)
* Notes back in

<a name"0.9.3"></a>
### 0.9.3 (2017-03-10)
* Connect assign contact flow to SDK
* BUGFIX: Search result count not resetting correctly
* BUGFIX: Assign button showing on assigned contact view
* BUGFIX: Shrunken search button on assigned contact view

<a name"0.9.2"></a>
### 0.9.2 (2017-03-09)
* Disable notes / dispositions panel until SDK functionality available
* BUGFIX: Search dropdown offset, right margin missing.

<a name"0.9.1"></a>
### 0.9.1 (2017-03-08)
* Fix bug in wrapup toggle
* Update index.html splash to new product name

<a name"0.9.0"></a>
### 0.9.0 (2017-03-08)
* Make Contacts Panel Immediately Visible Upon Login.

<a name"0.8.0"></a>
### 0.8.0 (2017-03-08)
* Wrapups UI and remaining logic
* BUGFIX: overzealous search result refreshing
* BUGFIX: unread message indication not showing & timer not resetting on new message

<a name"0.7.8"></a>
### 0.7.8 (2017-03-07)
* Mock scripts in interactions
* Maintain script values in interaction state so they persist across switching interactions

<a name"0.7.7"></a>
### 0.7.7 (2017-03-06)
* Script render components

<a name"0.7.4"></a>
### 0.7.4 (2017-03-03)
* Auto focus dialpad text input
* Call on dialpad text input enter
* Fixed outbound voice interaction being selected, hiding, the re-appearing when auto-answer is on

<a name"0.7.3"></a>
### 0.7.3 (2017-03-03)
* Remove analytics, leave google and mixpanel

<a name"0.7.2"></a>
### 0.7.2 (2017-03-03)
* Upgrade dependencies

<a name"0.7.1"></a>
### 0.7.1 (2017-03-03)
* Send button for messages
* Shift+enter makes new new lines on messages

<a name"0.7.0"></a>
### 0.7.0 (2017-03-03)
* Start of agent scripts
* Legalese typo fix

<a name"0.6.6"></a>
### 0.6.6 (2017-03-03)
* Email UI improvements

<a name"0.6.5"></a>
### 0.6.5 (2017-03-03)
* Fixing Jenkins pipeline

<a name"0.6.4"></a>
### 0.6.4 (2017-03-03)
* Fixing Jenkins pipeline

<a name"0.6.3"></a>
### 0.6.3 (2017-03-03)
* Fixing Jenkins pipeline

<a name"0.6.2"></a>
### 0.6.2 (2017-03-03)
* Fixing Jenkins pipeline

<a name"0.6.1"></a>
### 0.6.1 (2017-03-03)
* Fixing Jenkins pipeline

<a name"0.6.0"></a>
### 0.6.0 (2017-03-02)
* Barebones wrapup handling

<a name"0.5.10"></a>
### 0.5.10 (2017-03-01)
* Fixing auto-deploy

<a name"0.5.9"></a>
### 0.5.9 (2017-03-01)
*  Error banner for contacts panel

<a name"0.5.8"></a>
### 0.5.8 (2017-03-01)
* Fixing auto-deploy

<a name"0.5.7"></a>
### 0.5.7 (2017-03-01)
* Fixing auto-deploy

<a name"0.5.6"></a>
### 0.5.6 (2017-03-01)
* Fixing auto-deploy

<a name"0.5.5"></a>
### 0.5.5 (2017-03-01)
* Fixing auto-deploy

<a name"0.5.4"></a>
### 0.5.4 (2017-03-01)
* Fixing auto-deploy

<a name"0.5.3"></a>
### 0.5.3 (2017-03-01)
* "Notready" wording, styling

<a name"0.5.2"></a>
### 0.5.2 (2017-03-01)
* build breaking typo fix in validator import
* Disposition components (commented out, to be used later)

<a name"0.5.1"></a>
### 0.5.1 (2017-02-28)
* Link, Boolean and Number input types / validation
* Click to dial from contact phone number
* BUG: + being appended before Agent name

<a name"0.5.0"></a>
### 0.5.0 (2017-02-27)
* Click to dial via dialpad

<a name"0.4.7"></a>
### 0.4.7 (2017-02-24)
* Potential build fix

<a name"0.4.5"></a>
### 0.4.5 (2017-02-24)
* Browser refresh on status change to offline (workaround until SDK fix is in)

<a name"0.4.4"></a>
### 0.4.4 (2017-02-24)
* SDK version bump to allow SDK.init() to work on all environments (staging, prod, etc.)

<a name"0.4.3"></a>
### 0.4.3 (2017-02-24)
* Proper error handling for missing perms
* Add env for SDK init

<a name"0.4.2"></a>
### 0.4.2 (2017-02-24)
* link logout button to SDK goOffline()
* BUG: infinite scroll hangs
* BUG: active extension auto assign failing

<a name"0.4.1"></a>
### 0.4.1 (2017-02-24)
* Add TimeStat component

<a name"0.4.0"></a>
### 0.4.0 (2017-02-24)
* Ability to set extension before going ready
* Set default extension to first one in the extensions list if an active extension hadn't been previously set

<a name"0.3.2"></a>
### 0.3.2 (2017-02-24)
* Retrieve env from config.json, prep for prod push

<a name"0.3.1"></a>
### 0.3.1 (2017-02-23)
* Fix contacts panel size on window resize
* Added 'active' class names for voice buttons

<a name"0.3.0"></a>
### 0.3.0 (2017-02-23)
* Notes components
* Updated local NovaX (native messaging) setup

<a name"0.2.25"></a>
### 0.2.25 (2017-02-22)
* fix FB name on messages

<a name"0.2.24"></a>
### 0.2.24 (2017-02-22)
* fix email storage get typo

<a name"0.2.23"></a>
### 0.2.23 (2017-02-22)
* Use hotfix SDK build for quick facebook name patch

<a name"0.2.22"></a>
### 0.2.22 (2017-02-22)
* Format to minutes and one decimal place for avg wait time stat

<a name"0.2.21"></a>
### 0.2.21 (2017-02-22)
* Pad pop search number with + if not there, server currently stripping

<a name"0.2.20"></a>
### 0.2.20 (2017-02-22)
* Welcome status screen v1

<a name"0.2.19"></a>
### 0.2.19 (2017-02-22)
* Transfer lists
* Transfer to PSTN

<a name"0.2.18"></a>
### 0.2.18 (2017-02-22)
* Make initial contact pop search an exact match

<a name"0.2.17"></a>
### 0.2.17 (2017-02-21)
* Cancel transfers

<a name"0.2.16"></a>
### 0.2.16 (2017-02-21)
* Edit search results
* Gray out assign button on results if assigned to selected interaction
* Show placeholder / New Contact Btn on 0 results
* Loading indicator on contact search

<a name"0.2.15"></a>
### 0.2.15 (2017-02-21)
* New SDK for transfers
* Queue transfers
* Status indicator for when warm transfer is connecting and connected

<a name"0.2.14"></a>
### 0.2.14 (2017-02-21)
* Assign Contact From Search Results

<a name"0.2.13"></a>
### 0.2.13 (2017-02-20)
* Fix loading contact attributes/layout on tenant select.
* Reset loading state on login error.

<a name"0.2.12"></a>
### 0.2.12 (2017-02-20)
* Loading states for login and tenant select.

<a name"0.2.11"></a>
### 0.2.11 (2017-02-17)
* Disable logout button when there is an active interaction.

<a name"0.2.10"></a>
### 0.2.10 (2017-02-17)
* BUG: calling create instead of update on edit save

<a name"0.2.9"></a>
### 0.2.9 (2017-02-17)
* Show contact's name in interactions bar and main content area when a contact has been assigned to the interaction.
* Fix initial contact search for messaging interactions.

<a name"0.2.8"></a>
### 0.2.8 (2017-02-16)
* Start of warm transfer status in phone controls
* Prevent transfer to agents already being transferred to
* Auto refresh agents and queues every 5 seconds

<a name"0.2.7"></a>
### 0.2.7 (2017-02-16)
* BUG: voice interactions not triggering contact search/assign attempt.
* BUG: edit screen not clearing when changing between interactions.

<a name"0.2.6"></a>
### 0.2.6 (2017-02-16)
* Edit contacts.
* Always show name as contact title.
* Tweaks / improvements to contact input error display.

<a name"0.2.5"></a>
### 0.2.5 (2017-02-15)
* Show oldest unread customer message in interaction preview. Show most recent (non-system) message if none are unread.

<a name"0.2.4"></a>
### 0.2.4 (2017-02-15)
* Add copyright and legal info to login screen.

<a name"0.2.3"></a>
### 0.2.3 (2017-02-15)
* Select next interaction when current interaction end.

<a name"0.2.2"></a>
### 0.2.2 (2017-02-15)
* Queue transfers
* Refresh buttons for agents/queues in transfer menu
* Switch positions of cold/warm transfers (warm is default)
* Hide dialpad when not ready
* Refactored voice controls into their own components so that they reconstruct when starting/ending interactions
* Fixed dialpad buttons border error

<a name"0.2.1"></a>
### 0.2.1 (2017-02-14)
* Fix initial contact view state and SDK logs

<a name"0.2.0"></a>
### 0.2.0 (2017-02-13)
* Contact search and auto assign on interaction accept

<a name"0.1.1"></a>
### 0.1.1 (2017-02-13)`
* On hold and recording added to state on interaction start so they are in sync with values set before and during transfer.

<a name"0.1.0"></a>
### 0.1.0 (2017-02-10)
* Warm and cold transfers for resources (not queues or transfer lists).

<a name"0.0.10-SNAPSHOT"></a>
### 0.0.10-SNAPSHOT (2017-02-09)
* Remove draftjs dependency that might be breaking dev.

<a name"0.0.9"></a>
### 0.0.9 (2017-02-09)
* Added phone number to voice interaction. Don't show interaction until 'work-initiated'. Don't show messaging interaction until we have messaging history. Fixed icon sizes.


#### Initial Commit
* Here we go!
