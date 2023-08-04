export function playAudio(path: string, loop?: boolean) {
	const audio = new Audio(`/sounds/${path}.mp3`);
	if (loop) {
		audio.loop = true;
	}
	audio.play();
	return;
}

export function onHoverSound() {
	playAudio("hover-sound");
}

export function onClickSound() {
	playAudio("click-sound");
}

export const trackList = [
	{
		name: "C.B.P.D",
		artist: "Arulo",
		path: "/sounds/songs/C.B.P.D by Arulo.mp3",
	},
	{
		name: "Trip Hop Vibes",
		artist: "Alejandro Magaña",
		path: "/sounds/songs/Trip Hop Vibes by Alejandro Magaña.mp3",
	},
	{
		name: "Complicated",
		artist: "Arulo",
		path: "/sounds/songs/Complicated by Arulo.mp3",
	},
	{
		name: "Funky Hip Hop",
		artist: "Chad Crouch",
		path: "/sounds/songs/Funky Hip Hop by Arulo.mp3",
	},
	{
		name: "Try Me",
		artist: "Arulo",
		path: "/sounds/songs/Try Me by Arulo.mp3",
	},
];
