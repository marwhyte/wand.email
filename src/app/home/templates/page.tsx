import { auth } from "@/auth";
import Image from "next/image";
import Link from "next/link";

export default async function TemplatesPage() {
  const session = await auth();

  return (
    <div>
      <ul
        role="list"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
        <Link href="/home/templates/going">
          <li className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow hover:outline  hover:outline-gray-200">
            <div className="flex flex-1 flex-col p-8">
              <Image
                alt="Going logo"
                src="/going/going-logo.png"
                width={100}
                height={100}
                className="mx-auto"
              />
              <h3 className="mt-6 text-sm font-medium text-gray-900">Going</h3>
              <dl className="mt-1 flex flex-grow flex-col justify-between">
                <dt className="sr-only">Flight marketing emails</dt>
                <dd className="mt-3">
                  <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                    Premium
                  </span>
                </dd>
              </dl>
            </div>
          </li>
        </Link>
      </ul>
    </div>
  );
}
