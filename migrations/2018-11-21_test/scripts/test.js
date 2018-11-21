#!/usr/bin/env node

const item = process.argv[2];
const Git = require('nodegit');

if (item) {
    process.stdout.write(`Cool! I'm gonna do stuff with ${item} now then. Thanks!`);
} else {
    process.stderr.write(`Error: No item specified!`);
    process.exit(1);
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

Git.Clone(`https://github.com/financial-times/${item}`, './tmp', cloneOptions)
    .then((repo) => {
        return repo.config();
    })
    .then((config) => {
        console.log({ config });
    })
    .catch((error) => {
        console.log(error);
    });
