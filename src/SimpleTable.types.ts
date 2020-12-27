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
  @direction is the direction of the sort
*/
export type NonNullSortDirection<K = Key> = [columnKey: K, direction: "asc" | "desc"]
export type SortDirection<K = Key> = NonNullSortDirection<K> | [columnKey: null, direction: null]

// Props
export type Props<K extends Key = string, V = any> = {
  // row and column
  rows: Array<Row<K, V>>
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

export type State<K extends Key = string> = {
  /** last clicked column.
   * If this is undefined it means no click has happened yet, and so the default order/sorting is used
   */
  sortedColumnKey?: K
  sortDirection?: SortDirection<K>
}
