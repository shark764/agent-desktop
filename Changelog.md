<a name"0.4.1"></a>
### 0.4.1 (2017-02-24)
* Proper error handling for missing perms
* Add env for SDK init

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
