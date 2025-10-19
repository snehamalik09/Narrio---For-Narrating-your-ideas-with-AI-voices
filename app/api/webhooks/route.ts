import { verifyWebhook } from '@clerk/nextjs/webhooks';
import { NextRequest } from 'next/server';
import Author, { UserRole } from '@/models/Author.model';
import { connectDB } from '@/lib/mongodb';

export async function POST(req: NextRequest) {
    try {
        const evt = await verifyWebhook(req);

        if (evt.type === "user.created" && evt.data) {
            await connectDB();

            const emailAddress =
                evt.data.email_addresses?.[0]?.email_address ||
                `${evt.data.primary_email_address_id}@example.com`;
            const name = `${evt.data.first_name || ''} ${evt.data.last_name || ''}`.trim() || "Unknown";

            const existingUser = await Author.findOne({ clerkId: evt.data.id });
            if (!existingUser) {
                await Author.create({
                    clerkId: evt.data.id,
                    username: name,
                    email: emailAddress,
                    imgUrl: evt.data.image_url,
                    role: UserRole.LISTENER,
                    podcasts: [],
                    podcastCount: 0,
                    totalViews: 0
                });
            }

            return new Response('Webhook processed', { status: 200 });
        }

        return new Response('Event type not handled', { status: 200 });
    } catch (err) {
        console.error('Error processing webhook:', err);
        return new Response('Webhook error', { status: 400 });
    }
}

//
