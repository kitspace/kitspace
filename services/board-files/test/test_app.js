const assert = require('assert')
const supertest = require('supertest')

const app = require('../src/app')
const GitlabClient = require('../../../modules/gitlab-client')

const gitlab = new GitlabClient('https://gitlab2.kitnic.it/accounts')

describe('app', () => {
    let id, sha
    before(async () => {
        const projects = await gitlab.getProjects()
        id = projects[0].id
        sha = gitlab.getProjectHead(id)
    })
    it('404s on invalid requests', async () => {
        await supertest(app)
            .get(`/board-files/xxx`)
            .expect(404)
    })
    it('404s on invalid names', async () => {
        await supertest(app)
            .get(`/board-files/${id}/${sha}/images/invalid`)
            .expect(404)
    })
    it('serves top-large.png', async () => {
        const png = await supertest(app)
            .get(`/board-files/${id}/${sha}/images/top-large.png`)
            .expect(200)
            .then(r => r.text)
        assert(png)
    })
})
