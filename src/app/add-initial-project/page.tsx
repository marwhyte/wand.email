'use client'

import { addProject } from '@/lib/database/queries/projects'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const AddInitialProjectPage = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!loading) {
      const templateEmail = sessionStorage.getItem('template_email')
      if (templateEmail) {
        addProject('My first project', JSON.parse(templateEmail) as Email)
          .then((project) => {
            if (project) {
              router.push(`/projects/${project.id}`)
            }
          })
          .catch((error) => {
            console.error('Error adding project:', error)
          })
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading])

  return (
    <div className="flex h-screen flex-col items-center justify-center pb-36">
      <video controls={false} className="h-[200px] w-[200px]" autoPlay muted playsInline>
        <source src="/email-animation.webm" type="video/webm" />
        Your browser does not support the video tag.
      </video>
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Adding your new project...</h1>
      </div>
    </div>
  )
}

export default AddInitialProjectPage
