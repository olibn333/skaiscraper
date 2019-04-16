const parseUrl = require('./parseUrl')

function addRootDomain(path, url) {
  if (path.indexOf('/') === 0) {
    return 'http://' + parseUrl.extractRootDomain(url) + path
  }
  return path
}

module.exports = { addRootDomain }