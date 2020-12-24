import { createState } from "solid-js"

// util types
type AnyObject = Record<string, any>
type Renderable = any

export type Column = { key: string; label: string; sortable?: boolean; onClick?(e: MouseEvent, row: AnyObject): void }
export type SortInfo = Array<{ column: string; type: "asc" | "desc" }>

export type Props = {
  rows: Array<AnyObject>
  columns: Array<Column>

  style?: AnyObject
  className?: string

  initialSort?: SortInfo
  sort(sortInfo: SortInfo, rows: Array<AnyObject>): Array<AnyObject>
  rowKey(row: AnyObject): string

  renderHeaderColumn(column: Column): string | Renderable
  renderBodyColumn(row: AnyObject, column: string): string | Renderable
}

export type State = { sort: SortInfo | null }

export function SolidTable(props: Props) {
  const [state, setState] = createState<State>({ sort: null })

  function getSortInfo(): SortInfo {
    return state.sort || props.initialSort || []
  }

  function generateSortCallback(column: string) {
    return (e: MouseEvent) => {
      const sortInfo = getSortInfo()
      const append = e.shiftKey
      clickHandler(sortInfo, column, append)
      setState({ sort: sortInfo })
    }
  }

  const {
    rows: givenRows,
    columns,
    className = "",
    rowKey,
    sort,
    renderHeaderColumn = defaultHeaderRenderer,
    renderBodyColumn = defaultBodyRenderer,
  } = props

  let rows = givenRows
  const sortInfo = getSortInfo()

  if (sortInfo.length) {
    rows = sort(sortInfo, rows)
  }

  return (
    <table className={`solid-table ${className}`} style={props.style}>
      <thead>
        <tr>
          {columns.map((column) => (
            <th
              key={column.key}
              className={column.sortable ? "sortable" : undefined}
              onClick={column.sortable ? generateSortCallback(column.key) : undefined}
            >
              {renderHeaderColumn(column)} {column.sortable && renderHeaderIcon(getSortInfo(), column.key)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map(function (row) {
          const key = rowKey(row)
          return (
            <tr key={key}>
              {columns.map(function (column) {
                const givenOnClick = column.onClick
                const onClick =
                  givenOnClick &&
                  function (e: MouseEvent) {
                    givenOnClick(e, row)
                  }

                return (
                  <td onClick={onClick} key={`${key}.${column.key}`}>
                    {renderBodyColumn(row, column.key)}
                  </td>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
