import { getPlanNameFromPriceId } from '@/lib/data/plans'
import { getUserByStripeCustomerId, updateUserPlan } from '@/lib/database/queries/users'
import { BillingCycle, Plan } from '@/lib/database/types'
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export const config = {
  api: {
    bodyParser: false,
  },
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
})

export async function POST(request: NextRequest) {
  const headersList = await headers()
  const sig = headersList.get('stripe-signature')
  const body = await request.text()

  let event

  if (!sig || !body) {
    return NextResponse.json({ error: 'Webhook signature or body is missing' }, { status: 400 })
  }

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    console.error('Webhook Error:', err)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session)
        break
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break
      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Error processing webhook:', error)
    return NextResponse.json({ error: `Webhook processing error: ${error.message}` }, { status: 500 })
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  if (session.status === 'complete') {
    const userId = session.metadata?.userId as string
    const planName = session.metadata?.plan as Plan
    const billingCycle = session.metadata?.billingCycle as BillingCycle
    const stripeCustomerId = session.customer as string

    if (!userId || !planName || !billingCycle) {
      throw new Error('Missing userId, plan or billing cycle in session metadata')
    }

    // Update the user's plan in the database
    await updateUserPlan(userId, planName, stripeCustomerId, null)
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const user = await getUserByStripeCustomerId(subscription.customer as string)
  const stripePriceId = subscription.items.data[0].price.id
  if (!user) throw new Error(`User not found with stripe customer id ${subscription.customer}`)

  const plan = getPlanNameFromPriceId(stripePriceId)
  const expiresAt = new Date(subscription.current_period_end * 1000)

  await updateUserPlan(user.id, plan, subscription.customer as string, expiresAt)
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const user = await getUserByStripeCustomerId(subscription.customer as string)
  if (!user) throw new Error(`User not found with stripe customer id ${subscription.customer}`)

  await updateUserPlan(user.id, 'free', subscription.customer as string, new Date())
}
