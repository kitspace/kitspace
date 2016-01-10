utils = require('./utils/utils')

if require.main != module

    exports.deps = ['build/.temp/Main.jsx', 'src/index.html']
    exports.targets = ['build/index.html']

else

    {deps, targets} = utils.processArgs(process.argv)
    utils.reactRender(deps[0], deps[1], targets[0])
