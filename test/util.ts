export async function sleep(time: number) {
  await new Promise((res) => {
    setTimeout(res, time)
  })
}

export function getTagName(elm: Element | undefined): string | undefined {
  return elm?.tagName.toLowerCase()
}

export function click(elm: HTMLElement) {
  try {
    // @ts-ignore internal solid API
    elm.$$click(new MouseEvent("click"))
  } catch {
    elm.click()
  }
}
