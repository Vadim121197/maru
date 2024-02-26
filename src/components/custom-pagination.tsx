import type { Dispatch, SetStateAction } from 'react'
import { cn } from '~/lib/utils'
import { DOTS, usePagination } from '~/hooks/pagination'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from './ui/pagination'

export const CustomPagination = ({
  currentPage,
  totalPages,
  setCurrentPage,
}: {
  currentPage: number
  totalPages: number
  setCurrentPage: Dispatch<SetStateAction<number>>
}) => {
  const paginationRange = usePagination({
    currentPage,
    totalPages,
  })

  const onNext = () => {
    setCurrentPage((state) => state + 1)
  }

  const onPrevious = () => {
    setCurrentPage((state) => state - 1)
  }

  return (
    <Pagination>
      <PaginationContent className='gap-3'>
        <PaginationItem>
          <button disabled={currentPage === 1}>
            <PaginationPrevious onClick={onPrevious} />
          </button>
        </PaginationItem>
        {paginationRange &&
          paginationRange.map((pageNumber, index) => {
            // If the pageItem is a DOT, render the DOTS unicode character
            if (pageNumber === DOTS) {
              return (
                <PaginationItem key={index}>
                  <PaginationEllipsis />
                </PaginationItem>
              )
            }

            // Render our Page Pills
            return (
              <PaginationItem
                key={index}
                onClick={() => {
                  setCurrentPage(pageNumber)
                }}
                className={cn(
                  'text-base font-medium p-1 text-muted-foreground min-w-8 h-8 text-center cursor-pointer',
                  currentPage === pageNumber && 'border-primary border-[1px] text-muted',
                )}
              >
                {pageNumber}
              </PaginationItem>
            )
          })}
        <PaginationItem>
          <button disabled={currentPage === totalPages}>
            <PaginationNext onClick={onNext} />
          </button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
