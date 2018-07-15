const indicator = document.getElementById("indicator");
const countdownIndicator = document.getElementById("countdownIndicator");
const presetSelector = document.getElementById("presetSelector");

const presetDataURL = "https://api.myjson.com/bins/jevl2";

// buttons
// const pauseButton = document.getElementById("pause");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");

const reloadButton = document.getElementById("reload");

// sequence text
const sequenceText = document.getElementById("sequenceText");

var timer;
var presets;

// events
var start = new Event('start');
var pause = new Event('pause');
var resume = new Event('resume');
var stop = new Event('stop');
var reload = new Event('reload');

var getPresets = new Event('getPresets');
var pushPreset = new Event('pushPreset');


// event handlers
function startEventHandler(e) {
	var sequence = presets[presetSelector.value].sequence;
	// eval(sequenceText.value);
	e.target.innerText = "pause";
	playStream(generateStream(sequence));
};

function pauseEventHandler(e) {
	e.target.innerText = "resume";
	timer.pause();
	audio.pause();
};

function resumeEventHandler(e) {
	e.target.innerText = "pause";
	timer.resume();
	audio.resume();
};

function stopEventHandler(e) {
	if (timer) {
		timer.clearAll();
	};
	audio.stop();
};


function startButtonEventHandler(e) {
	switch (e.target.innerText) {
		case "start":
			e.target.dispatchEvent(start);
			break;
		case "pause":
			e.target.dispatchEvent(pause);
			break;
		case "resume":
			e.target.dispatchEvent(resume);

	}
};

function stopButtonEventHandler(e) {
	setIndicator("stopped");
	startButton.innerText = "start";
	startButton.dispatchEvent(stop);	
};


function setPresetEventHandler(e) {
	sequenceText.value = '"' + e.target.value + '": ' + stringify(presets[e.target.value], undefined, 2);
};

function getPresetsEventHandler(e) {
	// var presets = e.presets;
	for (var key in presets) {
		if (presets.hasOwnProperty(key)) {
			var option = document.createElement("option");
			option.value = key;
			option.innerHTML = key;
			e.target.appendChild(option);
		}
	};
	setPresetEventHandler(e);
};


function reloadEventHandler(e) {
	console.log("reload");
};

function getPresetList(e) {
	// console.log("preset event");
	var file = 'presets/';
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4) {
			if (this.status == 200) {
				console.log(this.responseText);
				// sequenceText.value = this.respo	nseText;
			};
			if (this.status == 404) {console.log("Page not found.")};
			// includeHTML();
		}
	}
	xhttp.open("GET", file, true);
	xhttp.send();
    /*exit the function:*/
    return;
};


function setIndicator(text) {
	indicator.innerText = text;
	if (text == 'work') {
		setIndicatorColor('red');
	} else {
		setIndicatorColor('black')
	};
};


function setIndicatorColor(color) {
	indicator.style.color = color;
};


function setCountdownIndicator(text) {
	countdownIndicator.innerText = text;
};


function setCountdownIndicatorColor(color) {
	countdownIndicator.style.color = color;
};


function* generateStream(seq) {
	var i = 0;
	while (seq[i]) {
		yield seq[i];
		i++;
	};
};


function playStream(stream) {
	var step = stream.next();
	setIndicator(step.value ? step.value.type : "done");
	setCountdownIndicator(step.value ? step.value.dur : 0);
	audio.play(step.value.type);
	if (step.done == false) {
		timer = new Timer(function() {
			playStream(stream)	
		}, step.value.dur * 1000)	
	}		
};



// pauseButton.addEventListener("click", pauseButtonEventHandler);
startButton.addEventListener("click", startButtonEventHandler);
stopButton.addEventListener("click", stopButtonEventHandler);

startButton.addEventListener('start', startEventHandler);
startButton.addEventListener('pause', pauseEventHandler);
startButton.addEventListener('resume', resumeEventHandler);
startButton.addEventListener('stop', stopEventHandler);
startButton.addEventListener('reload', reloadEventHandler);

presetSelector.addEventListener('change', setPresetEventHandler);
presetSelector.addEventListener('getPresets', getPresetsEventHandler);

window.addEventListener("load", function(e) {

	loadXMLDoc(function(response) {
		presets = JSON.parse(response);
		presetSelector.dispatchEvent(getPresets);
	}, "GET", presetDataURL)
});
