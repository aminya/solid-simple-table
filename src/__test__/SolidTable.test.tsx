// import { getByRole } from '@testing-library/dom';

import { render } from "solid-js/web"
import { SolidTable } from "../SolidTable"
import type { SortInfo, AnyObject } from "../SolidTable"

const rows = [
  { file: '/path/a', message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus id molestie nisi', severity: 'error' },
  { file: '/path/b', message: 'Vivamus tincidunt ligula ut ligula laoreet faucibus', severity: 'warning'  },
  { file: '/path/a', message: 'Proin tincidunt justo nulla, sit amet accumsan lectus pretium vel', severity: 'info'  },
  { file: '/path/a', message: 'Cras faucibus eget ante ut consectetur', severity: 'error'  },
]

const columns = [
  {
    key: 'file',
    label: 'File',
    sortable: true,
  },
  {
    key: 'message',
    label: 'Message',
  }
]

function MyTable() {

  function sortRows(sortInfo: SortInfo, rows: Array<AnyObject>): Array<AnyObject> {
    // Convert [{key: 'file', type: 'asc'}] -> { file: 'asc' }
    const sortColumns: AnyObject = {}
    for (let i = 0, length = sortInfo.length; i < length; i++) {
      const entry = sortInfo[i]
      sortColumns[entry.column] = entry.type
    }

    return rows.sort(function(a, b) {
      if ("file" in sortColumns) {
        const multiplyWith = sortColumns.file === 'asc' ? 1 : -1
        const sortValue = a.severity.localeCompare(b.severity)
        if (sortValue !== 0) {
          return multiplyWith * sortValue
        }
      }
      return 0
    })
  }

  return (
    <SolidTable
      rows={rows}
      columns={columns}
      initialSort={[{ column: 'file', type: 'asc' }]}
      sort={sortRows}
      rowKey={row => JSON.stringify(row)}
      renderHeaderColumn={column => <span>{column.label}</span>}
      renderBodyColumn={(row, column) => <span>{row[column]}</span>}
    />
  )
}

test("renders without crashing", () => {
  const rootElm = document.createElement("div")
  const dispose = render(() => <MyTable/>, rootElm)
  rootElm.textContent = ""
  dispose()
})
