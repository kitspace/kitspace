utils = require('./utils/utils')

if require.main != module

    exports.deps = ['build/.temp/submit.jsx', 'src/submit.html']
    exports.targets = ['build/submit/index.html']
    exports.moduleDep = true

else

    {deps, targets} = utils.processArgs(process.argv)
    utils.reactRender(deps[0], deps[1], targets[0])
