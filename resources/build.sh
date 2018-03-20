#!/bin/bash
set -e
npm install
npm run test
npm run build
mv app/assets/favicons/favicon.ico build/favicon.ico 
cd .. 
cp -r app/build/* mount