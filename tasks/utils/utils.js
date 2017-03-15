const {RouterContext} = require('react-router')

exports.processArgs = function(argv) {
    if (argv.length < 5) {
        console.error('not enough arguments');
        process.exit(1);
    }
    if (!argv[0].endsWith('node')) {
        console.error("tasks should be run with 'node' explicitely");
        process.exit(1);
    }
    if (argv[1] !== require.main.filename) {
        console.error('task filename is not in task arguments');
        process.exit(1);
    }
    const sepIndex = argv.indexOf('--');
    const deps = argv.slice(2, (sepIndex - 1) + 1 || undefined);
    const config = process.argv[(sepIndex + 1)];
    const targets = process.argv.slice((sepIndex + 2));
    return {config, deps, targets};
};


exports.reactRender = function(jsx, html, output) {
    const fs = require('fs');
    const React = require('react');
    const ReactDOMServer = require('react-dom/server');
    const DocumentTitle = require('react-document-title');
    const jsdom = require('jsdom');

    require('babel-register')({presets: ['react']});
    const Main = require(process.cwd() + '/' + jsx);

    const react = ReactDOMServer.renderToString(React.createElement(RouterContext, {}, [React.createElement(Main)]));

    const title = DocumentTitle.rewind(react);

    const rawHtml = fs.readFileSync(html, {encoding:'utf8'});
    const document = jsdom.jsdom(rawHtml);

    if (title != null) {
        for (let t of document.head.getElementsByTagName('title')) {
            document.head.removeChild(t);
        }
        const tag = document.createElement('title');
        tag.innerHTML = title;
        document.head.appendChild(tag);
    }

    const content = document.getElementById('content');
    content.innerHTML = react;

    return fs.writeFileSync(output, jsdom.serializeDocument(document));
};
