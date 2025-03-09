'use client'

import { Button } from '@/app/components/button'
import { ColorInput } from '@/app/components/color-input'
import { Field, FieldGroup, Label } from '@/app/components/fieldset'
import { Input } from '@/app/components/input'
import LogoUploader from '@/app/components/logo-uploader'
import { Text } from '@/app/components/text'
import { addCompany, updateCompany } from '@/lib/database/queries/companies'
import { getFile } from '@/lib/database/queries/files'
import { Company, File } from '@/lib/database/types'
import { formatFileSize, getImgFromKey } from '@/lib/utils/misc'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { Dialog, DialogTitle } from './dialog'

interface CompanyDialogProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (company: Company) => void
  company?: Company | null
}

type FormData = Omit<Company, 'id' | 'user_id' | 'created_at'>

export default function CompanyDialog({ isOpen, onClose, onSuccess, company }: CompanyDialogProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    primary_color: '#000000',
    logo_file_id: '',
  })
  const [fileDetails, setFileDetails] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string
    logo?: string
  }>({})

  useEffect(() => {
    if (company) {
      setFormData(company)
    } else {
      setFormData({
        name: '',
        primary_color: '#000000',
        logo_file_id: '',
      })
    }
  }, [company])

  useEffect(() => {
    async function fetchFileDetails() {
      if (formData.logo_file_id) {
        const file = await getFile(formData.logo_file_id)
        if (file) {
          setFileDetails(file)
        }
      } else {
        setFileDetails(null)
      }
    }
    fetchFileDetails()
  }, [formData.logo_file_id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return
    setIsSubmitting(true)
    setFieldErrors({})

    try {
      if (!formData.name.trim()) {
        setFieldErrors((prev) => ({ ...prev, name: 'Please enter a company name' }))
        return
      }

      if (!formData.logo_file_id) {
        setFieldErrors((prev) => ({ ...prev, logo: 'Please upload a company logo' }))
        return
      }

      if (company) {
        const updatedCompany = await updateCompany(company.id, {
          name: formData.name,
          primaryColor: formData.primary_color ?? undefined,
          logoFileId: formData.logo_file_id ?? undefined,
        })
        if (updatedCompany) {
          onSuccess(updatedCompany)
          return
        }
      } else {
        const newCompany = await addCompany({
          name: formData.name,
          primaryColor: formData.primary_color ?? undefined,
          logoFileId: formData.logo_file_id ?? undefined,
        })
        if (newCompany) {
          onSuccess(newCompany)
          return
        }
      }
    } catch (error) {
      console.error('Failed to save company:', error)
      setFieldErrors({ name: 'Failed to save company' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog size="xl" open={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <DialogTitle className="mb-4 text-lg font-medium leading-6 text-zinc-900 dark:text-white">
          {company ? company.name : 'Create a new company'}
        </DialogTitle>

        <FieldGroup>
          <Field>
            <Label htmlFor="company_name">Company Name</Label>
            <Input
              id="company_name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={clsx('mt-1', fieldErrors.name && 'border-red-500')}
              required
            />
            {fieldErrors.name && <Text className="mt-1 !text-sm !text-red-500">{fieldErrors.name}</Text>}
          </Field>

          <Field>
            <Label>Company Logo</Label>
            <LogoUploader
              onUpload={(file) => {
                setFormData({ ...formData, logo_file_id: file.id })
                setFileDetails(file)
              }}
            />

            {fieldErrors.logo && <Text className="mt-1 !text-sm !text-red-500">{fieldErrors.logo}</Text>}
            {fileDetails?.image_key && (
              <div className="mt-2 flex">
                <div className="bg-checkerboard w-fit rounded-md p-2">
                  <img className="h-12 w-auto" src={getImgFromKey(fileDetails?.image_key)} alt="Logo" />
                </div>
                <div className="ml-2">
                  <Text className="max-w-[200px] truncate !text-sm font-bold">
                    {fileDetails?.file_name || formData.logo_file_id}
                  </Text>
                  <div>
                    <Text className="!text-xs text-gray-500">
                      {fileDetails?.size_bytes ? formatFileSize(fileDetails.size_bytes) : ''}
                    </Text>
                  </div>
                </div>
              </div>
            )}
          </Field>

          <Field>
            <Label htmlFor="primary_color">Primary Color</Label>
            <ColorInput
              showTransparent={false}
              className={clsx('mt-1')}
              id="primary_color"
              value={formData.primary_color ?? undefined}
              onChange={(value) => setFormData({ ...formData, primary_color: value })}
            />
          </Field>
        </FieldGroup>

        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" onClick={onClose} color="grey" disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" color="purple" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : company ? 'Save Changes' : 'Create Company'}
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
