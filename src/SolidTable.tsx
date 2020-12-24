// util types
type AnyObject = Record<string, any>
type Renderable = any

export type Column = { key: string; label: string; sortable?: boolean; onClick?(e: MouseEvent, row: AnyObject): void }
export type SortInfo = Array<{ column: string; type: "asc" | "desc" }>

export type Props = {
  rows: Array<AnyObject>
  columns: Array<Column>

  style?: AnyObject
  className?: string

  initialSort?: SortInfo
  sort(sortInfo: SortInfo, rows: Array<AnyObject>): Array<AnyObject>
  rowKey(row: AnyObject): string

  renderHeaderColumn(column: Column): string | Renderable
  renderBodyColumn(row: AnyObject, column: string): string | Renderable
}

export type State = { sort: SortInfo | null }

