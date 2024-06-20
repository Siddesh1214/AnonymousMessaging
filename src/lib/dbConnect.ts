import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
}

const connection :ConnectionObject = {}


async function dbConnect():Promise<void> {
  if (connection.isConnected) {
    console.log("Already connected to DB")
    return;
  }

  try {
    // const db = await mongoose.connect(process.env.MONGODB_URI || "", {});
    const db = await mongoose.connect("mongodb+srv://siddeshshinde1214:LF7irW7N6yKgNN4I@cluster0.iwhgzrv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0" || "", {});
    // console.log('db', db);
    connection.isConnected = db.connections[0].readyState;
    console.log('DB Connected Successfully')
  } catch (error) {
    console.log('error ', error);
    console.log("DB Connection Failed")
    // process.exit(1); 
  }
}

export default dbConnect;