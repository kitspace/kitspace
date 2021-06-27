# https://kitspace.org

[![Build and deploy workflow status badge](https://github.com/kitspace/kitspace/actions/workflows/build_and_deploy.yml/badge.svg?branch=master)](https://github.com/kitspace/kitspace/actions/workflows/build_and_deploy.yml?query=branch%3Amaster)
[![Backers on Open Collective](https://opencollective.com/kitspace/backers/badge.svg)](#backers)
[![Sponsors on Open Collective](https://opencollective.com/kitspace/sponsors/badge.svg)](#sponsors)

> [Watch a 5 minute lightning-talk about Kitspace from the 35th Chaos Communication Congress (35C3)](https://media.ccc.de/v/35c3-9566-lightning_talks_day_2#t=477).

[![video](image_src/35c3_lightning.jpg)](https://media.ccc.de/v/35c3-9566-lightning_talks_day_2#t=477)

Kitspace (formerly Kitnic) is a registry of open source hardware electronics
projects that are ready to order and build. It could be described as a
"Thingiverse for electronics". The most important elements of a Kit Space
project page are what allow a design to be manufactured:

- A preview of the printed circuit board and prominent link to download the Gerber manufacturing files
- The ability to quickly add the required components to a distributor shopping
  cart (using our [browser extension][1clickbom])


Help us build an open hardware repository of useful electronics projects!

## Get in touch

 - [Subscribe to the Kitspace newsletter](https://kitspace.org/newsletter/)
 - [Follow Kitspace on Twitter](https://twitter.com/kitspaceorg)
 - Join our chatroom: _choose your preferred platform, they are bridged so we can all talk across platforms_
     - [Discord](https://discord.gg/nFjDCZqghC)
     - [Matrix.org][element-chat]
     - IRC: irc.libera.chat#kitspace (e.g. [via Kiwi IRC](https://kiwiirc.com/nextclient/irc.libera.chat/kitspace))


## How many people visit the site?

Our visitor stats are public [on plausible.io](https://plausible.io/kitspace.org).

## pcb-stackup

The renderings of the PCB files are made using [pcb-stackup](https://github.com/tracespace/pcb-stackup).
You can get similar renderings and also inspect invdividual layers, using the [tracespace gerber viewer](https://tracespace.io/view).

## Adding your project

Check out [kitspace.org/submit](https://kitspace.org/submit) which will guide you through the process.

### kitspace.yaml format

Currently the `kitspace.yaml` makes use of the following fields:

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
eda:
  type: kicad
  pcb: path/to/your/file.kicad_pcb
readme: A path to your README file in case it isn't in the repository root directory.
multi: Identifier field only used if the repository contains multiple projects.

```
Paths should be in UNIX style (i.e. use `/` not `\`) and relative to the root
of your repository. The YAML format is pretty straight forward but if you need
to know more check the example below and [the YAML website][6]. Use [this YAML
validator][yamllint] to be extra sure that your `kitspace.yaml` is valid.

### KiCad PCB

If you you used KiCad for your design you can also specify a KiCad PCB file to use by adding an `eda` field.

```yaml
eda:
  type: kicad
  pcb: path/to/your/file.kicad_pcb

```

If your project has a KiCad PCB file, and interactive assembly guide
for the board will be created using the [Interactive HTML BOM
plugin](https://github.com/openscopeproject/InteractiveHtmlBom) from
the [Open Scope Project](https://github.com/openscopeproject).

If both `eda` and `gerbers` are present the Gerber files will be used.

### Some examples

Check out the repo links of the projects listed on
[kitspace.org](https://kitspace.org) already. The minimum required file tree is
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
├── kitspace.yaml
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

with `kitspace.yaml` containing:

```yaml
summary: A more advanced example
site: https://example.com
color: red
bom: manufacture/advanced-example-BOM.tsv
gerbers: manufacture/gerbers-and-drills
```

#### The multi field

> NOTE: `multi` doesn't yet work with the [kitspace.org/submit](https://kitspace.org/submit) preview tool. See issue [#182](https://github.com/kitspace/kitspace/issues/182).

Kitspace supports multiple projects in one repository with the `multi` field. When multiple projects exist, `multi` will always be the first field in the `kitspace.yaml`, with the paths to your projects folder nested underneath.

```
├── kitspace.yaml
├── project_one
│   ├── 1-click-bom.tsv
│   ├── README.md
│   └── gerbers
│       ├── example.cmp
│       ├── example.drd
│       ├── example.dri
│        ...
│       ├── example.stc
│       └── example.sts
└── project_two
    ├── 1-click-bom.tsv
    ├── README.md
    └── gerbers
        ├── example.cmp
        ├── example.drd
        ├── example.dri
         ...
        ├── example.stc
        └── example.sts

```

with `kitspace.yaml` containing:

```yaml
multi:
    project_one:
        summary: First project in a repository.
        color: blue
        site: https://example-one.com
    project_two:
        summary: Second project in a repository.
        color: red
        site: https://example-two.com
```

If you want to use custom paths for the `readme`, `bom`, or `gerbers` then note that these are from the root of the repository.

E.g.

```
├── kitspace.yaml
├── manufacturing_outputs
│   └── project_one_gerbers
│       ├── example.cmp
│       ├── example.drd
│       ├── example.dri
│        ...
│       ├── example.stc
│       └── example.sts
├── project_one
│   ├── documentation
│   │   └── README.md
    └── BOM.csv
└── project_two
    ...
```

```yaml
multi:
    project_one:
        readme: project_one/documentation/README.md
        bom: project_one/BOM.csv
        gerbers: manufacturing_outputs/project_one_gerbers
    project_two:
      ...
```

### Terms and Conditions for Adding a Project

1. We (Kitspace developers) do not claim any ownership over your work, it remains yours.
2. By submitting your project you give us permission to host copies of your files for other people to download.
3. If you change your mind, you can remove your project any time by removing the public git repository, sending a pull-request to remove it from [`boards.txt`](https://github.com/kitspace/kitspace/blob/master/boards.txt) or notifying [@kasbah](https://github.com/kasbah) in some other way.

## Development

### Architecture

This repository is the Kitspace front-end. The contents including all project
data are currently pre-compiled into a static site.  The main part of the site
that requires server side components is the submission preview (`/submit`). Pages also use freegeoip lookup to decide what sites to link to for people that do not have the 1-click BOM browser extension. This roughly illustrates the main data flow when someone is browsing the site.

![](docs/current.png)

We have two services running for the submission preview.

- [git-clone-server](https://github.com/kasbah/git-clone-server) for serving up files from git repositories.
- [partinfo](https://github.com/kitspace/kitspace-partinfo) for getting part information for the BOM.

And one for the geo ip lookup on pages.

- [freegeoip](https://github.com/fiorix/freegeoip)

### Requirements

- [Nodejs](https://nodejs.org) version 10 or higher
- [fswatch](http://emcrisostomo.github.io/fswatch/) on OSX/Windows or inotify-tools on Linux
- [Ninja Build](https://github.com/ninja-build/ninja/releases) >= 1.5.1
- [Inkscape](https://inkscape.org/) (v0.92) for converting SVGs to PNGs
- [Yarn](https://yarnpkg.com/) to ensure the correct dependencies are installed
- The rest of the dependencies can be retrieved via `yarn install`

#### Quick start for Debian/Ubuntu

```
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt update && sudo apt install git nodejs inotify-tools ninja-build inkscape yarn
git clone https://github.com/kitspace/kitspace && cd kitspace
yarn install
```

### Running a local dev server

Get requirements above then:

```bash
yarn install    # retrieves dependencies
yarn get-boards # gets the test projects and puts them into boards/
yarn build      # generates a build.ninja file using the ./configure script
# and calls ninja to execute the build.ninja file which builds everything (similar to how make executes a makefile)
yarn serve      # starts a development server to preview the site
```

Visit http://127.0.0.1:8080 in your browser to see your local development site.

[viewer]: http://viewer.tracespace.io
[1clickbom]: https://1clickBOM.com
[yamllint]: http://www.yamllint.com
[1clickbom#making]: https://1clickbom.com/#making-a-1-click-bom
[element-chat]: https://app.element.io/#/room/#kitspace:matrix.org

[4]: https://help.github.com/articles/create-a-repo/
[5]: https://help.github.com/articles/adding-a-file-to-a-repository/
[6]: http://www.yaml.org/start.html

## Code of Conduct

We are committed to making working on Kitspace an inclusive and welcoming environment. All contributors are expected to abide by our [code of conduct](code_of_conduct.md). It's just common sense.

## Contributors

This project exists thanks to all the people who contribute.
<a href="https://github.com/kitspace/kitspace/graphs/contributors"><img src="https://opencollective.com/kitspace/contributors.svg?width=890&button=false" /></a>


## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/kitspace#backer)]

<a href="https://opencollective.com/kitspace#backers" target="_blank"><img src="https://opencollective.com/kitspace/backers.svg?width=890"></a>


## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/kitspace#sponsor)]

<a href="https://opencollective.com/kitspace/sponsor/0/website" target="_blank"><img src="https://opencollective.com/kitspace/sponsor/0/avatar.svg"></a>
<a href="https://opencollective.com/kitspace/sponsor/1/website" target="_blank"><img src="https://opencollective.com/kitspace/sponsor/1/avatar.svg"></a>
<a href="https://opencollective.com/kitspace/sponsor/2/website" target="_blank"><img src="https://opencollective.com/kitspace/sponsor/2/avatar.svg"></a>
<a href="https://opencollective.com/kitspace/sponsor/3/website" target="_blank"><img src="https://opencollective.com/kitspace/sponsor/3/avatar.svg"></a>
<a href="https://opencollective.com/kitspace/sponsor/4/website" target="_blank"><img src="https://opencollective.com/kitspace/sponsor/4/avatar.svg"></a>
<a href="https://opencollective.com/kitspace/sponsor/5/website" target="_blank"><img src="https://opencollective.com/kitspace/sponsor/5/avatar.svg"></a>
<a href="https://opencollective.com/kitspace/sponsor/6/website" target="_blank"><img src="https://opencollective.com/kitspace/sponsor/6/avatar.svg"></a>
<a href="https://opencollective.com/kitspace/sponsor/7/website" target="_blank"><img src="https://opencollective.com/kitspace/sponsor/7/avatar.svg"></a>
<a href="https://opencollective.com/kitspace/sponsor/8/website" target="_blank"><img src="https://opencollective.com/kitspace/sponsor/8/avatar.svg"></a>
<a href="https://opencollective.com/kitspace/sponsor/9/website" target="_blank"><img src="https://opencollective.com/kitspace/sponsor/9/avatar.svg"></a>


