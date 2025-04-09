import { classNames } from '@/lib/utils/misc'

const Loading = () => {
  return (
    <div className="mx-auto w-full">
      {/* Skeleton header */}
      <div className="z-100 flex min-h-[71px] w-full items-center justify-between border-b border-gray-200 bg-white px-4 py-4 pt-5">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-24 animate-pulse rounded bg-gray-200"></div>
        </div>
        <div className="absolute left-1/2 h-5 w-48 -translate-x-1/2 animate-pulse rounded bg-gray-200"></div>
        <div className="flex items-center space-x-4">
          <div className="h-9 w-24 animate-pulse rounded bg-gray-200"></div>
          <div className="h-9 w-20 animate-pulse rounded bg-gray-200"></div>
          <div className="h-9 w-24 animate-pulse rounded-md bg-gray-300"></div>
        </div>
      </div>

      <div className="flex flex-1">
        <div className="relative mx-auto flex w-full items-center overflow-hidden" data-chat-visible={true}>
          <div className={classNames(`-mb-2 flex w-full justify-center`)}>
            {/* Chat section */}
            <div className="flex w-[370px] min-w-[370px] max-w-[370px] shrink-0 flex-col border-r border-gray-200">
              <div className="flex flex-col px-6 pt-6">
                <div className="relative flex h-[calc(100vh-100px)] flex-col justify-end pb-6">
                  {/* Loading messages */}
                  <div className="z-1 mx-auto flex h-full w-full max-w-[552px] flex-col space-y-6 pb-6">
                    <div className="flex animate-pulse flex-col space-y-2">
                      <div className="h-4 w-3/4 rounded bg-gray-200"></div>
                      <div className="h-4 w-1/2 rounded bg-gray-200"></div>
                      <div className="h-4 w-5/6 rounded bg-gray-200"></div>
                    </div>
                    <div className="flex animate-pulse flex-col space-y-2">
                      <div className="h-4 w-2/3 rounded bg-gray-200"></div>
                      <div className="h-4 w-3/4 rounded bg-gray-200"></div>
                      <div className="h-4 w-1/2 rounded bg-gray-200"></div>
                    </div>
                  </div>
                </div>

                {/* Loading input area */}
                <div className="mt-4 flex items-end rounded-lg border border-gray-300 bg-white p-2">
                  <div className="h-10 w-full animate-pulse rounded bg-gray-100"></div>
                </div>
              </div>
            </div>

            {/* Workspace section */}
            <div className="w-full overflow-auto">
              <div className="flex items-center justify-center" style={{ height: 'calc(100vh - 65px)' }}>
                <div className="text-center">
                  <div className="border-primary mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-t-2"></div>
                  <p className="text-gray-500">Loading email content...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Loading
