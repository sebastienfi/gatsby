const Promise = require(`bluebird`)
const fs = require(`fs`)
const { readFile } = require(`./utils`)
const downloader = require(`./downloader`)

/**
 * Returns the file content
 *
 * @param {any} fileNode
 * @returns
 */
async function loadNodeContent(fileNode) {
  return new Promise((resolve, reject) => {
    fs.readFile(fileNode.absolutePath, `utf-8`, (err, fileContent) => {
      if (err) {
        reject(err)
      } else {
        resolve(fileContent)
      }
    })
  })
}

exports.loadNodeContent = loadNodeContent

/**
 * Returns the corresponding File Node.
 * Will download the file if path starts with http.
 *
 * @param {any} path
 * @param {any} pluginOptions
 * @param {any} done
 * @returns
 */
async function createFileNode(path, pluginOptions) {
  if (path.startsWith(`http`)) {
    // Downloads the remote files
    await downloader
      .file({
        url: path,
        dest: pluginOptions.path,
        auth: {
          user: ``,
          pass: ``,
        },
      })
      .then(({ filename }) => {
        console.log(`File saved to`, filename)
        return new Promise(
          (resolve, reject) =>
            readFile(filename, pluginOptions, (err, file) => file)
          // resolve()
        )
      })
      .catch(err => {
        console.log(
          `Some error occurred. The File couldn\`t be downloaded.`,
          err
        )
      })
  } else {
    // Local file
    return new Promise((resolve, reject) =>
      readFile(path, pluginOptions, (err, file) => file)
    )
  }
}

exports.createFileNode = createFileNode
