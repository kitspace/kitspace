#!/bin/bash
#don't do anything on repo branches
if [ "${TRAVIS_PULL_REQUEST}" == "false" ] && [ "${TRAVIS_BRANCH}" != "master" ]
    then exit 0;
fi

set -e

cd build

git init
git config user.name "Travis CI"
git config user.email "travisCI@monostable.co.uk"
git add .

if [ "${TRAVIS_PULL_REQUEST}" != "false" ]; then
    echo "preview.kitnic.it" > CNAME
    git add CNAME
    git commit -m "Deploy to GitHub Pages"
    git push --force --quiet \
        "https://${GH_TOKEN}@github.com/monostable/preview.kitnic.it" \
        master:gh-pages > /dev/null 2>&1
else
    echo "kitnic.it" > CNAME
    git add CNAME
    git commit -m "Deploy to GitHub Pages"
    git push --force --quiet \
        "https://${GH_TOKEN}@github.com/monostable/kitnic" \
        master:gh-pages > /dev/null 2>&1
fi
