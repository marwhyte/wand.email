'use client'

import { Field, Label } from '@/app/components/fieldset'
import { Input } from '@/app/components/input'
import { Select } from '@/app/components/select'
import { Switch, SwitchField } from '@/app/components/switch'
import { getBlockAttributes } from '@/lib/utils/attributes/attributes'
import { getPhotoUrl } from '@/lib/utils/misc'
import { TrashIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'
import { IconButton } from '../icon-button'
import {
  COMMON_SOCIAL_ICONS,
  Email,
  FOLDERS,
  RowBlock,
  SocialIconFolders,
  SocialIconName,
  SocialsBlock,
  SocialsBlockAttributes,
} from './types'
interface SocialIconsEditorProps {
  block: SocialsBlock
  onChange: (socials: SocialsBlockAttributes) => void
  parentRow: RowBlock
  email: Email
}

const SocialsEditor = ({ block, onChange, parentRow, email }: SocialIconsEditorProps) => {
  const socialsAttributes = getBlockAttributes(block, parentRow, email)
  const links = socialsAttributes.links
  const iconFolder = socialsAttributes.folder
  const validIcons = new Set([...Object.keys(COMMON_SOCIAL_ICONS)])

  const [showAdvanced, setShowAdvanced] = useState<{ [key: string]: boolean }>({})

  const handleSocialLinkChange = (index: number, field: string, value: string) => {
    const updatedLinks = [...links]
    updatedLinks[index] = {
      ...updatedLinks[index],
      [field]: value,
    }
    onChange({ ...block.attributes, links: updatedLinks })
  }

  const handleAddSocial = (iconTitle: SocialIconName) => {
    const newSocial = {
      icon: iconTitle,
      title: iconTitle,
      alt: `Follow us on ${iconTitle}`,
      url: '/',
    }
    onChange({ ...block.attributes, links: [...links, newSocial] })
  }

  const handleDeleteSocial = (index: number) => {
    const updatedLinks = links.filter((_, i) => i !== index)
    onChange({ ...block.attributes, links: updatedLinks })
  }

  return (
    <div className="flex flex-col gap-4">
      <Field>
        <Label>Icon Style</Label>
        <Select
          value={iconFolder}
          onChange={(e) => onChange({ ...block.attributes, folder: e.target.value as SocialIconFolders })}
        >
          {FOLDERS.map(({ name, title }) => (
            <option key={name} value={name}>
              {title}
            </option>
          ))}
        </Select>
      </Field>

      {links.map((link, index) => (
        <div key={index} className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src={getPhotoUrl(`${link.title.toLowerCase()}.png`, iconFolder)}
                alt={link.alt}
                className="h-6 w-6"
              />
              <IconButton title="Delete" onClick={() => handleDeleteSocial(index)} disabled={links.length === 1}>
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
                <Field labelPosition="top">
                  <Label>Alt Text</Label>
                  <Input
                    value={link.alt}
                    onChange={(e) => handleSocialLinkChange(index, 'alt', e.target.value)}
                    placeholder="Follow us on Facebook"
                  />
                </Field>
              </>
            )}

            <Field labelPosition="top">
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
              Icons
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
