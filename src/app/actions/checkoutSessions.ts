'use server'

import { auth } from '@/auth'
import { getPriceIdByTierAndAnually } from '@/lib/data/plans'
import { redirect } from 'next/navigation'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
})

export async function createCheckoutSession(tier: string, anually: boolean, path: string) {
  const session = await auth()
  if (!session?.user?.id || !session?.user?.email) {
    throw new Error('User not logged in')
  }

  console.log(`${process.env.NEXT_PUBLIC_BASE}${path}?success=true`)

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
      success_url: new URL(path, process.env.NEXT_PUBLIC_BASE).toString() + '?success=true',
      cancel_url: new URL(path, process.env.NEXT_PUBLIC_BASE).toString() + '?canceled=true',
      automatic_tax: { enabled: true },
    })
    return redirect(stripeSession.url!)
  } catch (err) {
    throw err
  }
}
