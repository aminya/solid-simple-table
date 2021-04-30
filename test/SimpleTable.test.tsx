import { render } from "solid-js/web"

import { Column, SortDirection } from "../src/SimpleTable.types"
import { MySimpleTable, rows as mySimpleTableRows } from "../demo/simple/index"
import { MyVariableRowsTable, initialRows as myVariableRowsTableInitialRows } from "../demo/variable-rows/index"
import { MyComplexTable, rows as myComplexTableRows, columns as MyComplexTableColumns } from "../demo/complex/index"

import { sleep, click, getTagName } from "./util"

function testTable(
  rowsData: Record<string, string>[],
  rootElm: HTMLDivElement,
  shouldTestSort: boolean = true,
  columnsData: Column[] = undefined,
  defaultSortDirection: SortDirection = undefined
) {
  const { table, thead, tbody, tr } = testTableSections(rootElm)

  // test headers
  const headers = tr!.children as HTMLCollectionOf<HTMLTableHeaderCellElement>
  const headersData = testTrHeaders(headers, rowsData, columnsData, defaultSortDirection)

  expect(tbody.children.length).toBe(rowsData.length)
  const rows = tbody.children as HTMLCollectionOf<HTMLTableRowElement>

  // test rows
  testTBodyRows(rows, rowsData)

  // test sorting
  if (shouldTestSort) {
    testSorting(rowsData, headers, tbody, headersData)
  }

  return { table, thead, tbody, tr, rows }
}

function testTableSections(rootElm: HTMLDivElement) {
  const children = rootElm.children
  expect(children.length).toBe(1)

  const table = children[0] as HTMLTableElement
  expect(getTagName(table)).toBe("table")
  expect(table.classList[0]).toBe("solid-simple-table")

  const tableChildren = table.children
  expect(tableChildren.length).toBe(2)

  const thead = tableChildren[0] as HTMLTableElement["tHead"]
  const tbody = tableChildren[1] as ReturnType<HTMLTableElement["createTBody"]>

  expect(getTagName(thead)).toBe("thead")
  expect(getTagName(tbody)).toBe("tbody")

  expect(thead.children.length).toBe(1)

  const tr = thead.firstElementChild as HTMLTableRowElement
  expect(getTagName(tr)).toBe("tr")

  return { table, thead, tbody, tr }
}

function testTrHeaders(
  headers: HTMLCollectionOf<HTMLTableHeaderCellElement>,
  rowsData: Record<string, string>[],
  columnsData?: Column[],
  defaultSortDirection?: SortDirection
) {
  expect(headers.length).toBe(Object.keys(rowsData[0]).length)

  const headersData = Object.keys(rowsData[0])
  for (let iColumn = 0, columnNum = headers.length; iColumn < columnNum; iColumn++) {
    const header = headers[iColumn]

    expect(getTagName(header)).toBe("th")

    const sortable = columnsData?.[iColumn].sortable ?? true
    const label = columnsData?.[iColumn].label ?? headersData[iColumn]

    if (sortable) {
      expect(header.className).toBe("sortable")
      if (defaultSortDirection !== undefined && label.toLowerCase() === defaultSortDirection[0]) {
        const direction = defaultSortDirection[1] ? "↓" : "↑"
        expect(header.textContent).toBe(`${label}${direction}`)
      } else {
        expect(header.textContent).toBe(`${label}⇅`)
      }
    } else {
      expect(header.className).toBe("")
      expect(header.textContent).toBe(`${label}`)
    }
  }
  return headersData
}

function testTBodyRows(rows: HTMLCollectionOf<HTMLTableRowElement>, rowsData: Record<string, string>[]) {
  // test rows
  for (let iRow = 0, rowNum = rows.length; iRow < rowNum; iRow++) {
    const row = rows[iRow]

    expect(getTagName(row)).toBe("tr")

    // test cells
    const cells = row.children
    expect(cells.length).toBe(Object.keys(rowsData[iRow]).length)

    const rowsValues = Object.values(rowsData[iRow])
    for (let iCell = 0, cellNum = cells.length; iCell < cellNum; iCell++) {
      const cell = cells[iCell]
      expect(getTagName(cell)).toBe("td")
      expect(cell.textContent).toBe(rowsValues[iCell])
    }
  }
}

function testSorting(
  rowsData: Record<string, string>[],
  headers: HTMLCollectionOf<HTMLTableHeaderCellElement>,
  tbody: ReturnType<HTMLTableElement["createTBody"]>,
  headersData: string[]
) {
  // test sorting
  for (let iColumn = 0, columnNum = headers.length; iColumn < columnNum; iColumn++) {
    const header = headers[iColumn] as HTMLTableHeaderCellElement

    // initial sort
    const rows = tbody.children as HTMLCollectionOf<HTMLTableRowElement>
    const relatedRowsData = rowsData.map((row) => row[headersData[iColumn]])

    const relatedRows: HTMLTableCellElement[] = new Array(columnNum)
    for (let iRow = 0, rowNum = rows.length; iRow < rowNum; iRow++) {
      const row = rows[iRow]
      relatedRows[iRow] = row.children[iColumn] as HTMLTableCellElement

      expect(relatedRows[iRow].textContent).toBe(relatedRowsData[iRow])
    }

    // ascending sort

    click(header)
    expect(header.textContent).toBe(`${headersData[iColumn]}↓`)

    const rowsAsc = tbody.children
    const relatedRowsDataAsc = relatedRowsData.sort()

    for (let iRow = 0, rowNum = rowsAsc.length; iRow < rowNum; iRow++) {
      const row = rowsAsc[iRow]
      relatedRows[iRow] = row.children[iColumn] as HTMLTableCellElement

      expect(relatedRows[iRow].textContent).toBe(relatedRowsDataAsc[iRow])
    }

    // descending sort

    click(header)
    expect(header.textContent).toBe(`${headersData[iColumn]}↑`)

    const rowsDesc = tbody.children
    const relatedRowsDataDesc = relatedRowsData.sort().reverse()

    for (let iRow = 0, rowNum = rowsDesc.length; iRow < rowNum; iRow++) {
      const row = rowsDesc[iRow]
      relatedRows[iRow] = row.children[iColumn] as HTMLTableCellElement

      expect(relatedRows[iRow].textContent).toBe(relatedRowsDataDesc[iRow])
    }

    click(header)
    expect(header.textContent).toBe(`${headersData[iColumn]}↓`)

    click(header)
    expect(header.textContent).toBe(`${headersData[iColumn]}↑`)
  }
}

describe("SolidSimpleTable", () => {
  let rootElm: HTMLDivElement
  let dispose: () => void

  beforeEach(() => {
    rootElm = document.createElement("div")
    rootElm.id = "app"
  })

  test("renders simple table", () => {
    dispose = render(() => <MySimpleTable />, rootElm)
    testTable(mySimpleTableRows, rootElm)
  })

  test("renders variable rows table", async () => {
    dispose = render(() => <MyVariableRowsTable initialRows={myVariableRowsTableInitialRows} />, rootElm)
    const { rows } = testTable(myVariableRowsTableInitialRows, rootElm)

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
    testTable(myComplexTableRows, rootElm, false, MyComplexTableColumns, ["file", "asc"])
  })

  afterEach(() => {
    rootElm.textContent = ""
    dispose()
  })
})
