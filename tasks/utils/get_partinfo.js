const superagent = require('superagent')
const immutable = require('immutable')

const partinfoURL =
    'http://ec2-52-50-17-76.eu-west-1.compute.amazonaws.com:8080/graphql'

const MpnQuery = `
query MpnQuery($mpn: MpnInput!) {
  part(mpn: $mpn) {
    mpn {
      manufacturer
      part
    }
    datasheet
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
