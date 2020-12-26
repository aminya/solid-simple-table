import { createState } from "solid-js"
import "./SimpleTable.less"
import { Props, State, SortDirection, Row, Column, Key } from "./SimpleTable.types"

export type { AnyObject, Renderable, Key, Row, Column, SortDirection, Props, State } from "./SimpleTable.types"

export function SimpleTable(props: Props) {
  const [state, setState] = createState<State>({ sortDirection: null })

  function getSortDirection(): SortDirection {
    return state.sortDirection || props.initialSortDirection || []
  }

  function generateSortCallback(columnKey: string) {
    return (e: MouseEvent) => {
      const sortDirection = getSortDirection()
      clickHandler(sortDirection, columnKey, /* append */ e.shiftKey)
      setState({ sortDirection })
    }
  }

  const { headerRenderer = defaultHeaderRenderer, bodyRenderer = defaultBodyRenderer, rowKey = defaultRowKey } = props

  const sortDirection = getSortDirection()

  if (sortDirection.length) {
    props.rows = props.sort(sortDirection, props.rows)
  }

  return (
    <table className={`solid-simple-table ${props.className ?? ""}`} style={props.style}>
      <thead>
        <tr>
          {props.columns.map((column) => (
            <th
              key={column.key}
              className={column.sortable ? "sortable" : undefined}
              onClick={column.sortable ? generateSortCallback(column.key) : undefined}
            >
              {headerRenderer(column)} {column.sortable && renderHeaderIcon(getSortDirection(), column.key)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {props.rows.map(function (row) {
          const key = rowKey(row)
          return (
            <tr key={key}>
              {props.columns.map(function (column) {
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

function defaultHeaderRenderer(column: Column) {
  return stringer(column)
}

function defaultBodyRenderer(row: Row, columnKey: Key) {
  return stringer(row[columnKey])
}

function defaultRowKey(row: Row) {
  return JSON.stringify(row)
}

function findSortItemByKey(sortDirection: SortDirection, columnKey: Key): number {
  if (Array.isArray(sortDirection)) {
    for (let i = 0, length = sortDirection.length; i < length; ++i) {
      if (sortDirection[i].columnKey === columnKey) {
        return i
      }
    }
  }
  return -1
}

function renderHeaderIcon(sortDirection: SortDirection, columnKey: string) {
  const index = sortDirection ? findSortItemByKey(sortDirection, columnKey) : -1
  let icon = ARROW.BOTH
  if (sortDirection && index !== -1) {
    icon = sortDirection[index].type === "asc" ? ARROW.UP : ARROW.DOWN
  }

  return <span className="sort-icon">{icon}</span>
}

function clickHandler(sortDirection: SortDirection, columnKey: Key, append: boolean) {
  const index = findSortItemByKey(sortDirection, columnKey)
  if (index < 0) {
    const value: { columnKey: Key; type: "asc" | "desc" } = { columnKey, type: "asc" }
    sortDirection = append ? sortDirection : []
    sortDirection.push(value)
  } else {
    const value: { columnKey: Key; type: "asc" | "desc" | null } = sortDirection[index]
    value.type = value.type === "asc" ? "desc" : null
    if (!append) {
      sortDirection = (value.type !== null ? [value] : []) as SortDirection
    } else if (!value.type) {
      sortDirection.splice(index, 1)
    }
  }
}
