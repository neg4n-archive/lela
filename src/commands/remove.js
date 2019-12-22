const utils = require('../utils')

module.exports.action = async function (accountName, accountsDatabase, accountsPath) {
  if (!accountName) {
    return console.log('\nMissing account name.\n')
  }
  for (const [index, account] of accountsDatabase.entries()) {
    if (account.name === accountName) {
      accountsDatabase.splice(index, 1)
    }
  }
  await utils.updateDatabase(accountsDatabase, accountsPath)
  console.log(`\nRemoved ${accountName}\n`)
}
