'use client'

import { Input } from '@/app/components/input'
import { Select } from '@/app/components/select'
import { isValidHttpUrl } from '@/lib/utils/misc'

enum LinkType {
  WEB = 'web',
  EMAIL = 'email',
  PHONE = 'phone',
}

type LinkFields = {
  email?: string
  subject?: string
  body?: string
  phone?: string
  url?: string
}

interface HrefEditorProps {
  href: string | undefined
  onChange: (href: string) => void
  compact?: boolean
}

const HrefEditor = ({ href, onChange, compact = false }: HrefEditorProps) => {
  const getLinkType = (href: string | undefined): LinkType => {
    if (!href) return LinkType.WEB
    if (href.startsWith('mailto:')) return LinkType.EMAIL
    if (href.startsWith('tel:')) return LinkType.PHONE
    return LinkType.WEB
  }

  const getLinkTypeFields = (type: LinkType, currentHref: string | undefined): LinkFields => {
    if (!currentHref) {
      switch (type) {
        case LinkType.EMAIL:
          return { email: '', subject: '', body: '' }
        case LinkType.PHONE:
          return { phone: '' }
        default:
          return { url: '' }
      }
    }

    switch (type) {
      case LinkType.EMAIL: {
        const [email, params] = currentHref.replace('mailto:', '').split('?')
        const searchParams = new URLSearchParams((params || '') as string)
        return {
          email: email || '',
          subject: searchParams.get('subject') || '',
          body: searchParams.get('body') || '',
        }
      }
      case LinkType.PHONE:
        return {
          phone: currentHref.replace('tel:', ''),
        }
      default:
        return {
          url: currentHref,
        }
    }
  }

  const handleLinkTypeChange = (type: LinkType, fields: LinkFields) => {
    let newHref = ''
    switch (type) {
      case LinkType.EMAIL:
        const emailParams = new URLSearchParams()
        if (fields.subject) emailParams.append('subject', fields.subject)
        if (fields.body) emailParams.append('body', fields.body)
        const encodedEmailParams = emailParams.toString().replace(/\+/g, '%20')
        newHref = `mailto:${fields.email || ''}${encodedEmailParams ? '?' + encodedEmailParams : ''}`
        break
      case LinkType.PHONE:
        newHref = `tel:${fields.phone || ''}`
        break
      default:
        newHref = fields.url || ''
    }
    onChange(newHref)
  }

  const type = getLinkType(href)
  const fields = getLinkTypeFields(type, href)

  const labelClassName = compact ? 'text-xs mb-1' : ''

  return (
    <div className={`${compact ? 'space-y-2' : 'space-y-4'}`}>
      <div className="flex gap-2">
        <div className={`w-36`}>
          <span className={labelClassName}>Link Type</span>
          <Select
            value={type}
            onChange={(e) => {
              const newType = e.target.value as LinkType
              const newFields = getLinkTypeFields(newType, '')
              handleLinkTypeChange(newType, newFields)
            }}
          >
            <option value={LinkType.WEB}>Web</option>
            <option value={LinkType.EMAIL}>Email</option>
            <option value={LinkType.PHONE}>Phone</option>
          </Select>
        </div>

        {type === LinkType.WEB && (
          <div className={`w-full`}>
            <span className={labelClassName}>URL</span>
            <Input
              type="url"
              value={fields.url}
              onChange={(e) => handleLinkTypeChange(type, { ...fields, url: e.target.value })}
              placeholder="https://example.com"
              pattern="https?://.*"
              title="Please enter a valid URL"
              invalid={!isValidHttpUrl(fields.url || '')}
              error={!isValidHttpUrl(fields.url || '') ? 'Invalid URL' : undefined}
            />
          </div>
        )}

        {type === LinkType.PHONE && (
          <div className={`w-full`}>
            <span className={labelClassName}>Phone Number</span>
            <Input
              type="tel"
              value={fields.phone}
              onChange={(e) => handleLinkTypeChange(type, { ...fields, phone: e.target.value })}
              placeholder="+1234567890"
            />
          </div>
        )}
      </div>

      {type === LinkType.EMAIL && (
        <div className={`${compact ? 'space-y-2' : 'space-y-4'}`}>
          <div>
            <span className={labelClassName}>Email to</span>
            <Input
              type="email"
              value={fields.email}
              onChange={(e) => handleLinkTypeChange(type, { ...fields, email: e.target.value })}
              placeholder="example@email.com"
            />
          </div>

          <div className="flex gap-2">
            <div className="w-1/2">
              <span className={labelClassName}>Subject</span>
              <Input
                value={fields.subject}
                onChange={(e) => handleLinkTypeChange(type, { ...fields, subject: e.target.value })}
                placeholder="Email subject"
              />
            </div>
            <div className="w-1/2">
              <span className={labelClassName}>Body</span>
              <Input
                value={fields.body}
                onChange={(e) => handleLinkTypeChange(type, { ...fields, body: e.target.value })}
                placeholder="Email body"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HrefEditor
