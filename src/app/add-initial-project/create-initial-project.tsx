'use client'

import { addProject } from '@/lib/database/queries/projects'
import router from 'next/router'
import { useEffect, useState } from 'react'

type Props = {
  projects: Project[]
}

const CreateInitialProject = ({ projects }: Props) => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // check if there are any recent projects (last 5 seconds)
    const recentProjects = projects.filter((project) => {
      return new Date(project.created_at).getTime() > Date.now() - 5000
    })

    if (recentProjects.length > 0) return

    let ignore = false

    if (!ignore) {
      const templateEmail = sessionStorage.getItem('template_email')
      if (templateEmail) {
        addProject('My first project', JSON.parse(templateEmail) as Email)
          .then((project) => {
            if (project && !ignore) {
              router.push(`/projects/${project.id}`)
            }
          })
          .catch((error) => {
            if (!ignore) {
              console.error('Error adding project:', error)
            }
          })
      }
    }

    return () => {
      ignore = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}

export default CreateInitialProject
