#!/bin/bash

npm install
npm run build
mv app/assets/favicons/favicon.ico build/favicon.ico

cd ..
cp -r app/build/* mount