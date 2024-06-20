import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";



export async function POST(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;


  if (!session || !session.user) {
    return Response.json({
      success: false,
      message: "Not Authenticated"
    }, { status: 401 })
  }
  const userId = user._id;
  const { acceptMessage } = await request.json();


  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessage },
      { new: true }
    )
    if (!updatedUser) {
      return Response.json({
          success: false,
          message: 'Unable to find user to update message acceptance status',
        },
        { status: 404 }
      );
    }

    return Response.json({
      success: false,
      message: 'Message acceptance status updated successfully',
      updatedUser
    },
    { status: 404 }
  );
} catch (error) {
  console.log('Failed to update user status',error);
    return Response.json({
      success: false,
      message: "Failed to update user status to accept messages"
    }, { status: 500 })
  }

}


export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;


  if (!session || !session.user) {
    return Response.json({
      success: false,
      message: "Not Authenticated"
    }, { status: 401 })
  }
  const userId = user._id;

 try {
  const foundUser = await UserModel.findById(userId);
  if (!foundUser) {
    return Response.json({
      success: false,
      message: "User not found"
    }, { status: 404 });
  }


  if (!foundUser) {
    return Response.json({
      success: false,
      message: 'User not found'
    }, { status: 404 });
  }
  return Response.json({
    success: true,
    isAcceptingMessage:foundUser?.isAcceptingMessage,
  }, { status: 200 });

 } catch (error) {
  console.log('Failed to update user status',error);
    return Response.json({
      success: false,
      message: "Error in gettign message updating status"
    }, { status: 500 })
  }
}