const indicator = document.getElementById("indicator");
const countdownIndicator = document.getElementById("countdownIndicator");
const presetSelector = document.getElementById("presets");

// buttons
// const pauseButton = document.getElementById("pause");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");

const reloadButton = document.getElementById("reload");

// sequence text
const sequenceText = document.getElementById("sequenceText");

var timer;

// events
var start = new Event('start');
var pause = new Event('pause');
var resume = new Event('resume');
var stop = new Event('stop');
var reload = new Event('reload');



// event handlers
function startEventHandler(e) {
	// console.log(eval(sequenceText.value));
	var sequence = eval(sequenceText.value);
	console.log(sequence);
	playStream(generateStream(sequence));
};

function pauseEventHandler(e) {
	console.log("pause");
	timer.pause();
	audio.pause();
};

function resumeEventHandler(e) {
	console.log("resume");
	timer.resume();
	audio.resume();
};

function stopEventHandler(e) {
	console.log("stop");
	if (timer) {
		timer.clearAll();
	};
	audio.stop();
};

function reloadEventHandler(e) {
	console.log("reload");
};


function startButtonEventHandler(e) {
	if (e.target.innerText == "start") {
		e.target.innerText = "pause";
		e.target.dispatchEvent(start);
	} else if (e.target.innerText == "pause") {
		e.target.innerText = "resume";
		e.target.dispatchEvent(pause);
	} else if (e.target.innerText == "resume") {
		e.target.innerText = "pause";
		e.target.dispatchEvent(resume);
	};
};


function stopButtonEventHandler(e) {
	setIndicator("stopped");
	startButton.innerText = "start";
	startButton.dispatchEvent(stop);	
};


function selectPresetEventHandler(e) {
	console.log("preset event");
	var file = 'presets/' + e.target.value;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4) {
			if (this.status == 200) {
				// console.log(this.responseText);
				sequenceText.value = this.responseText;
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


function Timer(callback, delay) {
    var timerId, countdownTimer, start, remaining = delay;


    this.pause = function() {
        clearTimeout(timerId);
        countdownTimer.pause();
        remaining -= new Date() - start;
    };

    this.resume = function() {
        start = new Date();
        clearTimeout(timerId);
        timerId = setTimeout(callback, remaining);
        countdownTimer = new CountdownTimer(Math.floor(remaining/1000));
    };

    this.clearAll = function() {
    	clearTimeout(timerId);
    	countdownTimer.clearAll();
    }

    this.resume();
};


function CountdownTimer(totalSeconds) {
    var timerId, remaining = totalSeconds;

    this.pause = function() {
        clearInterval(timerId);
    };

    this.resume = function() {
        clearInterval(timerId);
        timerId = setInterval(function() {
        	if (remaining > 0) {
        		remaining -= 1;
        		setCountdownIndicator(remaining);  
        		if (remaining < 5) {
        			setCountdownIndicatorColor("red");
        			audio.play('countin');
        		} else {
        			setCountdownIndicatorColor("black");
        		}     		
        	}
        }, 1000);
    };

    this.clearAll = function() {
    	clearInterval(timerId);
    }

    this.resume();
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

presetSelector.addEventListener('change', selectPresetEventHandler);
