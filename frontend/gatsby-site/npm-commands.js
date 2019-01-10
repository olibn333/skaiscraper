var npm = require('npm')

npm.load(function(err) {
  //Handle errors
  console.log("Load error: ", err)

  //Run npm commands
  npm.command.run('build', (err) => {
    console.log("Run error: ", err)
  })

  npm.on('log', function(message) {
    //Log installation progress
    console.log(message)
  })
})