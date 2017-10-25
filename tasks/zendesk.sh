#!/bin/bash

echo "****************************"
echo "* BEFORE WE GET STARTED... *"
echo "****************************"
echo "You'll want to make sure that the following repos are all within the root of the same directory."
echo " "
echo "And, you'll also need to have the following packages installed"
echo "1) http-server (if you do not have it, open a new terminal window and run 'npm install http-server -g')"
echo "2) xterm (Verly likely that this is already installed on your computer, otherwise, installation instructions vary depending on your computer, Google time...)"
echo "3) boot-cljs (installation instructions vary depending on your computer, also, Google time...)"
echo " "
echo "Are you all set with this stuff? (y/N)"
read allinstalled
if [[ !($allinstalled =~ ^([yY][eE][sS]|[yY])+$) ]]
  then
    echo "OK, well, do you want to bail out for now while you get all that set up, or do you want me to wait and then we pick up where we left off? (wait/bail)"
    read wait

    if [[ !$wait == "wait" ]]
      then
        exit
      else
        echo "OK, waiting..."
        echo "When you're ready to move on, enter 'yes'"
        read moveon

        if [[ !($moveon =~ ^([yY][eE][sS]|[yY])+$) ]]
          then
            echo "Hmmm...I'll take that as a 'no', bailing out!"
            exit
        fi
    fi
fi

echo " "
echo "***************************************"
echo "* LAUNCH TOOLBAR ON YOUR LOCAL SERVER *"
echo "***************************************"
xterm -e 'ngrok http 3000' &
cd ./../zendesk-managed-package-v2
echo "Once the ngrok window has loaded and is online, find the terminal window for *port 3000*, and copy the string of numbers between the 'https://' and '.ngrok.io', and paste here:"
read ngid1
touch manifest.tmp.json
cp manifest.template.json manifest.tmp.json
sed -i -e "s/ngid1/$ngid1/g" manifest.tmp.json

echo " "
echo "*************************************************"
echo "* MOUNT LOCAL WIDGET FILES ON YOUR LOCAL SERVER *"
echo "*************************************************"
xterm -e 'cd ./../zendesk-managed-package-v2;http-server' &
echo "Once your new http server for zendesk widgets has loaded up, find the terminal you just launched for your *Zendesk files*, and copy and paste that port number here"
read zdwidgetsport
xterm -e "ngrok http $zdwidgetsport" &

echo " "
echo "********************************************************************"
echo "* UPDATE ZENDESK APP WITH NGROK URL POINTING TO LOCAL WIDGET FILES *"
echo "********************************************************************"
echo "Once the ngrok window has loaded and is online, copy the string of numbers between the 'https://' and '.ngrok.io', and paste here:"
read ngid2
sed -i -e "s/ngid2/$ngid2/g" manifest.tmp.json
cd ./../cxengage-javascript-sdk/src/cljs/cxengage_javascript_sdk/modules
sed -i -e "s#https:\/\/sdk.cxengage.net\/zendesk.*.modal\.html#https://$ngid2.ngrok.io/assets/modal.html#g" zendesk.cljs

echo " "
echo "**************************************"
echo "* GENERATE THE COMPILED THE SDK FILE *"
echo "**************************************"
cd ../../../..
boot make-prod-release
echo "Hit Y when the build is complete"
read iscomplete
if [[ ($iscomplete =~ ^([yY][eE][sS]|[yY])+$) ]]
  then
    xterm -e 'cd ./../cxengage-javascript-sdk/release;http-server' &
fi

echo " "
echo "***************************************"
echo "* LAUNCH THE SDK ON YOUR LOCAL SERVER *"
echo "***************************************"
echo "Once your new http server for cxengage-javascript-sdk has completed booting up, copy the port number from your new server, and paste here:"
read cxengageport
xterm -e "ngrok http $cxengageport" &

echo " "
echo "************************************************"
echo "* UPDATE AGENT DESKTOP TO USE THE NEW SDK FILE *"
echo "************************************************"
echo "Here we are updating the index.html for TB2, but we'll be making a backup of the file (index.html.bk) which you can use to revert index.html before creating a PR."
echo " "
echo "Anyhow, once the ngrok window for your new cxengage-javascript-sdk has loaded and is online, find the terminal window for this ngrok, and copy the string of numbers between the 'https://' and '.ngrok.io', and paste here:"
read sdkurl
cd ./../agent-desktop/app
cp index.html index.html.bk
sed -i -e "s#https.*.main\.js#https://$sdkurl.ngrok.io/main.js#g" index.html

echo " "
echo "*******************************************************"
echo "* GENERATE ZIP FILE FOR UPLOAD TO ZENDESK ADMIN PANEL *"
echo "*******************************************************"
echo "Don't worry, making a backup of the manifest.json (manifest.json.bk) which you can use to revert the file before creating a PR"
cd ./../../zendesk-managed-package-v2
cp manifest.json manifest.json.bk
cp manifest.tmp.json manifest.json
rm -rf manifest.tmp.json
zip -r zendesk.zip *
echo "Congratulations! Your Zendesk app is now ready to deploy!"

echo " "
echo "*******************"
echo "* WHAT TO DO NEXT *"
echo "*******************"
echo "1) In your local zendesk-managed-package-v2 repo, find a file named 'zendesk.zip', and upload that to the zendesk admin tool"
echo "2) Restart your Agent Desktop/TB2 repo"
