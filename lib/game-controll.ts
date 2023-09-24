export function initSDK() {
	console.log("Initializing PokiSDK");
	PokiSDK.init()
		.then(startLoading)
		.catch(() => {
			console.log(":( adblock");
		});

	// remove this line in your production build
	PokiSDK.setDebug(true);
}

function startLoading() {
	// Load the game!
	PokiSDK.gameLoadingStart();
}

export function SDKFinishLoading() {
	// We're done loading!
	PokiSDK.gameLoadingFinished();
}

// Yes! We made a super combo!
// PokiSDK.happyTime(0.8); // scale is 0.0 to 1.0

// // We died but we can get one more shot by watching a rewarded video
// PokiSDK.gameplayStop();
// PokiSDK.rewardedBreak().then((success) => {
// 	if (success) {
// 		console.log("Revive!");
// 		PokiSDK.gameplayStart();
// 		// revive();
// 	}
// });

export function SDKStartGame() {
	console.log("Starting a new round!");
	PokiSDK.gameplayStart();
}

export function SDKStopGame() {
	pauseGame();
	PokiSDK.gameplayStop();
	// we closed the gameplay now let’s trigger the break
	PokiSDK.commercialBreak().then(() => {
		// we restart the level
		unPauseGame();
		PokiSDK.gameplayStart();
	});
}

export function SDKRewardedBreak() {
	// we failed the level, let’s close this gameplay session and trigger a break
	pauseGame();
	PokiSDK.gameplayStop();
	// we closed the gameplay now let’s trigger the break
	PokiSDK.commercialBreak().then(() => {
		// we restart the level
		unPauseGame();
		// PokiSDK.gameplayStart();
	});
}

var pauseGame = function () {
	console.log("Starting break");
	muteAudio();
	disableKeyboardInput();
};

var unPauseGame = function () {
	console.log("Break completed");
	unMuteAudio();
	enableKeyboardInput();
};

function disableEvent(event: any) {
	event.preventDefault();
}

function disableKeyboardInput() {
	document.addEventListener("keydown", disableEvent);
}

function enableKeyboardInput() {
	document.removeEventListener("keydown", disableEvent);
}

function muteAudio() {
	document.querySelectorAll("audio").forEach((elem) => muteMe(elem));
}

function unMuteAudio() {
	document.querySelectorAll("audio").forEach((elem) => unmuteMe(elem));
}

function muteMe(elem: any) {
	elem.muted = true;
	elem.pause();
}
function unmuteMe(elem: any) {
	elem.muted = false;
	elem.play();
}
