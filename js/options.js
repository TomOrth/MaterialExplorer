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
		controls.update.style.backgroundColor = hex;
	});

// Handler for "Update" being clicked
controls.update.onclick = function() {
    // If color has changed
	if (color) {
		// Get data from window.
		var data = {
			headerColor: color
		};
		// Write JSON data to file.
		fse.writeFileSync(process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'] + '/.materialexplorer.json', JSON.stringify(data));
	}
	// Tell main.js to close the options window and refresh the main window.
	ipc.send('closeOptions');
};


// Try to get options from config file. If there aren't any, set default options.
try {
	// Set options to contents of config file.
	var options = fse.readFileSync(process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'] + '/.materialexplorer.json');
} catch (e) { // If error (assume file doesn't exist)
	// Set default options
	var options = {
		headerColor: '#FF3D00'
	};
}

// Start header color chooser at the current value.
color = options.headerColor;