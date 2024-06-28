#!/usr/bin/env sh

npx prisma migrate deploy && node server.js