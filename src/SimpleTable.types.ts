import type { JSX } from "solid-js"

// util types
export type Renderable = any

export type IndexType = string | number

// row and column types
export type Row<K extends IndexType = IndexType> = number | string | Record<K, any>

export type Column<K extends IndexType = IndexType> = {
  id: K
  label?: string
  sortable?: boolean
  onClick?(e: MouseEvent, row: Row<K>): void
}

/**
 * Sort direction. It is a tuple:
 *
 * @type is The direction of the sort
 * @columnID is the key used for sorting
 */
export type NonNullSortDirection<K extends IndexType = IndexType> = [columnID: K, type: "asc" | "desc"]
export type SortDirection<K extends IndexType = IndexType> = NonNullSortDirection<K> | [columnID: null, type: null]

// Props
export type Props<K extends IndexType> = {
  // rows
  rows: Array<Row<K>>

  // Optional props:

  // columns

  // manually provided columns
  columns?: Array<Column<K>>

  /**
   * If columns is not provided and Row is an object, construct columns based on this row Takes this Row's keys as Column IDs
   *
   * @default 0 (first row)
   */
  representitiveRowNumber?: number

  // renderers
  headerRenderer?(column: Column): string | Renderable
  bodyRenderer?(row: Row<K>, columnID: K): string | Renderable

  // dynamic CSS classes
  /**
   * Optional function to get dynamic CSS class names for each column header cell.
   *
   * @param `Column` Object (same as for `headerRenderer`)
   * @returns `string` of CSS class names to be set for the `th` element of that column
   */
  headerCellClass?(column: Column): string
  /**
   * Optional function to get dynamic CSS class names for each body cell.
   *
   * @param Row Object, column ID (same as for bodyRenderer)
   * @returns String of CSS class names to be set for that cell's td element
   */
  bodyCellClass?(row: Row<K>, columnID: K): string

  // styles
  style?: JSX.CSSProperties | string
  className?: string

  // sort options
  defaultSortDirection?: NonNullSortDirection<K>
  rowSorter?(rows: Array<Row<K>>, sortDirection: NonNullSortDirection<K>): Array<Row<K>>

  // accessors

  /**
   * Set to true if you want column, row, and cell accessors
   *
   * @default false
   */
  accessors?: boolean

  /**
   * A function that takes row and returns string unique key for that row
   *
   * @default {defaultGetRowID}
   */
  getRowID?(row: Row<K>): string
}

// Component signals (states)
export type RowsSignal<K extends IndexType> = Array<Row<K>>
