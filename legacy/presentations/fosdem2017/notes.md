1.
    - Here to talk about a website I made called Kitnic which is for sharing electronic projects.
    - Slides are available at the address printed there
1. 
    - It seems like we are living in the beginnings of a golden age of open hardware  
    - People are sharing  more and more projects online
    - GitHub
        - 3000 Kicad Projects
        - 7000 Eagle Projects
    - Over 9000 shared projects shared on OshPark
    - And that's not counting the Hackaday.io projects, the blogs and forums
    - We want to process all these different ways of sharing making and sharing electronic projects 
1. 
    - But some of the most interesting projects are simultaneously brilliant and useless.
1. 
    - We have all these different ways of making and sharing things
1. 
    - And we want to get a board out of it
1.
    - And we want the right parts ordered
1.
    - So this is my primitive meat grinder. 
    - A browser extension that allows you to easily purchase an re-purchase electronic parts
    - And a site to share your complete projects with others
1. 
    - The extension's purpose is to automate what you do on these retailer sites when you buy parts
    - So far it works with Digikey, Mouser, RS, Newark, Farnell/Element14
1. 
    - The reason this has to be a browser extension is that it's generally accepted good practice to not allow other websites to change things in your shopping carts.
1.
    - It turns out the retailer websites don't really have APIs and are really not geared towards automating this process.
    - This is a request you have to send to add something to the Mouser cart.
    - I thought, well this is never going to work, but it might. 
1.
    - The only way it will work is if I thoroughly test it across countries and retailers.
    - Turns out this was a good approach and I am able to keep up with changes the retailers make to their sites fairly easily. 
1.
    - This is what working with the extension looks like
    - An extension that links a spreadsheet with your retailer shopping cart.
    - You copy and paste into it. 
    - And you copy out of it back into your spreadsheet. 
    - You can drive the retailer sites this way
1.
    - It's available for Chrome and Firefox
    - Takes in tab-separated values, this is the clipboard format of spreadsheets
    - Supports 5 retailers
    - Add and remove from shopping cart
    - Can have a guess at what part you mean by searching Octopart and Findchips
    - Open source under CPAL license
    - About 250 users
1. 
    - Getting back to the meat-grinder, we are not quite there yet.
    - We have a way of sharing a list of part with people
    - I wanted to make a place where people could share a more complete project, still with these two elements 
1. 
    - So to make a start I decided on some defaults
    - A git repository, for now as everyone can get some hosting for that
    - Tab separated values
         - the format that works with the extension
         - it displays nicely on github
         - we'll require the bare minimum to allow someone to potentially re-purchase
    - RS274-X Gerbers and Excellon drills, because this is what every PCB fab accepts
    - IPC-2581, ODB++ look like interesting formats that try and capture more information, but for now hardly anyone seems to be using them

1. 
    - Since the extension is Javascript, and the front-end will need to be Javascript, I am just continuing to write more and more javascript, for better or worse
    - Of course it hooks up with the extension
    - There is actually some surprising amount of functionality without the extension
        - I found some undocumented ways to add things to retailer carts
        - For full functionality we still need the extension
    - We make heavy use of build automation throught Travis CI
    - And the static site hosting that GitHub provides
    - The registry is currenly a simple text file in the root of the source code repository
    - People put things into the right format and send me a request to append their git URL
    - Everytime a new project is added the whole site is re-built
    - This definitely won't scale well with projects added, but does scale well with traffic, uptime of the website has been absolutely flawless
    - I found a really neat project by Michael Cousins that converts gerbers to SVG and is able to make these beautiful previews of a board
    - This way everyone can immediately see what a project is about from the board, and you don't have to add a picture
1.
    - So let's take a look at the site
    - We have all the previews of the boards and short descriptions
    - We can search
    - We have a prominent link to the Gerbers
    - And we can easily buy the right parts
    - We get an indication here, with the color button if all the parts have been specified for a retailer
    - I recently added a README rendering, which makes a project much more approachable
1.
    - We will have to move away from this client side only approach
    - Hardware engineers don't really like to use git necessarily, so we should realy provide an alternative way to add projects
    - Tagged versions would be useful for any project though, so you can select between version 1 or 2 etc
    - We could actually skip the download step and connect up the PCB services directly
    - Another cool idea would be to help people more in puttting the boards together

1.
    - This is a mock-up of that idea
    - You hover over the part in your BOM and it shows you where to place it
1. 
    - There has been some interest from assemblers to hook up direct links to get things manufactured and that could get really interesting for validated designs
    - A lot can be done to help people make bills of materials and add all the right SKUs
    - Live pricing data, so you can estimate total cost easily would be useful

1.
    - How can you help?
    - Add your project!
    - I am running a promotion at the moment as well, so if you add your project you get $25 dollars PCB manufacturing voucher
    - We have a long list of possible features, if you can do web-dev or want to learn, pick a feature and work on it
    - Spread the word, this is going to be really useful if everyone uses this, let's get everyone involved

1.
    
    - Any questions?
    - If you want to keep in touch, you can check on the website itself
    - I made a twitter account for the site, and it's on other social media as well, Reddit, Facebook, Hackaday.io etc
    - Of course GitHub is the best way if you wanto get involved in the development side


