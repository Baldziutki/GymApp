import mongoose from 'mongoose';
import dotenv from 'dotenv';

export const connectToDatabase = async (fastify, options) => {

  dotenv.config();

  const dbUrl = process.env.DB_URL;

  try {
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: options.dbName,
    });

    fastify.addHook('onClose',async () => {
      await mongoose.coonection.close();
    });

    console.log('Connected to db');

  } catch (err) {
    console.log(err);
    console.log(err.stack);
    console.log("Couldn't connect to db");
  }
};


