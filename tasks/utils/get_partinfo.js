const superagent = require('superagent')
const immutable = require('immutable')

const partinfoURL =
    'https://partinfo.kitnic.it/graphql'

const MpnQuery = `
query MpnQuery($mpn: MpnInput!) {
  part(mpn: $mpn) {
    mpn {
      manufacturer
      part
    }
    datasheet
    description
    image {
      url
      credit_string
      credit_url
    }
  }
}`

function getPartinfo(lines) {
    return lines.map(line => {
        return Promise.all(line.partNumbers.map(mpn => {
            return superagent
                .post(partinfoURL)
                .send({
                    query: MpnQuery,
                    variables: {
                        mpn
                    },
                }).then(res => {
                    return res.body.data.part
                })
        }))
    })
}

module.exports = getPartinfo
