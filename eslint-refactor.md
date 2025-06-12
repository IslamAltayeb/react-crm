For the sake of learning, these are the steps that I followed 
to clean the previous eslint configuration and setup a new eslint configuration.

1. Remove any file configuration for eslint and prettier
.eslinter.json
.prettierrc

2. Uninstall related packages.
npm uninstall eslint prettier eslint-plugin-n eslint-plugin-promise
npm uninstall eslint-config-* eslint-plugin-* prettier-plugin-*

3. Remove configs in packages.json
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },

4. remove global npm

5. install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm

6. install npm
nvm install --lts
nvm use --lts

7. npm install --save-dev eslint


8. go to eslint.org
npm init @eslint/config

9. npm i eslint-plugin-unused-imports

10. npx eslint "src/**/*.{js,ts,jsx,tsx}" --fix

