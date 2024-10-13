'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Heading } from '../heading'

export function Hero() {
  const [selectedImage, setSelectedImage] = useState('/marketing/thursday-boots3.png')

  useEffect(() => {
    const images = [
      '/marketing/thursday-boots3.png',
      '/marketing/thursday-boots2.png',
      '/marketing/thursday-boots1.png',
    ]
    const interval = setInterval(() => {
      setSelectedImage((prevImage) => {
        const index = images.indexOf(prevImage)
        const nextIndex = (index + 1) % images.length
        return images[nextIndex]
      })
    }, 1500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-white dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-24 lg:flex lg:items-center lg:gap-x-10 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:flex-auto">
          <div className="flex">
            <div className="relative flex items-center gap-x-4 rounded-full px-4 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20 dark:text-gray-300 dark:ring-white/10 dark:hover:ring-white/20">
              <span className="font-semibold text-purple-600 dark:text-purple-400">New designs!</span>
              <span className="h-4 w-px bg-slate-900/10 dark:bg-white/10" aria-hidden="true"></span>
              <Link href="/templates" className="flex items-center gap-x-1">
                <span className="absolute inset-0" aria-hidden="true"></span>
                See new templates
                <svg
                  className="-mr-2 h-5 w-5 text-gray-400 dark:text-gray-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>
          <h1 className="font-display mx-auto mt-5 max-w-4xl text-5xl font-medium tracking-tight text-slate-900 dark:text-white sm:text-7xl">
            Create{' '}
            <span className="relative whitespace-nowrap text-purple-600 dark:text-purple-400">
              <svg
                aria-hidden="true"
                viewBox="0 0 418 42"
                className="dark:fill-purple-60/70 absolute left-0 top-2/3 h-[0.58em] w-full fill-purple-400/60"
                preserveAspectRatio="none"
              >
                <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
              </svg>
              <span className="relative">stunning emails</span>
            </span>{' '}
            with ease
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            SwiftMaker is a easy to plug in email builder. It works well with React, NextJS, and HTML projects.
          </p>
          <div className="mt-10 flex items-center gap-x-6">
            <Link
              href="/templates"
              className="rounded-md bg-purple-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Start building
            </Link>
            <Link href="/templates" className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100">
              No signup required <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
        <div className="mt-16 sm:mt-24 lg:mt-0 lg:flex-shrink-0 lg:flex-grow">
          <svg viewBox="0 0 366 729" role="img" className="mx-auto w-[16.875rem] max-w-full drop-shadow-xl">
            <title>App screenshot</title>
            <defs>
              <clipPath id="2ade4387-9c63-4fc4-b754-10e687a0d332">
                <rect width="316" height="684" rx="36" />
              </clipPath>
            </defs>
            <path
              fill="#4B5563"
              d="M363.315 64.213C363.315 22.99 341.312 1 300.092 1H66.751C25.53 1 3.528 22.99 3.528 64.213v44.68l-.857.143A2 2 0 0 0 1 111.009v24.611a2 2 0 0 0 1.671 1.973l.95.158a2.26 2.26 0 0 1-.093.236v26.173c.212.1.398.296.541.643l-1.398.233A2 2 0 0 0 1 167.009v47.611a2 2 0 0 0 1.671 1.973l1.368.228c-.139.319-.314.533-.511.653v16.637c.221.104.414.313.56.689l-1.417.236A2 2 0 0 0 1 237.009v47.611a2 2 0 0 0 1.671 1.973l1.347.225c-.135.294-.302.493-.49.607v377.681c0 41.213 22 63.208 63.223 63.208h95.074c.947-.504 2.717-.843 4.745-.843l.141.001h.194l.086-.001 33.704.005c1.849.043 3.442.37 4.323.838h95.074c41.222 0 63.223-21.999 63.223-63.212v-394.63c-.259-.275-.48-.796-.63-1.47l-.011-.133 1.655-.276A2 2 0 0 0 366 266.62v-77.611a2 2 0 0 0-1.671-1.973l-1.712-.285c.148-.839.396-1.491.698-1.811V64.213Z"
            />
            <path
              fill="#343E4E"
              d="M16 59c0-23.748 19.252-43 43-43h246c23.748 0 43 19.252 43 43v615c0 23.196-18.804 42-42 42H58c-23.196 0-42-18.804-42-42V59Z"
            />
            <foreignObject
              width="316"
              height="684"
              transform="translate(24 24)"
              clipPath="url(#2ade4387-9c63-4fc4-b754-10e687a0d332)"
            >
              <img src={selectedImage} alt="" width={316} height={684} />
            </foreignObject>
          </svg>
        </div>
      </div>
      <div className="pb-24 lg:pb-36">
        <Heading className="text-center" level={2}>
          Integrate easily with these email providers, and more
        </Heading>
        <ul
          role="list"
          className="mt-8 flex items-center justify-center gap-x-8 sm:flex-col sm:gap-x-0 sm:gap-y-10 xl:flex-row xl:gap-x-12 xl:gap-y-0"
        >
          {[
            [
              { name: 'NodeMailer', logo: '/logos/nodemailer.png' },
              { name: 'SendGrid', logo: '/logos/sendgrid.png' },
              { name: 'Resend', logo: '/logos/resend.svg' },
            ],
            [
              { name: 'Amazon SES', logo: '/logos/amazonSES.png' },
              { name: 'Postmark', logo: '/logos/postmark.png' },
            ],
          ].map((group, groupIndex) => (
            <li key={groupIndex}>
              <ul role="list" className="flex flex-col items-center gap-y-8 sm:flex-row sm:gap-x-12 sm:gap-y-0">
                {group.map((company) => (
                  <li key={company.name} className="flex">
                    <img src={company.logo} alt={company.name} className="h-14 rounded-md dark:bg-gray-200" />
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
