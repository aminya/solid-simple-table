import { createSignal, onMount } from "solid-js"
import { render } from "solid-js/web"
import { SimpleTable } from "../../src/SimpleTable"

export const initialRows = [
  { file: "C:/a", message: "Lorem ipsum dolor sit amet, consectetur", severity: "error" },
  { file: "C:/b", message: "Vivamus tincidunt ligula ut ligula laoreet faucibus", severity: "warning" },
  { file: "C:/c", message: "Proin tincidunt justo nulla, sit amet accumsan lectus pretium vel", severity: "info" },
  { file: "C:/d", message: "Cras faucibus eget ante ut consectetur", severity: "error" },
]

type Props = {
  initialRows: typeof initialRows
}

export function MyVariableRowsTable(props: Props) {
  // This example pushes and sets to props.rows, so createSignal's second argument needs to be false as this is not an immutable replacement.
  const [getRows, setRows] = createSignal(props.initialRows, { equals: false })

  onMount(() => {
    setInterval(() => {
      const rows = getRows()
      rows.push({ file: "New file", message: "New message", severity: "info" })
      setRows(rows)
    }, 1000)
  })

  return <SimpleTable rows={getRows()} />
}

// skip rendering if in test mode
if (process.env.NODE_ENV !== "test") {
  // render demo
  render(() => <MyVariableRowsTable initialRows={initialRows} />, document.getElementById("app")!)
}
