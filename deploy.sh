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
    echo "deploying to preview.kitnic.it"
    echo "preview.kitnic.it" > CNAME
    git add CNAME
    git commit -m "Deploy to GitHub Pages" > /dev/null
    git push --force "https://${GH_TOKEN}@github.com/monostable/preview.kitnic.it" master:gh-pages
else
    echo "deploying to kitnic.it"
    echo "kitnic.it" > CNAME
    git add CNAME
    git commit -m "Deploy to GitHub Pages" > /dev/null
    git push --force --quiet \
        "https://${GH_TOKEN}@github.com/monostable/kitnic" \
        master:gh-pages > /dev/null 2>&1
fi
