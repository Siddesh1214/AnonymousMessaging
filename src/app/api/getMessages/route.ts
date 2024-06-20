import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  console.log('session?.expires',session);

  if (!session || !session.user) {
    return Response.json({
      success: false,
      message: "You are not logged in"
    },{status:401})
  }

  const userId = new mongoose.Types.ObjectId(user._id);
  console.log("userId", userId);

  try {

    const userExists = await UserModel.findOne({ _id: userId }).lean();
    console.log("User Exists:", userExists);

    // const user = await UserModel.aggregate([
    //   { $match: { _id: userId } },
    //   { $unwind: '$messages' },
    //   { $sort: { 'messages.createdAt': -1 } },
    //   { $group: { _id: '$_id', messages: { $push: '$messages' } } },
    // ]).exec();
    // console.log("Aggregated User Data:", user);


    // if (!user || user.length === 0) {
    //   return Response.json({
    //     success: false,
    //     message: "User not found"
    //   },{status:401})
    // }
    if (!user) {
      return Response.json({
        success: false,
        message: "User not found"
      },{status:401})
    }


    return Response.json({
      success: true,
      message:'success in fetching messages',
      messages: userExists?.messages
    },{status:200})

  } catch (error) {
    console.log('error in fetching messages', error);
    return Response.json({
      success: false,
      message: "error in fetching messages"
    },{status:500})
  }


}

