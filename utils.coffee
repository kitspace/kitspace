fs = require('fs')
cp = require('child_process')

getVersion = (repo, callback) ->
    id = setTimeout ((repo) ->
        console.error("timed out to get version for #{repo}")
        process.exit(2)
    ).bind(undefined, repo)
    , 10000
    cp.exec "git ls-remote #{repo}", {encoding:'utf8'}, ((repo, id, err, output) ->
        clearTimeout(id)
        hash = output.split('\n')[0].split('\t')[0]
        if not hash? or hash == ''
            console.error("could not get version for #{repo}")
            process.exit(1)
        callback(hash)
    ).bind(undefined, repo, id)


readRepos = () ->
    return fs.readFileSync('./boards.txt', {encoding:'utf8'}).split('\n')
        .filter((l) -> l != '')


repoToFolder = (repo) ->
    folder = repo.replace(/^http:\/\//,'')
    folder = folder.replace(/^https:\/\//,'')
    folder = folder.replace(/^.?@/,'')
    return "boards/#{folder}"


exports.getVersion   = getVersion
exports.readRepos    = readRepos
exports.repoToFolder = repoToFolder
