
class: center, middle

<img class=fullscreen src=images/logo.png />

---
# The Idea

How can I get someone else to buy the parts I need?

![](images/nexus-main.jpg)

---
#How hard could it be?


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
- Supports:
  - Digikey 
  - Mouser 
  - RS
  - Newark
  - Farnell/Element14
- Takes in tab separated values
- Able to add/remove to cart 
- Can have a guess at what part you mean
- Open source (CPAL)
- About 250 users

---

- GitHub
  - 3000 KiCAD Projects
  - 7000 Eagle Projects

- OshPark
  - Over 9000 shared projects

---

<img class=fullscreen src=images/greener.jpg />

---

<img class=fullscreen src=images/greener2.jpg />

---

<img class=fullscreen src=images/greener3.jpg />

---
<img class=fullscreen src=images/meat1.jpg />

---
<img class=fullscreen src=images/meat2.jpg />
---
<img class=fullscreen src=images/meat3.jpg />
---
- Git repository
- Tab separated values
  - 1-click-bom.tsv
  - At minumum: References, Quantity and MPN
- RS274-X Gerbers and Excellon drills

<center>
<img src=images/apart1.jpg>
</center>
---

- NodeJS & React
- 1-click BOM extension
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

<p align=middle><img src=https://camo.githubusercontent.com/a93fc9e232decf64f3816dada7a7593bb1ed76ae/68747470733a2f2f747261636573706163652e6769746875622e696f2f7063622d737461636b75702f6578616d706c652f61726475696e6f2d746f702e737667></p>

---

<br>
<br>
<br>
<br>
<br>
<br>
<center><h1><a href=https://kitnic.it>kitnic.it</a><h1></center>

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

</font>
---
#Questions?
- [kitnic.it](https://kitnic.it)
- [@kitnic_it](https://twitter.com/kitnic_it)
- [github.com/monostable/kitnic](https://github.com/monostable/kitnic)
<br>
<br>
<br>
<br>
<br>
<br>

<font size=3>

Image credits
<li>Brown Sod, Green Sod - CC-BY 2.0 https://www.flickr.com/photos/mukluk/</li>

<li>Meat grinder & Disassembled hand-powered grinder - CC-BY-SA 3.0 - Wikipedia - Photos taken by de:user:Kku. Modified by de:user:Rainer Zenz</li>

