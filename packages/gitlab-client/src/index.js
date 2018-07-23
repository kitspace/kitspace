const urlJoin = require('url-join')
const shortid = require('shortid')
const url = require('url')
const superagent = require('superagent')
const jsYaml = require('js-yaml')
const path = require('path')
const whatsThatGerber = require('whats-that-gerber')
const cheerio = require('cheerio')

const defaultInfo = {
  color: 'green',
  bom: '1-click-bom.tsv',
}

class GitlabClient {
  constructor(gitlab_url, token, cookie) {
    this.gitlab_url = gitlab_url
    this.url = urlJoin(gitlab_url, 'api/v4/')
    this.agent = superagent.agent()
    if (token) {
      this.agent.set('PRIVATE-TOKEN', token)
    }
    if (cookie) {
      this.agent.set({cookie})
    }
  }
  apiUrl(path) {
    return urlJoin(this.url, path)
  }
  gitlabUrl(path) {
    return urlJoin(this.gitlab_url, path)
  }
  getAuthenticity() {
    const url = this.gitlabUrl('users/sign_in')
    return this.agent.get(url).then(r => {
      const $ = cheerio.load(r.text)
      return $('input[name=authenticity_token]').attr('value')
    })
  }
  login(username, password) {
    const url = this.gitlabUrl('users/sign_in')
    return this.getAuthenticity().then(authenticity_token =>
      this.agent
        .post(url)
        .redirects(0)
        .send(`authenticity_token=${encodeURIComponent(authenticity_token)}`)
        .send(`user[login]=${encodeURIComponent(username)}`)
        .send(`user[password]=${encodeURIComponent(password)}`)
        .send('user[remember_me]=0')
        .send('utf8=✓')
        .catch(e => {
          if (e.status === 302) {
            return e.response
          } else {
            throw e
          }
        }),
    )
  }
  loginOAuth(provider) {
    const url = this.gitlabUrl('users/auth/' + provider)
    return this.getAuthenticity().then(token =>
      this.agent
        .post(url)
        .redirects(0)
        .on('redirect', r => console.log({r}))
        .send(`authenticity_token=${encodeURIComponent(token)}`),
    )
  }
  createUser(params) {
    return this.agent
      .post(this.apiUrl('users'))
      .send(params)
      .then(r => r.body)
  }
  getCurrentUser() {
    return this.agent
      .get(this.apiUrl('user'))
      .then(r => r.body)
      .catch(e => {
        if (e.status === 401) {
          return null
        }
        throw e
      })
  }
  createTempUser() {
    const name = shortid.generate()
    return this.createUser({
      username: name,
      name: name,
      // This is the pattern gitlab uses internally for oauth when it can't
      // get the email. Using this might prevent it actually trying to send
      // out emails?
      email: `temp-email-for-oauth-${name}@gitlab.localhost`,
      password: shortid.generate(),
      projects_limit: 10,
      skip_confirmation: true,
    })
  }
  createProject(params, user) {
    if (user != null) {
      var url = this.apiUrl(`projects/user/${user}`)
    } else {
      var url = this.apiUrl('projects')
    }
    return this.agent
      .post(url)
      .send(params)
      .then(r => r.body)
  }
  getProjects() {
    //TODO: projects > 20
    return this.agent.get(this.apiUrl('projects')).then(r => r.body)
  }
  getProject(id) {
    return this.agent
      .get(this.apiUrl(`projects/${encodeURIComponent(id)}`))
      .then(r => r.body)
  }
  getProjectHead(id) {
    return this.agent
      .get(this.apiUrl(`projects/${encodeURIComponent(id)}/repository/commits`))
      .then(r => {
        return r.body[0].id
      })
  }
  async getProjectFiles(id, ref) {
    const per_page = 100
    const max_pages = 100
    const getPage = page => {
      const params = `recursive=true&per_page=${per_page}&start_page=${page}${
        ref ? `&ref=${ref}` : ''
      }`
      return this.agent
        .get(
          this.apiUrl(
            `projects/${encodeURIComponent(id)}/repository/tree?${params}`,
          ),
        )
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
    return this.agent
      .get(
        this.apiUrl(
          `/projects/${projectId}/repository/blobs/${blob}${base64 ? '' : '/raw'}`,
        ),
      )
      .then(r => (base64 ? r.body : r.text))
  }
  createFile(projectId, path, content, params) {
    const defaultParams = {
      content,
      branch: 'master',
      commit_message: 'Upload file from Kitspace web interface',
    }
    params = Object.assign(defaultParams, params)
    const url = this.apiUrl(`/projects/${projectId}/repository/files/${path}`)
    return this.agent
      .post(url)
      .send(params)
      .then(r => r.body)
      .catch(e => {
        // 400 means the file already exists so we overwrite it
        if (e.status === 400) {
          return this.agent
            .put(url)
            .send(params)
            .then(r => r.body)
        } else {
          throw e
        }
      })
  }
  deleteFile(projectId, path, params) {
    const defaultParams = {
      branch: 'master',
      commit_message: 'Delete file from Kitspace web interface',
    }
    params = Object.assign(defaultParams, params)
    return this.agent
      .delete(this.apiUrl(`/projects/${projectId}/repository/files/${path}`))
      .send(params)
      .then(r => r.body)
  }
  getInfo(projectId, files) {
    const yaml = files.find(f =>
      RegExp('^(kitnic.yaml|kitspace.yaml)$').test(f.path),
    )
    if (yaml) {
      return this.getFile(projectId, yaml.id).then(str =>
        Object.assign(defaultInfo, jsYaml.safeLoad(str)),
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
          gerber: str,
        })),
      ),
    )
  }
}

function filterOutGerbers(files, info) {
  if (info.gerbers) {
    files = files.filter(
      f => path.dirname(f.path) + '/' === path.join(info.gerbers, '/'),
    )
  }
  const layers = files
    .map(f => ({file: f, type: whatsThatGerber(f.name)}))
    .filter(({type}) => type !== 'drw')
  const possibleGerbers = layers.map(({file}) => file)
  const possibleTypes = layers.map(({type}) => type)
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
