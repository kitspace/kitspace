const app = require('express')()
const util = require('util')
const path = require('path')
const pcbStackup = util.promisify(require('pcb-stackup'))
const fs = require('fs')
const mkdirp = util.promisify(require('mkdirp'))
const writeFile = util.promisify(fs.writeFile)
const readFile = util.promisify(fs.readFile)
const exists = util.promisify(fs.exists)

const config = require('../config')
const GitlabClient = require('../../../modules/gitlab-client')

const gitlab = new GitlabClient('https://gitlab2.kitnic.it/accounts')

const validFileNames = ['top.svg', 'bottom.svg']

app.get('/board-files/:projectId/:sha/images/:fileName', (req, res) => {
    const { projectId, sha, fileName } = req.params
    const valid = validFileNames.includes(fileName) && /^[0-9a-f]{40}$/.test(sha)
    if (!valid) {
        return res.sendStatus(404)
    }
    makeImage(projectId, sha, fileName, res)
        .then(imageData => {
            res.send(imageData)
            return imageData
        })
        .catch(e => {
            if (e.status) {
                res.sendStatus(e.status)
            } else {
                console.error(e)
                res.sendStatus(500)
            }
        })
        .then(imageData => {
            if (imageData) {
                return cacheImage(projectId, sha, fileName, imageData)
            }
        })
        .catch(e => {
            console.error(e)
        })
})

async function cacheImage(projectId, sha, fileName, imageData) {
    const dir = path.join(config.cache_dir, projectId, sha, 'images')
    await mkdirp(dir)
    return await writeFile(path.join(dir, fileName), imageData)
}

function makeImage(projectId, sha, fileName, res) {
    const ext = path.extname(fileName)
    switch (ext) {
        case '.png':
            res.setHeader('content-type', 'image/png')
            return makePng(projectId, sha, fileName)
        case '.svg':
            res.setHeader('content-type', 'image/svg+xml')
            return makeSvg(projectId, sha, fileName)
        default:
            throw Error(`Invalid file extension: ${ext}`)
    }
}

async function makeSvg(projectId, sha, fileName) {
    const cached = path.join(config.cache_dir, projectId, sha, 'images', fileName)
    if (await exists(cached)) {
        return await readFile(cached, 'utf8')
    }
    const stackup = await getStackup(projectId, sha, fileName)
    switch (fileName) {
        case 'top.svg':
            return stackup.top.svg
        case 'bottom.svg':
            return stackup.bottom.svg
        default:
            throw Error(`Invalid file requested: ${fileName}`)
    }
}

async function makePng(projectId, sha, fileName) {}

async function getStackup(projectId, sha, fileName) {
    const files = await gitlab.getProjectFiles(projectId, sha)
    const info = await gitlab.getInfo(projectId, files)
    const layers = await gitlab.getGerberFiles(projectId, files, info)
    return await pcbStackup(layers)
}

module.exports = app

function trace(x) {
    console.log(x)
    return x
}
