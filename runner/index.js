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
        let output = '';

        cmd.stdout.on('data', (data) => {
            output += data;
        });

        cmd.stderr.on('data', (data) => {
            output += data;
        });

        cmd.on('error', reject);

        cmd.on('close', (code) => {
            if (code === 0) {
                resolve(output);
            } else {
                reject(new Error(output));
            }
        });

    });
}

(async () => {

    for (let item of migrationConfig.collection) {

        console.log(`Running migration for item '${item}'...`);

        // TODO: Why do we need to call node?
        const processToRun = `node ${migrationScriptPath} ${item}`;

        console.log({ processToRun });

        const processOutput  = await runProcess(processToRun);

        console.log(processOutput);

    }

})();

// Action: Add PR or issue to GitHub project
