const diff = require('./diff')

diff.getDiff('hola\nchau', 'hola\ny\nchau', (err, res) => {
  if (err) { console.log('Error') }
  console.log(res)
})
