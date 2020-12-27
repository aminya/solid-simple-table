import { render } from "solid-js/web"
import { SimpleTable } from "../../dist/SimpleTable"
import type { SortDirection } from "../../src/SimpleTable"

const rows = [
  { file: "C:/a", message: "Lorem ipsum dolor sit amet, consectetur", severity: "error" },
  { file: "C:/b", message: "Vivamus tincidunt ligula ut ligula laoreet faucibus", severity: "warning" },
  { file: "C:/c", message: "Proin tincidunt justo nulla, sit amet accumsan lectus pretium vel", severity: "info" },
  { file: "C:/d", message: "Cras faucibus eget ante ut consectetur", severity: "error" },
]

const columns = [
  {
    key: "file",
    label: "File",
    sortable: true,
  },
  {
    key: "message",
    label: "Message",
  },
  {
    key: "severity",
    label: "Severity",
    sortable: true,
  },
]

type MyTableRow = typeof rows[0]
type MyTableColumn = typeof columns[0]
type MyColumnKeys = keyof MyTableRow

function MyTableSorter(sortDirection: SortDirection<MyColumnKeys>, rows: Array<MyTableRow>): Array<MyTableRow> {
  // Convert [{key: 'file', type: 'asc'}] -> { file: 'asc' }
  let sortColumns: { [index in MyColumnKeys]: "asc" | "desc" } | {} = {}
  for (let i = 0, length = sortDirection.length; i < length; i++) {
    const entry = sortDirection[i]
    // @ts-ignore
    sortColumns[entry.columnKey] = entry.type
  }

  return rows.sort(function (a, b) {
    if ("file" in sortColumns) {
      const multiplyWith = sortColumns.file === "asc" ? 1 : -1
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
      bodyRenderer={(row: MyTableRow, columnKey: MyColumnKeys) => <span>{row[columnKey]}</span>}
      defaultSortDirection={[{ columnKey: "file", type: "asc" }]}
      sort={MyTableSorter}
      rowKey={(row) => JSON.stringify(row)}
    />
  )
}

render(() => <MyTable />, document.getElementById("app"))
