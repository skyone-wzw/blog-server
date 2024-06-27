#!/usr/bin/env sh

npx prisma migrate deploy && npx next start "$@"