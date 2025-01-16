// import mongoose from 'mongoose';
//
// let initialize = false;
//
// export const connect = async () => {
//   mongoose.set('strictQuery', true);
//   if (initialize) {
//     console.log('Mongodb already connected');
//     return;
//   }
//
//   try {
//     await mongoose.connect(process.env.MONGODB_URI, {
//       dbName: 'next-imdb-clerk',
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     initialize = true;
//     console.log('Mongodb connected');
//   } catch (error) {
//     console.log('Mongodb connection error: ', error);
//   }
//
// }

import mongoose from 'mongoose';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(process.env.MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
