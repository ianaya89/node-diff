const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const program = require('commander')

const diff = require('./src/diff')
const print = require('./src/print')

const exec = function (oldFilePath, newFilePath) {
  console.log(chalk.cyan('\n👓  reading files...'))
  console.log('📁  old file ', oldFilePath)
  console.log('📁  new file ', newFilePath)

  const oldFile = fs.readFileSync(path.resolve(__dirname, oldFilePath), { encoding: 'utf8' })
  const newFile = fs.readFileSync(path.resolve(__dirname, newFilePath), { encoding: 'utf8' })

  console.log(chalk.cyan('\n🔀  comparing files..'))

  diff.getDiff(oldFile, newFile, (err, results) => {
    if (err) { console.log('Error') }

    print(results)
  })
}

program
  .option('-o --old <old-file>', 'old file path')
  .option('-n --new <new-file>', 'new file path')
  .description('Node CLI tool to compare two files')
  .parse(process.argv)

if (!program.old) { throw new Error('Missing parameter -o -old (old file path)') }
if (!program.new) { throw new Error('Missing parameter -n -new (new file path)') }

exec(program.old, program.new)
