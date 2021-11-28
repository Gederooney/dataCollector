import { connect } from "mongoose";
import dotenv from "dotenv";
import { ReturnType, ConnectionOptions } from "../src/inerfaces";

dotenv.config();

const options: ConnectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  authSource: "admin",
};

const connectDB = async (): Promise<ReturnType> => {
  try {
    await connect(process.env.MONGO_URI || "", options);
    return { sucess: true, message: "Connected to db" };
  } catch (error: unknown) {
    return { sucess: false, message: `${error}` };
  }
};

export default connectDB;
