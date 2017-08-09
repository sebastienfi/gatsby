const md5File = require(`md5-file`)
const slash = require(`slash`)
const fs = require(`fs`)
const mime = require(`mime`)
const prettyBytes = require(`pretty-bytes`)
const path = require(`path`)

const createId = path => {
  const slashed = slash(path)
  return `${slashed} absPath of file`
}

function readFile(file, pluginOptions, cb) {
  const slashed = slash(file)
  const slashedFile = {
    ...path.parse(slashed),
    absolutePath: slashed,
  }
  md5File(slashedFile.absolutePath, (md5Err, contentDigest) => {
    fs.stat(slashedFile.absolutePath, (statErr, stats) => {
      // Stringify date objects.
      const newFile = JSON.parse(
        JSON.stringify({
          // Don't actually make the File id the absolute path as otherwise
          // people will use the id for that and ids shouldn't be treated as
          // useful information.
          id: createId(file),
          children: [],
          parent: `___SOURCE___`,
          internal: {
            contentDigest: contentDigest,
            mediaType: mime.lookup(slashedFile.ext),
            type: `File`,
          },
          sourceInstanceName: pluginOptions.name,
          absolutePath: slashedFile.absolutePath,
          relativePath: slash(
            path.relative(pluginOptions.path, slashedFile.absolutePath)
          ),
          extension: slashedFile.ext.slice(1).toLowerCase(),
          size: stats.size,
          prettySize: prettyBytes(stats.size),
          modifiedTime: stats.mtime,
          accessTime: stats.atime,
          changeTime: stats.ctime,
          birthTime: stats.birthtime,
          ...slashedFile,
          ...stats,
        })
      )
      cb(null, newFile)
    })
  })
}

exports.readFile = readFile

exports.createId = createId
