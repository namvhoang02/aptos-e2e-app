#!/usr/bin/env bash

pnpm run dev > ./my.log 2>&1 &
echo $! > ./dev-pid.txt
