import mongoose from "mongoose";

export const database_connection = async () => {
  try {    
    await mongoose.connect(process.env.DB_URL)    
    console.log('Database connected');
  } catch (error) {
    console.log('Database not connected' ,  error);
  }
}
