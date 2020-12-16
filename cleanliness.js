//load libraries
const {MongoClient} = require('mongodb')

const MONGO_URL = 'mongodb://localhost:27017'
const MONGO_DB = 'airbnb'
const MONGO_COLLECTION = 'listingsAndReviews'

const avgCleanliness = async (propertyType, client) => {

    const result = await client.db(MONGO_DB).collection(MONGO_COLLECTION)
    .aggregate([
        {
            $match: {
                property_type: propertyType
            }
        },
        
        {
            $group:{                //fields in the new object to be returned
                _id: "$address.country",
                total: {$sum :1},
                properties: {
                    $push: {
                            _id: "$_id",
                            cleanliness: "$review_scores.review_scores_cleanliness"  
                    }
                }
            }
        },
        {
            // project here
            $project:{
                avg_cleanliness: {$avg: "$properties.cleanliness"}
            }
        }     
    ])
    .toArray()
    console.info(result)
    return result
}

const client = new MongoClient(MONGO_URL, {
    useNewUrlParser: true, useUnifiedTopology: true
})

client.connect()
    .then(async()=>{
        const result = await avgCleanliness('Condominium', client)
        client.close()
    })