
class: center, middle

<img class=fullscreen src=images/logo.png />

???
- My name is Kaspar
- Here to talk about a webservice and browser extension that make it easier to replicate electronics projects

---

![](images/bls_125_banner.gif)

In the US: 
- 1,114,000 Software Developers
- 315,900 Electrical and Electronic Engineers

![](images/reddit.jpg)

Reddit: 
- `/r/programming` 720,000 subscribers
- `/r/electronics` 66,000 subscribers

???
- I'd like to give some context for these projects
- The motivation behind their approach
- Maybe a million software developers and 300,000 electronic engineers in the US
- A similiar ratio if you look at these sub-reddits
- Gives you an idea of the size of our field

---

# On the other hand

- there is about __one__ EE to every __three__ programmers
- __one__ in __ten__ software devlopers know C  (maybe, according to TIOBE)

- `/r/electronics` 66,000 subscribers
- `/r/c_programming` 30,000 subscribers

???

- But if you reduce it down to just C developers
- There are probably less C developers than electronic engineers
- Obviously these are just rough figures

---

# Where is the Linux of electronics?

<img style="height:400px;float:right" src=images/ohr_logo.svg />

???

- But the really interesting question for me is, why are there no hugely collaborative electronic engineering efforts? 
- Something at the scale of say, Linux
- This penguin here is actually the logo of the open hardware repository, from our friends at CERN, and there are a few other projects out there looking at this issue
- I imagine there are quite a few people out there asking this question

---
# Assemblers and compilers

<img style="width:49%;" src=images/soldering_meeblip.jpg />
<img style="width:49%;float:right;" src=images/pick_and_place.jpg />

???
- Despite the numbers of electronic engineers, electronic engineering is not a pure information technology
- We have to move atoms in physical space
- Which means money needs to be spent
- But we do have increased automation and decreased cost

---
<img style="z-index:0; top:0px;height:681px;position:absolute" src=images/circuit_boards.jpg />

???
- The cost reduction in PCB batching services is giving more and more people the opportunity to make professional grade PCBs
- __it's tantalizingly close__

---

# We do share projects 
- GitHub
  - 3000 KiCAD Projects
  - 7000 Eagle Projects

- OshPark
  - Over 9000 shared projects

- Hackaday.io, EEVblog Forums, etc

???

- We do share projects
- This is a rough survey I did last years on the numbers of projects you can find online
- This is not including other popular ways to share projects such as Hackaday and forums
- __So what's the problem?__ 

---
<br>
<br>
<br>
<center><img src=images/pease.jpg /></center>

???

- Often it takes considerable effort to understand someone else's work
- Projects can be simultaneously brilliant but not reproducable
- There is no clear standard way to present the information that reduces the friction

---
<img class=fullscreen src=images/meat1.jpg />

???
- So what we would like, is something that incorporates all these different ways of doing things

---
<img class=fullscreen src=images/meat2.jpg />

???
- Allows you to make the PCB

---
<img class=fullscreen src=images/meat3.jpg />

???
- And allows you to purchase the parts

---

<img src=images/kitnic_logo.png />kitnic.it

<center>
<img class=fullscreen src=images/meat_apart.jpg>
</center>

???

- And this is my approach to try and solve this
- The Kitnic.it web service
- and the 1-click BOM browser extension

---

# 1-click BOM extension 
<img style="float:right" src=images/1_click_logo.png />

Automates purchasing by replicating the web requests that are sent when you use retailer sites:
- Digikey 
- Mouser 
- RS
- Newark / Farnell / Element14

???

- The browser extension tries to completely reduce the friction between a BOM and the retailer shopping cart
- It does this by replicating the web requests that your browser sends when using the site
- Currently works for these retailers

---
- Q: Why a browser extension and not just a website?
- A: Same origin policy

"The same-origin policy restricts how a document or script loaded from one origin can interact with a resource from another origin." - MDN

???

- So you might ask why couldn't you offer this as a webpage?
- The same origin policy would restrict these interactions

---

<img class=fullheight src=images/cors.jpeg />

???

- The same origin policy means that retailers would need to open up the endpoints to allow these interactions

---
```
curl
'http://uk.mouser.com/ProductDetail/Cree-Inc/CGHV96100F2/?Cree-Inc
%2fCGHV96100F2%2f&qs=sGAEpiMZZMvplms98TlKY6zbNRoARc
Ug8gg333Al67kStE%252bN8N0%2fKg%3d%3d'
-H 'Cookie: g11n=Up9NRXFGLVs=;
ME_Main=&ME_DSN=kJ0slznDUsNJMyNjQRiw8Q==&ME_DSU=YyaQEeoCnLc=;
ASP.NET_SessionId=zxtlgy45oobekaaphyv5n0z1;
_op_aixPageId=a2_60d31424-8123-4e84-b3f9-a18a6f8bfc3d-3648-87767;
CARTCOOKIEUUID=c46df9ef-39bb-4ada-bfcd-2452ed49bc8a; _gat=1;
__ar_v4=5UM3NRP3LFFG5JUPQ2VEXA%3A20150203%3A12%7CVPQ73SPSLBEPXM7QJ2MJRL%3A20150203%3A12%7CA463QQQT6VD37AVLWC4RZU%3A20150203%3A12;
SDG1=12; SDG2=40; SDG3=0; preferences=ps=gb&pl=en-GB&pc_gb=GBP;
_ga=GA1.2.91020740.1409853093;
__utma=261309969.91020740.1409853093.1417720020.1422769855.8;
__utmb=261309969.15.10.1422769855; __utmc=261309969;
__utmz=261309969.1409853093.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none);
__utmv=261309969.|14=MYM=1638924=1^16=UV=5423887=1^18=Sub=1795089=1^19=PCAT=5367B8=1;
__atuvc=1%7C5; __atuvs=54cdc5eabb3480fd000; __utmli=ctl00_ContentMain_btnBuy2'
-H 'Origin: http://uk.mouser.com' -H 'Accept-Encoding: gzip, deflate' -H
'Accept-Language: en-GB,en-US;q=0.8,en;q=0.6' -H 'User-Agent: Mozilla/5.0 (X11;
Linux i686) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/39.0.2171.65
Chrome/39.0.2171.65 Safari/537.36' -H 'Content-Type:
application/x-www-form-urlencoded' -H 'Accept:
text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8' -H
'Cache-Control: max-age=0' -H 'Referer:
http://uk.mouser.com/ProductDetail/Cree-Inc/CGHV96100F2/?qs=sGAEpiMZZMvplms98TlKY6zbNRoARcUg8gg333Al67kStE%252bN8N0%2fKg%3d%3d'
-H 'Connection: keep-alive' --data
'__EVENTTARGET=&__EVENTARGUMENT=&__VIEWSTATE=skTHKc%2BTu8q1ptksBWazoqW1jH%2F9s
30wKeqLaG6vPBO92Ae4BJFGniiNMJOdrxMC0BKNq0OgMPn9jzXyEnh%2BhZElrKrDDEwTj6wDz%2BB
5Mc8596z13lM4bwTtSkhsckjY87ZWffCEhuwhyb5YCmSMivmI453lwnERDa8eObcoNnPPaM0TNaN0o
X6eY%2FQ0eiyT%2FJsDR6vWe4u1sV0sPkLebGRRWfI4chXx3bL9X0CXPlXzEjYBjSMVFvahuPicHdx
N4QG31f8teVRA4a6JqwXeveNQi8J4yp2Euq3lgQnEjPAWpjeUEq5tXJbII8qczxQBrYBFu7ebLbyl
PNsPfrOeY6REXhUiEV1...
```
???

- Anyway, these are the kind of requests we are trying  to replicate
- It's not a nice API by any means
- And we need to scrape the site to get some of this information to send

---

<img class=fullscreen src=images/unit_test.png />


???
- So the only way to make this work 
- And ensure that it keeps working
- Is to use a lot of integration tests to test this across all the different sites 

---

<img class=fullscreen src=images/extension.png />

???

- But this is what the extension looks like
- You normally use it in addition to a spreadsheet program and copy and paste from it
- And you can quickly accesss all the retailer functionality from there


---

# 1-click BOM extension

- Available for Chrome and Firefox
- Takes in tab separated values (the clipboard format of spreadsheet programs)
- Can load a online BOM 
- Able to add to and remove from cart 
- Can have a guess at what part you mean
- Open source (CPAL)
- About 500 users

???

---
<img class=fullscreen src=images/meat3.jpg />

???

- So this kind of solves one aspect of our goal. 
- We can replicate  purcheses across the globe 
- But it doesn't include the PCB and there is no standard way to package a complete project to be replicated

---
#Kitnic.it
- Git repository
- Tab separated values
  - 1-click-bom.tsv
  - At minumum: References, Quantity and Part Number
- RS274-X Gerbers and Excellon drills

```
.
├── 1-click-bom.tsv
└── gerbers
    ├── board.cmp
    ├── board.drd
    ├── board.dri
    ├── board.gko
    ├── board.gpi
    ├── board.gto
    ├── board.stc
    └── board.sts
```

???

- So this is where kitnic.it comes in. 
- We combine the BOM with gerber files and put the in a Git repository
- And kitnic.it makes a page out of this for people to access

---

<br>
<br>
<br>
<br>
<br>
<br>
<center><h1><a href=https://kitnic.it>kitnic.it</a><h1></center>
<center><a href=http://localhost:8080>localhost:8080</a><h1></center>

??? 

---
# The Virtual Kit

<img height=500px src=images/kit.jpg />

??? 

The idea really is that, creators can put together a virtual kit, that others can buy themselves, and we can share open hardware designs that way. With the least amount of friction.

Are there any questions at this point?

---
<img style="left:0;" height=150px src=images/travis_pipeline.png />
- Static site hosting on Netlify and AWS
- Travis CI builds every branch
- All branches are deployed to `*.preview.kitnic.it` sub-domains
- Master branch is deployed to `kitnic.it`
- Register by editing the boards.txt file

```
https://github.com/kasbah/push-on-hold-off
https://github.com/kitnic/BQ25570_Harvester
https://github.com/JarrettR/USBvil
https://github.com/8BitMixtape/NextLevelEdition
https://github.com/dvdfreitag/Signal-Detector

```

???
- This is the infrastructure behind kitnic
- We use static site hosting 

---

# Planned features

1. Accounts
1. File upload and user project management
1. Improved tools for making BOMs

---
# More features

1. Option to auto-publish user's projects from GitHub and Dropbox
1. Tagged releases and versioning
1. Connect to PCB batching services
1. Connect to assembly services

---
<img class=fullscreen src=images/aide.png />
---
<center><img class=fullscreen src=images/bicyle_incremental.png /></center>
---

#Is the browser extension the best way? 

CORS endpoints are available for some retailers!

---

###Is the browser extension the best way? 

Pro:

- Flexibility and development speed
- New retailers can be added at will
- Web Extensions will allow one codebase for Chrome, Firefox and Microsoft Edge

Con:
- Does a user _want_ to install an extension?
- Based on web-scraping, can break at any point

---

# Towards sustainablity?

```
| Item               | Cost  |
|--------------------+-------|
| Google Web Store   | $5    |
| Contractor's time  | $2500 |
| Free PCB promotion | $500  |
| Domain names       | $20   |
| Hosting            | $0    |
| Kaspar's time      | ???   |
```


1. Track purchasing referrals?
1. Paid private accounts?

---
<br/>
<br/>
<br/>
<br/>
<br/>
 <center><h1>Show me the code!<h1><center>
---
<br/>
<br/>
<center><img src=images/javascript_everywhere.jpg /></center>
---

##1-click BOM
- No more Coffeescript
- But we still compile from ES6 to ES5!

---

##Kitnic 
React front-end

Micro services:

- `git-clone-server.kitnic.it`
    - clone git repos and serve the files
    - <i class="fa fa-github"></i> [kasbah/git-clone-server](https://github.com/kasbah/git-clone-server)
- `freegeoip.kitnic.it`
    - IP geolocation
    - <i class="fa fa-github"></i> [fiorix/freegeoip](https://github.com/kasbah/git-clone-server)

---
<svg width=400px viewBox="0 0 18 7">
  	<path fill="#CB3837" d="M0,0v6h5v1h4v-1h9v-6"></path>
  	<path fill="#FFF" d="M1,1v4h2v-3h1v3h1v-4h1v5h2v-4h1v2h-1v1h2v-4h1v4h2v-3h1v3h1v-3h1v3h1v-4"></path>
</svg>

Over 350,000 javascript packages

e.g. left-pad:

```js
module.exports = leftpad;
function leftpad (str, len, ch) {
  str = String(str);
  var i = -1;
  if (!ch && ch !== 0) ch = ' ';
  len = len - str.length;
  while (++i < len) {
    str = ch + str;
  }
  return str;
}
```
---
[pcb-stackup](https://github.com/tracespace/pcb-stackup)

```
pcb-stackup
├─┬ gerber-to-svg
│ ├── gerber-parser
│ └── gerber-plotter
└── whats-that-gerber
```

<p align=middle><img width=80% src=images/stackup.svg></p>
---
## Let's build an equality function for resistor descriptions!
<img style="max-width:300px;float:right;" src=images/resistors.jpg />
E.g.
  - 100 Ohm
  - 100R
  - 1k5
  - 1M Ω

---

```sh
# creates a package.json file
npm init
# installs dependencies and saves to package.json
npm install --save js-quantities resistor-data
```

```js
//index.js
const Qty = require('js-quantities')
const resistorData = require('resistor-data')

function extract(R) {
    //"100 Ohm" or "100 Ω" style
    const match1 = /\d+\.?\d* ?(ohm|Ω|Ω)/i.exec(R)
    if (match1) {
        return Qty(match1[0])
    }
    //"1k5", "1M" or "100R" style
    const match2 = /\d+(k|m|r)\d*/i.exec(R)
    if (match2) {
        const v = resistorData.notationToValue(match2[0]) + ' ohm'
        return Qty(v)
    }
}

function equal(R1, R2) {
    return extract(R1).eq(extract(R2))
}

```

---

`index.js`

```diff
-function equal(R1, R2) {
+module.exports = function equal(R1, R2) {
     return extract(R1).eq(extract(R2))
 }
```
`package.json`
```json
{
  "name": "r-equal",
  "version": "1.0.0",
  "description": "Function to test if resistor values are equal",
  "main": "index.js",
  "license": "ISC",
  "dependencies": {
    "js-quantities": "^1.6.5",
    "resistor-data": "^1.0.0"
  }
}
```

```sh
npm publish
```


---

# Extend and combine this with: 
- Octopart and Findchips search 
- The Common Parts Library ([CC-By Octopart in YAML format](https://github.com/octopart/cpl-data))

<img width=100% src=images/cpl_data.png />

---

<video controls=true class=fullscreen src=images/demo.mp4 />

---



# How to get involved?
- Add your project and you'll get free PCB manufacturing (8/20 left)
- Web development
- Spread the word
<br />
<br />
<img style="float:right" width=200 src=images/divide.gif />

</font>
---
#Questions?
- [kitnic.it](https://kitnic.it)
- <i class="fa fa-twitter" aria-hidden=true ></i>[@kitnic_it](https://twitter.com/kitnic_it)
- <i class="fa fa-github" aria-hidden=true ></i> [github.com/monostable/kitnic](https://github.com/monostable/kitnic)
- slides: kitnic.it/fosdem2017
<font size=3>
<br />
<br />

Image credits

- ohwr.org logo - CC-BY-SA [CERN](http://www.ohwr.org/documents/3)
- Eric Archer soldering a MeeBlip 6 - CC-BY-SA [Create Digital Media](https://www.flickr.com/people/21681011@N08)
- Pick and place internals of surface mount machine - CC-BY [Periptus](jhttps://commons.wikimedia.org/wiki/User:Peripitus)
- Circuit board evolution - CC-BY [Feesta.com](http://feesta.com/post/102813775604/circuit-board-evolution-3d-is-hard-but-not-as) 
- Cover of Troubleshooting Analog Circuits by Robert A. Pease - © 1991 by Butterworth-Heinemann
- Meat grinder & Disassembled hand-powered grinder - CC-BY-SA [Kku](https://commons.wikimedia.org/wiki/de:User:Kku) and [Rainer Zenz](https://commons.wikimedia.org/wiki/de:user:Rainer Zenz)
- Bleep Drum Kit with MIDI - CC-BY-SA SparkFun Electronics
- Iterative development drawing - © [Henrik Kniberg](http://blog.crisp.se/2016/01/25/henrikkniberg/making-sense-of-mvp)
- 3 Resistors - CC-BY-SA [Afrank99](https://commons.wikimedia.org/wiki/User:Afrank99)
-  GFP-tagged Cln2 - CC-BY - [Jean Peccoud](https://www.youtube.com/watch?v=sG2Zd3vRdvQ)

