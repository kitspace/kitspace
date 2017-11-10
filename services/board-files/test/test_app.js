const assert = require('assert')
const app = require('../src/app')
const GitlabClient = require('../../../modules/gitlab-client')

const client = new GitlabClient('https://gitlab2.kitnic.it/accounts')

describe('app', () => {
    it('serves top-large.png', async () => {
        const projects = await client.getProjects()
        const id = projects[0].id
        assert(false)
    })
})
