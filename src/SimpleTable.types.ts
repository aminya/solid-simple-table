// util types
export type AnyObject = Record<string, any>
export type Renderable = any

// row and column types
export type Key = string
export type Row<K extends Key = string, V = any> = Record<K, V>

export type Column<K extends Key = string, V = any> = {
  key: K
  label?: string
  sortable?: boolean
  onClick?(e: MouseEvent, row: Row<K, V>): void
}

/** Sort direction.
  It is a tuple:
  @columnKey is the key used for sorting
  @type is the direction of the sort
*/
export type NonNullSortDirection<K = Key> = [columnKey: K, type: "asc" | "desc"]
export type SortDirection<K = Key> = NonNullSortDirection<K> | [columnKey: null, type: null]

// Props
export type Props<K extends Key = string, V = any> = {
  // row
  rows: Array<Row<K, V>>

  // Optional props:

  // columns
  columns?: Array<Column<K, V>>

  // renderers
  headerRenderer?(column: Column): string | Renderable
  bodyRenderer?(row: Row, columnKey: K): string | Renderable

  // styles
  style?: AnyObject
  className?: string

  // sort options
  defaultSortDirection?: NonNullSortDirection<K>
  rowSorter?(rows: Array<Row>, sortDirection: NonNullSortDirection<K>): Array<Row>

  /** a function that takes row and returns string unique key for that row */
  rowKey?(row: Row): string
}

// Component signals (states)
export type SortDirectionSignal<K extends Key = string> = SortDirection<K> | undefined
export type RowsSignal<K extends Key = string, V = any> = Array<Row<K, V>>
