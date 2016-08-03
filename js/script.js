// Import File system. Provides extra methods that standard fs API lacks.
var fse = require('fs-extra');
//ipcRenderer (Fancy event emitter)
var ipc = require('electron').ipcRenderer;
// Import electron's built in shell API.
var shell = require('electron').shell;
// Windows uses a different slash than Unix systems. Figure our which slash should be used.
var slash = (process.platform == 'win32') ? '\\' : '/';

// Object to store major page parts.
var pg = {
	title: document.getElementsByTagName('title')[0],
	header: document.getElementsByTagName('header')[0],
	headerTitle: document.getElementById('title'),
	settingsButton: document.getElementById('settings-button'),
	up: document.getElementById('up')
};

// Initialize currently-in-view directory. Starts at the user's home.
// For Windows, USERPROFILE is used instead of HOME to fetch home directory.
// TODO: Hidden file support. Maybe make icons grey when  they're shown?
var currentDir = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'] + slash;
// Create currentDir: directory currently being viewed.

// Generate list of files in current directory.
function fileList(dir) {
	// Read directory for list of files
	fse.readdir(dir, function(err, file) {
		pg.title.innerHTML = dir;
		pg.headerTitle.innerHTML = dir;
		files.innerHTML = '';
		for (var i = 0; i < file.length; ++i) {
			// Object of fileTable elements.
			var fileTable = {
				tr: document.createElement('tr'),
				imgContainer: document.createElement('td'),
				img: new Image(),
				fileName: document.createElement('td'),
				fileSize: document.createElement('td'),
				timeStamp: document.createElement('td'),
				files: document.getElementById('files')
			};
			// Clear any table contents that are already there.
			// Get file stats.
			var stats = fse.statSync(currentDir + file[i]);
			var mtime = String(stats.mtime);
			// Set src of img (folder or file).
			// TODO: Other types of file image (ex. for image files, spreadsheets, etc).
			fileTable.img.setAttribute('src', stats.isDirectory() ? 'img/folder.png' : 'img/file-document.png');
			// Append img to imgContainer cell and put file name in name cell.
			fileTable.imgContainer.appendChild(fileTable.img);
			fileTable.fileName.innerHTML = file[i];
			// Sets up the size of the file/folder and last modified date
			// TODO: Fix folder sizes. Currently gets size of actual folder. Should get size of folder + all contents.
            if (stats.size >= 1073741824) fileTable.fileSize.innerHTML = parseInt(stats.size / 1073741824) + 'GB';
            else if (stats.size >= 1048576) fileTable.fileSize.innerHTML = parseInt(stats.size / 1048576) + 'MB';
            else if (stats.size >= 1024) fileTable.fileSize.innerHTML = parseInt(stats.size / 1024) + 'KB';
            else fileTable.fileSize.innerHTML = stats.size + ' bytes';

			fileTable.timeStamp.innerHTML = mtime.substring(4, mtime.indexOf('GMT') - 4);
			// Append fileName, size, and timeStamp into the table row.
			fileTable.tr.appendChild(fileTable.imgContainer);
			fileTable.tr.appendChild(fileTable.fileName);
			fileTable.tr.appendChild(fileTable.fileSize);
			fileTable.tr.appendChild(fileTable.timeStamp);
			// Finally, append the row into the table.
			fileTable.files.appendChild(fileTable.tr);
		}
	});
}

// Handles all click events on page.
onclick = function(e) {
	// Did user click on settings button?
	if (e.target === pg.settingsButton) {
		// Open options window.
        // TODO: Fix this
		ipc.send('openOptions');
	} else if (e.target === pg.up) {
		currentDir = currentDir.substring(0, currentDir.length - 1);
		currentDir = currentDir.substring(0, currentDir.lastIndexOf(slash) + 1);
		fileList(currentDir);
	} else if (e.target.parentNode.tagName === 'TBODY' || e.target.tagName === 'IMG') { // Did user click on a file/folder?
		// If user clicked on a file/folder
		// Get the name of the file/folder they clicked on.
		var name = (e.target.tagName === 'IMG') ? e.target.parentNode.nextSibling.innerHTML : e.target.parentNode.childNodes[1].innerHTML;
		// If they clicked on a file
		if (fse.statSync(currentDir + name).isFile()) {
			// Open item with default application.
			shell.openItem(currentDir + name);
		} else { // If user clicked on a folder
			// Add that folder's name to the end of the current path
			currentDir += name + slash;
			// Regenerate the list for the new directory
			fileList(currentDir);
		}
	}
};

var options = {
    titleColor: '#FF3D00'
};

options = JSON.parse(fse.readFileSync(process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'] + '/.materialexplorer.json'));

pg.header.style.backgroundColor = options.color;

// All done declaring functions and stuff! Initialize the file list at the starting directory.
fileList(currentDir);