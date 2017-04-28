exports.extractLink = function extractLink(selector, doc) {
    const link = doc.querySelector(selector)
    if (link != null) {
        return link.href
    } else {
        return null
    }
}
exports.extractAll = function extractAll(selector, doc) {
    const nodes = doc.querySelectorAll(selector)
    const ret = []
    for (let i = 0; i < nodes.length; ++i) {
        ret.push(nodes[i].innerHTML.trim())
    }
    return ret
}

exports.extract = function extract(selector, doc) {
    const item = doc.querySelector(selector)
    if (item != null)  {
        return item.innerHTML.trim()
    }
    else {
        return null
    }
}
