'use client'

import { Footer } from '@/app/components/footer'
import Nbsp from '@/app/components/nbsp'
import { usePlan } from '@/app/components/payment/plan-provider'
import { tiers } from '@/lib/data/plans'
import { Radio, RadioGroup } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/20/solid'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const frequencies = [
  { value: 'monthly', label: 'Monthly', priceSuffix: '/month' },
  { value: 'annually', label: 'Annually', priceSuffix: '/year' },
]

const faqs = [
  {
    id: 1,
    question: 'What is wand.email?',
    answer:
      'wand.email is an easy, drag-and-drop email builder that allows you to create beautiful emails in minutes, not hours. It integrates easily into most tech stacks, including html, react, and nextJS',
  },
  {
    id: 2,
    question: 'How many emails can I make?',
    answer:
      'You can make as many emails as you want. There is no limit to the number of emails you can make. On the free plan you are limited to 5 montly exports',
  },
  {
    id: 3,
    question: 'Can I cancel my subscription anytime?',
    answer: 'Yes, wand.email subscriptions are billed monthly or annually. You can cancel your subscription anytime.',
  },
  {
    id: 4,
    question: 'Can I costumize the emails to look like they were built in-house?',
    answer:
      'Yes, wand.email allows you to costumize the emails on any plan to look like they were built in-house. You can use our drag-and-drop editor to add your own images, colors, and fonts.\n\n You can add your own logo, and change the colors and fonts to match your brand.',
  },
  // More questions...
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function PricingPage() {
  const [frequency, setFrequency] = useState(frequencies[0])
  const session = useSession()
  const { plan } = usePlan()
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined' && !session.data?.user) {
      localStorage.setItem('postSignUpRedirectTo', window.location.pathname)
    }
  }, [session.data?.user])

  const handlePlanSelection = (href: string) => {
    if (!session.data?.user) {
      localStorage.setItem('postSignUpRedirectTo', href)
      router.push('/signup')
    } else {
      router.push(href)
    }
  }

  return (
    <div className="isolate overflow-hidden">
      <div className="flow-root bg-gray-900 pb-16 pt-24 sm:pt-32 lg:pb-0">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative z-10">
            <h2 className="mx-auto max-w-4xl text-center text-5xl font-bold tracking-tight text-white">
              The right plan for you, whoever you are
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-lg leading-8 text-white/70">
              Choose a plan that fits your needs. Whether you&apos;re a solo creator, a growing startup, or a large
              organization, we have flexible options to help you create stunning emails.
            </p>
            <div className="mt-16 flex justify-center">
              <fieldset className="relative" aria-label="Payment frequency">
                <RadioGroup
                  value={frequency}
                  onChange={setFrequency}
                  className="grid grid-cols-2 gap-x-1 rounded-full bg-white/5 p-1 text-center text-xs font-semibold leading-5 text-white"
                >
                  {frequencies.map((option) => (
                    <Radio
                      key={option.value}
                      value={option}
                      className="cursor-pointer rounded-full px-2.5 py-1 data-[checked]:bg-indigo-500"
                    >
                      {option.label}
                      {option.value === 'annually' && (
                        <div className="absolute -right-5 -top-3 rounded-full bg-pink-500 px-2 py-[0.5px] text-xs font-semibold leading-5 text-white">
                          Save 20%
                        </div>
                      )}
                    </Radio>
                  ))}
                </RadioGroup>
              </fieldset>
            </div>
          </div>
          <div className="relative mx-auto mt-10 grid max-w-md grid-cols-1 gap-y-8 lg:mx-0 lg:-mb-14 lg:max-w-none lg:grid-cols-3">
            <svg
              viewBox="0 0 1208 1024"
              aria-hidden="true"
              className="absolute -bottom-48 left-1/2 h-[64rem] -translate-x-1/2 translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] lg:-top-48 lg:bottom-auto lg:translate-y-0"
            >
              <ellipse cx={604} cy={512} rx={604} ry={512} fill="url(#d25c25d4-6d43-4bf9-b9ac-1842a30a4867)" />
              <defs>
                <radialGradient id="d25c25d4-6d43-4bf9-b9ac-1842a30a4867">
                  <stop stopColor="#7775D6" />
                  <stop offset={1} stopColor="#E935C1" />
                </radialGradient>
              </defs>
            </svg>
            <div
              aria-hidden="true"
              className="hidden lg:absolute lg:inset-x-px lg:bottom-0 lg:top-4 lg:block lg:rounded-t-2xl lg:bg-gray-800/80 lg:ring-1 lg:ring-white/10"
            />
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className={classNames(
                  tier.featured
                    ? 'z-10 bg-white shadow-xl ring-1 ring-gray-900/10'
                    : 'bg-gray-800/80 ring-1 ring-white/10 lg:bg-transparent lg:pb-14 lg:ring-0',
                  'relative rounded-2xl'
                )}
              >
                <div className="p-8 lg:pt-12 xl:p-10 xl:pt-14">
                  <h3
                    id={tier.id}
                    className={classNames(
                      tier.featured ? 'text-gray-900' : 'text-white',
                      'text-lg font-semibold leading-6'
                    )}
                  >
                    {tier.name}
                  </h3>
                  <div>
                    <h4
                      className={classNames(
                        tier.featured ? 'text-gray-900' : 'text-white',
                        'mt-2 text-sm font-semibold leading-6'
                      )}
                    >
                      {tier.description}
                    </h4>
                  </div>
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between lg:flex-col lg:items-stretch">
                    <div className="mt-2 flex items-center gap-x-4">
                      <p
                        className={classNames(
                          tier.featured ? 'text-gray-900' : 'text-white',
                          'text-4xl font-bold tracking-tight'
                        )}
                      >
                        {tier.price[frequency.value as keyof typeof tier.price]}
                      </p>
                      <div className="text-sm leading-5">
                        <p className={tier.featured ? 'text-gray-900' : 'text-white'}>USD</p>
                        <p
                          className={tier.featured ? 'text-gray-500' : 'text-gray-400'}
                        >{`Billed ${frequency.value}`}</p>
                      </div>
                    </div>

                    <button
                      disabled={plan === tier.id}
                      onClick={() => handlePlanSelection(tier.href)}
                      aria-describedby={tier.id}
                      className={classNames(
                        tier.featured
                          ? 'bg-indigo-600 shadow-sm hover:bg-indigo-500 focus-visible:outline-indigo-600'
                          : 'bg-white/10 hover:bg-white/20 focus-visible:outline-white',
                        'rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'
                      )}
                    >
                      {plan === tier.id
                        ? 'Your current plan'
                        : tier.name === 'Free'
                          ? 'Create your account'
                          : 'Buy this plan'}
                    </button>
                  </div>

                  <div className="mt-8 flow-root sm:mt-10">
                    <ul
                      role="list"
                      className={classNames(
                        tier.featured
                          ? 'divide-gray-900/5 border-gray-900/5 text-gray-600'
                          : 'divide-white/5 border-white/5 text-white',
                        '-my-2 divide-y border-t text-sm leading-6 lg:border-t-0'
                      )}
                    >
                      {tier.highlights.map((mainFeature) => (
                        <li key={mainFeature} className="flex gap-x-3 py-2">
                          <CheckIcon
                            aria-hidden="true"
                            className={classNames(
                              tier.featured ? 'text-indigo-600' : 'text-gray-500',
                              'h-6 w-5 flex-none'
                            )}
                          />
                          {mainFeature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="relative bg-white lg:pt-14">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">Frequently asked questions</h2>
              <p className="mt-6 text-base leading-7 text-gray-600">
                Have a different question and can’t find the answer you’re looking for? Reach out to our support team by
                <Nbsp />
                <a href="mailto:support@wand.email" className="font-semibold text-indigo-600 hover:text-indigo-500">
                  sending us an email
                </a>
                <Nbsp />
                and we’ll get back to you as soon as we can.
              </p>
            </div>
            <div className="mt-20">
              <dl className="space-y-16 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-16 sm:space-y-0 lg:gap-x-10">
                {faqs.map((faq) => (
                  <div key={faq.id}>
                    <dt className="text-base font-semibold leading-7 text-gray-900">{faq.question}</dt>
                    <dd className="mt-2 text-base leading-7 text-gray-600">{faq.answer}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  )
}
