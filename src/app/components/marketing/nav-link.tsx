import Link from 'next/link'

export function NavLink({ href, children, target }: { href: string; children: React.ReactNode; target?: string }) {
  return (
    <Link
      target={target}
      href={href}
      className="inline-block rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
    >
      {children}
    </Link>
  )
}
