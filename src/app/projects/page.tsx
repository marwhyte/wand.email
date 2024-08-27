import { auth } from '@/auth'
import { addProject, getProjects } from '@/lib/database/queries/projects'
import { Button } from '@components/button'
import AddProjectButton from '@components/email-workspace/add-project-button'
import { Heading } from '@components/heading'
import Image from 'next/image'

export default async function ProjectsPage() {
  const session = await auth()
  console.log(session?.user)
  const projects = await getProjects()

  const createProject = () => {
    addProject('New Project')
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {projects.length === 0 ? (
        <div className="text-center">
          <Image
            width={256}
            height={256}
            src="/empty-projects.svg"
            alt="Start a new project"
            className="mx-auto mb-8"
          />
          <Heading level={1} className="mb-4">
            Let&apos;s Start Your First Project!
          </Heading>
          <p className="mb-6 text-gray-600">
            Ready to craft your first email? Choose a template or start from scratch to create a message that resonates
            with your audience.
          </p>

          <div className="flex justify-center gap-2">
            <Button color="blue" href="/templates">
              Browse Templates
            </Button>
            <AddProjectButton />
          </div>
        </div>
      ) : (
        <div>
          <h1>Projects</h1>
          <ul>
            {projects.map((project) => (
              <li key={project.id}>{project.title}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
