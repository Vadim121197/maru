import { CheckCircle2, UploadCloud } from 'lucide-react'
import { useDropzone, type DropzoneOptions } from 'react-dropzone'

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
      className='w-full bg-input border-[1px] py-4'
    >
      <input {...getInputProps()} />
      {file ? (
        <div className='flex flex-col items-center gap-1 px-10'>
          <CheckCircle2 className='w-6 h-6 text-primary' />
          <p className='text-sm font-normal break-all text-center'>{file.name}</p>
          <span onClick={open} className='mt-1 text-primary underline cursor-pointer'>
            Browse Files
          </span>
        </div>
      ) : (
        <div className='flex flex-col items-center gap-5'>
          <div>
            <UploadCloud className='w-6 h-6 text-primary' />
          </div>
          <p className='text-sm font-normal'>
            Drag and Drop here or{' '}
            <span onClick={open} className='text-primary underline cursor-pointer'>
              Browse Files
            </span>
          </p>
        </div>
      )}
    </div>
  )
}
