const assert = require('assert')
const GitlabClient = require('../src/index')

require('dotenv').config()

describe('user', () => {
  const g = new GitlabClient(process.env.GITLAB_URL)

  it('creates random user', async () => {
    const user = await g.createTempUser()
    assert(user.id != null)
  })
})

describe('project', () => {
  const g = new GitlabClient(process.env.GITLAB_URL)
  let id
  before(async () => {
    const projects = await g.getProjects()
    id = projects[0].id
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
    assert.deepStrictEqual(files1, files2)
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
