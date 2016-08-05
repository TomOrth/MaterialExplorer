//context test
const remote = require('electron').remote;
const Menu = remote.Menu, MenuItem = remote.MenuItem;
var bookmarks = {
                  items: []
                };
const menu = new Menu();
let target = null;
menu.append(new MenuItem({label: 'Cut', click() {
     alert(String(target))
}}));
menu.append(new MenuItem({type: 'separator'}));
menu.append(new MenuItem({label: 'Add To Bookmarks', click(){
     var choice = {
         bookmarks: document.getElementById("bookmarks"),
         fileRow: document.createElement("tr"),
         imageContainer: document.createElement("td"),
         nameContainer: document.createElement("td"),
         img: new Image(),
         content: {
             name: target.innerHTML,
             src: target.previousElementSibling.childNodes[0].getAttribute("src"),
             dir: currentDir + target.innerHTML + slash
         }
     };
     choice.img.src = choice.content.src;
     choice.imageContainer.appendChild(choice.img);
     choice.nameContainer.innerHTML = choice.content.name;
     choice.nameContainer.setAttribute("data-dir", choice.content.dir);
     choice.fileRow.appendChild(choice.imageContainer);
     choice.fileRow.appendChild(choice.nameContainer);
     choice.bookmarks.appendChild(choice.fileRow);
     bookmarks.items.push(choice.content);
     fse.writeFileSync(process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'] + '/.materialbookmarks.json', JSON.stringify(bookmarks));
}}));
var fileList = document.getElementById("files");
fileList.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      target = e.target;
      menu.popup(remote.getCurrentWindow());
}, false);


// TODO: Make this menu functional & replace placeholders
