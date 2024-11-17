import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

type EmailAddress = {
  id: string
  email_address: string
}

type WebhookEvent = {
  data: {
    id: string
    email_addresses: EmailAddress[]
    primary_email_address_id: string
    username?: string
  }
  object: 'event'
  type: string
}

export async function POST(req: Request) {
  const headersList = headers()
  const secret = process.env.CLERK_WEBHOOK_SECRET

  if (!secret) {
    console.error('Missing Clerk webhook secret')
    return NextResponse.json(
      { error: 'Missing Clerk webhook secret' },
      { status: 500 }
    )
  }

  try {
    // Get the raw body
    const rawBody = await req.text()
    
    // Create webhook instance
    const webhook = new Webhook(secret)
    
    // Verify the webhook
    const evt = webhook.verify(rawBody, {
      'svix-id': headersList.get('svix-id') || '',
      'svix-timestamp': headersList.get('svix-timestamp') || '',
      'svix-signature': headersList.get('svix-signature') || ''
    }) as WebhookEvent

    if (evt.type === 'user.created') {
      const { id, email_addresses, username } = evt.data

      const primaryEmail = email_addresses.find(
        email => email.id === evt.data.primary_email_address_id
      )

      if (primaryEmail) {
        await prisma.user.create({
          data: {
            clerkId: id,
            email: primaryEmail.email_address,
            username: '',
            clerkusername: username || primaryEmail.email_address.split('@')[0],
          },
        })
        
        console.log(`Webhook processed successfully for email: ${primaryEmail.email_address}`)
      }
    }

    return NextResponse.json(
      { message: 'Webhook processed successfully' },
      { status: 200 }
    )
  } catch (err) {
    console.error('Error processing webhook:', err)
    return NextResponse.json(
      { error: 'Invalid webhook payload' },
      { status: 400 }
    )
  }
}