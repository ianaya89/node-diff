const fs = require('fs')
const commander = require('commander')
const diff = require('./src/diff')

commander
  .arguments('<new-file> <old-file>')
  .description('Node CLI tool to compare two files')
  .action((a, b) => {
    console.log(a, b)
  })
  .parse(process.argv)

const newFile = fs.readFileSync('./files/new.txt', { encoding: 'utf8' })
const oldFile = fs.readFileSync('./files/old.txt', { encoding: 'utf8' })

// console.log(newFile)

// diff.getDiff(oldFile, newFile, (err, res) => {
//   if (err) { console.log('Error') }
//
//   //console.log(res)
//   const del = []
//   const ins = []
//   const nor = []
//   // const file = {}
//   const file = []
//
//   for (var i = 0; i < res.length; i++) {
//     if (res[i].added && res[i + 1] && res[i + 1].removed) {
//       var swap = res[i]
//       res[i] = res[i + 1]
//       res[i + 1] = swap
//     }
//
//     if (res[i].removed) {
//       // del.push('-' + res[i].value)
//       res[i].value = '-' + res[i].value
//     } else if (res[i].added) {
//       res[i].value = '+' + res[i].value
//     } else {
//       del.push('.' + res[i].value)
//     }
//
//     // file['line' + i] = res[i].value // .value.split('\n')
//     file.push(res[i].value)
//   }
//
//   // console.log('delete', del)
//   // console.log('new', ins)
//   // console.log('normal', nor)
//   console.log(file.join(''))
//   //console.log(del)
// })

console.log(diff.diffString(oldFile, newFile))
