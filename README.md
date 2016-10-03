# https://kitnic.it
**We are giving away free PCB manufacturing vouchers to the first 20
projects that register. Just follow [the instructions
below](#submitting-your-project). Current status: 9/20 left.**

[![build status][travis-status]](https://travis-ci.org/monostable/kitnic) 

Kitnic is a registry of open source hardware electronics projects that are
ready to order and build. The most important elements of a Kitnic project page
are: 

- A prominent link to download the Gerber files and a preview rendering of the board
- The ability to quickly add the required components to a retailer shopping
  cart (using clever magic in the form of our [browser extension][1clickbom]) 

Help us build a open hardware repository of useful electronics projects!

## Get in touch

 - [Join gitter.im chat](https://gitter.im/monostable/kitnic) 
 - IRC freenode#kitnic
 - [Post on our Google Groups mailing list](https://groups.google.com/forum/#!forum/kitnic-discuss)

##Submitting your project

To submit your project to Kitnic, follow these steps:

**1. Export your plotted gerbers & drill data** and check that they will render
nicely using [viewer.tracespace.io][viewer]. Put them into a directory - by
default the path `gerbers/` will be searched. If this is not where they are
stored, please add this info in the kitnic.yaml file (see below).

**2. Create the 1-click-bom file.**
Download the extension and see [the guide on exporting a 1-click-bom from your
design][1clickbom#making]. This format will allow people to quickly purchase
the components.  By default this file is expected to be a `1-click-bom.tsv` in
the root of the project, if the file has a different name or is in a different
location, please add this info in the kitnic.yaml file (see below).

**3. (Optional) Create the YAML project description file.** The `kitnic.yaml`
file allows you to specify a website you would like to link to, give a summary
of your project, pick a rendering color or configure custom paths for the two
requirements above. If you don't have a `kitnic.yaml` with a summary we
will try and find a summary from your repo. If we can't find one the build
will fail.  See [the section below](#kitnicyaml-format) for details of the file
format.

**4. Add your project to a Git repository.**
To have your project included on Kitnic it needs to be in a publicly accessible
Git repository (but it doesn't have to be on GitHub). If you don't know how to
use Git then *don't worry*! - you can easily [create a repo on GitHub][4] and
[upload your files using the web interface][5].

**5. Add your project to Kitnic's board list.**
To add your project to Kitnic, edit the [boards.txt](boards.txt) file, by
appending the full public URL to your repo (including `https://`, `http://`
or`git@` ). Then submit a pull request and Travis CI should confirm that it
builds ok.  If any of the requirements above are not met then this process will
likely fail.

We will then preview your page and merge it so it appears on [kitnic.it](http://kitnic.it).

If you run into any problems please get in touch via [Gitter
chat](https://gitter.im/monostable/kitnic), IRC (freenode#kitnic) or the
[mailing-list](https://groups.google.com/forum/#!forum/kitnic-discuss).


### Kitnic.yaml format

Currently the `kitnic.yaml` makes use of the following fields:

```yaml
summary: A description for your project
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
bom: A path to your 1-click-bom in case it isn't `1-click-bom.tsv`.
gerbers: A path to your folder of gerbers in case it isn't `gerbers/`.

```
Paths should be in UNIX style (i.e. use `/` not `\`) and relative to the root
of your repository. The YAML format is pretty straight forward but if you need
to know more check the example below and [the YAML website][6]. Use [this YAML
validator][yamllint] to be extra sure that your `kitnic.yaml` is valid.

### Some examples
Check out the repo links of the projects listed on
[kitnic.it](https://kitnic.it) already. The minimum required file tree is
something like :

```
.
├── 1-click-bom.tsv
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
summary: A more advanced example
site: https://example.com
color: red
bom: manufacture/advanced-example-BOM.tsv
gerbers: manufacture/gerbers-and-drills
```


## Development
### Requirements

- [Nodejs](https://nodejs.org) >= 4
- [fswatch](http://emcrisostomo.github.io/fswatch/) on OSX/Windows or inotify-tools on Linux
- [Ninja Build](https://github.com/ninja-build/ninja/releases) >= 1.5.1
- [Sass](http://sass-lang.com/install) >= 3.2.12
- The rest of the dependencies can be retrieved via `npm install`

### Running a local dev server

- Get requirements above and make sure executables are on your path
- `npm install`
- `npm start`
- Point your browser at `http://127.0.0.1:8080`. The script should watch for
file-saves and re-build when you change a source file.


[viewer]: http://viewer.tracespace.io
[1clickbom]: https://1clickBOM.com
[yamllint]: http://www.yamllint.com
[1clickbom#making]: https://1clickbom.com/#making-a-1-click-bom
[travis-status]: https://travis-ci.org/monostable/kitnic.svg?branch=master

[4]: https://help.github.com/articles/create-a-repo/
[5]: https://help.github.com/articles/adding-a-file-to-a-repository/
[6]: http://www.yaml.org/start.html
[8]: https://img.shields.io/badge/mailing--list-kitnic--discuss-green.svg
