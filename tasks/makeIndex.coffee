utils = require('./utils/utils')

if require.main != module

    exports.deps = ['build/.temp/Main.jsx', 'src/index.html', 'build/.temp/boards.json']
    exports.targets = ['build/index.html']
    exports.moduleDep = true

else

    {deps, targets} = utils.processArgs(process.argv)
    utils.reactRender(deps[0], deps[1], targets[0])
