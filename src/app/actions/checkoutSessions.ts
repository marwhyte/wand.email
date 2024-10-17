'use server'

import { auth } from '@/auth'
import { getPriceIdByTierAndAnually } from '@/lib/data/plans'
import { redirect } from 'next/navigation'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-09-30.acacia',
})

export async function createCheckoutSession(tier: string, anually: boolean, path: string) {
  const session = await auth()
  if (!session?.user?.id || !session?.user?.email) {
    throw new Error('User not logged in')
  }

  try {
    const stripeSession = await stripe.checkout.sessions.create({
      metadata: {
        userId: session.user.id,
        plan: tier,
        billingCycle: anually ? 'yearly' : 'monthly',
      },
      customer_email: session.user.email,
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price: getPriceIdByTierAndAnually(tier, anually),
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_BASE}${path}&success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE}${path}&canceled=true`,
      automatic_tax: { enabled: true },
    })
    return redirect(stripeSession.url!)
  } catch (err) {
    throw err
  }
}
