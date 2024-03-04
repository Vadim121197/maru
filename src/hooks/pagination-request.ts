'use client'

import { useEffect, useState } from 'react'

import axios from 'axios'

import type { PaginationGeneric } from '~/types/pagination'

import useAxiosAuth from './axios-auth'

export const usePaginationRequest = <T>(url: string, setData: (tasks: T[]) => void) => {
  const axiosAuth = useAxiosAuth()

  const [loading, setLoading] = useState<boolean | undefined>()
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)

  useEffect(() => {
    const source = axios.CancelToken.source()

    setLoading(true)

    void (async () => {
      try {
        const {
          data: { data, page_number, total_pages },
        } = await axiosAuth.get<PaginationGeneric<T[]>>(url + `?page_size=10&page_number=${currentPage}`, {
          cancelToken: source.token,
        })

        setCurrentPage(page_number)
        setTotalPages(total_pages)

        setData(data)
        setLoading(false)
      } catch (error) {
        setLoading(false)
      }
    })()

    return () => {
      // Cancel the request when the component unmounts
      source.cancel()
    }
  }, [url, axiosAuth, currentPage, setData])

  return { loading, currentPage, totalPages, setCurrentPage }
}
