import { render } from "solid-js/web"
import { SimpleTable } from "../../dist/SimpleTable"

const rows = [
  { file: "C:/a", message: "Lorem ipsum dolor sit amet, consectetur", severity: "error" },
  { file: "C:/b", message: "Vivamus tincidunt ligula ut ligula laoreet faucibus", severity: "warning" },
  { file: "C:/c", message: "Proin tincidunt justo nulla, sit amet accumsan lectus pretium vel", severity: "info" },
  { file: "C:/d", message: "Cras faucibus eget ante ut consectetur", severity: "error" },
]

const columns = [
  {
    key: "file",
    label: "File",
  },
  {
    key: "message",
    label: "Message",
  },
  {
    key: "severity",
    label: "Severity",
  },
]

function MyTable() {
  return (
    <SimpleTable
      rows={rows}
      columns={columns}
    />
  )
}

render(() => <MyTable />, document.getElementById("app"))
