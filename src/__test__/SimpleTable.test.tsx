// import { getByRole } from '@testing-library/dom';

import { render } from "solid-js/web"
import { SimpleTable } from "../../dist/SimpleTable"
import type { NonNullSortDirection } from "../../src/SimpleTable"

import { MySimpleTable } from "../../demo/simple/index"
import { MyComplexTable } from "../../demo/complex/index"

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
