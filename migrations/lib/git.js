const fs = require('fs');
const NodeGit = require('nodegit');
const path = require('path');

const GIT_TMP_DIR = './tmp';

const cloneOptions = {
    fetchOpts: {
        callbacks: {
            certificateCheck: () => { return 1; },
            credentials: () => {
                console.log(`Authenticating with GitHub using token: ${process.env.GITHUB_TOKEN }`);
                return NodeGit.Cred.userpassPlaintextNew(process.env.GITHUB_TOKEN, "x-oauth-basic");
            }
        }
    }
};

class Git {

    constructor () {
        this.repo = null;
    }

    /**
     * Clone a GitHub repository via HTTPS
     * 
     * @param {string} fullRepoName 
     * @returns {import('nodegit').Repository}
     */
    async clone (fullRepoName) {

        const repoUrl = `https://github.com/${fullRepoName}.git`;
        const cloneTarget = `${GIT_TMP_DIR}/${fullRepoName}`;

        console.log({ fullRepoName, repoUrl, cloneTarget });

        /**
         * @type import('nodegit').Repository
         */
        const repo = await NodeGit.Clone(repoUrl, cloneTarget, cloneOptions)
            .catch((err) => {
                throw err;
            });

        console.log(`Repo cloned: ${repoUrl}`);

        this.repo = repo;
        this.workingDirectory = this.repo.workdir();
    };

    async createAndCheckoutBranch ({ branchName, fromBranch = 'master' }) {
        const mostRecentCommitId = (await this.repo.getBranchCommit(fromBranch)).id();

        await this.repo.createBranch(branchName, mostRecentCommitId);
        await this.repo.checkoutBranch(branchName);

        const currentBranch = (await this.repo.getCurrentBranch()).name();

        console.log({ currentBranch });
    }

    async addFile (filename, sourceDirectory) {

        const fileContent = fs.readFileSync(`${sourceDirectory}/${filename}`, { encoding: 'utf8' });
        const targetFilepath = path.join(this.workingDirectory, filename);

        fs.writeFileSync(targetFilepath, fileContent);

        console.log(`File written: ${targetFilepath}`);

        const repoIndex = await this.repo.refreshIndex();
        await repoIndex.addByPath(filename);
        repoIndex.write();

        console.log(`File added to git: ${targetFilepath}`);

        console.log(await this.repo.getStatusExt());

        return Promise.resolve();
    }

    async createPullRequest () {
        
    }

}

module.exports = Git;
