// Import File system. Provides extra methods that standard fs API lacks.
var fse = require('fs-extra');
// Import electron's built in shell API.
var shell = require('electron').shell;
// Windows uses a different slash than Unix systems. Figure our which slash should be used.
var slash = (process.platform == 'win32') ? '\\' : '/';

// Object to store major page parts.
var pg = {
	title: document.getElementsByTagName('title')[0],
	header: document.getElementById('title'),
	settings: {
		icon: document.getElementById('settings-icon'),
		pane: document.getElementById('settings'),
		showHidden: false
	},
	up: document.getElementById('up')
};

// Create startDir. Initial path to view.
// For Windows, USERPROFILE is used instead of HOME to fetch home directory.
// TODO: Hidden file hiding support. Maybe make icons grey when shown?
var currentDir = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'] + slash;
// Create currentDir: directory currently being viewed.

// Generate list of files in current directory.
function fileList(dir) {
	// Read directory for list of files
	fse.readdir(dir, function(err, file) {
		pg.title.innerHTML = dir;
		pg.header.innerHTML = dir;
		files.innerHTML = '';
		for (var i = 0; i < file.length; ++i) /*if (pg.settings.showHidden || file[i][0] === '.') {*/ {
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
			// TODO: Add larger byte options.
			fileTable.fileSize.innerHTML = stats.size + ' bytes';
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

// Handles file click.
onclick = function(e) {
	// Did user click on settings button?
	if (e.target.id === 'settings-icon') {
        // If settings pane isn't showing, show it. If it is, then hide it.
		if (pg.settings.pane.style.display === 'none') {
			pg.settings.pane.style.display = 'block';
		} else {
			pg.settings.pane.style.display = 'none';
		}
	} else if (e.target.id === 'hidden') { // If file hide/show button is clicked
		// Change the value of the variable
		showHidden = !showHidden;
		// Regenerate list
		fileList(currentDir);
	} else if (e.target.id === 'up') {
        currentDir = currentDir.substring(0, currentDir.length - 1);
        currentDir = currentDir.substring(0, currentDir.lastIndexOf(slash) + 1);
        fileList(currentDir);
    } else if (e.target.parentNode.tagName === 'TBODY' || e.target.tagName === 'IMG') { // Did user click on a file/folder?
        // If user clicked on a file
        // Get the name of the file/folder they clicked on.
		var name = (e.target.tagName === 'IMG') ? e.target.parentNode.nextSibling.innerHTML : e.target.parentNode.childNodes[1].innerHTML;
		console.log(name);
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

// Done declaring functions and stuff! Initialize file list.
fileList(currentDir);