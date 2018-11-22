#!/usr/bin/env node

const Git = require('../../lib/git');

const item = process.argv[2];

if (!item) {
    throw Error(`Error: No item specified!`);
}

(async () => {

    const branchName = 'test-migration';

    const gitRepo = new Git();

    await gitRepo.clone(`financial-times-sandbox/${item}`);
    await gitRepo.createAndCheckoutBranch({ branchName });

    await gitRepo.addFile('.gitignore', `${__dirname}/files`);

    // console.log(await gitRepo.repo.getStatus());

    // TODO: Modify the README

    // TODO: Delete the LICENSE file

    // ----

    // TODO: Commit changes

    // TODO: Push branch

    // TODO: Create PR

    // TODO:
    // console.log(JSON.stringify({ pull_request_id: 1234 }))

})();
