const request = require('request')

const getFacebookLikesShares = (url) => {
  const query = 'https://graph.facebook.com/?fields=og_object%7Blikes.summary(total_count).limit(0)%7D,share&id=' + url
  return new Promise((resolve, reject) => {
    request(query, (error, response) => {
      try {
        if (error) throw error
        else if (response.statusCode == 200) {
          const result = JSON.parse(response.body)
          try {
            const likes = result.og_object.likes.summary.total_count
            const shares = result.share.share_count
            resolve( { likes, shares } )
          } catch (error) {
            console.log("Unable to get all data from facebook API: ", error)
            const shares = result.share.share_count
            resolve( { likes: "No data", shares } )
          }
        }
      } catch (error) {
        console.log("Error at getFaceBookLikesShares: ", error)
        reject(error)
      }
    })
  })
}

const test = async () => {
  try {
    const result = await getFacebookLikesShares('https://globalnews.ca/news/4856517/vancouver-city-council-votes-to-declare-climate-emergency/')
    console.log(result)
  } catch (error) {
    console.log("Error at test: ", error)
  }
}

// test()

module.exports = { getFacebookLikesShares }