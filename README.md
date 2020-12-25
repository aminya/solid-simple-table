# Solid Table

![CI](https://github.com/aminya/solid-simple-table/workflows/CI/badge.svg)

Solid Table is an efficient reactive table component that gives you freedom.

## Installation

```
npm install --save solid-simple-table
```

## Usage

```js
import { SimpleTable } from "solid-simple-table"

const rows = [
  {
    file: "/path/a",
    message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus id molestie nisi",
    severity: "error",
  },
  { file: "/path/b", message: "Vivamus tincidunt ligula ut ligula laoreet faucibus", severity: "warning" },
  { file: "/path/a", message: "Proin tincidunt justo nulla, sit amet accumsan lectus pretium vel", severity: "info" },
  { file: "/path/a", message: "Cras faucibus eget ante ut consectetur", severity: "error" },
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
]

function MyTable() {
  function sortRows(sortInfo: SortInfo, rows: Array<AnyObject>): Array<AnyObject> {
    // Convert [{key: 'file', type: 'asc'}] -> { file: 'asc' }
    const sortColumns: AnyObject = {}
    for (let i = 0, length = sortInfo.length; i < length; i++) {
      const entry = sortInfo[i]
      sortColumns[entry.column] = entry.type
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

  return (
    <SimpleTable
      rows={rows}
      columns={columns}
      headerRenderer={(column) => <span>{column.label}</span>}
      bodyRenderer={(row, column) => <span>{row[column]}</span>}
      initialSort={[{ column: "file", type: "asc" }]}
      sort={sortRows}
      rowKey={(row) => JSON.stringify(row)}
    />
  )
}
```

## API

```ts
<SimpleTable
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
/>

```

In which:

```ts
// util types
export type AnyObject = Record<string, any>
type Renderable = any

// row and column types
export type Key = string
export type Row<K extends Key = string, V = any> = Record<K, V>

export type Column<K extends Key = string, V = any> = { key: K; label: string; sortable?: boolean; onClick?(e: MouseEvent, row: Row<K, V>): void }

// sort info
export type SortInfo<K = Key> = Array<{ columnKey: K; type: "asc" | "desc" }>;

```

## License

This package is licensed under the terms of MIT License. It was converted from [sb-react-table](https://github.com/steelbrain/react-table/tree/2f8472960a77ca6cf2444c392697772716195bf4).
