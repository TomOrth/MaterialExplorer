// Import IPC renderer (for window management)
const ipc = require('electron').ipcRenderer;
// Import extra filesystem functions
const fse = require('fs-extra');

// Initialize var to store color.
var color = '';

// Object of elements in this window.
var controls = {
	update: document.getElementById('update')
};

// Initialize color picker, giving it its required parts.
ColorPicker.fixIndicators(document.getElementById('slide-indicator'), document.getElementById('picker-indicator'));

// TODO: Comments for this section.
ColorPicker(document.getElementById('slide'), document.getElementById('picker'),
	function(hex, hsv, rgb, pickerCoordinate, sliderCoordinate) {
		ColorPicker.positionIndicators(
			document.getElementById('slide-indicator'),
			document.getElementById('picker-indicator'),
			sliderCoordinate, pickerCoordinate
		);
		color = hex;
		controls.update.style.color = hex;
	});

// Handler for "Update" being clicked
controls.update.onclick = function() {
	var data = {
		headerColor: color
	};
	fse.writeFileSync(process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'] + '/.materialexplorer.json', JSON.stringify(data));
	ipc.send('closeOptions');
    console.log('test');
};

// Get current values from storage.
var options = fse.readFileSync(process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'] + '/.materialexplorer.json');
color = options.headerColor;