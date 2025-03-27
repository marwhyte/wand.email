'use server'

import { auth } from '@/auth'
import { getUserByEmail, updateUserSubscriptionExpiry } from '@/lib/database/queries/users'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
})

export async function cancelSubscription() {
  const session = await auth()

  if (!session?.user?.email) {
    throw new Error('User not logged in')
  }

  const user = await getUserByEmail(session.user.email)

  if (!user) {
    throw new Error('User not found')
  }

  if (!user.stripeCustomerId) {
    throw new Error('User has no Stripe customer ID')
  }

  try {
    // Get customer's subscription
    const subscriptions = await stripe.subscriptions.list({
      customer: user.stripeCustomerId,
    })

    if (!subscriptions.data.length) {
      throw new Error('No active subscription found')
    }

    // Cancel the subscription at period end
    await stripe.subscriptions.update(subscriptions.data[0].id, {
      cancel_at_period_end: true,
    })

    const expiresAt = new Date(subscriptions.data[0].current_period_end * 1000)

    if (expiresAt) {
      await updateUserSubscriptionExpiry(user.id, expiresAt)
    }

    return { success: true, expiresAt }
  } catch (err) {
    console.error('Error canceling subscription:', err)
    throw err
  }
}
