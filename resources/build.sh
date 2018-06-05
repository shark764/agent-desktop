#!/bin/bash
set -e
npm install
npm run test
npm run build
mv app/assets/favicons/favicon.ico build/favicon.ico
mv app/config_pr.json build/config_pr.json
cd ..
cp -r app/build/* mount
