import { auth } from '@/auth'
import { getProjects } from '@/lib/database/queries/projects'
import { joinClassNames } from '@/lib/utils/misc'
import { Button } from '@components/button'
import AddProjectButton from '@components/email-workspace/add-project-button'
import { Heading } from '@components/heading'
import Image from 'next/image'
import Link from 'next/link'
import ProjectDropdown from '../components/email-workspace/project-dropdown'

export default async function ProjectsPage() {
  const session = await auth()
  console.log(session?.user)
  const projectsData = await getProjects()

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {projectsData.length === 0 ? (
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
          <h2 className="text-sm font-medium text-gray-500">My Projects</h2>
          <ul role="list" className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {projectsData.map((project, index) => (
              <li key={project.title} className="col-span-1 rounded-md shadow-sm">
                <Link
                  href={`/projects/${project.id}`}
                  key={project.title}
                  className="col-span-1 flex rounded-md shadow-sm transition-shadow duration-200 ease-in-out hover:shadow-md"
                >
                  <div
                    className={joinClassNames(
                      [
                        'bg-red-500',
                        'bg-blue-500',
                        'bg-green-500',
                        'bg-yellow-500',
                        'bg-purple-500',
                        'bg-pink-500',
                        'bg-indigo-500',
                        'bg-teal-500',
                      ][index % 8],
                      'flex w-16 flex-shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white'
                    )}
                  >
                    {project.title
                      .split(' ')
                      .slice(0, 2)
                      .map((word) => word[0])
                      .join('')}
                  </div>
                  <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-b border-r border-t border-gray-200 bg-white">
                    <div className="flex-1 truncate px-4 py-2 text-sm">
                      <p className="font-medium text-gray-900 hover:text-gray-600">{project.title}</p>
                      <p className="text-gray-500">{project.content.rows.length} Rows</p>
                    </div>
                    <ProjectDropdown project={project} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
