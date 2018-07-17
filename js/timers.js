function Timer(onNextStep, onSecond, delay) {
    var timerId, countdownTimer, start, remaining = delay;


    this.pause = function() {
        clearTimeout(timerId);
        countdownTimer.pause();
        remaining -= new Date() - start;
    };

    this.resume = function() {
        start = new Date();
        clearTimeout(timerId);
        timerId = setTimeout(onNextStep, remaining);
        countdownTimer = new CountdownTimer(onSecond, Math.floor(remaining/1000));
    };

    this.clearAll = function() {
    	clearTimeout(timerId);
    	countdownTimer.clearAll();
    }

    this.resume();
};


function CountdownTimer(onSecond, totalSeconds) {
    var timerId, remaining = totalSeconds;

    this.pause = function() {
        clearInterval(timerId);
    };

    this.resume = function() {
        clearInterval(timerId);
        timerId = setInterval(function() {
        	if (remaining > 0) {
        		remaining -= 1;
                onSecond(remaining);        		     		
        	}
        }, 1000);

    };

    this.clearAll = function() {
    	clearInterval(timerId);
    }

    this.resume();
};