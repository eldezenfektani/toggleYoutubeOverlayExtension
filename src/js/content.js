let overlayVisible = true;
let progressBarVisible = true;

const elements = [
	{ name: "ytp-chrome-bottom", value: true },
	{ name: "ytp-ce-element", value: false },
	{ name: "ytp-paid-content-overlay", value: true },
	{ name: "ytp-player-content ytp-iv-player-content", value: true },
	{ name: "ytp-chrome-top", value: true },
	{ name: "ytp-gradient-bottom", value: true },
	{ name: "ytp-gradient-top", value: true },
];

// UI Button Listener
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	if (message.action === "toggleOverlay") {
		overlayVisible = message.value;
		toggleOverlay();
	}
	if (message.action === "toggleProgressBar") {
		progressBarVisible = message.value;
		toggleProgressBar();
	}
});

// Get stored values
chrome.storage.sync.get(
	["overlayVisible", "progressBarVisible"],
	function (result) {
		overlayVisible = result.overlayVisible;
		progressBarVisible = result.progressBarVisible;
	}
);

function toggleOverlay() {
	elements.forEach(function (el) {
		let visible = overlayVisible ? "visible" : "hidden";
		let element = document.getElementsByClassName(el.name);
		Array.prototype.forEach.call(element, function (e) {
			if (visible === "visible" && el.value === false) {
				e.style.visibility = "hidden";
				return;
			}
			e.style.visibility = visible;
		});
	});
	chrome.storage.sync.set({ overlayVisible: overlayVisible });
}

function toggleProgressBar() {
	const progressBarElements = document.querySelectorAll(
		".ytp-progress-bar-container"
	);
	progressBarElements.forEach((element) => {
		element.style.visibility = progressBarVisible ? "visible" : "hidden";
	});
	chrome.storage.sync.set({ progressBarVisible: progressBarVisible });
}

function waitForVideo() {
	var video = document.querySelector(".video-stream.html5-main-video");
	if (video) {
		video.oncanplay = function () {
			toggleOverlay();
			toggleProgressBar();
		};
	} else {
		requestAnimationFrame(waitForVideo);
	}
}

document.addEventListener("yt-navigate-finish", waitForVideo);

// Key Listener
document.addEventListener("keydown", function (event) {
	if (event.key === "h") {
		overlayVisible = !overlayVisible;
		chrome.runtime.sendMessage({
			action: "toggleOverlayKeyPressed",
			value: overlayVisible,
		});
		if (overlayVisible === true) {
			progressBarVisible = true;
			chrome.runtime.sendMessage({
				action: "toggleProgressBarKeyPressed",
				value: progressBarVisible,
			});
		}
	}
	if (event.key === "p" && !overlayVisible) {
		progressBarVisible = !progressBarVisible;
		chrome.runtime.sendMessage({
			action: "toggleProgressBarKeyPressed",
			value: progressBarVisible,
		});
	}
});
