//context test
const remote = require('electron').remote;
const Menu = remote.Menu, MenuItem = remote.MenuItem;

const menu = new Menu();
let target = null;
menu.append(new MenuItem({label: 'MenuItem1', click() {console.log(target.parentNode.parentNode)}}));
menu.append(new MenuItem({type: 'separator'}));
menu.append(new MenuItem({label: 'MenuItem2', type: 'checkbox', checked: false}));

window.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      target = e.target;
      menu.popup(remote.getCurrentWindow());
}, false);

