'use client'

import { Field, Label } from '@/app/components/fieldset'
import { Input } from '@/app/components/input'
import { Select } from '@/app/components/select'
import { Switch, SwitchField } from '@/app/components/switch'
import { getPhotoUrl } from '@/lib/utils/misc'
import { useState } from 'react'
import { SocialIconFolders } from './types'

interface SocialIconsEditorProps {
  socialLinks: Array<{
    title: string
    alt: string
    url: string
  }>
  iconFolder: SocialIconFolders
  onChange: (updates: {
    socialLinks?: Array<{
      title: string
      alt: string
      url: string
    }>
    iconFolder?: SocialIconFolders
  }) => void
}

const SocialIconsEditor = ({ socialLinks, iconFolder, onChange }: SocialIconsEditorProps) => {
  const [showAdvanced, setShowAdvanced] = useState<{ [key: string]: boolean }>({})

  const handleSocialLinkChange = (index: number, field: string, value: string) => {
    const updatedLinks = [...socialLinks]
    updatedLinks[index] = {
      ...updatedLinks[index],
      [field]: value,
    }
    onChange({ socialLinks: updatedLinks })
  }

  return (
    <div className="flex flex-col gap-4">
      <Field>
        <Label>Icon Style</Label>
        <Select value={iconFolder} onChange={(e) => onChange({ iconFolder: e.target.value as SocialIconFolders })}>
          <option value="socials-blue">Blue</option>
          <option value="socials-color">Color</option>
          <option value="socials-dark-gray">Dark Gray</option>
          <option value="socials-dark-round">Dark Round</option>
          <option value="socials-dark">Dark</option>
          <option value="socials-outline-black">Outline Black</option>
          <option value="socials-outline-color">Outline Color</option>
          <option value="socials-outline-gray">Outline Gray</option>
          <option value="socials-outline-white">Outline White</option>
          <option value="socials-white">White</option>
        </Select>
      </Field>

      {socialLinks.map((link, index) => (
        <div key={index} className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
          <div className="mb-4 flex items-center justify-between">
            <img src={getPhotoUrl(`${link.title.toLowerCase()}.png`, iconFolder)} alt={link.alt} className="h-6 w-6" />
            <SwitchField>
              <Label>Advanced</Label>
              <Switch
                checked={showAdvanced[index] || false}
                onChange={(checked) => {
                  setShowAdvanced((prev) => ({ ...prev, [index]: checked }))
                }}
              />
            </SwitchField>
          </div>

          {showAdvanced[index] && (
            <>
              <Field>
                <Label>Title</Label>
                <Input value={link.title} onChange={(e) => handleSocialLinkChange(index, 'title', e.target.value)} placeholder="Facebook" />
              </Field>
              <Field>
                <Label>Alt Text</Label>
                <Input value={link.alt} onChange={(e) => handleSocialLinkChange(index, 'alt', e.target.value)} placeholder="Follow us on Facebook" />
              </Field>
            </>
          )}

          <Field>
            <Label>URL</Label>
            <Input type="url" value={link.url} onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)} placeholder="https://facebook.com/" />
          </Field>
        </div>
      ))}
    </div>
  )
}

export default SocialIconsEditor
