// audio
const audio = new (function Audio() {
	var playing;
	this.work = document.getElementById("workAudio");
	this.countin = document.getElementById("countinAudio");
	this.rest = document.getElementById("restAudio");
	this.pause = () => playing.pause();
	this.resume = function() {
		playing.play();
	};
	this.stop = function() {
		playing.pause(); playing.currentTime = 0;
	};
	this.play = function(type) {
		if (this[type]) {
			playing = this[type];
			playing.play();
		};
	}
})();