const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const chalk = require('chalk')
const jsonFind = require('json-find')
const authenticator = require('otplib/authenticator')

authenticator.options = { crypto }

const args = process.argv.slice(2)
const homeDirectory = require('os').homedir()

const leaPath = path.join(homeDirectory, '.lea')
const accountsPath = path.join(leaPath, 'accounts.json')

const colors = require(path.join(__dirname, '..', 'colors.json'))
const colorsDatabase = jsonFind(colors)

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
    console.log(`${(JSON.stringify(colors).indexOf(account.name)) > -1 ? chalk.hex(colorsDatabase.checkKey(account.name)).bold(account.name) : chalk.bold(account.name)}: ${authenticator.generate(account.secret)}`)
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
