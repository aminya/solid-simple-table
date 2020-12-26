import { createState } from "solid-js"
import "./SimpleTable.css"

// util types
export type AnyObject = Record<string, any>
type Renderable = any

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
export type SortInfo<K = Key> = Array<{ columnKey: K; type: "asc" | "desc" }>

// Props
export type Props<K extends Key = string, V = any> = {
  // row and column
  rows: Array<Row<K, V>>
  columns: Array<Column<K, V>>

  // renderers
  headerRenderer(column: Column): string | Renderable
  bodyRenderer(row: Row, columnKey: K): string | Renderable

  // styles
  style?: AnyObject
  className?: string

  // sort options
  initialSort?: SortInfo<K>
  sort(sortInfo: SortInfo<K>, rows: Array<Row>): Array<Row>

  /** a function that takes row and returns string unique key for that row */
  rowKey(row: Row): string
}

export type State = { sort: SortInfo | null }

export function SimpleTable(props: Props) {
  const [state, setState] = createState<State>({ sort: null })

  function getSortInfo(): SortInfo {
    return state.sort || props.initialSort || []
  }

  function generateSortCallback(column: string) {
    return (e: MouseEvent) => {
      const sortInfo = getSortInfo()
      const append = e.shiftKey
      clickHandler(sortInfo, column, append)
      setState({ sort: sortInfo })
    }
  }

  const {
    rows: givenRows,
    columns,
    className = "",
    rowKey,
    sort,
    headerRenderer = defaultHeaderRenderer,
    bodyRenderer = defaultBodyRenderer,
  } = props

  let rows = givenRows
  const sortInfo = getSortInfo()

  if (sortInfo.length) {
    rows = sort(sortInfo, rows)
  }

  return (
    <table className={`solid-simple-table ${className}`} style={props.style}>
      <thead>
        <tr>
          {columns.map((column) => (
            <th
              key={column.key}
              className={column.sortable ? "sortable" : undefined}
              onClick={column.sortable ? generateSortCallback(column.key) : undefined}
            >
              {headerRenderer(column)} {column.sortable && renderHeaderIcon(getSortInfo(), column.key)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map(function (row) {
          const key = rowKey(row)
          return (
            <tr key={key}>
              {columns.map(function (column) {
                const givenOnClick = column.onClick
                const onClick =
                  givenOnClick &&
                  function (e: MouseEvent) {
                    givenOnClick(e, row)
                  }

                return (
                  <td onClick={onClick} key={`${key}.${column.key}`}>
                    {bodyRenderer(row, column.key)}
                  </td>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

const ARROW = {
  UP: "↑",
  DOWN: "↓",
  BOTH: "⇅",
}

function defaultHeaderRenderer(item: any) {
  if (typeof item !== "string") {
    throw new Error("Non-string header array fed to solid-simple-table without headerRenderer prop")
  }
  return item
}

function defaultBodyRenderer(row: Row, columnKey: Key) {
  const value = row[columnKey]
  if (typeof value !== "string") {
    throw new Error("Non-predictable rows fed to solid-simple-table without bodyRenderer prop")
  }
  return value
}

function findSortItemByKey(sortInfo: SortInfo, columnKey: Key): number {
  if (Array.isArray(sortInfo)) {
    for (let i = 0, length = sortInfo.length; i < length; ++i) {
      if (sortInfo[i].columnKey === columnKey) {
        return i
      }
    }
  }
  return -1
}

function renderHeaderIcon(sortInfo: SortInfo, column: string) {
  const index = sortInfo ? findSortItemByKey(sortInfo, column) : -1
  let icon = ARROW.BOTH
  if (sortInfo && index !== -1) {
    icon = sortInfo[index].type === "asc" ? ARROW.UP : ARROW.DOWN
  }

  return <span className="sort-icon">{icon}</span>
}

function clickHandler(sortInfo: SortInfo, columnKey: Key, append: boolean) {
  const index = findSortItemByKey(sortInfo, columnKey)
  if (index < 0) {
    const value: { columnKey: Key; type: "asc" | "desc" } = { columnKey, type: "asc" }
    sortInfo = append ? sortInfo : []
    sortInfo.push(value)
  } else {
    const value: { columnKey: Key; type: "asc" | "desc" | null } = sortInfo[index]
    value.type = value.type === "asc" ? "desc" : null
    if (!append) {
      sortInfo = (value.type !== null ? [value] : []) as SortInfo
    } else if (!value.type) {
      sortInfo.splice(index, 1)
    }
  }
}
