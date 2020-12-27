import { render } from "solid-js/web"

import { MySimpleTable, rows as mySimpleTableRows } from "../../demo/simple/index"
import { MyComplexTable, rows as myComplexTableRows, columns as MyComplexTableColumns } from "../../demo/complex/index"

let rootElm: HTMLDivElement
let dispose: () => void

beforeEach(() => {
  rootElm = document.createElement("div")
  rootElm.id = "app"
})

test("renders simple table", () => {
  dispose = render(() => <MySimpleTable />, rootElm)
  const children = rootElm.children
  expect(children.length).toBe(1)

  const table = children[0]
  expect(table.tagName).toBe("table".toUpperCase())
  expect(table.classList[0]).toBe("solid-simple-table")

  const tableChildren = table.children
  expect(tableChildren.length).toBe(2)

  const thead = tableChildren[0]
  const tbody = tableChildren[1]

  expect(thead.tagName).toBe("thead".toUpperCase())
  expect(tbody.tagName).toBe("tbody".toUpperCase())

  expect(thead.children.length).toBe(1)

  const tr = thead.firstElementChild
  expect(tr?.tagName).toBe("tr".toUpperCase())

  // test headers
  const headers = tr!.children

  expect(headers.length).toBe(Object.keys(mySimpleTableRows[0]).length)

  const mySimpleTableRowsHeaders = Object.keys(mySimpleTableRows[0])
  for (let iColumn = 0, columnNum = headers.length; iColumn < columnNum; iColumn++) {
    const header = headers[iColumn]
    expect(header.tagName).toBe("th".toUpperCase())
    expect(header.className).toBe("sortable")
    expect(header.textContent).toBe(`${mySimpleTableRowsHeaders[iColumn]}⇅`)
  }

  expect(tbody.children.length).toBe(mySimpleTableRows.length)
  const rows = tbody.children

  // test rows
  for (let iRow = 0, rowNum = rows.length; iRow < rowNum; iRow++) {
    const row = rows[iRow]

    expect(row.tagName).toBe("tr".toUpperCase())

    // test cells
    const cells = row.children
    expect(cells.length).toBe(Object.keys(mySimpleTableRows[iRow]).length)

    const mySimpleTableRowsValues = Object.values(mySimpleTableRows[iRow])
    for (let iCell = 0, cellNum = cells.length; iCell < cellNum; iCell++) {
      const cell = cells[iCell]
      expect(cell.tagName).toBe("td".toUpperCase())
      expect(cell.textContent).toBe(mySimpleTableRowsValues[iCell])
    }
  }
})

test("renders complex table", () => {
  dispose = render(() => <MyComplexTable />, rootElm)

  const children = rootElm.children
  expect(children.length).toBe(1)

  const table = children[0]
  expect(table.tagName).toBe("table".toUpperCase())
  expect(table.classList[0]).toBe("solid-simple-table")

  const tableChildren = table.children
  expect(tableChildren.length).toBe(2)

  const thead = tableChildren[0]
  const tbody = tableChildren[1]

  expect(thead.tagName).toBe("thead".toUpperCase())
  expect(tbody.tagName).toBe("tbody".toUpperCase())

  expect(thead.children.length).toBe(1)

  const tr = thead.firstElementChild
  expect(tr?.tagName).toBe("tr".toUpperCase())

  // test headers
  const headers = tr!.children

  expect(headers.length).toBe(MyComplexTableColumns.length)

  for (let iColumn = 0, columnNum = headers.length; iColumn < columnNum; iColumn++) {
    const header = headers[iColumn]
    const label = MyComplexTableColumns[iColumn].label

    expect(header.tagName).toBe("th".toUpperCase())
    if (label === "File") {
      expect(header.className).toBe("sortable")
      expect(header.textContent).toBe(`${label}↓`)
    } else if (label == "Message") {
      expect(header.className).toBe("undefined")
      expect(header.textContent).toBe(`${label}`)
    } else {
      expect(header.className).toBe("sortable")
      expect(header.textContent).toBe(`${label}⇅`)
    }
  }

  expect(tbody.children.length).toBe(myComplexTableRows.length)
  const rows = tbody.children

  // test rows
  for (let iRow = 0, rowNum = rows.length; iRow < rowNum; iRow++) {
    const row = rows[iRow]

    expect(row.tagName).toBe("tr".toUpperCase())

    // test cells
    const cells = row.children
    expect(cells.length).toBe(Object.keys(myComplexTableRows[iRow]).length)

    const myComplexTableRowsValues = Object.values(myComplexTableRows[iRow])
    for (let iCell = 0, cellNum = cells.length; iCell < cellNum; iCell++) {
      const cell = cells[iCell]
      expect(cell.tagName).toBe("td".toUpperCase())
      expect(cell.textContent).toBe(myComplexTableRowsValues[iCell])
    }
  }
})

afterEach(() => {
  rootElm.textContent = ""
  dispose()
})
