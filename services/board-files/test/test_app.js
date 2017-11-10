const assert = require('assert')
const supertest = require('supertest')

const app = require('../src/app')
const GitlabClient = require('../../../modules/gitlab-client')

const gitlab = new GitlabClient('https://gitlab2.kitnic.it/accounts')

describe('app', () => {
    it('serves top-large.png', async () => {
        const projects = await gitlab.getProjects()
        const id = projects[0].id
        const sha = gitlab.getProjectHead(id)
        const png = await supertest(app)
            .get(`/board-files/${id}/${sha}/images/top-large.png`)
            .expect(200)
            .then(r => r.text)
        console.log(png)
        assert(png)
    })
})
