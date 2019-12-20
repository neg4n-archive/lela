const fs = require('fs')

module.exports.updateDatabase = async (accounts, accountsPath) => {
  fs.writeFileSync(accountsPath, JSON.stringify(accounts, null, 2))
}
