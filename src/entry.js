const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const authenticator = require('otplib/authenticator')

authenticator.options = { crypto }

const args = process.argv.slice(2)
const homeDirectory = require('os').homedir()

const leaPath = path.join(homeDirectory, '.lea')
const accountsPath = path.join(leaPath, 'accounts.json')

if (!fs.existsSync(leaPath)) {
  fs.mkdirSync(leaPath)
}
if (!fs.existsSync(accountsPath)) {
  const defaultAccounts = {
    database: []
  }
  fs.writeFileSync(accountsPath, JSON.stringify(defaultAccounts))
}

const accounts = require(accountsPath)

if (!args[0]) {
  console.log('\n')
  for (const account of accounts.database) {
    console.log(`${account.name}: ${authenticator.generate(account.secret)}`)
  }
  console.log('\n')
} else {
  try {
    const requiredCommand = require(path.join(__dirname, 'commands', args[0].replace('/', '')))
    requiredCommand.action(args, accounts, accountsPath)
  } catch (error) {
    console.log('Invalid argument.')
  }
}
