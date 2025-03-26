'use client'

import { useSession } from 'next-auth/react'
import Image from 'next/image'

export function UserAvatar({ size = 24 }: { size?: number }) {
  const { data } = useSession()

  return (
    <div className="overflow-hidden rounded-full" style={{ width: size, height: size }}>
      {data?.user?.image ? (
        <Image
          width={size}
          height={size}
          src={data.user.image}
          alt={data?.user?.name || data?.user?.email || 'User'}
          className="h-full w-full object-cover"
        />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center bg-blue-500 font-medium text-white"
          style={{ fontSize: size === 24 ? '12px' : '18px' }}
        >
          {data?.user?.name ? data.user.name.charAt(0).toUpperCase() : data?.user?.email?.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  )
}
