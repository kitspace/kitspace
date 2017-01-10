
class: center, middle

<img class=fullscreen src=images/logo.png />

---

- GitHub
  - 3000 KiCAD Projects
  - 7000 Eagle Projects

- OshPark
  - Over 9000 shared projects

- Hackaday.io, EEVblog Forums, etc

---
<br>
<br>
<br>
<center><img src=images/pease.jpg /></center>
---
<img class=fullscreen src=images/meat1.jpg />

---
<img class=fullscreen src=images/meat2.jpg />
---
<img class=fullscreen src=images/meat3.jpg />

---
<h1><li>1-click BOM browser extension</li></h1>
<h1><li>kitnic.it</li></h1>
<center>
<img src=images/apart1.jpg>
</center>
---
# 1-click BOM extension 

- Replicate the web requests that are sent when you use retailer sites.
  - Digikey 
  - Mouser 
  - RS
  - Newark
  - Farnell/Element14
---
#Same origin policy

"The same-origin policy restricts how a document or script loaded from one origin can interact with a resource from another origin." - MDN
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
---

<img class=fullscreen src=images/unit_test.png />

---

<img class=fullscreen src=images/extension.png />

---

# 1-click BOM extension

- Available for Chrome and Firefox
- Takes in tab separated values
- Can load a on-line BOM 
- Able to add/remove to cart 
- Can have a guess at what part you mean
- Open source (CPAL)
- About 250 users

---
<img class=fullscreen src=images/meat3.jpg />

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

---

- NodeJS & React
- GitHub Pages & Travis CI
  - The boards.txt file

```
https://github.com/kasbah/push-on-hold-off
https://github.com/kitnic/BQ25570_Harvester
https://github.com/JarrettR/USBvil
https://github.com/8BitMixtape/NextLevelEdition
https://github.com/dvdfreitag/Signal-Detector

```

- tracespace/pcb-stackup 

<p align=middle><img src=images/stackup.svg></p>

---

<br>
<br>
<br>
<br>
<br>
<br>
<center><h1><a href=https://kitnic.it>kitnic.it</a><h1></center>

---
# The Virtual Kit
<img src=images/kit.jpg />

---

# Planned Features

- Accounts
- Non git-backed projects
- Interface to versioning
- Connect to PCB batching services
- Assembly aide
---
<img class=fullscreen src=images/aide.png />
---

# More Planned Features
- Connect to assembly services
- Better tools for making BOMs
- Live pricing data

---

# How to get involved?
- Add your project 
  - Running a promotion where you get a $25 voucher with Dangerous Prototypes' PCB service
  - 15/20 left
- Web development
- Spread the word
<br />
<br />
<img width=200 src=images/divide.gif />

</font>
---
#Questions?
- [kitnic.it](https://kitnic.it)
- [@kitnic_it](https://twitter.com/kitnic_it)
- [github.com/monostable/kitnic](https://github.com/monostable/kitnic)
<font size=3>
<br />
<br />
<br />
<br />

Image credits

<li>Meat grinder & Disassembled hand-powered grinder - CC-BY-SA 3.0 - Wikipedia - Photos taken by de:user:Kku. Modified by de:user:Rainer Zenz</li>
<li>Bleep Drum Kit with MIDI - CC-BY-SA 2.0 - SparkFun Electronics</li>
<li> GFP-tagged Cln2 - CC-BY - Jean Peccoud - https://www.youtube.com/watch?v=sG2Zd3vRdvQ

