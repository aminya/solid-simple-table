// import { getByRole } from '@testing-library/dom';

import { render } from "solid-js/web"
import { SolidTable } from "../SolidTable"

test("renders without crashing", () => {
  const div = document.createElement("div")
  const dispose = render(SolidTable, div)
  div.textContent = ""
  dispose()
})
