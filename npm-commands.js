var npm = require('npm');

npm.load(function(err) {
  // handle errors
  console.log("Load error: ", err)
  // run npm commands
  npm.command.run('build', (err) => {
    console.log("Run error: ", err)
  });

  npm.on('log', function(message) {
    // log installation progress
    console.log(message);
  });
});