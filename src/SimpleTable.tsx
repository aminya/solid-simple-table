import { createSignal, For } from "solid-js"
import "./SimpleTable.less"
import {
  Props,
  SortDirectionSignal,
  RowsSignal,
  SortDirection,
  NonNullSortDirection,
  Row,
  Column,
  Key,
} from "./SimpleTable.types"

export type {
  AnyObject,
  Renderable,
  Key,
  Row,
  Column,
  SortDirection,
  NonNullSortDirection,
  Props,
  SortDirectionSignal,
  RowsSignal,
} from "./SimpleTable.types"

export function SimpleTable(props: Props) {
  const [getSortDirectionSignal, setSortDirection] = createSignal<SortDirectionSignal>()
  const [getRows, setRows] = createSignal<RowsSignal>(props.rows)

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

  function generateSortCallback(columnKey: string) {
    return (e: MouseEvent) => {
      setSortDirection(sortClickHandler(getSortDirection(), columnKey, /* append */ e.shiftKey))
      sortRows()
    }
  }

  const rowSorter: NonNullable<Props["rowSorter"]> = props.rowSorter ?? defaultSorter

  // Row sorting logic:
  function sortRows() {
    const currentSortDirection = getSortDirection()
    // if should reset sort
    if (
      currentSortDirection[0] === null &&
      /* if defaultSortDirection is provided */ props.defaultSortDirection !== undefined
    ) {
      // reset sort
      setRows(rowSorter(getRows(), props.defaultSortDirection))
    }
    // if should sort normally
    else if (currentSortDirection[0] !== null) {
      setRows(rowSorter(getRows(), currentSortDirection))
    } // else ignore sort
  }

  const { headerRenderer = defaultHeaderRenderer, bodyRenderer = defaultBodyRenderer, getRowID = defaultGetRowID } = props

  function maybeRowID(row: Row) {
    // if accessors are needed
    if (props.accessors) {
      return getRowID(row)
    } else {
      return undefined
    }
  }

  if (props.columns === undefined) {
    props.columns = defaultColumnMaker(props.rows, props.representitiveRowNumber)
  }

  // initial sort
  sortRows()

  return (
    <table className={`solid-simple-table ${props.className ?? ""}`} style={props.style}>
      <thead>
        <tr>
          <For each={props.columns}>
            {(column) => (
              <th
                id={props.accessors ? column.key : undefined}
                className={column.sortable !== false ? "sortable" : undefined}
                onClick={column.sortable !== false ? generateSortCallback(column.key) : undefined}
              >
                {headerRenderer(column)} {column.sortable !== false && renderHeaderIcon(getSortDirection(), column.key)}
              </th>
            )}
          </For>
        </tr>
      </thead>
      <tbody>
        <For each={getRows()}>
          {(row) => {
            const rowID = maybeRowID(row)
            return (
              <tr id={rowID}>
                <For each={props.columns!}>
                  {(column) => {
                    return (
                      <td
                        onClick={column.onClick !== undefined ? (e: MouseEvent) => column.onClick!(e, row) : undefined}
                        id={rowID ? `${rowID}.${column.key}` : undefined}
                      >
                        {bodyRenderer(row, column.key)}
                      </td>
                    )
                  }}
                </For>
              </tr>
            )
          }}
        </For>
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

function defaultGetRowID(row: Row) {
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
