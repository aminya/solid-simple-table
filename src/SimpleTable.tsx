import { createSignal } from "solid-js"
import "./SimpleTable.less"
import { Props, Signal, SortDirection, NonNullSortDirection, Row, Column, Key } from "./SimpleTable.types"

export type {
  AnyObject,
  Renderable,
  Key,
  Row,
  Column,
  SortDirection,
  NonNullSortDirection,
  Props,
  Signal,
} from "./SimpleTable.types"

export function SimpleTable(props: Props) {
  const [getSortDirectionSignal, setSortDirection] = createSignal<Signal>()

  function getSortDirection(): SortDirection {
    const sortDirection = getSortDirectionSignal()
    if (sortDirection !== undefined) {
      return sortDirection
    }
    // use default sort direction:
    else if (props.defaultSortDirection !== undefined) {
      return props.defaultSortDirection
    } else {
      return [null, null]
    }
  }

  function getSorter(): NonNullable<Props["rowSorter"]> {
    return props.rowSorter ?? defaultSorter
  }

  function generateSortCallback(columnKey: string) {
    return (e: MouseEvent) => {
      setSortDirection(sortClickHandler(getSortDirection(), columnKey, /* append */ e.shiftKey))
    }
  }

  // Row sorting logic:
  function sortRows(
    rows: Array<Row>,
    currentSortDirection: SortDirection,
    defaultSortDirection: NonNullSortDirection | undefined
  ) {
    // if should reset sort
    if (
      currentSortDirection[0] === null &&
      /* if defaultSortDirection is provided */ defaultSortDirection !== undefined
    ) {
      // reset sort
      rows = getSorter()(rows, defaultSortDirection)
    }
    // if should sort normally
    else if (currentSortDirection[0] !== null) {
      rows = getSorter()(rows, currentSortDirection)
    } // else ignore sort
    return rows
  }

  const { headerRenderer = defaultHeaderRenderer, bodyRenderer = defaultBodyRenderer, rowKey = defaultRowKey } = props

  props.rows = sortRows(props.rows, getSortDirection(), props.defaultSortDirection)

  if (props.columns === undefined) {
    props.columns = defaultColumnMaker(props.rows)
  }

  return (
    <table className={`solid-simple-table ${props.className ?? ""}`} style={props.style}>
      <thead>
        <tr>
          {props.columns.map((column) => (
            <th
              key={column.key}
              className={column.sortable !== false ? "sortable" : undefined}
              onClick={column.sortable !== false ? generateSortCallback(column.key) : undefined}
            >
              {headerRenderer(column)} {column.sortable !== false && renderHeaderIcon(getSortDirection(), column.key)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {props.rows.map(function (row) {
          const key = rowKey(row)
          return (
            <tr key={key}>
              {props.columns!.map(function (column) {
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

function defaultColumnMaker(rows: Array<Row>, representitiveRowNumber: number = 0) {
  // construct the column information based on the representitive row
  const representitiveRow = rows[representitiveRowNumber]
  const columnKeys = Object.keys(representitiveRow)

  // make Array<{key: columnKey}>
  const columnNumber = columnKeys.length
  let columns: Array<Column> = new Array(columnNumber)
  for (let iCol = 0; iCol < columnNumber; iCol++) {
    columns[iCol] = { key: columnKeys[iCol] }
  }
  return columns
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
  return column.label ?? column.key
}

function defaultBodyRenderer(row: Row, columnKey: Key) {
  return stringer(row[columnKey])
}

function defaultRowKey(row: Row) {
  return JSON.stringify(row)
}

function renderHeaderIcon(sortDirection: SortDirection, columnKey: Key) {
  let icon
  if (sortDirection[0] === null || sortDirection[0] !== columnKey) {
    icon = ARROW.BOTH
  } else {
    icon = sortDirection[1] === "asc" ? ARROW.DOWN : ARROW.UP
  }
  return <span className="sort-icon">{icon}</span>
}

function sortClickHandler(sortDirection: SortDirection, columnKey: Key, append: boolean) {
  const previousSortedColumn = sortDirection[0]
  const previousSortedDirection = sortDirection[1]

  // if holding shiftKey while clicking: reset sorting
  if (append) {
    sortDirection = [null, null]
  }
  // if clicking on an already sorted column: invert direction on click
  else if (previousSortedColumn === columnKey) {
    sortDirection[1] = previousSortedDirection === "asc" ? "desc" : "asc" // invert direction
  }
  // if clicking on a new column
  else {
    sortDirection = [columnKey, "asc"]
  }
  return sortDirection
}

/**
 Default alphabetical sort function
 @param rows: the rows of the table
 @param columnKey: the last clicked columnKey
*/
function defaultSorter(rows: Array<Row>, sortDirection: NonNullSortDirection): Array<Row> {
  const columnKey = sortDirection[0]
  rows = rows.sort(function (r1, r2) {
    const r1_val = r1[columnKey]
    const r2_val = r2[columnKey]
    if (r1_val == r2_val) {
      // equal values
      return 0
    } else if (r1_val < r2_val) {
      return -1 //r1_val comes first
    } else {
      return 1 // r2_val comes first
    }
  })
  return sortDirection[1] === "desc" ? rows.reverse() : rows
}
