// Import File system. Provides extra methods that standard fs API lacks.
var fse = require('fs-extra');
// Import electron's built in shell API.
var shell = require('electron').shell;
// Windows uses a different slash than Unix systems. Figure our which slash should be used.
var slash = (process.platform == 'win32') ? '\\' : '/';

// Object to store major page parts.
var pg = {
    title: document.getElementsByTagName('title')[0],
    header: document.getElementsByTagName('header')[0],
    settings: {
        icon: document.getElementById('settings-icon'),
        pane: document.getElementById('settings'),
        showHidden: false
    }
};

// Create startDir. Initial path to view.
// For Windows, USERPROFILE is used instead of HOME to fetch home directory.
// TODO: Hidden file hiding support. Maybe make icons grey when shown?
var currentDir = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'] + slash;
// Create currentDir: directory currently being viewed.

// Generate list of files in current directory.
function fileList(dir) {
    // TODO: Is currentDir really necessary?
	currentDir = dir;
	// Read directory for list of files
	fse.readdir(dir, function(err, file) {
        pg.title.innerHTML = dir;
        pg.header.innerHTML = dir;
        files.innerHTML = '';
		for (var i = 0; i < file.length; ++i) if (!pg.settings.showHidden && file[i][0] === '.') {
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
			var stats = fse.statSync(currentDir);
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
    // Did user click on a file?
    if (e.target.parentNode.tagName === 'TBODY' || e.target.tagName === 'IMG') {
        var name = (e.target.tagName === 'IMG') ? e.target.parentNode.nextSibling.innerHTML : e.target.parentNode.childNodes[1].innerHTML;
        // So far only logic for file clicking is enabled, not for folders
        // TODO: Allow movement between directories. Shouldn't be hard.
    	if (fse.statSync(currentDir + name).isFile()) {
    		// Opens item with default application.
    		shell.openItem(currentDir + name);
    	} else {
            currentDir += name;
            fileList(currentDir);
        }
    }
    if (e.target.id === 'hidden') {
        showHidden = e.target.value;
        fileList(currentDir);
    }
};

// Done declaring functions and stuff! Initialize file list.
fileList(currentDir);