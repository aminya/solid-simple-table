import { createState } from "solid-js"
import "./SolidTable.css"

// util types
export type AnyObject = Record<string, any>
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

export function SolidTable(props: Props) {
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
    renderHeaderColumn = defaultHeaderRenderer,
    renderBodyColumn = defaultBodyRenderer,
  } = props

  let rows = givenRows
  const sortInfo = getSortInfo()

  if (sortInfo.length) {
    rows = sort(sortInfo, rows)
  }

  return (
    <table className={`solid-table ${className}`} style={props.style}>
      <thead>
        <tr>
          {columns.map((column) => (
            <th
              key={column.key}
              className={column.sortable ? "sortable" : undefined}
              onClick={column.sortable ? generateSortCallback(column.key) : undefined}
            >
              {renderHeaderColumn(column)} {column.sortable && renderHeaderIcon(getSortInfo(), column.key)}
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
                    {renderBodyColumn(row, column.key)}
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
    throw new Error("Non-string header array fed to solid-table without renderHeaderColumn prop")
  }
  return item
}

function defaultBodyRenderer(row: AnyObject, column: string) {
  const value = row[column]
  if (typeof value !== "string") {
    throw new Error("Non-predictable rows fed to solid-table without renderBodyColumn prop")
  }
  return value
}

function findSortItemByKey(sortInfo: SortInfo, column: string): number {
  if (Array.isArray(sortInfo)) {
    for (let i = 0, length = sortInfo.length; i < length; ++i) {
      if (sortInfo[i].column === column) {
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

function clickHandler(sortInfo: SortInfo, column: string, append: boolean) {
  const index = findSortItemByKey(sortInfo, column)
  if (index < 0) {
    const value: { column: string; type: "asc" | "desc" } = { column, type: "asc" }
    sortInfo = append ? sortInfo : []
    sortInfo.push(value)
  } else {
    const value: { column: string; type: "asc" | "desc" | null } = sortInfo[index]
    value.type = value.type === "asc" ? "desc" : null
    if (!append) {
      sortInfo = (value.type !== null ? [value] : []) as SortInfo
    } else if (!value.type) {
      sortInfo.splice(index, 1)
    }
  }
}
