import { Webhook } from 'svix'
import { buffer } from 'micro'
import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/db' 

export const config = {
  api: {
    bodyParser: false,
  },
}

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

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const rawBody = await buffer(req)
  const secret = process.env.CLERK_WEBHOOK_SECRET

  if (!secret) {
    return res.status(500).json({ error: 'Missing Clerk webhook secret' })
  }

  const webhook = new Webhook(secret)

  try {
    const evt = webhook.verify(rawBody, req.headers as any) as WebhookEvent

    if (evt.type === 'user.created') {
      const { id, email_addresses, username } = evt.data

      const primaryEmail = email_addresses.find(email => email.id === evt.data.primary_email_address_id)

      if (primaryEmail) {
        await prisma.user.create({
          data: {
            clerkId: id,
            email: primaryEmail.email_address,
            username: '',
            clerkusername : username || primaryEmail.email_address.split('@')[0],
            college: 'default',
          },
        })
      }
      console.log(`Webhook successfully processed with ${primaryEmail}`)
    }
    res.status(200).json({ message: 'Webhook processed successfully' })
  } catch (err) {
    console.error('Error processing webhook:', err)
    res.status(400).json({ error: 'Invalid webhook payload' })
  }
}