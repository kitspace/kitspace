const utils = require('./utils/utils');

if (require.main !== module) {

    exports.deps = ['build/.temp/main.jsx', 'src/main.html', 'build/.temp/boards.json'];
    exports.targets = ['build/index.html'];
    exports.moduleDep = true;

} else {

    const {deps, targets} = utils.processArgs(process.argv);
    utils.reactRender(deps[0], deps[1], targets[0]);
}
