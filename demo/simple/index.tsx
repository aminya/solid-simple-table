import { render } from "solid-js/web"
import { SimpleTable } from "../../src/SimpleTable"
import type { IndexType, Props } from "../../src/SimpleTable"

export const rows = [
  { file: "C:/a", message: "Folder a", severity: "error" },
  { file: "C:/b", message: "Folder b", severity: "warning" },
  { file: "C:/c", message: "Folder c", severity: "info" },
  { file: "C:/d", message: "Folder d", severity: "error" },
]

export function MySimpleTable<Ind extends IndexType = IndexType>(props: Props<Ind>) {
  return <SimpleTable rows={rows} id={props.id}/>
}

// skip rendering if in test mode
if (process.env.NODE_ENV !== "test") {
  // render demo
  render(() => <MySimpleTable />, document.getElementById("app")!)
}
