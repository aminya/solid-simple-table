import { render } from "solid-js/web"
import { SimpleTable } from "../../src/SimpleTable"

export const rows = [
  { file: "C:/a", message: "Folder a", severity: "error" },
  { file: "C:/b", message: "Folder b", severity: "warning" },
  { file: "C:/c", message: "Folder c", severity: "info" },
  { file: "C:/d", message: "Folder d", severity: "error" },
]

export function MySimpleTable() {
  return <SimpleTable rows={rows} />
}

// skip rendering if in test mode
if (process.env.NODE_ENV !== "test") {
  // render demo
  render(() => <MySimpleTable />, document.getElementById("app")!)
}
