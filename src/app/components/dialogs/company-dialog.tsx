'use client'

import { Button } from '@/app/components/button'
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

interface FormData {
  name: string
  logoFileId: string
  address: string
}

interface CompanyDialogProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (company: Company) => void
  company?: Company | null
}

export default function CompanyDialog({ isOpen, onClose, onSuccess, company }: CompanyDialogProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    logoFileId: '',
    address: '',
  })
  const [fileDetails, setFileDetails] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string
    logo?: string
  }>({})

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name,
        logoFileId: company.logoFileId || '',
        address: company.address || '',
      })
    } else {
      setFormData({
        name: '',
        logoFileId: '',
        address: '',
      })
    }
  }, [company])

  useEffect(() => {
    async function fetchFileDetails() {
      if (formData.logoFileId) {
        const file = await getFile(formData.logoFileId)
        if (file) {
          setFileDetails(file)
        }
      } else {
        setFileDetails(null)
      }
    }
    fetchFileDetails()
  }, [formData.logoFileId])

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

      if (!formData.logoFileId) {
        setFieldErrors((prev) => ({ ...prev, logo: 'Please upload a company logo' }))
        return
      }

      if (company) {
        const updatedCompany = await updateCompany(company.id, {
          name: formData.name,
          logoFileId: formData.logoFileId ?? undefined,
          address: formData.address ?? null,
        })
        if (updatedCompany) {
          onSuccess(updatedCompany)
          return
        }
      } else {
        const newCompany = await addCompany({
          name: formData.name,
          logoFileId: formData.logoFileId ?? undefined,
          address: formData.address ?? null,
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
          {company ? company.name : 'Create a new brand'}
        </DialogTitle>

        <FieldGroup>
          <Field>
            <Label htmlFor="company_name">
              Brand Name <span className="text-red-500">*</span>
            </Label>
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
            <Label>
              Brand Logo <span className="text-red-500">*</span>
            </Label>
            <LogoUploader
              onUpload={(file) => {
                setFormData({ ...formData, logoFileId: file.id })
                setFileDetails(file)
              }}
            />

            {fieldErrors.logo && <Text className="mt-1 !text-sm !text-red-500">{fieldErrors.logo}</Text>}
            {fileDetails?.imageKey && (
              <div className="mt-2 flex">
                <div className="w-fit rounded-md p-2">
                  <img
                    className={clsx(
                      'h-14 rounded-lg object-contain', // Scaled down from h-32 to h-21
                      fileDetails.width && fileDetails.height
                        ? fileDetails.width > fileDetails.height
                          ? 'w-auto' // Wider image
                          : fileDetails.width === fileDetails.height
                            ? 'w-21' // Scaled down from w-32 to w-21 for square image
                            : 'w-auto' // Taller image
                        : 'w-32' // Scaled down from w-48 to w-32 for default wider logo
                    )}
                    src={getImgFromKey(fileDetails?.imageKey)}
                    alt="Logo"
                  />
                </div>
                <div className="ml-2">
                  <Text className="max-w-[200px] truncate !text-sm font-bold">
                    {fileDetails?.fileName || formData.logoFileId}
                  </Text>
                  <div>
                    <Text className="!text-xs text-gray-500">
                      {fileDetails?.sizeBytes ? formatFileSize(fileDetails.sizeBytes) : ''}
                    </Text>
                    {fileDetails?.width && fileDetails?.height && (
                      <Text className="!text-xs text-gray-500">
                        {fileDetails.width} × {fileDetails.height}px
                      </Text>
                    )}
                  </div>
                </div>
              </div>
            )}
          </Field>

          <Field labelPosition="top">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address ?? ''}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
            <span className="pt-2 text-xs text-gray-500">
              A complete, valid mailing address where you are able to receive business mail is required on all
              commercial email communications in order to comply with anti-spam regulations in the US. This is a legal
              requirement for all commercial email communications.
            </span>
          </Field>
        </FieldGroup>

        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" onClick={onClose} color="grey" disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" color="purple" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : company ? 'Save Changes' : 'Create Brand'}
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
