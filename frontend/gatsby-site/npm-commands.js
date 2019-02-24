var npm = require('npm')

npm.load(function(err) {
  //Handle errors
  console.log("Load error: ", err)

  //Run npm commands
  npm.command.run('deploy', (err) => {
    console.log("Run error: ", err)
  })

  npm.on('log', function(message) {
    //Log progress
    console.log(message)
  })
})
