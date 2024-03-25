import { toast } from 'react-toastify'

import type { AxiosError } from 'axios'

export const showErrorToast = (error: unknown) => {
  const err = error as AxiosError

  const errData = err.response?.data as { detail: string | undefined } | undefined

  toast.error(errData?.detail ?? `${err.message} (${err.config?.url}, ${err.config?.method})`)
}
