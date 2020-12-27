const fs = require("fs")
const inline = require("web-resource-inliner")

inline.html(
  {
    fileContent: readFileSync("./demo/simple/dist/index.html"),
    relativeTo: "./demo/simple/dist",
  },
  (err, result) => {
    if (err) { throw err }
    fs.writeFileSync("./demo/simple/dist/index.html", result)
  }
)


function readFileSync(file) {
  const contents = fs.readFileSync(file, "utf8")
  return process.platform === "win32" ? contents.replace(/\r\n/g, "\n") : contents
}
