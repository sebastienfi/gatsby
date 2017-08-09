const chokidar = require(`chokidar`)
const { readFile, createId } = require(`./utils`)

exports.sourceNodes = (
  { boundActionCreators, getNode, hasNodeChanged },
  pluginOptions,
  done
) => {
  const { createNode, deleteNode } = boundActionCreators

  let ready = false

  const watcher = chokidar.watch(pluginOptions.path, {
    ignored: [
      `**/*.un~`,
      `**/.gitignore`,
      `**/.npmignore`,
      `**/.babelrc`,
      `**/yarn.lock`,
      `**/node_modules`,
      `../**/dist/**`,
    ],
  })

  // For every path that is reported before the 'ready' event, we throw them
  // into a queue and then flush the queue when 'ready' event arrives.
  // After 'ready', we handle the 'add' event without putting it into a queue.
  let pathQueue = []
  const flushPathQueue = onComplete => {
    let queue = pathQueue
    pathQueue = []

    let numPathsProcessed = 0
    let numPaths = queue.length

    queue.forEach(path => {
      readFile(path, pluginOptions, (err, file) => {
        createNode(file)

        numPathsProcessed++
        if (numPathsProcessed === numPaths) {
          onComplete()
        }
      })
    })
  }

  watcher.on(`add`, path => {
    if (ready) {
      console.log(`added file at`, path)
      readFile(path, pluginOptions, (err, file) => {
        createNode(file)
      })
    } else {
      pathQueue.push(path)
    }
  })
  watcher.on(`change`, path => {
    console.log(`changed file at`, path)
    readFile(path, pluginOptions, (err, file) => {
      createNode(file)
    })
  })
  watcher.on(`unlink`, path => {
    console.log(`file deleted at`, path)
    deleteNode(createId(path))
  })
  watcher.on(`ready`, () => {
    if (ready) {
      return
    }

    ready = true
    flushPathQueue(() => {
      done()
    })
  })

  return
}
