'use client'

import { Field, Label } from '@/app/components/fieldset'
import { Input } from '@/app/components/input'
import { Select } from '@/app/components/select'
import { Switch, SwitchField } from '@/app/components/switch'
import { getPhotoUrl } from '@/lib/utils/misc'
import { TrashIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'
import { IconButton } from '../icon-button'
import {
  COMMON_SOCIAL_ICONS,
  FOLDER_SPECIFIC_ICONS,
  SocialIconFolders,
  SocialIconName,
  SocialsBlock,
  SocialsBlockAttributes,
} from './types'

interface SocialIconsEditorProps {
  block: SocialsBlock
  onChange: (socials: SocialsBlockAttributes) => void
}

const SocialsEditor = ({ block, onChange }: SocialIconsEditorProps) => {
  const socialLinks = block.attributes.socialLinks
  const iconFolder = block.attributes.folder
  const validIcons = new Set([
    ...Object.keys(COMMON_SOCIAL_ICONS),
    ...Object.values(FOLDER_SPECIFIC_ICONS).flatMap((icons) => Object.keys(icons)),
  ])

  const [showAdvanced, setShowAdvanced] = useState<{ [key: string]: boolean }>({})

  const handleSocialLinkChange = (index: number, field: string, value: string) => {
    const updatedLinks = [...socialLinks]
    updatedLinks[index] = {
      ...updatedLinks[index],
      [field]: value,
    }
    onChange({ ...block.attributes, socialLinks: updatedLinks })
  }

  const handleAddSocial = (iconTitle: SocialIconName) => {
    const newSocial = {
      icon: iconTitle,
      title: iconTitle,
      alt: `Follow us on ${iconTitle}`,
      url: '/',
    }
    onChange({ ...block.attributes, socialLinks: [...socialLinks, newSocial] })
  }

  const handleDeleteSocial = (index: number) => {
    const updatedLinks = socialLinks.filter((_, i) => i !== index)
    onChange({ ...block.attributes, socialLinks: updatedLinks })
  }

  return (
    <div className="flex flex-col gap-4">
      <Field>
        <Label>Icon Style</Label>
        <Select
          value={iconFolder}
          onChange={(e) => onChange({ ...block.attributes, folder: e.target.value as SocialIconFolders })}
        >
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
            <div className="flex items-center gap-2">
              <img
                src={getPhotoUrl(`${link.title.toLowerCase()}.png`, iconFolder)}
                alt={link.alt}
                className="h-6 w-6"
              />
              <IconButton onClick={() => handleDeleteSocial(index)} disabled={socialLinks.length === 1}>
                <TrashIcon className="h-4 w-4 text-red-500" />
              </IconButton>
            </div>
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
          <div className="flex flex-col gap-4">
            {showAdvanced[index] && (
              <>
                <Field>
                  <Label>Alt Text</Label>
                  <Input
                    value={link.alt}
                    onChange={(e) => handleSocialLinkChange(index, 'alt', e.target.value)}
                    placeholder="Follow us on Facebook"
                  />
                </Field>
              </>
            )}

            <Field>
              <Label>URL</Label>
              <Input
                type="url"
                value={link.url}
                onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                placeholder="https://facebook.com/"
              />
            </Field>
          </div>
        </div>
      ))}

      <div className="mt-2">
        <Field>
          <Label>Add Social Icon</Label>
          <Select onChange={(e) => handleAddSocial(e.target.value as SocialIconName)} value="">
            <option value="" disabled>
              Select an icon to add...
            </option>
            {Array.from(validIcons)
              .sort()
              .map((icon) => (
                <option key={icon} value={icon}>
                  {icon}
                </option>
              ))}
          </Select>
        </Field>
      </div>
    </div>
  )
}

export default SocialsEditor
