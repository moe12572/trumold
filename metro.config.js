// const blacklist = require("metro-config/src/defaults/blacklist")
const blacklist = require('metro-config/src/defaults/exclusionList');
module.exports = {
  resolver: {
    blacklistRE: blacklist([/amplify\/#current-cloud-backend\/.*/]),
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
}