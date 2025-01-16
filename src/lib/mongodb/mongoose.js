import mongoose from 'mongoose';

let initialize = false;

export const connect = async () => {
  mongoose.set('strictQuery', true);
  if (initialize) {
    console.log('Mongodb already connected');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'next-imdb-clerk',
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    initialize = true;
    console.log('Mongodb connected');
  } catch (error) {
    console.log('Mongodb connection error: ', error);
  }

}
