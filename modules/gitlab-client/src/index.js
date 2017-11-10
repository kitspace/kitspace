const urlJoin = require('url-join')
const url = require('url')
const superagent = require('superagent')
const jsYaml = require('js-yaml')
const path = require('path')
const whatsThatGerber = require('whats-that-gerber')

const defaultInfo = {
    color: 'green',
    bom: '1-click-bom.tsv'
}

class GitlabClient {
    constructor(gitlab_url) {
        this.url = urlJoin(gitlab_url, 'api/v4/')
    }
    apiUrl(path) {
        return urlJoin(this.url, path)
    }
    getProjects() {
        //TODO: projects > 20
        return superagent.get(this.apiUrl('projects')).then(r => r.body)
    }
    getProjectHead(projectId) {
        return superagent
            .get(this.apiUrl(`projects/${projectId}/repository/commits`))
            .then(r => r.body[0].id)
    }
    async getProjectFiles(id, ref) {
        const per_page = 100
        const max_pages = 100
        const getPage = page => {
            const params = `recursive=true&per_page=${per_page}&start_page=${page}${
                ref ? `&ref=${ref}` : ''
            }`
            return superagent
                .get(this.apiUrl(`projects/${id}/repository/tree?${params}`))
                .then(r => r.body)
        }
        let files = await getPage(1)
        if (files.length === per_page) {
            let i = 2
            let files_additional = await getPage(i)
            files = files.concat(files_additional)
            while (files_additional.length === per_page && i <= max_pages) {
                files_additional = await getPage(++i)
                files = files.concat(files_additional)
            }
        }
        return files.filter(f => f.type === 'blob')
    }
    getFile(projectId, blob, base64 = false) {
        return superagent
            .get(
                this.apiUrl(
                    `/projects/${projectId}/repository/blobs/${blob}${
                        base64 ? '' : '/raw'
                    }`
                )
            )
            .then(r => (base64 ? r.body : r.text))
    }
    getInfo(projectId, files) {
        const yaml = files.find(f => RegExp('^kitnic.yaml$').test(f.path))
        if (yaml) {
            return this.getFile(projectId, yaml.id).then(str =>
                Object.assign(defaultInfo, jsYaml.safeLoad(str))
            )
        }
        return Promise.resolve(defaultInfo)
    }
    getGerberFiles(projectId, files, info) {
        files = filterOutGerbers(files, info)
        return Promise.all(
            files.map(f =>
                this.getFile(projectId, f.id).then(str => ({
                    filename: f.name,
                    gerber: str
                }))
            )
        )
    }
}

function filterOutGerbers(files, info) {
    if (info.gerbers) {
        files = files.filter(
            f => path.dirname(f.path) + '/' === path.join(info.gerbers, '/')
        )
    }
    const layers = files
        .map(f => ({ file: f, type: whatsThatGerber(f.name) }))
        .filter(({ type }) => type !== 'drw')
    const possibleGerbers = layers.map(({ file }) => file)
    const possibleTypes = layers.map(({ type }) => type)
    const duplicates = possibleTypes.reduce((prev, t) => {
        return prev || possibleTypes.indexOf(t) !== possibleTypes.lastIndexOf(t)
    }, false)
    if (!duplicates) {
        return possibleGerbers
    }
    //if we have duplicates we reduce it down to the folder with the most
    //gerbers
    const folders = possibleGerbers.reduce((folders, f) => {
        const name = path.dirname(f.path)
        folders[name] = (folders[name] || 0) + 1
        return folders
    }, {})
    const gerberFolder = Object.keys(folders).reduce((prev, name) => {
        if (folders[name] > folders[prev]) {
            return name
        }
        return prev
    })
    return possibleGerbers.filter(f => path.dirname(f.path) === gerberFolder)
}

module.exports = GitlabClient

function trace(x) {
    console.log(x)
    return x
}
