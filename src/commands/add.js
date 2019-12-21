const readline = require('readline')
const util = require('util')

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
  const readLine = readline.createInterface({ input: process.stdin, output: process.stdout })

  readLine.question[util.promisify.custom] = (question) => {
    return new Promise((resolve) => {
      readLine.question(question, resolve)
    })
  }

  const answer = await util.promisify(readLine.question)('secret: ')

  accountsDatabase.push({
    name: accountName.replace(/ /g, ''),
    secret: answer
  })
  await utils.updateDatabase(accountsDatabase, accountsPath)
  readLine.close()
}
