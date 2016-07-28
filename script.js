// Import File system. Provides extra methods that standard fs API lacks.
var fse = require('fs-extra');
// Import electron's built in shell API.
var shell = require('electron').shell;
// Windows uses a different slash than Unix systems. Figure our which slash should be used.
var slash = (process.platform == 'win32') ? '\\' : '/';

// Create startDir. Initial path to view.
// For Windows, USERPROFILE is used instead of HOME to fetch home directory.
// TODO: Hidden file hiding support. Maybe make icons grey when shown?
var startDir = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'] + slash;
// Create currentDir: directory currently being viewed.
var currentDir = '';

// Generate list of files in current directory.
function fileList(dir) {
    // TODO: Is currentDir really necessary?
	currentDir = dir;
	// Read directory for list of files
	fse.readdir(dir, function(err, file) {
		for (var i = 0; i < file.length; ++i) {
			// Object of fileTable elements.
			var fileTable = {
				tr: document.createElement('tr'),
				fileName: document.createElement('td'),
				fileSize: document.createElement('td'),
				timeStamp: document.createElement('td'),
				span: document.createElement('span'),
				img: new Image(),
				files: document.getElementById('files')
			};
			// Get file stats.
			var stats = fse.statSync(currentDir + file[i]);
			var mtime = String(stats.mtime);
			// Set onclick for file.
            // TODO: Replace this with click listener below.
            // This is a bad solution.
			fileTable.span.setAttribute('onclick', 'fileClick(this.innerHTML)');
			// Set src of img (folder or file).
            // TODO: Other types of file image.
			fileTable.img.setAttribute('src', stats.isDirectory() ? 'img/folder.png' : 'img/file-document.png');
			// Append img and name to name cell.
            // TODO: The Name space should have the name in it. No reason to include the image.
			fileTable.fileName.appendChild(fileTable.img);
			fileTable.fileName.appendChild(fileTable.span);
			// set span to file name
            // TODO: Excessive spans are bad and should be minimized.
			fileTable.span.innerHTML = file[i];
			// Sets up the size of the file/folder and last modified date
            // TODO: Add larger byte options.
			fileTable.fileSize.innerHTML = stats.size + ' bytes';
            // TODO: Kill center class. ASAP
			fileTable.fileSize.setAttribute('class', 'center');
            // TODO: Simplify timestamps.
			fileTable.timeStamp.innerHTML = mtime.substring(0, mtime.indexOf('GMT') - 1);
            // TODO: Kill center class.
			fileTable.timeStamp.setAttribute('class', 'center');
			// Append fileName, size, and timeStamp into the table row.
			fileTable.tr.appendChild(fileTable.fileName);
			fileTable.tr.appendChild(fileTable.fileSize);
			fileTable.tr.appendChild(fileTable.timeStamp);
			// Finally, append the row into the table.
			fileTable.files.appendChild(fileTable.tr);
		}
	});
}
// Handles file click.
// TODO: Replace with click handler. Individual onclicks is a terrible solution.
function fileClick(name) {
	// So far only logic for file clicking is enabled, not for folders
    // TODO: Allow movement between directories. Shouldn't be hard.
	if (fse.statSync(currentDir + name).isFile()) {
		// Opens item with default program
		shell.openItem(currentDir + name);
	}
}

// Done declaring functions and stuff! Initialize file list.
fileList(startDir);