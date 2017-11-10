const app = require('express')()
const util = require('util')
const path = require('path')
const pcbStackup = util.promisify(require('pcb-stackup'))

const GitlabClient = require('../../../modules/gitlab-client')

const gitlab = new GitlabClient('https://gitlab2.kitnic.it/accounts')

const validFileNames = ['top.svg']

app.get('/board-files/:projectId/:sha/images/:fileName', (req, res) => {
    const { projectId, sha, fileName } = req.params
    const valid = validFileNames.includes(fileName) && /^[0-9a-f]{40}$/.test(sha)
    if (!valid) {
        return res.sendStatus(404)
    }
    makeImage(projectId, sha, fileName, res)
        .then(r => res.send(r))
        .catch(e => {
            if (e.status) {
                res.sendStatus(e.status)
            } else {
                console.error(e)
                res.sendStatus(500)
            }
        })
})

function makeImage(projectId, sha, fileName, res) {
    const ext = path.extname(fileName)
    switch (ext) {
        case '.png':
            res.setHeader('content-type', 'image/png')
            return makePng(projectId, sha, fileName)
        case '.svg':
            res.setHeader('content-type', 'image/svg+xml')
            return makeSvg(projectId, sha, fileName)
    }
}

async function makeSvg(projectId, sha, fileName) {
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

async function makePng(projectId, sha, fileName) {
}

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
