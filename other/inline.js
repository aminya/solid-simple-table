const fs = require("fs")
const inline = require("web-resource-inliner")

const folder = process.argv[2]

inline.html(
  {
    fileContent: readFileSync(`${folder}/index.html`),
    relativeTo: folder,
  },
  (err, result) => {
    if (err) {
      throw err
    }
    fs.writeFileSync(`${folder}/index.html`, result)
  }
)

function readFileSync(file) {
  const contents = fs.readFileSync(file, "utf8")
  return process.platform === "win32" ? contents.replace(/\r\n/g, "\n") : contents
}
