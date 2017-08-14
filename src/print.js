const chalk = require('chalk')

const print = function (results) {
  const lines = {}
  let lineNumber = 1

  results.forEach(r => {
    if (r.value.includes('\n')) { lineNumber += 1 }
    if (!lines[lineNumber]) { lines[lineNumber] = { value: '', type: '' } }

    const lastBreak = r.value.lastIndexOf('\n')
    const value = lastBreak > 0 ? r.value.substring(0, lastBreak) : r.value

    if (r.value !== '\n') {
      if (r.removed) {
        lines[lineNumber].value += chalk.red(value)
        lines[lineNumber].removed = true
        lines[lineNumber].type = '-'
      } else if (r.added) {
        lines[lineNumber].value += chalk.green(value)
        lines[lineNumber].type = !lines[lineNumber].type ? '+' : '*'
        lines[lineNumber].added = true
      } else {
        lines[lineNumber].value += value
      }
    }
  })

  lineNumber = 1

  for (let line in lines) {
    if (lines[line].value) {
      lines[line].value.split('\n').forEach(l => {
        console.log(`${lineNumber}\t${lines[line].type}\t${l}`)
        lineNumber += 1
      })
    }
  }
}

module.exports = print
