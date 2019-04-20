const request = require('request')

const getFacebookLikesShares = (url) => {
  const accessToken = 'EAAJFl1StLOkBAE4jOGN42o9r8mPyUFppEefPnlexRTu6QFmPZB11S2Ev4bq8DvoqcubckLjHW2bV78dsZBQmhZCiUFjVBZA3rco0ZCG5HrNpi7WlZBATKR3OkYJQatslv4R6r1c4rQZBPUIiyC7LRIjFYiZAZAwvSoxbGQO2DXyo1yI0Kna3LzZCeFVzieZAK46J3NyBlhYaK4wFAZDZD'
  const query = 'https://graph.facebook.com/?fields=og_object%7Blikes.summary(total_count).limit(0)%7D,engagement&id=' + url + '&access_token=' + accessToken
  return new Promise((resolve, reject) => {
    request(query, (error, response) => {
      try {
        if (error) throw error
        else if (response.statusCode === 200) {
          const result = JSON.parse(response.body)
          const shares = result.engagement.share_count
          try {
            const likes = result.og_object.likes.summary.total_count
            resolve({ likes, shares })
          } catch (error) {
            resolve({ likes: "No data", shares })
          }
        } else {
          const result = JSON.parse(response.body)
          console.log("There was an error fetching facebook likes/shares.")
          console.log(result.error.message)
          resolve({ likes: 'No data', shares: 'No data' })
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