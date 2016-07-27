var fse = require('fs-extra');
var slash = (process.platform == 'win32') ? '\\'.substring(0,1) : '/'
var startDir = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'] + slash;
var currentDir = "";
var fileList = function(dir){
    currentDir = dir;
    fse.readdir(dir, function(err, file) {
        for (var i = 0; i < file.length; ++i) {
            var tr = document.createElement('tr'),
            fileName = document.createElement('td'),
            fileSize = document.createElement('td'),
            timeStamp = document.createElement('td'),
            span = document.createElement("span");
	    var img = new Image();
	    var files = document.getElementById('files');
            var stats = fse.statSync(currentDir + file[i]);
            var mtime = String(stats["mtime"])
            var src = (stats.isDirectory() ? 'img/folder.png' : 'img/file-document.png');
            span.setAttribute('onclick', 'fileClick(this.innerHTML)');
	    img.setAttribute('src', src);
	    fileName.appendChild(img);
	    fileName.appendChild(span);
            span.innerHTML = file[i];
            fileSize.innerHTML = stats["size"] + " bytes";
            fileSize.setAttribute("class", "center");
            timeStamp.innerHTML = mtime.substring(0, mtime.indexOf("GMT") - 1);
            timeStamp.setAttribute("class", "center");
            tr.appendChild(fileName);
            tr.appendChild(fileSize);
            tr.appendChild(timeStamp);
	    files.appendChild(tr);
        }
    });
}
var fileClick = function(name) {
    var shell = require('electron').shell;
    console.log("click");
    if (fse.statSync(currentDir + name).isFile()) {
        shell.openItem(currentDir + name);
    }
};
var init = function(){
    fileList(startDir);
}
