const superagent = require('superagent')
const ramda      = require('ramda')

const partinfoURL = 'https://partinfo.kitnic.it/graphql'

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
    specs {
      key
      name
      value
    }
  }
}`

function getPartinfo(lines) {
  const requests = lines.map(line => {
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
  return Promise.all(requests).then(ramda.flatten)
}

module.exports = getPartinfo
