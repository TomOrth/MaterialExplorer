//File system.  Provides extra methods that fs does not have
var fse = require('fs-extra');
//electron's built in shell api
var shell = require('electron').shell;
//Windows uses a different slash than unix systems
var slash = (process.platform == 'win32') ? '\\'.substring(0,1) : '/';
/*startDir is used for the initial state and currentDir is used for all methods that require the current directory 
(windows does not have a HOME env, but a USERPROFILE env) 
*/
var startDir = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'] + slash;
var currentDir = "";
//Sets up the main table for the files lists
var fileList = function(dir){
    currentDir = dir;
    //reads the directory for a list of files
    fse.readdir(dir, function(err, file) {
        for (var i = 0; i < file.length; ++i) {
            //object of fileTable elements
            var fileTable = {
                tr:  document.createElement('tr'),
                fileName: document.createElement('td'),
                fileSize: document.createElement('td'),
                timeStamp: document.createElement('td'),
                span: document.createElement("span"),
	        img: new Image(),
	        files: document.getElementById('files')
            };
            //Stats for files
            var stats = fse.statSync(currentDir + file[i]);
            var mtime = String(stats["mtime"])
            //Changes file/folder img depending on type of item present
            var src = (stats.isDirectory() ? 'img/folder.png' : 'img/file-document.png');
            //set onclick for files being clicked
            fileTable.span.setAttribute('onclick', 'fileClick(this.innerHTML)');
	    //set src for img
            fileTable.img.setAttribute('src', src);
            //appending img and name to specific cell
	    fileTable.fileName.appendChild(fileTable.img);
	    fileTable.fileName.appendChild(fileTable.span);
            //set span to file name
            fileTable.span.innerHTML = file[i];
            //sets up the size of the file/folder and last modified date along with center class
            fileTable.fileSize.innerHTML = stats["size"] + " bytes";
            fileTable.fileSize.setAttribute("class", "center");
            fileTable.timeStamp.innerHTML = mtime.substring(0, mtime.indexOf("GMT") - 1);
            fileTable.timeStamp.setAttribute("class", "center");
            //Appending fileName, Size, and timeStamp to the table row
            fileTable.tr.appendChild(fileTable.fileName);
            fileTable.tr.appendChild(fileTable.fileSize);
            fileTable.tr.appendChild(fileTable.timeStamp);
            //final row added to the table
	    fileTable.files.appendChild(fileTable.tr);
        }
    });
}
//Handles file click
var fileClick = function(name) {
    //electron's built in shell api
    var shell = require('electron').shell;
    //So far only logic for file clicking is enabled, not for folders
    if (fse.statSync(currentDir + name).isFile()) {
        //Opens item with default program
        shell.openItem(currentDir + name);
    }
};
//runs when the program loads for an intial state
var init = function(){
    fileList(startDir);
}
