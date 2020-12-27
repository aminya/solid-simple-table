// import { getByRole } from '@testing-library/dom';

import { render } from "solid-js/web"
import { SimpleTable } from "../../dist/SimpleTable"
import type { NonNullSortDirection } from "../../src/SimpleTable"

const rows = [
  { file: "C:/a", message: "Lorem ipsum dolor sit amet, consectetur", severity: "error" },
  { file: "C:/b", message: "Vivamus tincidunt ligula ut ligula laoreet faucibus", severity: "warning" },
  { file: "C:/c", message: "Proin tincidunt justo nulla, sit amet accumsan lectus pretium vel", severity: "info" },
  { file: "C:/d", message: "Cras faucibus eget ante ut consectetur", severity: "error" },
]

const columns = [
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

type MyTableRow = typeof rows[0]
type MyTableColumn = typeof columns[0]
type MyColumnKeys = keyof MyTableRow

function MyTableSorter(rows: Array<MyTableRow>, sortDirection: NonNullSortDirection<MyColumnKeys>): Array<MyTableRow> {
  const columnID = sortDirection[0]
  const currentSortDirection = sortDirection[1]
  return rows.sort(function (a, b) {
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

function MyTable() {
  return (
    <SimpleTable
      rows={rows}
      columns={columns}
      headerRenderer={(column: MyTableColumn) => <span>{column.label}</span>}
      bodyRenderer={(row: MyTableRow, columnID: MyColumnKeys) => <span>{row[columnID]}</span>}
      defaultSortDirection={["file", "asc"]}
      rowSorter={MyTableSorter}
      getRowID={(row) => JSON.stringify(row)}
    />
  )
}

test("renders without crashing", () => {
  const rootElm = document.createElement("div")
  const dispose = render(() => <MyTable />, rootElm)
  rootElm.textContent = ""
  dispose()
})
