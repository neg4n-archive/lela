const fs = require('fs')
const util = require('util')

module.exports.updateDatabase = async (accounts, accountsPath) => {
  await util.promisify(fs.writeFile)(accountsPath, JSON.stringify(accounts, null, 2))
}
