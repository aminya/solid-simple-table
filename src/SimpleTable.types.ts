// util types
export type AnyObject = Record<string, any>
export type Renderable = any

// row and column types
export type Key = string
export type Row<K extends Key = string, V = any> = Record<K, V>

export type Column<K extends Key = string, V = any> = {
  id: K
  label?: string
  sortable?: boolean
  onClick?(e: MouseEvent, row: Row<K, V>): void
}

/** Sort direction.
  It is a tuple:
  @columnID is the key used for sorting
  @type is the direction of the sort
*/
export type NonNullSortDirection<K = Key> = [columnID: K, type: "asc" | "desc"]
export type SortDirection<K = Key> = NonNullSortDirection<K> | [columnID: null, type: null]

// Props
export type Props<K extends Key = string, V = any> = {
  // rows
  rows: Array<Row<K, V>>

  // Optional props:

  // columns

  // construct columns based on this row
  // (Defaults to 0 first row)
  representitiveRowNumber?: number

  // manually provided columns
  columns?: Array<Column<K, V>>

  // renderers
  headerRenderer?(column: Column): string | Renderable
  bodyRenderer?(row: Row, columnID: K): string | Renderable

  // styles
  style?: AnyObject
  className?: string

  // sort options
  defaultSortDirection?: NonNullSortDirection<K>
  rowSorter?(rows: Array<Row>, sortDirection: NonNullSortDirection<K>): Array<Row>

  // accessors

  /**
    set to true if you want column, row, and cell accessors
    @default false
  */
  accessors?: boolean

  /** a function that takes row and returns string unique key for that row
    @default {defaultGetRowID}
  */
  getRowID?(row: Row): string
}

// Component signals (states)
export type SortDirectionSignal<K extends Key = string> = SortDirection<K> | undefined
export type RowsSignal<K extends Key = string, V = any> = Array<Row<K, V>>
