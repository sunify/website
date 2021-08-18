#!/bin/bash
# See https://medium.com/@nthgergo/publishing-gh-pages-with-travis-ci-53a8270e87db
set -o errexit

# config
git config --global user.email "isuntc@gmail.com"
git config --global user.name "Alex Lunyov"

cd dist
git init
git add .
git commit -m "Deploy to Github Pages"
git push --force --quiet "https://${GITHUB_TOKEN}@github.com/sunify/sunify.github.io.git" master:master > /dev/null 2>&1