#!/bin/bash

#exit with non-zero exit code if any process fails
set -e

#  don' do anything on pull-requests
if [ "${TRAVIS_PULL_REQUEST}" != "false" ]
then
    exit 0
elif  [ "${TRAVIS_BRANCH}" != "master" ]
then
    echo -e "${SSH_KEY}" > key-file
    chmod 600 key-file
    ssh -i key-file -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no "ubuntu@preview.kitnic.it" "rm -rf www/kitnic/${TRAVIS_BRANCH}"
    scp -i key-file -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -r build "ubuntu@preview.kitnic.it:www/kitnic/${TRAVIS_BRANCH}"
    rm -f key-file
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
