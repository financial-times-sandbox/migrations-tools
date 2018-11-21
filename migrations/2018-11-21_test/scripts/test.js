#!/usr/bin/env node

const item = process.argv[2];

if (item) {
    process.stdout.write(`Cool! I'm gonna do stuff with ${item} now then. Thanks!`);
} else {
    process.stderr.write(`Error: No item specified!`);
}
