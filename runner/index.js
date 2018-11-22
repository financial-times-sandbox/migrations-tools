#!/usr/bin/env node

// npx github:financial-times/runner 2018-11-21_test

// npx --package ./runner runner migrations/2018-11-21_test

const path = require('path');
const spawn = require('child_process').spawn;

function runProcess (processToRun) {

    return new Promise((resolve, reject) => {

        const sh = spawn('sh', ['-c', processToRun], {
            env: process.env,
            cwd: process.cwd()
        });

        let output = '';

        sh.stdout.on('data', (data) => {
            output += data;
        });

        sh.stderr.on('data', (data) => {
            output += data;
        });

        sh.on('error', reject);

        sh.on('close', (code) => {
            if (code === 0) {
                resolve(output);
            } else {
                reject(new Error(output));
            }
        });

    });
}

// Action: Loop through collection and run migration script for each
(async () => {

    // Action: Get the migration to run
    const migrationDirectory = process.argv[2];
    const migrationPath = path.resolve(`${process.cwd()}/${migrationDirectory}`);
    const migrationConfigPath = `${migrationPath}/config.js`; // TODO: .json

    // Action: Read the migration config
    const migrationConfig = require(migrationConfigPath);

    // console.log({ migrationConfigPath });
    // console.log({ migrationConfig });
    // console.log({ migrationScriptPath });

    // Action: Create a GitHub project using the migration name
    // TODO: Require Octokit, authenticate with GitHub, create project
    const migrationName = migrationConfig.name;

    const migrationScriptPath = `${migrationPath}/${migrationConfig.script}`;

    for (let item of migrationConfig.collection) {

        console.log('\n===\n');
        console.log(`Running migration script for item '${item}'...`);

        // TODO: Why do we need to call `node` on OS X?
        const processToRun = `node ${migrationScriptPath} ${item}`;

        // console.log({ processToRun });

        try {
            const processOutput  = await runProcess(processToRun);
            console.log(processOutput);
        } catch (err) {
            console.error(new Error(`Error running migration script for ${item}: ${err.message}`));
        }

    }

    // TODO: Action: Add PRs/issues as cards on the migration's GitHub project

})();
