#!/usr/bin/env node

const fs = require('fs')
const util = require('util')
const path = require('path')
const crypto = require('crypto')
const chalk = require('chalk')
const jsonFind = require('json-find')
const authenticator = require('otplib/authenticator')

authenticator.options = { crypto }

const args = process.argv.slice(2)
const homeDirectory = require('os').homedir()

const lelaPath = path.join(homeDirectory, '.lela')
const accountsPath = path.join(lelaPath, 'accounts.json')

const colors = require(path.join(__dirname, '..', 'colors.json'))
const colorsDatabase = jsonFind(colors);

(async function entry () {
  await util.promisify(fs.access)(lelaPath, fs.F_OK).catch(async error => {
    if (error.code === 'ENOENT') {
      await util.promisify(fs.mkdir)(lelaPath)
    }
  })
  await util.promisify(fs.access)(accountsPath).catch(async error => {
    if (error.code === 'ENOENT') {
      const defaultAccounts = []
      await util.promisify(fs.writeFile)(accountsPath, JSON.stringify(defaultAccounts))
    }
  })

  const accounts = JSON.parse(await util.promisify(fs.readFile)(accountsPath))

  if (!args[0]) {
    if (accounts.length === 0) {
      return console.log('there are no accounts in lela\'s database.')
    }
    process.stdout.write('\n')
    for (const account of accounts) {
      console.log(`${(JSON.stringify(colors).indexOf(account.name)) > -1 ? chalk.hex(colorsDatabase.checkKey(account.name)).bold(account.name) : chalk.bold(account.name)}: ${authenticator.generate(account.secret)}`)
    }
    process.stdout.write('\n')
  } else {
    try {
      const requiredCommand = require(path.join(__dirname, 'commands', args[0].replace('/', '')))
      requiredCommand.action(args[1], accounts, accountsPath)
    } catch (error) {
      console.log('invalid argument.')
    }
  }
  return 0
})()
