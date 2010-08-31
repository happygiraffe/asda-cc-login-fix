#!/bin/sh

dest='asda-cc-login-fix.zip'

rm -f $dest
zip -9q $dest \
  manifest.json \
  script.js
ls $dest