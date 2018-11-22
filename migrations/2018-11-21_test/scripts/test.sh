ITEM=$1

GITHUB_USERNAME="simonplend"

FULL_REPO_NAME="financial-times-sandbox/${ITEM}"
REPO_WORKING_DIR="./tmp/${FULL_REPO_NAME}"

BRANCH_NAME="test-migration"
FILES_DIR="(pwd)/files"

echo FILES_DIR;
exit;

git clone "https://${GITHUB_USERNAME}:${GITHUB_TOKEN}@https://github.com/${FULL_REPO_NAME}.git" "${REPO_WORKING_DIR}"

cd "${REPO_WORKING_DIR}"

git checkout -b "${BRANCH_NAME}"

cp "${FILES_DIR}/.gitignore" .

git status

# echo '{ "pull_request_id": "1234" }';
