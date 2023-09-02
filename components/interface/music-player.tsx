"use client";

import { playAudio, trackList } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function MusicPlayer() {
	const [isPlaying, setIsPlaying] = useState(false); // Add state for tracking if the audio is playing
	const [currentIndexSong, setCurrentIndexSong] = useState(0);
	const currentSong = trackList[currentIndexSong];

	useEffect(() => {
		const audio = new Audio();
		audio.src = currentSong.path;
		audio.load();
		audio.volume = 0.5;
		audio.onended = () => {
			setCurrentIndexSong((currentIndexSong) =>
				currentIndexSong === trackList.length - 1
					? 0
					: currentIndexSong + 1
			);
		};

		// Update the state to start playing the audio when the user clicks on the page
		const handleClick = () => {
			setIsPlaying(true);
			// Start environment sounds
			playAudio("city", true);
			document.removeEventListener("click", handleClick); // Remove the click event listener after starting playback
		};
		document.addEventListener("click", handleClick);
		if (isPlaying) {
			audio.play();
		}
	}, [currentIndexSong, isPlaying]);

	return (
		<div className="absolute top-5 left-5 text-white">
			{/* <div className="flex flex-col">
				<span className="text-xs">Now playing:</span>
				<span className="text-bold">{currentSong.name}</span>
				<span className="text-sm">by {currentSong.artist}</span>
			</div> */}
		</div>
	);
}
