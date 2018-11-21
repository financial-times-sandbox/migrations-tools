#!/usr/bin/env node

const item = process.argv[2];
const NodeGit = require('nodegit');

if (item) {
    console.log(`Cool! I'm gonna do stuff with ${item} now then. Thanks!`);
} else {
    throw Error(`Error: No item specified!`);
}

let cloneOptions = {};

cloneOptions.fetchOpts = {
    callbacks: {
        certificateCheck: function () { return 1; },
        credentials: function () {
            return NodeGit.Cred.userpassPlaintextNew(process.env.GITHUB_TOKEN, "x-oauth-basic");
        }
    }
};

console.log({ GITHUB_TOKEN: process.env.GITHUB_TOKEN });

const repoUrl = `https://github.com/Financial-Times/${item}.git`;
const cloneTarget = `./tmp/${item}`;

console.log({ repoUrl });

NodeGit.Clone(repoUrl, cloneTarget, cloneOptions)
    .then((repo) => {
        return repo.config();
    })
    .then((config) => {
        console.log({ config });
    })
    .catch((error) => {
        console.log(error);
    });
