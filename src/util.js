
function removeReference(immutableMap) {
    return immutableMap.filter((_,k) => k !== 'reference')
}

module.exports = {removeReference}

