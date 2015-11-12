ninjaBuildGen = require('ninja-build-gen')

ninja = ninjaBuildGen('1.3', 'build')

ninja.rule('run').run('http-server build/')
    .description('Spin up a development server')

ninja.edge('serve').using('run')

ninja.byDefault('serve')

ninja.save('build.ninja')

