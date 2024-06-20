import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel, { Message } from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";



export async function POST(request: Request) {
  await dbConnect();

  try {
    // const { searchParams } = new URL(request.url);
    // console.log('serachParams', searchParams);
    // const queryParam = { username: searchParams.get('username') }
    
    // console.log('queryParam', queryParam);
    const {data,username} = await request.json();
    console.log('message ', data.content)
    console.log('username ', username)
    

    const user = await UserModel.findOne({ username }).exec();
    if (!user) {
      return Response.json({
        success: false,
        message: "User not found",
      },{status:404})
    }

    if (!user.isAcceptingMessage) {
      return Response.json({
        success: false,
        message: "User is not accepting messages",
      },{status:403})  //forbidden
    }

    const newMessage = { content: data.content, createdAt: new Date() };
    console.log('newMessage ', newMessage);
    user.messages.push(newMessage as Message);
    await user.save();
    

    return Response.json({
      success: true,
      message: "Message sent successfully",
    }, { status: 201 });

  } catch (error) {
    console.error("Error adding message:", error);
    return Response.json({
        message: "Internal server error",
        success: false
      },{ status: 500 }
    );
  }
}