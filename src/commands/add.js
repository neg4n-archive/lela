const readline = require('readline')
const utils = require('../utils')

module.exports.action = (args, accounts, accountsPath) => {
  if (!args[1]) {
    return console.log('missing account name.')
  }
  for (const account of accounts.database) {
    if (account.name === args[1]) {
      return console.log('this account already exists')
    }
  }
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  rl.question('secret: ', answer => {
    accounts.database.push({
      name: args[1].replace(/ /g, ''),
      secret: answer
    })
    utils.updateDatabase(accounts, accountsPath)
    rl.close()
  })
}
