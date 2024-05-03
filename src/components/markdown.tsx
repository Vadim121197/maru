import ReactMarkdown from 'react-markdown'

import { Copy } from 'lucide-react'

import { copyToClipboard } from '~/lib/copy-to-clipboard'

export const Markdown = ({ markdown }: { markdown: string }) => {
  return (
    <ReactMarkdown
      className='w-[100%]'
      components={{
        p: ({ children }) => <p className='mb-4 text-base font-medium text-[#CEC5C5]'>{children}</p>,
        h1: ({ children }) => (
          <h1 className='mb-4 mt-6 border-b border-border pb-[.3em] text-[2em] leading-[1.25]  text-[#CEC5C5]'>
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className='mb-4 mt-6 border-b border-border pb-[.3em] text-[1.5em] leading-[1.25] text-[#CEC5C5]'>
            {children}
          </h2>
        ),
        h3: ({ children }) => <h3 className='mb-4 mt-6 text-[1.25em] leading-[1.25] text-[#CEC5C5]'>{children}</h3>,
        h4: ({ children }) => <h4 className='mb-4 mt-6 text-[1em] leading-[1.25] text-[#CEC5C5]'>{children}</h4>,
        h5: ({ children }) => <h5 className='mb-4 mt-6 text-[.875em] leading-[1.25] text-[#CEC5C5]'>{children}</h5>,
        h6: ({ children }) => <h6 className='mb-4 mt-6 text-[.85em] leading-[1.25] text-[#CEC5C5]'>{children}</h6>,
        ol: ({ children }) => (
          <ol className='max-w-md list-inside list-decimal space-y-1 text-[#CEC5C5]'>{children}</ol>
        ),
        ul: ({ children }) => <ul className='max-w-md list-inside list-disc space-y-1 text-[#CEC5C5]'>{children}</ul>,
        li: ({ children }) => <li className='text-[#CEC5C5]'>{children}</li>,
        a: ({ children, href }) => (
          <a target='_blank' rel='noopener noreferrer' href={href} className='break-all text-primary underline'>
            {children}
          </a>
        ),
        code: ({ children }) => (
          <code className='rounded-[6px] bg-[#6e768166] p-1 text-[85%] text-[#CEC5C5]'>{children}</code>
        ),
        pre: ({ children }) => {
          const content = (
            children as {
              props?: {
                children?: string
              }
            }
          ).props?.children

          return (
            <div className='relative my-2 overflow-auto'>
              <div className='absolute right-4 top-4'>
                <Copy className='size-4 cursor-pointer' onClick={copyToClipboard(content ?? '')} />
              </div>
              <pre className='block min-h-[52px] overflow-x-auto rounded-[6px] bg-[#161b22] px-4 pb-2 pt-8 text-[85%] leading-[1.45]'>
                {content ?? ''}
              </pre>
            </div>
          )
        },
      }}
    >
      {markdown}
    </ReactMarkdown>
  )
}
