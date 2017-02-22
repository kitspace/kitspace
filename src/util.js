
function removeQueryId(immutableMap) {
    return immutableMap.filter((_,k) => k !== 'query_id')
}

module.exports = {removeQueryId}

