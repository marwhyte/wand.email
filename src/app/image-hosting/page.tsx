'use client'

import { ROOT } from '@/lib/routes'
import Link from 'next/link'

export default function ImageHostingPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">Image Hosting on wand.email</h1>

        <div className="space-y-6 text-gray-600">
          <p className="font-medium text-gray-800">
            When you generate or upload images in your emails created with wand.email, those images need to be stored
            somewhere to be accessible to your recipients. This page explains how our image hosting works and potential
            future charges.
          </p>

          <div className="rounded-md bg-yellow-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Important Notice</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    While image hosting is currently included with your subscription, usage limits and charges will
                    apply based on your plan. Free plans do not allow data overages beyond the threshold. You can either
                    host images yourself or upgrade your plan if you intend to send high volume campaigns with images.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="mt-8 text-xl font-semibold text-gray-800">How Image Hosting Works</h2>

          <p>
            When you add images to your emails in wand.email, whether by uploading your own images or using our AI image
            generation feature, these images are stored on our secure cloud servers. This ensures that your email
            recipients can view these images when they open your email.
          </p>

          <div className="space-y-4 rounded-md bg-gray-50 p-4">
            <h3 className="text-lg font-medium text-gray-800">What happens when you add an image to your email:</h3>
            <ol className="ml-5 list-decimal space-y-2">
              <li>The image is uploaded to our secure cloud storage</li>
              <li>A unique URL is generated for that image</li>
              <li>This URL is included in your email HTML</li>
              <li>When recipients open your email, they load the image from our servers</li>
            </ol>
          </div>

          <h2 className="mt-8 text-xl font-semibold text-gray-800">Image Hosting Storage Limits</h2>

          <p>
            We provide different storage limits based on your subscription plan. Each plan includes a specific amount of
            monthly image hosting bandwidth:
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-gray-200 p-4 shadow-sm">
              <h3 className="mb-2 text-lg font-medium text-gray-800">Free Plan</h3>
              <p className="text-sm text-gray-600">
                Includes 10GB of monthly image hosting bandwidth. No overages allowed—once exceeded, images will not be
                served until the next billing cycle or until you upgrade.
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 p-4 shadow-sm">
              <h3 className="mb-2 text-lg font-medium text-gray-800">Pro Plan</h3>
              <p className="text-sm text-gray-600">
                Includes 150GB of monthly image hosting bandwidth. Additional storage beyond this will incur extra
                charges based on usage.
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 p-4 shadow-sm">
              <h3 className="mb-2 text-lg font-medium text-gray-800">Enterprise Plan</h3>
              <p className="text-sm text-gray-600">
                Custom bandwidth limits tailored to your organization&apos;s needs with priority delivery network access
                and advanced analytics.
              </p>
            </div>
          </div>

          <h2 className="mt-8 text-xl font-semibold text-gray-800">How Usage Is Calculated</h2>

          <p>Your image hosting usage is calculated based on the following formula:</p>

          <div className="my-4 rounded-md bg-gray-100 p-4 font-mono text-sm">
            <p className="mb-2">For emails:</p>
            <p>Total size of images included in an email × Total emails sent × Total open rate</p>
          </div>

          <p>
            For example, if you send an email with 500KB of images to 1,000 recipients and have a 20% open rate, that
            would consume approximately 100MB of your bandwidth (500KB × 1,000 × 0.2 = 100MB).
          </p>

          <div className="mt-4 rounded-md border border-blue-200 bg-blue-50 p-4">
            <h3 className="text-md font-medium text-blue-800">Tip:</h3>
            <p className="mt-2 text-blue-700">
              Optimize your images before uploading to reduce their size. A properly optimized image can be 70-80%
              smaller than an unoptimized one, while maintaining visual quality.
            </p>
          </div>

          <h2 className="mt-8 text-xl font-semibold text-gray-800">Alternative Options</h2>

          <p>If you prefer not to use our image hosting service or anticipate exceeding your plan&apos;s limits:</p>

          <ul className="ml-5 list-disc space-y-2">
            <li>Host images on your own server and use absolute URLs in your emails</li>
            <li>Use a third-party image hosting service and link to those images</li>
            <li>Upgrade to a higher plan tier if you regularly send high-volume campaigns</li>
            <li>Optimize your images to reduce file size before uploading</li>
          </ul>

          <h2 className="mt-8 text-xl font-semibold text-gray-800">Best Practices</h2>

          <div className="rounded-md bg-blue-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Tips for Efficient Image Usage</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <ul className="list-inside list-disc space-y-1">
                    <li>Optimize your images before uploading to reduce file size</li>
                    <li>Use appropriate image dimensions for your email layout</li>
                    <li>Consider downloading and storing important images locally as a backup</li>
                    <li>Regularly review your bandwidth usage in your account dashboard</li>
                    <li>For high-volume campaigns, use fewer or smaller images</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <h2 className="mt-8 text-xl font-semibold text-gray-800">Questions?</h2>

          <p>
            We&apos;re committed to providing transparent information about our services. If you have any questions
            about image hosting or potential future charges, please don&apos;t hesitate to{' '}
            <a href="mailto:support@wand.email" className="text-blue-500">
              contact our support team.
            </a>
          </p>

          <div className="mt-8 text-center">
            <Link
              href={ROOT}
              className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
