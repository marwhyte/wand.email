'use client'

import { SortFunction, sortItems, useSortPreference } from '@/app/hooks/useSortPreference'
import { joinClassNames } from '@/lib/utils/misc'
import { ArrowsUpDownIcon } from '@heroicons/react/16/solid'
import { CalendarIcon, DocumentTextIcon, PencilIcon, TableCellsIcon } from '@heroicons/react/24/outline'
import { Dropdown, DropdownButton, DropdownItem, DropdownMenu } from '../dropdown'
import { Link } from '../link'
import AddProjectButton from './add-project-button'
import ProjectDropdown from './project-dropdown'

type SortKey = 'created_at' | 'updated_at' | 'title' | 'row_count'

type SortAttributes = {
  icon: React.ReactNode
  label: string
}

export default function SortedProjectsList({ projects }: { projects: Project[] }) {
  const [sortPreference, setSortKey] = useSortPreference<SortKey>('projectSort', {
    key: 'created_at',
    direction: 'desc',
  })

  const customSorts: Record<string, SortFunction<Project>> = {
    row_count: (a, b, direction) => {
      const aCount = a.content.rows.length
      const bCount = b.content.rows.length
      return direction === 'asc' ? aCount - bCount : bCount - aCount
    },
    // Add more custom sorts here if needed
  }

  const sortedProjects = sortItems(projects, sortPreference, customSorts)

  const sortAttributes = [
    { icon: <CalendarIcon className="h-4 w-4" />, label: 'Created date', value: 'created_at' },
    { icon: <PencilIcon className="h-4 w-4" />, label: 'Updated date', value: 'updated_at' },
    { icon: <DocumentTextIcon className="h-4 w-4" />, label: 'Alphabetical', value: 'title' },
    { icon: <TableCellsIcon className="h-4 w-4" />, label: 'Row count', value: 'row_count' },
  ]

  const currentSort = sortAttributes.find((attr) => attr.value === sortPreference.key) as SortAttributes

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <Dropdown>
          <DropdownButton color="white">
            {currentSort.icon}
            {currentSort.label}
            <ArrowsUpDownIcon aria-hidden="true" />
          </DropdownButton>
          <DropdownMenu>
            {sortAttributes.map((attr) => (
              <DropdownItem key={attr.value} onClick={() => setSortKey(attr.value as SortKey)}>
                {attr.icon}
                {attr.label}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
        <AddProjectButton color="blue" />
      </div>
      <h2 className="text-sm font-medium text-gray-500">My Projects</h2>

      <ul role="list" className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        {sortedProjects.map((project, index) => (
          <li key={project.id} className="col-span-1 rounded-md shadow-sm">
            <Link
              href={`/projects/${project.id}`}
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
  )
}
