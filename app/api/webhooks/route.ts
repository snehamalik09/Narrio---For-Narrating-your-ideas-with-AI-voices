import { verifyWebhook } from '@clerk/nextjs/webhooks';
import { NextRequest } from 'next/server';
import Author, { UserRole } from '@/models/Author.model';
import { connectDB } from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    console.log("Webhook received");

    const evt = await verifyWebhook(req);
    console.log("Webhook verified:", evt.type);

    if (evt.type === "user.created" && evt.data) {
      console.log("Processing user.created event for ID:", evt.data.id);

      const emailAddress = evt.data.email_addresses?.[0]?.email_address;
      if (!emailAddress) {
        console.error("Email not found for user:", evt.data.id);
        throw new Error("Email not found");
      }

      const name = `${evt.data.first_name || ''} ${evt.data.last_name || ''}`.trim() || "Unknown";
      console.log("User name:", name, "Email:", emailAddress);

      await connectDB();
      console.log("Database connected");

      const existingUser = await Author.findOne({ clerkId: evt.data.id });
      if (existingUser) {
        console.log("User already exists in database:", existingUser?.clerkID);
      } else {
        const newUser = await Author.create({
          clerkId: evt.data.id,
          username: name,
          email: emailAddress,
          imgUrl: evt.data.image_url,
          role: UserRole.LISTENER,
          podcasts: [],
          podcastCount: 0,
          totalViews: 0
        });
        console.log("New user created:", newUser?.clerkID);
      }
    }

    return new Response('Webhook processed', { status: 200 });
  } catch (err) {
    console.error('Error processing webhook:', err);
    return new Response('Error verifying webhook', { status: 400 });
  }
}
