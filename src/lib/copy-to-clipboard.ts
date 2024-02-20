import { toast } from 'react-toastify'

export const copyToClipboard = (t: string) => () => {
  void (async () => {
    await navigator.clipboard.writeText(t)
    toast.success('Copied', { autoClose: 150 })
  })()
}
