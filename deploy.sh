#!/bin/bash

#exit with non-zero exit code if any process fails
set -e

#  don' do anything on pull-requests
if [ "${TRAVIS_PULL_REQUEST}" != "false" ]
then
    exit 0
elif  [ "${TRAVIS_BRANCH}" != "master" ]
then
    echo -e "${SSH_KEY}" > key
    chmod 600 key
    scp -i key -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -r build "ubuntu@preview.kitnic.it:www/kitnic/${TRAVIS_BRANCH}"
    rm key
else
    cd build
    git init
    echo "kitnic.it" > CNAME
    git config user.name "Travis CI"
    git config user.email "travisCI@monostable.co.uk"
    git add .
    git commit -m "Deploy to GitHub Pages" > /dev/null
    git push --force --quiet "https://${GH_TOKEN}@github.com/monostable/kitnic" master:gh-pages > /dev/null 2>&1
fi
