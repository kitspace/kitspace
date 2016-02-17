#Kitnic

[![build status][1]](https://travis-ci.org/monostable/kitnic)

[![Join gitter.im chat][2]](https://gitter.im/monostable/kitnic) or IRC freenode#kitnic

##Submitting your project repo

### Required
1. A `1-click-BOM.tsv` in the root of your repo, or specify another location
     of the `.tsv` in `kitnic.yaml` using the `bom:` field. You should use the [1-click-BOM extension](http://1clickBOM.com) to make and test these out.
1. Gerbers in a folder called `gerbers` in the root of your repo. You can
     specify another location in `kitnic.yaml` using the `gerbers:` field
1. A `description:` field in `kitnic.yaml` or a description on GitHub if you
   are using GitHub

###Optional
1. A `color:` field in `kitnic.yaml` to specify a rendering color of the
      solder resist on kitnic.it, this can be one of `green`, `red`, `blue`,
      `black`, `white`, `orange`, `purple` or `yellow`. The default if not color is specified is `green`.
1. A `site:` field to link to an external site

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

```
description: A more advanced example
site: https://example.com
color: red
bom: manufacture/advanced-example-BOM.tsv
gerbers: manufacture/gerbers-and-drills
```


## Development
### Requirements

- npm >= 2.1.6
- inotify-tools or fswatch
- ninja >= 1.5.1 

[1]: https://travis-ci.org/monostable/kitnic.svg?branch=master
[2]: https://badges.gitter.im/monostable/kitnic.svg
[3]: https://github.com/monostable/1clickBOM#usage
