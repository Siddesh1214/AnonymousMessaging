import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";



export async function POST(request: Request) {
  await dbConnect();

  // const session = await getServerSession(authOptions);
  const session = await getServerSession({ req: request, ...authOptions });
  const user: User = session?.user as User;


  if (!session || !session.user) {
    return Response.json({
      success: false,
      message: "Not Authenticated"
    }, { status: 401 })
  }
  const userId = user._id;
  const { acceptMessages } = await request.json();
  console.log('accept message status', acceptMessages);


  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessages },
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
      success: true,
      message: 'Message acceptance status updated successfully',
      updatedUser
    },
    { status: 200 }
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

  // const session = await getServerSession(authOptions);
  const session = await getServerSession({ req: request, ...authOptions });
  const user: User = session?.user as User;
  // console.log('session form acceptMessages ROUTE ', session);
  // console.log('user form acceptMessages ROUTE ', user);


  if (!session || !session.user) {
    return Response.json({
      success: false,
      message: "Not Authenticated"
    }, { status: 401 })
  }
  const userId = user._id;

 try {
  const foundUser = await UserModel.findById(userId);
   console.log('found user', foundUser);
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
