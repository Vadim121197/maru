export interface Pagination<T> {
  page_number: number
  page_size: number
  total_items: number
  total_pages: number
  data: T
}
