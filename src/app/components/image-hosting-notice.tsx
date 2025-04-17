import { IMAGE_HOSTING } from '@/lib/routes'
import Link from 'next/link'

export function ImageHostingNotice() {
  return (
    <div className="mt-4 rounded-md bg-gray-50 p-3 text-sm">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-gray-700">
            <Link
              target="_blank"
              href={IMAGE_HOSTING}
              className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
            >
              Data limits apply for images hosted on wand.email (Free: 10GB, Pro: 150GB)
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
