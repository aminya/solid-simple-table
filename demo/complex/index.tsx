import { render } from "solid-js/web"
import { SimpleTable } from "../../src/SimpleTable"
import type { NonNullSortDirection } from "../../src/SimpleTable"
import type { IndexType, Props } from "../../src/SimpleTable"

export const rows = [
  { file: "C:/a", message: "Lorem ipsum dolor sit amet, consectetur", severity: "error" },
  { file: "C:/b", message: "Vivamus tincidunt ligula ut ligula laoreet faucibus", severity: "warning" },
  { file: "C:/c", message: "Proin tincidunt justo nulla, sit amet accumsan lectus pretium vel", severity: "info" },
  { file: "C:/d", message: "Cras faucibus eget ante ut consectetur", severity: "error" },
]

export const columns = [
  {
    id: "file",
    label: "File",
  },
  {
    id: "message",
    label: "Message",
    sortable: false,
  },
  {
    id: "severity",
    label: "Severity",
  },
]

type MyComplexTableRow = typeof rows[0]
type MyComplexTableColumn = typeof columns[0]
type MyColumnKeys = keyof MyComplexTableRow

function MyComplexTableSorter(
  rows_in: Array<MyComplexTableRow>, // eslint-disable-line no-shadow
  sortDirection: NonNullSortDirection<MyColumnKeys>
): Array<MyComplexTableRow> {
  const columnID = sortDirection[0]
  const currentSortDirection = sortDirection[1]
  return rows_in.sort(function (a, b) {
    if (columnID in a && columnID in b) {
      const multiplyWith = currentSortDirection === "asc" ? 1 : -1
      const sortValue = a.severity.localeCompare(b.severity)
      if (sortValue !== 0) {
        return multiplyWith * sortValue
      }
    }
    return 0
  })
}

export function MyComplexTable<Ind extends IndexType = IndexType>(props: Props<Ind>) {
  return (
    <SimpleTable
      rows={rows}
      columns={columns}
      headerRenderer={(column: MyComplexTableColumn) => <span>{column.label}</span>}
      bodyRenderer={(row: MyComplexTableRow, columnID: MyColumnKeys) => <span>{row[columnID]}</span>}
      defaultSortDirection={["file", "asc"]}
      rowSorter={MyComplexTableSorter}
      getRowID={(row) => JSON.stringify(row)}
      id={props.id}
    />
  )
}

// skip rendering if in test mode
if (process.env.NODE_ENV !== "test") {
  // render demo
  render(() => <MyComplexTable />, document.getElementById("app")!)
}
