import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb'
const uri = 'mongodb+srv://danidev:<password>@cluster0.hoemvti.mongodb.net/?retryWrites=true&w=majority'

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

async function connect() {
  try {
    await client.connect()
    const database = client.db('database')
    return database.collection('movies')
  } catch (error) {
    console.error('Error connecting to the database')
    console.error(error)
    await client.close()
  }
}
async function run() {
  try {
    // Connect the client to the server(optional starting in v4.7)
    await client.connect()
    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 })
    console.log('Pinged your deployment. You successfully connected to MongoDB!')
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close()
  }
}
run().catch(console.dir)

export class MovieModel {
  static async getAll({ genre }) {
    const db = await connect()

    if (genre) {
      return db
        .find({
          genre: {
            $elemMatch: {
              $regex: genre,
              $options: 'i'
            }
          }
        })
        .toArray()
    }

    return db.find({}).toArray()
  }

  static async getById({ id }) {
    const db = await connect()
    const objectId = new ObjectId(id)
    return db.findOne({ _id: objectId })
  }

  static async create({ input }) {
    const db = await connect()

    const { insertedId } = await db.insertOne(input)

    return {
      id: insertedId,
      ...input
    }
  }

  static async delete({ id }) {
    const db = await connect()
    const objectId = new ObjectId(id)
    const { deletedCount } = await db.deleteOne({ _id: objectId })
    return deletedCount > 0
  }

  static async update({ id, input }) {
    const db = await connect()
    const objectId = new ObjectId(id)

    const { ok, value } = await db.findOneAndUpdate({ _id: objectId }, { $set: input }, { returnNewDocument: true })

    if (!ok) return false

    return value
  }
}
