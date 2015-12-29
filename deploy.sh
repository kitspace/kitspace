#!/bin/bash
if [ "${TRAVIS_PULL_REQUEST}" != "false" ] || [ "${TRAVIS_BRANCH}" != "master" ]
    then exit 0;
fi

set -e

cd build

git init
echo "kitnic.it" > CNAME
git config user.name "Travis CI"
git config user.email "travisCI@monostable.co.uk"
git add .
git commit -m "Deploy to GitHub Pages"
git push --force --quiet "https://${GH_TOKEN}@github.com/monostable/kitnic" master:gh-pages > /dev/null 2>&1
