import { createSignal, createComputed, For, Show } from "solid-js"
import "./SimpleTable.less" // eslint-disable-line import/no-unassigned-import
import { Props, IndexType, RowsSignal, SortDirection, NonNullSortDirection, Row, Column } from "./SimpleTable.types"

export * from "./SimpleTable.types"

export function SimpleTable<Ind extends IndexType = IndexType>(props: Props<Ind>) {
  const [getSortDirectionSignal, setSortDirection] = createSignal<SortDirection<Ind> | undefined>(undefined)
  const [getRows, setRows] = createSignal<RowsSignal<Ind>>(props.rows, { equals: false })

  // update the local copy whenever the parent updates
  createComputed(() => {
    setRows(props.rows)
  })

  function getSortDirection(): SortDirection<Ind> {
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

  function generateSortCallback(columnID: Ind) {
    return (e: MouseEvent) => {
      setSortDirection(sortClickHandler<Ind>(getSortDirection(), columnID, /* append */ e.shiftKey))
      sortRows()
    }
  }

  const rowSorter: NonNullable<Props<Ind>["rowSorter"]> = props.rowSorter ?? defaultSorter

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
      setRows(rowSorter(getRows(), currentSortDirection as NonNullSortDirection<Ind>))
    } // else ignore sort
  }

  // static props:
  // destructure the props that are not tracked and are used inside the loop (cache the property access)
  const {
    headerRenderer = defaultHeaderRenderer,
    bodyRenderer = defaultBodyRenderer,
    getRowID = defaultGetRowID,
    headerCellClass,
    bodyCellClass,
    accessors,
    id
  } = props

  function maybeRowID(row: Row<Ind>) {
    // if accessors are needed
    if (accessors === true) {
      return getRowID(row)
    } else {
      return undefined
    }
  }

  if (props.columns === undefined) {
    // if columns are not provided manually provide it
    // TODO `Ind` here is a `string`. Remove the cast
    props.columns = defaultColumnMaker(props.rows, props.representativeRowNumber) as Column<Ind>[]
  }

  // initial sort
  sortRows()

  return (
    <table
      class={props.className ?? "solid-simple-table light typography"}
      style={props.style}
      id={id ?? undefined}
    >
      <thead>
        <tr>
          <For each={props.columns!}>
            {(column) => {
              const isSortable = column.sortable !== false

              let className: string = isSortable ? "sortable" : ""
              if (headerCellClass !== undefined) {
                className += ` ${headerCellClass(column)}`
              }

              return (
                <th
                  id={accessors === true ? String(column.id) : undefined}
                  class={className}
                  onClick={isSortable ? generateSortCallback(column.id) : undefined}
                >
                  {headerRenderer(column)}
                  <Show when={isSortable}>{renderHeaderIcon(getSortDirection(), column.id)}</Show>
                </th>
              )
            }}
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
                        class={bodyCellClass?.(row, column.id)}
                        onClick={column.onClick !== undefined ? (e: MouseEvent) => column.onClick!(e, row) : undefined}
                        id={rowID !== undefined ? `${rowID}.${column.id}` : undefined}
                      >
                        {bodyRenderer(row, column.id)}
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

function defaultColumnMaker(rows: Array<Row<string>>, representativeRowNumber: number = 0) {
  // construct the column information based on the representative row
  const representativeRow = rows[representativeRowNumber]
  const columnIDs = Object.keys(representativeRow)

  // make Array<{key: columnID}>
  const columnNumber = columnIDs.length
  const columns: Array<Column<string>> = new Array(columnNumber)
  for (let iCol = 0; iCol < columnNumber; iCol++) {
    columns[iCol] = { id: columnIDs[iCol] }
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

function defaultHeaderRenderer<Ind extends IndexType>(column: Column<Ind>) {
  return <div class="header">{column.label ?? column.id}</div>
}

function defaultBodyRenderer<Ind extends IndexType>(row: Row<Ind>, columnID: Ind) {
  if (typeof row === "object") {
    return stringer(row[columnID])
  } else {
    return stringer(row)
  }
}

function defaultGetRowID<Ind extends IndexType>(row: Row<Ind>) {
  return stringer(row)
}

function renderHeaderIcon<Ind extends IndexType>(sortDirection: SortDirection<Ind>, columnID: Ind) {
  let icon
  if (sortDirection[0] === null || sortDirection[0] !== columnID) {
    icon = ARROW.BOTH
  } else {
    icon = sortDirection[1] === "asc" ? ARROW.DOWN : ARROW.UP
  }
  return <span class="sort-icon">{icon}</span>
}

function sortClickHandler<Ind extends IndexType>(sortDirection: SortDirection<Ind>, columnID: Ind, append: boolean) {
  let sortDirectionNew: SortDirection<Ind>

  // if holding shiftKey while clicking: reset sorting
  if (append) {
    sortDirectionNew = [null, null]
  }
  // if clicking on an already sorted column: invert direction on click
  else if (sortDirection[0] === columnID) {
    sortDirectionNew = [
      /* previousSortedColumn */ sortDirection[0],
      /* previousSortedDirection */ sortDirection[1] === "asc" ? "desc" : "asc", // invert direction
    ]
  }
  // if clicking on a new column
  else {
    sortDirectionNew = [columnID, "asc"]
  }
  return sortDirectionNew
}

/**
 * Default alphabetical sort function
 *
 * @param rows: The rows of the table
 * @param columnID: The last clicked columnID
 */
function defaultSorter(
  rows: Array<number | string | Record<IndexType, any>>,
  sortDirection: NonNullSortDirection
): Array<Row<IndexType>> {
  if (!rows.length) {
    return rows
  }

  let rowsNew: typeof rows
  const columnID = sortDirection[0]
  if (typeof rows[0] === "object") {
    rowsNew = rows.sort((r1, r2) => {
      const r1_val = (r1 as Record<IndexType, any>)[columnID]
      const r2_val = (r2 as Record<IndexType, any>)[columnID]
      if (r1_val === r2_val) {
        // equal values
        return 0
      } else if (r1_val < r2_val) {
        return -1 //r1_val comes first
      } else {
        return 1 // r2_val comes first
      }
    })
  } else {
    rowsNew = rows.sort()
  }

  return sortDirection[1] === "desc" ? rowsNew.reverse() : rowsNew
}
