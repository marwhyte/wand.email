import { CheckIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid'
import { cssTransition, ToastContainer } from 'react-toastify'

const toastAnimation = cssTransition({
  enter: 'animated fadeInRight',
  exit: 'animated fadeOutRight',
})

export function ChatToastContainer() {
  return (
    <ToastContainer
      closeButton={({ closeToast }) => {
        return (
          <button className="Toastify__close-button" onClick={closeToast}>
            <div className="i-ph:x text-lg" />
          </button>
        )
      }}
      icon={({ type }) => {
        /**
         * @todo Handle more types if we need them. This may require extra color palettes.
         */
        switch (type) {
          case 'success': {
            return <CheckIcon className="h-5 w-5 text-green-500" />
          }
          case 'error': {
            return <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
          }
        }

        return undefined
      }}
      position="bottom-right"
      pauseOnFocusLoss
      transition={toastAnimation}
    />
  )
}
