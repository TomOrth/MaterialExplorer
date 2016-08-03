const ipc = require('electron').ipcRenderer;
const fse = require('fs-extra');

var color = '';

pg.optionsWindow = {
    update: document.getElementById('update')
};

ColorPicker.fixIndicators(
    document.getElementById('slide-indicator'),
    document.getElementById('picker-indicator'));

ColorPicker(
    document.getElementById('slide'),
    document.getElementById('picker'),

    function(hex, hsv, rgb, pickerCoordinate, sliderCoordinate) {

        ColorPicker.positionIndicators(
            document.getElementById('slide-indicator'),
            document.getElementById('picker-indicator'),
            sliderCoordinate, pickerCoordinate
        );
        color = hex;
        document.getElementsByTagName('button')[0].style.color = hex;
    });

pg.optionsWindow.update.onclick = function() {
    var data = {
        titleColor: color
    };
    fse.writeFileSync(process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'] + '/settings.json', JSON.stringify(data));
    ipc.send('settings', color);
};

//setting up the header color
fse.readFile(process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'] + '/settings.json', function(err, data) {
	var color;
	if (err) {
		color = '#FF3D00';
	} else {
		var settings = JSON.parse(data);
		color = settings.titleColor;
	}
	pg.header.style.backgroundColor = color;
	pg.settings.colorButton.style.color = color;
});

ipc.on('titleColor', function(event, color) {
	pg.header.style.backgroundColor = arg;
	pg.settings.colorButton.style.color = arg;
});