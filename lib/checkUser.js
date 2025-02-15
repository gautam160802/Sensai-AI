import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma"; // Adjust the path as needed

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  try {
    const loggedInUser = await db.user.findUnique({
      where: {
        clerkUserid: user.id, // Ensure this matches your Prisma schema
      },
    });

    if (loggedInUser) {
      return loggedInUser;
    }

    const name = `${user.firstName || ""} ${user.lastName || ""}`.trim();

    const newUser = await db.user.create({
      data: {
        clerkUserid: user.id, // Ensure this matches your schema
        name,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
      },
    });

    return newUser;
  } catch (error) {
    console.log(error.message);
    return null; // Ensure a return value in case of an error
  }
};
