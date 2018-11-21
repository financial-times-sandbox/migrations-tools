#!/usr/bin/env node

// npx github:financial-times/runner 2018-11-21_test

// npx --package ./runner runner migrations/2018-11-21_test

const path = require('path');
const spawn = require('child_process').spawn;

// Action: Get the migration to run
const migrationName = process.argv[2];

const migrationPath = path.resolve(`${process.cwd()}/${migrationName}`);

const migrationConfigPath = `${migrationPath}/config.json`;

console.log({ migrationConfigPath });

// Action: Read the migration config
const migrationConfig = require(migrationConfigPath);

console.log({ migrationConfig });

const migrationScriptPath = `${migrationPath}/${migrationConfig.script}`;

console.log({ migrationScriptPath });

// Action: Create a GitHub project using the migration name

// TODO: Require Octokit, authenticate with GitHub, create project
// ...

// Action: Loop through collection and run migration script for each

function runProcess (processToRun) {

    return new Promise((resolve, reject) => {

        const cmd = spawn('sh', ['-c', processToRun], { env: process.cwd() });

        cmd.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });
    
        cmd.stderr.on('data', (data) => {
            console.log(`stderr: ${data}`);
        });

        // TODO: resolve or reject when process closes
        // TODO: reject when process errors

        resolve();

    });
}

(async () => {

    for (let item of migrationConfig.collection) {

        console.log(`Running migration for item '${item}'...`);
    
        const processToRun = `${migrationScriptPath} ${item}`;
    
        console.log({ processToRun });
    
        await runProcess(processToRun);
    
    }

})();

// Action: Add PR or issue to GitHub project
