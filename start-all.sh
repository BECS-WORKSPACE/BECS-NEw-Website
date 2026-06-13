#!/bin/bash

(
  cd server
  npm run dev 2>&1 | sed 's/^/[BACKEND] /'
) &

(
  cd client/main-website
  npm run dev 2>&1 | sed 's/^/[MAIN-WEBSITE] /'
) &

(
  cd client/becs-store
  npm run dev 2>&1 | sed 's/^/[BECS-STORE] /'
) &

(
  cd client/admin
  npm run dev 2>&1 | sed 's/^/[ADMIN] /'
) &

(
  cd client/training-institute
  npm run dev 2>&1 | sed 's/^/[TRAINING] /'
) &

wait
