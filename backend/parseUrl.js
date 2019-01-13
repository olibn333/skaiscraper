const request = require('request')
const validUrl = require('valid-url')

function getHTML(url) {
  return new Promise(resolve => {
    request(url, function (error, response, body) {
      try {
        if (error) {
          resolve(error)
        }
        else if (!error && response.statusCode == 200) {
          resolve(body)
        }
      } catch (e) {
        resolve(e)
      }
    })
  })
}

function extractUrlDetails(url) {
  //Following this format: scheme://host:port/path?query
  const hostName = extractHostname(url)
  const rootDomain = extractRootDomain(url)
  const siteName = rootDomain.split('.')[0]
  const sitePathAndQuery = url.split(hostName)[1]
  //let sitePath, siteQuery
  if (sitePathAndQuery.indexOf('?') > -1) {
    sitePath = sitePathAndQuery.split('?')[0]
    siteQuery = sitePathAndQuery.split('?')[1]
  }
  else{
    sitePath = sitePathAndQuery
    siteQuery = ''
  }
    
  return {url, hostName, rootDomain, siteName, sitePath, siteQuery}
}


//Ripped ruthlessly from https://stackoverflow.com/questions/8498592/extract-hostname-name-from-string
function extractHostname(url) {
  let hostname;
  //find & remove protocol (http, ftp, etc.) and get hostname

  if (url.indexOf("//") > -1) {
    hostname = url.split('/')[2];
  }
  else {
    hostname = url.split('/')[0];
  }

  //find & remove port number
  hostname = hostname.split(':')[0];
  //find & remove "?"
  hostname = hostname.split('?')[0];

  return hostname;
}

// To address those who want the "root domain," use this function:
const extractRootDomain = (url) => {
  let domain = extractHostname(url),
  splitArr = domain.split('.'),
  arrLen = splitArr.length;

  //extracting the root domain here
  //if there is a subdomain 
  if (arrLen > 2) {
    domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
    //check to see if it's using a Country Code Top Level Domain (ccTLD) (i.e. ".me.uk")
    if (splitArr[arrLen - 2].length == 2 && splitArr[arrLen - 1].length == 2) {
      //this is using a ccTLD
      domain = splitArr[arrLen - 3] + '.' + domain;
    }
  }
  return domain;
}


module.exports = { getHTML, extractRootDomain, extractHostname, extractUrlDetails, validUrl }