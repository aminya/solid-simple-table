/* eslint-disable no-shadow */

import { render } from "solid-js/web"

import { MySimpleTable, rows as mySimpleTableRows } from "../demo/simple/index"
import { MyVariableRowsTable, initialRows as myVariableRowsTableInitialRows } from "../demo/variable-rows/index"
import { MyComplexTable, rows as myComplexTableRows, columns as MyComplexTableColumns } from "../demo/complex/index"

import { sleep, click, getTagName } from "./util"

let rootElm: HTMLDivElement
let dispose: () => void

beforeEach(() => {
  rootElm = document.createElement("div")
  rootElm.id = "app"
})

function testTBodyRows(rows: HTMLCollection, rowsData: Record<string, string>[]) {
  // test rows
  for (let iRow = 0, rowNum = rows.length; iRow < rowNum; iRow++) {
    const row = rows[iRow]

    expect(getTagName(row)).toBe("tr")

    // test cells
    const cells = row.children
    expect(cells.length).toBe(Object.keys(rowsData[iRow]).length)

    const tableValues = Object.values(rowsData[iRow])
    for (let iCell = 0, cellNum = cells.length; iCell < cellNum; iCell++) {
      const cell = cells[iCell]
      expect(getTagName(cell)).toBe("td")
      expect(cell.textContent).toBe(tableValues[iCell])
    }
  }
}

test("renders simple table", () => {
  dispose = render(() => <MySimpleTable />, rootElm)
  const children = rootElm.children
  expect(children.length).toBe(1)

  const table = children[0]
  expect(getTagName(table)).toBe("table")
  expect(table.classList[0]).toBe("solid-simple-table")

  const tableChildren = table.children
  expect(tableChildren.length).toBe(2)

  const thead = tableChildren[0]
  const tbody = tableChildren[1]

  expect(getTagName(thead)).toBe("thead")
  expect(getTagName(tbody)).toBe("tbody")

  expect(thead.children.length).toBe(1)

  const tr = thead.firstElementChild
  expect(getTagName(tr)).toBe("tr")

  // test headers
  const headers = tr!.children

  expect(headers.length).toBe(Object.keys(mySimpleTableRows[0]).length)

  const mySimpleTableRowsHeaders = Object.keys(mySimpleTableRows[0])
  for (let iColumn = 0, columnNum = headers.length; iColumn < columnNum; iColumn++) {
    const header = headers[iColumn]
    expect(getTagName(header)).toBe("th")
    expect(header.className).toBe("sortable")
    expect(header.textContent).toBe(`${mySimpleTableRowsHeaders[iColumn]}⇅`)
  }

  expect(tbody.children.length).toBe(mySimpleTableRows.length)
  const rows = tbody.children

  // test rows
  testTBodyRows(rows, mySimpleTableRows)

  // test sorting
  for (let iColumn = 0, columnNum = headers.length; iColumn < columnNum; iColumn++) {
    const header = headers[iColumn] as HTMLTableHeaderCellElement

    // initial sort
    const rows = tbody.children
    const mySimpleTableRowsRelatedRows = mySimpleTableRows.map((row) => row[mySimpleTableRowsHeaders[iColumn]])

    const relatedRows: HTMLTableCellElement[] = new Array(columnNum)
    for (let iRow = 0, rowNum = rows.length; iRow < rowNum; iRow++) {
      const row = rows[iRow]
      relatedRows[iRow] = row.children[iColumn] as HTMLTableCellElement

      expect(relatedRows[iRow].textContent).toBe(mySimpleTableRowsRelatedRows[iRow])
    }

    // ascending sort

    click(header)
    expect(header.textContent).toBe(`${mySimpleTableRowsHeaders[iColumn]}↓`)

    const rowsAsc = tbody.children
    const mySimpleTableRowsRelatedRowsAsc = mySimpleTableRowsRelatedRows.sort()

    for (let iRow = 0, rowNum = rowsAsc.length; iRow < rowNum; iRow++) {
      const row = rowsAsc[iRow]
      relatedRows[iRow] = row.children[iColumn] as HTMLTableCellElement

      expect(relatedRows[iRow].textContent).toBe(mySimpleTableRowsRelatedRowsAsc[iRow])
    }

    // descending sort

    click(header)
    expect(header.textContent).toBe(`${mySimpleTableRowsHeaders[iColumn]}↑`)

    const rowsDesc = tbody.children
    const mySimpleTableRowsRelatedRowsDesc = mySimpleTableRowsRelatedRows.sort().reverse()

    for (let iRow = 0, rowNum = rowsDesc.length; iRow < rowNum; iRow++) {
      const row = rowsDesc[iRow]
      relatedRows[iRow] = row.children[iColumn] as HTMLTableCellElement

      expect(relatedRows[iRow].textContent).toBe(mySimpleTableRowsRelatedRowsDesc[iRow])
    }

    click(header)
    expect(header.textContent).toBe(`${mySimpleTableRowsHeaders[iColumn]}↓`)

    click(header)
    expect(header.textContent).toBe(`${mySimpleTableRowsHeaders[iColumn]}↑`)
  }
})

test("renders variable rows table", async () => {
  dispose = render(() => <MyVariableRowsTable initialRows={myVariableRowsTableInitialRows} />, rootElm)
  const children = rootElm.children
  expect(children.length).toBe(1)

  const table = children[0]
  expect(getTagName(table)).toBe("table")
  expect(table.classList[0]).toBe("solid-simple-table")

  const tableChildren = table.children
  expect(tableChildren.length).toBe(2)

  const thead = tableChildren[0]
  const tbody = tableChildren[1]

  expect(getTagName(thead)).toBe("thead")
  expect(getTagName(tbody)).toBe("tbody")

  expect(thead.children.length).toBe(1)

  const tr = thead.firstElementChild
  expect(getTagName(tr)).toBe("tr")

  // test headers
  const headers = tr!.children

  expect(headers.length).toBe(Object.keys(myVariableRowsTableInitialRows[0]).length)

  const myVariableRowsTableRowsHeaders = Object.keys(myVariableRowsTableInitialRows[0])
  for (let iColumn = 0, columnNum = headers.length; iColumn < columnNum; iColumn++) {
    const header = headers[iColumn]
    expect(getTagName(header)).toBe("th")
    expect(header.className).toBe("sortable")
    expect(header.textContent).toBe(`${myVariableRowsTableRowsHeaders[iColumn]}⇅`)
  }

  const rows = tbody.children

  // test rows
  testTBodyRows(rows, myVariableRowsTableInitialRows)

  // test added rows
  for (let i = 0; i < 4; i++) {
    const addedRowIndex = 4 + i
    expect(rows.length).toBe(addedRowIndex)
    // eslint-disable-next-line no-await-in-loop
    await sleep(1000)

    const row = rows[addedRowIndex]
    expect(getTagName(row)).toBe("tr")

    // test cells
    const cells = row.children
    expect(cells.length).toBe(Object.keys({ file: "New file", message: "New message", severity: "info" }).length)

    const mySimpleTableRowsValues = Object.values({ file: "New file", message: "New message", severity: "info" })
    for (let iCell = 0, cellNum = cells.length; iCell < cellNum; iCell++) {
      const cell = cells[iCell]
      expect(getTagName(cell)).toBe("td")
      expect(cell.textContent).toBe(mySimpleTableRowsValues[iCell])
    }
  }
})

test("renders complex table", () => {
  dispose = render(() => <MyComplexTable />, rootElm)

  const children = rootElm.children
  expect(children.length).toBe(1)

  const table = children[0]
  expect(getTagName(table)).toBe("table")
  expect(table.classList[0]).toBe("solid-simple-table")

  const tableChildren = table.children
  expect(tableChildren.length).toBe(2)

  const thead = tableChildren[0]
  const tbody = tableChildren[1]

  expect(getTagName(thead)).toBe("thead")
  expect(getTagName(tbody)).toBe("tbody")

  expect(thead.children.length).toBe(1)

  const tr = thead.firstElementChild
  expect(getTagName(tr)).toBe("tr")

  // test headers
  const headers = tr!.children

  expect(headers.length).toBe(MyComplexTableColumns.length)

  for (let iColumn = 0, columnNum = headers.length; iColumn < columnNum; iColumn++) {
    const header = headers[iColumn]
    const label = MyComplexTableColumns[iColumn].label

    expect(getTagName(header)).toBe("th")
    if (label === "File") {
      expect(header.className).toBe("sortable")
      expect(header.textContent).toBe(`${label}↓`)
    } else if (label === "Message") {
      expect(header.className).toBe("")
      expect(header.textContent).toBe(`${label}`)
    } else {
      expect(header.className).toBe("sortable")
      expect(header.textContent).toBe(`${label}⇅`)
    }
  }

  expect(tbody.children.length).toBe(myComplexTableRows.length)
  const rows = tbody.children

  // test rows
  testTBodyRows(rows, myComplexTableRows)
})

afterEach(() => {
  rootElm.textContent = ""
  dispose()
})
