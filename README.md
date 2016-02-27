#Kitnic

[![build status][1]](https://travis-ci.org/monostable/kitnic)

[![Join gitter.im chat][2]](https://gitter.im/monostable/kitnic) or IRC freenode#kitnic

##Submitting your project repo

To have your project included on Kitnic it needs to be in a publicly accessible
git repository (but it doesn't have to be on GitHub). If you don't know how to
use git then don't worry, you can still [create a repo on GitHub][4] and [upload your
files using the web interface][5].

To register your project with Kitnic edit the [boards.txt](boards.txt) file,
appending the full public URL to your repo (including `https://`, `http://` or
`git@` ). Submit a pull request and Travis CI should confirm that it builds ok.
We can then preview your page for you and can merge it so it appears on
[kitnic.it](http://kitnic.it). 

You will need certain things in your repository for this to work:

1. A directory with plotted gerbers, these will be rendered as a preview and offered as a zip for download.
1. A `1-click-BOM.tsv`, this will allow others to quickly purchase the components
   required to make your project. Use the [1-click-BOM extension](http://1clickBOM.com) 
   to help you make this and test it out.
1. (Optional) A `kitnic.yaml` where you can specify a website, give a
   description, pick a rendering color or configure custom paths for the two
   requirements above.

If you don't have a `kitnic.yaml` with a description we will try and find a
description from your repo. If we can't find one the build will fail.

### Kitnic.yaml format

Currently the `kitnic.yaml` makes use of the following fields:

```yaml
description: A description for your project
site: A site you would like to link to (include http:// or https://)
color: The solder resist color of the preview rendering. Can be one of: 
       - green
       - red
       - blue
       - black
       - white
       - orange
       - purple 
       - yellow
bom: A path to your 1-click-BOM in case it isn't `1-click-BOM.tsv`.
gerbers: A path to your folder of gerbers in case it isn't `gerbers/`.

```
Paths should be in UNIX style (i.e. use `/` not `\`) and relative to the root of your
repository. The YAML format is pretty straight forward but if you need to know more check the example below and [the YAML website][6]. Use [this YAML validator][7] to be extra sure that your `kitnic.yaml` is valid.

### Some examples

So, the minimum required file tree is something like :

```
.
├── 1-click-BOM.tsv
└── gerbers
    ├── example.cmp
    ├── example.drd
    ├── example.dri
    ├── example.gko
    ├── example.gpi
    ├── example.gto
    ├── example.plc
    ├── example.sol
    ├── example.stc
    └── example.sts
```

A more advanced example could be something like:

```
.
├── kitnic.yaml
└── manufacture
    ├── advanced-example-BOM.tsv
    └── gerbers-and-drills
        ├── advanced-example-B_Adhes.gba
        ├── advanced-example-B_CrtYd.gbr
        ├── advanced-example-B_Cu.gbl
        ├── advanced-example-B_Fab.gbr
        ├── advanced-example-B_Mask.gbs
        ├── advanced-example-B_Paste.gbp
        ├── advanced-example-B_SilkS.gbo
        ├── advanced-example.drl
        ├── advanced-example-Edge_Cuts.gbr
        ├── advanced-example-F_Adhes.gta
        ├── advanced-example-F_CrtYd.gbr
        ├── advanced-example-F_Cu.gtl
        ├── advanced-example-F_Fab.gbr
        ├── advanced-example-F_Mask.gts
        ├── advanced-example-F_Paste.gtp
        └── advanced-example-F_SilkS.gto
```

with `kitnic.yaml` containing:

```yaml
description: A more advanced example
site: https://example.com
color: red
bom: manufacture/advanced-example-BOM.tsv
gerbers: manufacture/gerbers-and-drills
```


## Development
### Requirements

- npm >= 2.1.6
- sass >= 3.2.12
- inotify-tools or fswatch
- ninja >= 1.5.1

[1]: https://travis-ci.org/monostable/kitnic.svg?branch=master
[2]: https://badges.gitter.im/monostable/kitnic.svg
[3]: https://github.com/monostable/1clickBOM#usage
[4]: https://help.github.com/articles/create-a-repo/
[5]: https://help.github.com/articles/adding-a-file-to-a-repository/
[6]: http://www.yaml.org/start.html
[7]: http://codebeautify.org/yaml-validator
