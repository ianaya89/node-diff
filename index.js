const fs = require('fs')
const commander = require('commander')
const diff = require('./src/diff')
const print = require('./src/print')

commander
  .arguments('<new-file> <old-file>')
  .description('Node CLI tool to compare two files')
  .action((a, b) => {
    console.log(a, b)
  })
  .parse(process.argv)

const newFile = fs.readFileSync('./files/new.txt', { encoding: 'utf8' })
const oldFile = fs.readFileSync('./files/old.txt', { encoding: 'utf8' })

diff.getDiff(oldFile, newFile, (err, results) => {
  if (err) { console.log('Error') }

  print(results)
})
