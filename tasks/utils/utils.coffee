exports.checkArgs = (argv) ->
    if argv.length < 5
        console.error('not enough arguments')
        process.exit(1)
    if argv[0] != 'coffee'
        console.error("tasks should be run with 'coffee' explicitely")
        process.exit(1)
    if argv[1] != require.main.filename
        console.error("task filename is not in argv")
        process.exit(1)
    sepIndex = argv.indexOf('--')
    if (sepIndex <= 2)
        console.error('no seperation of deps and targets')
        process.exit(1)
    deps = argv[2..(sepIndex - 1)]
    targets = process.argv[(sepIndex + 1)..]
    return {deps:deps, targets:targets}
