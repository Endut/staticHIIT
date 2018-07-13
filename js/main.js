const indicator = document.getElementById("indicator");
const countdownIndicator = document.getElementById("countdownIndicator");

// buttons
const pauseButton = document.getElementById("pause");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");

// audios
const runAudio = document.getElementById("runAudio");
const countinAudio = document.getElementById("countinAudio");

var timer;


function pauseButtonEventHandler(e) {
	if (e.target.innerText == "pause") {
		e.target.innerText = "resume";
		setIndicator("paused!");
		timer.pause();
	} else {
		e.target.innerText = "pause";
		timer.resume();		
	};
};


function startButtonEventHandler(e) {
	playAudio(countinAudio);
	setTimeout(function() {
		playStream(generateStream(streamdef.sequence));
	}, 4000);
};


function stopButtonEventHandler(e) {
	setIndicator("stopped");
	timer.pause();
};


function setIndicator(text) {
	indicator.innerText = text;
	// return indicator;
};


function setCountdownIndicator(text) {
	countdownIndicator.innerText = text;
	// return indicator;
};


function setCountdownIndicatorColour(colour) {
	countdownIndicator.style.color = colour;
};


function playAudio(el) {
	el.play();
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
        			setCountdownIndicatorColour("red");
        			playAudio(countinAudio);
        		} else {
        			setCountdownIndicatorColour("black");
        		}     		
        	}
        }, 1000);
    };

    this.resume();
};


const streamdef = {
	repetitions: 4,
	sequence: [
		{type: 'warmup', dur: 10},
		{type: 'run', dur: 10},
		{type: 'rest', dur: 10},
		{type: 'run', dur: 10},
		{type: 'rest', dur: 10},
		{type: 'run', dur: 10},
		{type: 'rest', dur: 10},
		{type: 'run', dur: 10},
		{type: 'warmdown', dur: 10}
	]
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
	playAudio(runAudio);
	if (step.done == false) {
		timer = new Timer(function() {
			playStream(stream)	
		}, step.value.dur * 1000)	
	}		
};



pauseButton.addEventListener("click", pauseButtonEventHandler);
startButton.addEventListener("click", startButtonEventHandler);
stopButton.addEventListener("click", stopButtonEventHandler);
