import { createState } from "solid-js"
import "./SimpleTable.css"
import { Props, State, SortInfo, Row, Key } from "./SimpleTable.types"

export type { AnyObject, Renderable, Key, Row, Column, SortInfo, Props, State } from "./SimpleTable.types"

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

// Returns a string from any value
function stringer(value: any) {
  if (typeof value === "string") {
    return value
  } else {
    return JSON.stringify(value)
  }
}

function defaultHeaderRenderer(item: any) {
  return stringer(item)
}

function defaultBodyRenderer(row: Row, columnKey: Key) {
  return stringer(row[columnKey])
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