'use client'

import { Field, FieldGroup, Label } from '@/app/components/fieldset'
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
}

const HrefEditor = ({ href, onChange }: HrefEditorProps) => {
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

  return (
    <FieldGroup>
      <Field labelPosition="top">
        <Label>Link Type</Label>
        <Select
          value={type}
          onChange={(e) => {
            const newType = e.target.value as LinkType
            const newFields = getLinkTypeFields(newType, '')
            handleLinkTypeChange(newType, newFields)
          }}
        >
          <option value={LinkType.WEB}>Open Web Page</option>
          <option value={LinkType.EMAIL}>Send Email</option>
          <option value={LinkType.PHONE}>Call Phone Number</option>
        </Select>
      </Field>

      {type === LinkType.EMAIL && (
        <>
          <Field labelPosition="top">
            <Label>Email to</Label>
            <Input
              type="email"
              value={fields.email}
              onChange={(e) => handleLinkTypeChange(type, { ...fields, email: e.target.value })}
              placeholder="example@email.com"
            />
          </Field>
          <Field labelPosition="top">
            <Label>Subject</Label>
            <Input
              value={fields.subject}
              onChange={(e) => handleLinkTypeChange(type, { ...fields, subject: e.target.value })}
              placeholder="Email subject"
            />
          </Field>
          <Field labelPosition="top">
            <Label>Body</Label>
            <Input
              value={fields.body}
              onChange={(e) => handleLinkTypeChange(type, { ...fields, body: e.target.value })}
              placeholder="Email body"
            />
          </Field>
        </>
      )}

      {type === LinkType.PHONE && (
        <Field labelPosition="top">
          <Label>Phone Number</Label>
          <Input
            type="tel"
            value={fields.phone}
            onChange={(e) => handleLinkTypeChange(type, { ...fields, phone: e.target.value })}
            placeholder="+1234567890"
          />
        </Field>
      )}

      {type === LinkType.WEB && (
        <Field labelPosition="top">
          <Label>URL</Label>
          <Input
            type="url"
            value={fields.url}
            onChange={(e) => handleLinkTypeChange(type, { ...fields, url: e.target.value })}
            placeholder="https://example.com"
            pattern="https?://.*"
            title="Please enter a valid URL (e.g. https://example.com)"
            invalid={!isValidHttpUrl(fields.url || '')}
            error={
              !isValidHttpUrl(fields.url || '') ? 'Please enter a valid URL (e.g. https://example.com)' : undefined
            }
          />
        </Field>
      )}
    </FieldGroup>
  )
}

export default HrefEditor
