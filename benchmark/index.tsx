import { render } from "solid-js/web"
import { SimpleTable } from "../src/SimpleTable"

import { Chance } from "chance"
const chance = new Chance()

let rows = new Array(1000)

for (let iRow = 0; iRow < rows.length; iRow++) {
  rows[iRow] = {
    file: chance.sentence({ words: 1 }),
    message: chance.sentence({ words: 20 }),
    severity: chance.sentence({ words: 1 }),
  }
}

export function MySimpleTable() {
  return <SimpleTable rows={rows} />
}

// render demo

const ti = window.performance.now()

render(() => <MySimpleTable />, document.getElementById("app")!)

const tf = window.performance.now()
console.log(`Render time: ${(tf - ti).toFixed()}`)
