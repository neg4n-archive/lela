const util = require('util')
const prompt = require('prompt')

const utils = require('../utils')

module.exports.action = async function (accountName, accountsDatabase, accountsPath) {
  if (!accountName) {
    return console.log('missing account name.')
  }

  for (const account of accountsDatabase) {
    if (account.name === accountName) {
      return console.log('this account already exists')
    }
  }

  prompt.start()
  prompt.message = ''
  prompt.delimiter = ''
  prompt.colors = false

  await util.promisify(prompt.get)({
    name: 'secret',
    description: 'enter your secret:',
    replace: '*',
    hidden: true
  }).then(result => {
    accountsDatabase.push({
      name: accountName,
      secret: result.secret.replace(/ /g, '')
    })
  })

  await utils.updateDatabase(accountsDatabase, accountsPath)
}
