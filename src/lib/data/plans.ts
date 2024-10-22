import { Plan } from '../database/types'

export type Tier = {
  name: string
  id: string
  href: string
  featured: boolean
  color: 'purple' | 'blue' | 'green'
  description: string
  price: { monthly: string; annually: string }
  highlights: string[]
}
export const tiers: Tier[] = [
  {
    name: 'Free',
    id: 'free',
    href: '/sign-up',
    color: 'purple',
    featured: false,
    description: 'For individuals and small projects',
    price: { monthly: '$0', annually: '$0' },
    highlights: ['Access to all templates', 'Highly customizable editor', '5 exports every month'],
  },
  {
    name: 'Starter',
    id: 'starter',
    href: '/templates?upgrade=true&plan=starter',
    color: 'blue',
    featured: true,
    description: 'Emails on brand with your business',
    price: { monthly: '$15', annually: '$144' },
    highlights: [
      'Everything in Free',
      'Unlimited exports',
      'Premium templates',
      'Personalized footer',
      'Email support',
      'And more...',
    ],
  },
  {
    name: 'Pro',
    id: 'pro',
    href: '/templates?upgrade=true&plan=pro',
    color: 'green',
    featured: false,
    description: 'Great for larger businesses with complex needs',
    price: { monthly: '$40', annually: '$384' },
    highlights: ['Everything in Starter', 'Premium support', 'Custom code'],
  },
]

export const getPlanNameFromPriceId = (productId: string): Plan => {
  if (
    productId === 'price_1QAYppFQjmQhGhP2vSTaThs7' ||
    productId === 'price_1QAYsVFQjmQhGhP2h9N1zQuj' ||
    productId === 'price_1QAvCuFQjmQhGhP2RHkrtIL2'
  ) {
    return 'starter'
  }
  if (productId === 'price_1QAYryFQjmQhGhP2YcUrnPqE' || productId === 'price_1QAYsVFQjmQhGhP2h9N1zQuj') {
    return 'pro'
  }
  return 'free'
}

export const getPriceIdByTierAndAnually = (tier: string, anually: boolean) => {
  if (tier === 'starter') {
    if (anually) {
      return 'price_1QAYqbFQjmQhGhP2aPnqRYux'
    }
    return 'price_1QAYppFQjmQhGhP2vSTaThs7'
    // this is free version for testing
    // return 'price_1QAvCuFQjmQhGhP2RHkrtIL2'
  }
  if (tier === 'pro') {
    if (anually) {
      return 'price_1QAYsVFQjmQhGhP2h9N1zQuj'
    }
    return 'price_1QAYryFQjmQhGhP2YcUrnPqE'
  }
}
