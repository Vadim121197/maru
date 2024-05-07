import { useDropzone, type DropzoneOptions } from 'react-dropzone'

import { CheckCircle2, UploadCloud } from 'lucide-react'

export const Dropzone = ({ file, onDrop }: { file: File | undefined; onDrop: DropzoneOptions['onDrop'] }) => {
  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
  })

  return (
    <div
      {...getRootProps()}
      onClick={(e) => {
        e.stopPropagation()
      }}
      className='w-full border-DEFAULT bg-input py-4'
    >
      <input {...getInputProps()} />
      {file ? (
        <div className='flex flex-col items-center gap-1 px-10'>
          <CheckCircle2 className='size-6 text-primary' />
          <p className='break-all text-center text-sm font-normal'>{file.name}</p>
          <span onClick={open} className='mt-1 cursor-pointer text-primary underline'>
            Browse Files
          </span>
        </div>
      ) : (
        <div className='flex flex-col items-center gap-5'>
          <div>
            <UploadCloud className='size-6 text-primary' />
          </div>
          <p className='text-sm font-normal'>
            Drag and Drop here or{' '}
            <span onClick={open} className='cursor-pointer text-primary underline'>
              Browse Files
            </span>
          </p>
        </div>
      )}
    </div>
  )
}
