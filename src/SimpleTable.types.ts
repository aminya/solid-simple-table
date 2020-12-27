// util types
export type AnyObject = Record<string, any>
export type Renderable = any

// row and column types
export type Key = string
export type Row<K extends Key = string, V = any> = Record<K, V>

export type Column<K extends Key = string, V = any> = {
  key: K
  label: string
  sortable?: boolean
  onClick?(e: MouseEvent, row: Row<K, V>): void
}

// sort info
export type SortDirection<K = Key> = Map<K, "asc" | "desc">

// Props
export type Props<K extends Key = string, V = any> = {
  // row and column
  rows: Array<Row<K, V>>
  columns: Array<Column<K, V>>

  // renderers
  headerRenderer?(column: Column): string | Renderable
  bodyRenderer?(row: Row, columnKey: K): string | Renderable

  // styles
  style?: AnyObject
  className?: string

  // sort options
  initialSortDirection?: SortDirection<K>
  rowSorter(rows: Array<Row>, columnKey: K, sortDirection: SortDirection<K>): Array<Row>

  /** a function that takes row and returns string unique key for that row */
  rowKey?(row: Row): string
}

export type State<K extends Key = string> = { lastClickedColumnKey?: K, sortDirection?: SortDirection<K> }
