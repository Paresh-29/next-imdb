import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { createOrUpdateUser, deleteUser } from '@/lib/actions/user';
import { clerkClient } from '@clerk/nextjs/server';

export async function POST(req) {
  // Get the webhook secret from environment variables
  const WEBHOOK_SECRET = process.env.SIGNING_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error('Please add SIGNING_SECRET to your environment variables');
    return new Response('Webhook secret not found', {
      status: 500,
    });
  }

  try {
    // Get the headers
    const headerPayload = headers();
    const svix_id = headerPayload.get('svix-id');
    const svix_timestamp = headerPayload.get('svix-timestamp');
    const svix_signature = headerPayload.get('svix-signature');

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new Response('Missing svix headers', {
        status: 400,
      });
    }

    // Get the body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    // Create new Svix instance with secret
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt;
    try {
      evt = wh.verify(body, {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      });
    } catch (err) {
      console.error('Error verifying webhook:', err);
      return new Response(`Webhook verification failed: ${err.message}`, {
        status: 400,
      });
    }

    const { id } = evt?.data ?? {};
    const eventType = evt?.type;

    if (!id) {
      return new Response('No user ID included in webhook payload', {
        status: 400,
      });
    }

    if (eventType === 'user.created' || eventType === 'user.updated') {
      const { first_name, last_name, image_url, email_addresses } = evt?.data ?? {};

      try {
        const user = await createOrUpdateUser(
          id,
          first_name,
          last_name,
          image_url,
          email_addresses
        );

        if (user && eventType === 'user.created') {
          await clerkClient.users.updateUserMetadata(id, {
            publicMetadata: {
              userMongoId: user._id,
            },
          });
        }

        return new Response('User created/updated successfully', { status: 200 });
      } catch (error) {
        console.error('Database operation failed:', error);
        return new Response('Database operation failed', { status: 500 });
      }
    }

    if (eventType === 'user.deleted') {
      try {
        await deleteUser(id);
        return new Response('User deleted successfully', { status: 200 });
      } catch (error) {
        console.error('Failed to delete user:', error);
        return new Response('Failed to delete user', { status: 500 });
      }
    }

    return new Response('Webhook processed', { status: 200 });
  } catch (error) {
    console.error('Webhook processing failed:', error);
    return new Response('Webhook processing failed', { status: 500 });
  }
}
