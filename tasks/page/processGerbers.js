const fs           = require('fs');
const globule      = require('globule');
const path         = require('path');
const yaml         = require('js-yaml');
const Svgo         = require('svgo');
const utils        = require('../utils/utils');
const boardBuilder = require('../../src/board_builder');
const cp           = require('child_process');
const Jszip        = require('jszip');


const svgo = new Svgo({
    full : true,
    plugins : [
        { removeDoctype                  : true  },
        { removeXMLProcInst              : true  },
        { removeComments                 : true  },
        { removeMetadata                 : true  },
        { removeEditorsNSData            : true  },
        { cleanupAttrs                   : true  },
        { minifyStyles                   : false },
        { convertStyleToAttrs            : true  },
        { cleanupIDs                     : true  },
        { removeRasterImages             : true  },
        { removeUselessDefs              : true  },
        { cleanupNumericValues           : true  },
        { cleanupListOfValues            : true  },
        { convertColors                  : true  },
        { removeUnknownsAndDefaults      : true  },
        { removeNonInheritableGroupAttrs : true  },
        { removeUselessStrokeAndFill     : true  },
        { removeViewBox                  : true  },
        { cleanupEnableBackground        : true  },
        { removeHiddenElems              : true  },
        { removeEmptyText                : true  },
        { convertShapeToPath             : true  },
        { moveElemsAttrsToGroup          : false },
        { moveGroupAttrsToElems          : true  },
        { collapseGroups                 : false },
        { convertPathData                : true  },
        { convertTransform               : true  },
        { removeEmptyAttrs               : true  },
        { removeEmptyContainers          : true  },
        { mergePaths                     : true  },
        { removeUnusedNS                 : true  },
        { transformsWithOnePath          : true  },
        { sortAttrs                      : true  },
        { removeTitle                    : true  },
        { removeDesc                     : true  },
        { removeDimensions               : true  },
        { removeAttrs                    : true  },
        { addClassesToSVGElement         : false },
        { removeStyleElement             : false }

    ]});

if (require.main !== module) {
    module.exports = function(config, folder) {
        let file, gerbers, info;
        try {
            file = fs.readFileSync(`${folder}/kitnic.yaml`);
        } catch (error) {}
        if (file != null) {
            info = yaml.safeLoad(file);
        }
        if (__guard__(info, x => x.gerbers) != null) {
            gerbers = globule.find(`${folder}/${info.gerbers}/*`);
        } else {
            gerbers = globule.find(`${folder}/gerbers/*`);
        }
        if (gerbers.length === 0) {
            console.error(`No gerbers found for ${folder}.`);
            process.exit(1);
        }
        const deps = [folder].concat(gerbers);
        const buildFolder = folder.replace('boards', 'build/boards');
        let version = cp.execSync(`cd ${folder} && git log -n 1 --oneline`
        , {encoding:'utf8'});
        version = version.split(' ')[0];
        const zip = `${path.basename(folder)}-${version}-gerbers.zip`;
        const targets = [
            `${buildFolder}/images/top.svg`,
            `${buildFolder}/images/bottom.svg`,
            `${buildFolder}/${zip}`,
            `build/.temp/${folder}/zip-info.json`,
            `${buildFolder}/images/top.png`
        ];
        return {deps, targets, moduleDep:false};
    };
} else {
    let file;
    const {config, deps, targets} = utils.processArgs(process.argv);
    const folder = deps[0];
    const gerbers = deps.slice(1);
    const [topSvgPath, bottomSvgPath, zipPath, zipInfoPath, topPngPath] = targets;
    fs.writeFileSync(zipInfoPath, JSON.stringify(path.basename(zipPath)));
    const zip = new Jszip;
    const folder_name = path.basename(zipPath, '.zip');
    try {
        file = fs.readFileSync(`${folder}/kitnic.yaml`);
    } catch (error) {}
    try {
        let color, data;
        const stackupData = [];
        for (let gerberPath of gerbers) {
            data = fs.readFileSync(gerberPath, {encoding:'utf8'});
            stackupData.push({filename:gerberPath, gerber:data});
            zip.file(path.join(folder_name, path.basename(gerberPath)), data);
        }
        zip.generateAsync({
            type:'nodebuffer',
            compression:'DEFLATE',
            compressionOptions : {level:6}})
        .then(content =>
            fs.writeFile(zipPath, content, function(err) {
                if (err != null) {
                    console.error(`Could not write gerber zip for ${folder}`);
                    throw err;
                }
            })
        );
        if (file != null) { ({ color } = yaml.safeLoad(file)); }
        boardBuilder(stackupData, color || 'green', function(error, stackup) {
            if (error != null) {
                throw error;
            }
            svgo.optimize(stackup.top.svg, result => {
                fs.writeFile(topSvgPath, result.data, function(err) {
                    if (err != null) {
                        console.error(`Could not write top svg for ${folder}`);
                        console.error(err);
                        return process.exit(1);
                    }
                    cp.exec(`inkscape '${topSvgPath}' -e '${topPngPath}' -z -w 720`, (err) =>  {
                        if (err) {
                            console.error(err);
                            return process.exit(1);
                        }
                    })
                })
            });
            return svgo.optimize(stackup.bottom.svg, result =>
                fs.writeFile(bottomSvgPath, result.data, function(err) {
                    if (err != null) {
                        console.error(`Could not write bottom svg for ${folder}`);
                        console.error(err);
                        return process.exit(1);
                    }
                })
            );
        });
    } catch (e) {
        console.error(`Could not process gerbers for ${folder}`);
        console.error(e);
        process.exit(1);
    }
}

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}
