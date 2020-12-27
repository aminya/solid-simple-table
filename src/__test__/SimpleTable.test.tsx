import { render } from "solid-js/web"

import { MySimpleTable, rows as mySimpleTableRows } from "../../demo/simple/index"
import { MyComplexTable, rows as myComplexTableRows, columns as MyComplexTableColumns } from "../../demo/complex/index"

let rootElm: HTMLDivElement
let dispose: () => void

beforeEach(() => {
  rootElm = document.createElement("div")
  rootElm.id = "app"
})

test("renders simple table without crashing", () => {
  dispose = render(() => <MySimpleTable />, rootElm)
})

test("renders complex table without crashing", () => {
  dispose = render(() => <MyComplexTable />, rootElm)
})

afterEach(() => {
  rootElm.textContent = ""
  dispose()
})
