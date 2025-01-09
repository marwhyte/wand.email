'use client'

import { updateOnboardingUser } from '@/lib/database/queries/users'
import { BusinessType, File, User } from '@/lib/database/types'
import { formatFileSize, getImgFromKey } from '@/lib/utils/misc'
import { getBusinessTypeOptions } from '@/lib/utils/options'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '../button'
import { ColorInput } from '../color-input'
import { Field, Label } from '../fieldset'
import { Input } from '../input'
import ListBox from '../list-box'
import LogoUploader from '../logo-uploader'
import { Steps } from '../steps'
import { Text } from '../text'

type Props = {
  logo: File | null
  user: User | null
}

export const OnboardingSteps = ({ logo, user }: Props) => {
  const [businessType, setBusinessType] = useState<BusinessType | null>(
    user?.business_type ?? (localStorage.getItem('businessType') as BusinessType)
  )
  const router = useRouter()
  const [primaryColor, setPrimaryColor] = useState<string | null>(user?.primary_color ?? '#3B82F6')
  const [secondaryColor, setSecondaryColor] = useState<string | null>(user?.secondary_color ?? '#93C5FD')
  const [customTheme, setCustomTheme] = useState<string>('')

  const [logoFile, setLogoFile] = useState<File | null>(logo ?? null)

  useEffect(() => {
    if (logo) {
      setLogoFile(logo)
    }
  }, [logo])

  const businessTypeOptions = getBusinessTypeOptions()

  useEffect(() => {
    // Load businessType from localStorage if user is null
    if (!user) {
      const storedBusinessType = localStorage.getItem('businessType')
      if (storedBusinessType) {
        setBusinessType(storedBusinessType as BusinessType)
      }
    }
  }, [user])

  const handleSubmit = async (formData: FormData) => {
    if (user) {
      await updateOnboardingUser({
        businessType: businessType,
        primaryColor: primaryColor,
        secondaryColor: secondaryColor,
        themes: selectedThemes,
      })
    } else {
      if (businessType) {
        localStorage.setItem('businessType', businessType)
      }
      if (logoFile) {
        localStorage.setItem('logoFileId', logoFile.id)
      }
      if (primaryColor) {
        localStorage.setItem('primaryColor', primaryColor)
      }
      if (secondaryColor) {
        localStorage.setItem('secondaryColor', secondaryColor)
      }
    }
  }

  const [selectedThemes, setSelectedThemes] = useState<string[]>(user?.themes ?? [])
  const [themeOptions, setThemeOptions] = useState<string[]>([
    'Elegant',
    'Simple',
    'Modern',
    'Classic',
    'Minimalist',
    'Bold',
    'Playful',
    'Professional',
    'Creative',
    'Traditional',
  ])

  const handleAddCustomTheme = () => {
    if (customTheme.length > 0) {
      setThemeOptions((prev) => [...prev, customTheme])
      setSelectedThemes((prev) => [...prev, customTheme])
      setCustomTheme('')
    }
  }

  return (
    <form action={handleSubmit}>
      <Steps
        height="500px"
        onFinish={async () => {
          if (user) {
            await updateOnboardingUser({ isOnboarded: true })
            router.push('/templates?onboarding-complete=true')
          } else {
            localStorage.setItem('is_onboarded', 'true')
            router.push('/templates?onboarding-complete=true')
          }
        }}
        steps={[{ name: 'About' }, { name: 'Branding' }, { name: 'Theme' }]}
      >
        {(currentStep) => (
          <div>
            <Text className="mb-6 text-center text-lg font-semibold">
              These questions are optional, but they help create a more personalized experience.
            </Text>

            {currentStep.name === 'About' && (
              <Field className="mt-24">
                <Label className="!text-lg font-semibold">How would you describe your business?</Label>
                <ListBox
                  options={businessTypeOptions}
                  selected={
                    businessType
                      ? {
                          label: businessTypeOptions.find((option) => option.id === businessType)?.label ?? '',
                          id: businessType,
                        }
                      : null
                  }
                  setSelected={(option) => setBusinessType(option.id as BusinessType)}
                />
                <input type="hidden" name="businessType" value={businessType ?? ''} />
              </Field>
            )}

            {currentStep.name === 'Branding' && (
              <div>
                <div className="mb-2 flex items-center justify-between gap-2">
                  <Text className="!text-xl font-bold">Logo</Text>
                  <LogoUploader
                    onUpload={(file) => {
                      localStorage.setItem('logoFileId', file.id)
                      if (user) {
                        updateOnboardingUser({ logoFileId: file.id })
                      }
                      setLogoFile(file)
                    }}
                  />
                </div>
                {logoFile && (
                  <div className="mt-2 flex">
                    <div className="bg-checkerboard w-fit rounded-md p-2">
                      <img className="h-12 w-auto" src={getImgFromKey(logoFile.image_key)} alt="Logo" />
                    </div>
                    <div className="ml-2">
                      <Text className="max-w-[200px] truncate !text-sm font-bold">{logoFile.file_name}</Text>
                      <div>
                        <Text className="!text-xs text-gray-500">{formatFileSize(logoFile.size_bytes)}</Text>
                      </div>
                    </div>
                  </div>
                )}
                <div className="mt-8">
                  <Text className="!text-xl font-bold">Colors</Text>
                  <Field className="mb-2 flex items-center gap-2">
                    <Label className="mr-6 mt-2">Primary</Label>
                    <div className="flex-grow">
                      <ColorInput value={primaryColor ?? ''} onChange={(color) => setPrimaryColor(color)} />
                    </div>
                  </Field>
                  <Field className="flex items-center gap-2">
                    <Label className="mr-1 mt-2">Secondary</Label>
                    <div className="flex-grow">
                      <ColorInput value={secondaryColor ?? ''} onChange={(color) => setSecondaryColor(color)} />
                    </div>
                  </Field>
                </div>
              </div>
            )}

            {currentStep.name === 'Theme' && (
              <div className="space-y-6">
                <Text className="!text-xl font-bold">Select Your Themes</Text>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Add custom..."
                    value={customTheme}
                    onChange={(e) => setCustomTheme(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddCustomTheme()
                      }
                    }}
                  />
                  <Button
                    disabled={customTheme.length === 0}
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      e.preventDefault()
                      handleAddCustomTheme()
                    }}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {themeOptions.map((theme) => (
                    <button
                      key={theme}
                      type="button"
                      onClick={() => {
                        setSelectedThemes((prev) =>
                          prev.includes(theme) ? prev.filter((t) => t !== theme) : [...prev, theme]
                        )
                      }}
                      className={`rounded-full px-4 py-2 text-sm transition-colors ${
                        selectedThemes.includes(theme) ? 'bg-purple-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {theme}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Steps>
    </form>
  )
}
