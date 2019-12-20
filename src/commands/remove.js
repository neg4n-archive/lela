const utils = require('../utils')

module.exports.action = (args, accounts, accountsPath) => {
  if (!args[1]) {
    return console.log('missing account name.')
  }
  for (const [index, account] of accounts.database.entries()) {
    if (account.name === args[1]) {
      accounts.database.splice(index, 1)
    }
  }
  utils.updateDatabase(accounts, accountsPath)
  console.log(`removed ${args[1]}`)
}
