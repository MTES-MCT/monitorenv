#!/bin/bash
set -e

./import-meta-env -x .env.frontend.example -p public/index.html

exec "$@"
