const nodeAssert = require('assert')
const assert = require('better-assert')
const shortid = require('shortid')
const GitlabClient = require('../src/index')

require('dotenv').config({path: '../../.env'})

describe('user', () => {
  const g = new GitlabClient(process.env.GITLAB_URL, process.env.GITLAB_TOKEN)

  it('creates random user and imports a project', async () => {
    const user = await g.createTempUser()
    assert(user.id != null)
    const import_url = 'https://github.com/monostable/jelly'
    const project = await g.createProject(
      {name: 'jelly', import_url, visibility: 'public'},
      user.id
    )
    assert(project.name != null)
  })
})

describe('login', () => {
  before(async () => {
    const g = new GitlabClient(process.env.GITLAB_URL, process.env.GITLAB_TOKEN)
    this.name = shortid.generate()
    this.password = shortid.generate()
    return g.createUser({
      username: this.name,
      name: this.name,
      // This is the pattern gitlab uses internally for oauth when it can't
      // get the email. Using this might prevent it actually trying to send
      // out emails?
      email: `temp-email-for-oauth-${this.name}@gitlab.localhost`,
      password: this.password,
      skip_confirmation: true
    })
  })
  it('logs in', async () => {
    const g = new GitlabClient(process.env.GITLAB_URL)
    await g.login(this.name, this.password)
    const u = await g.getCurrentUser()
    assert(u.name === this.name)
  })
})

describe('project', () => {
  const g = new GitlabClient(process.env.GITLAB_URL, process.env.GITLAB_TOKEN)
  const id = 1

  before(async () => {
    this.name = shortid.generate()
    this.password = shortid.generate()
    return g.createUser({
      username: this.name,
      name: this.name,
      // This is the pattern gitlab uses internally for oauth when it can't
      // get the email. Using this might prevent it actually trying to send
      // out emails?
      email: `temp-email-for-oauth-${this.name}@gitlab.localhost`,
      password: this.password
    })
  })

  it('gets project HEAD', () => {
    return g.getProjectHead(id).then(sha => {
      assert(sha.length === 40)
      assert(/^[0-9a-f]{40}$/.test(sha))
    })
  })

  it('gets project files', () => {
    return g.getProjectFiles(id).then(files => {
      assert(files.length > 0)
      assert(files.every(f => f.type === 'blob'))
    })
  })

  it('gets project files with ref', async () => {
    const ref = await g.getProjectHead(id)
    const files1 = await g.getProjectFiles(id)
    const files2 = await g.getProjectFiles(id, ref)
    nodeAssert.deepStrictEqual(files1, files2)
  })

  it('creates and deletes a file', async () => {
    const content = shortid.generate()
    const path = shortid.generate()
    const r = await g.createFile(id, path, content)
    assert(r.file_path === path)
    assert(r.branch === 'master')
    await g.deleteFile(id, path)
  })

  it('creates multiple files', async () => {
    const content1 = shortid.generate()
    const path1 = shortid.generate()
    const content2 = shortid.generate()
    const path2 = shortid.generate()
    const r = await g.createFiles(id, [
      {path: path1, content: content1},
      {path: path2, content: content2}
    ])
    assert(r.id != null)
  })

  it('overwrites a file', async () => {
    const content1 = shortid.generate()
    const content2 = shortid.generate()
    const path = shortid.generate()
    let r = await g.createFile(id, path, content1)
    assert(r.file_path === path)
    assert(r.branch === 'master')
    r = await g.createFile(id, path, content1)
    assert(r.file_path === path)
    assert(r.branch === 'master')
  })

  describe('project files', () => {
    let files
    before(async () => {
      files = await g.getProjectFiles(id)
    })
    it('gets file', () => {
      return g.getFile(id, files[0].id).then(str => assert(str != null))
    })
    it('gets info', () => {
      return g.getInfo(id, files).then(info => assert(info != null))
    })
    it('gets gerber files', async () => {
      const info = await g.getInfo(id, files)
      const gerberFiles = await g.getGerberFiles(id, files, info)
      assert(gerberFiles.length > 0)
      //conform to pcb-stackup format
      assert(gerberFiles.every(f => f.filename))
      assert(gerberFiles.every(f => f.gerber))
    })
  })
})

function trace(x) {
  console.log(x)
  return x
}
