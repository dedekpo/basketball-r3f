"use client";

import { useGameStore } from "@/lib/stores";
import { onClickSound, onHoverSound } from "@/lib/utils";
import { useProgress } from "@react-three/drei";
import Image from "next/image";
import ColorPicker from "../ui/color-picker";
import { useState } from "react";
import { SDKFinishLoading, SDKStartGame } from "@/lib/game-controll";

export default function Menu() {
	const { progress } = useProgress();
	const [loaded, setLoaded] = useState(false);

	const { gameMode, setGameMode, setCanPlayersMove } = useGameStore(
		(state) => ({
			gameMode: state.gameMode,
			setGameMode: state.setGameMode,
			resetTime: state.resetTime,
			resetShotClock: state.resetShotClock,
			resetGameScore: state.resetGameScore,
			setCanPlayersMove: state.setCanPlayersMove,
		})
	);

	if (progress < 100) return <LoadingScreen progress={progress} />;

	if (!loaded) {
		SDKFinishLoading();
		setLoaded(true);
		setGameMode("menu");
	}

	if (gameMode !== "menu") return;

	return (
		<div className="absolute flex items-center justify-center top-0 left-0 h-screen w-screen z-50">
			{/* <div className="absolute mx-auto top-4 left-4 w-[50vh] h-[12vh]">
				<Image
					src={"/images/logo-full.png"}
					alt={"Court Kings"}
					fill
					className="object-cover object-center"
				/>
			</div> */}
			<div className="flex w-[80%]">
				<div className="relative w-full flex flex-col items-start -left-10">
					<ColorPicker />
				</div>
				<div className="w-full flex flex-col text-white font-bold text-[9vh]">
					<button
						onPointerEnter={onHoverSound}
						onClick={() => {
							onClickSound();
							setGameMode("match");
						}}
					>
						<p className="text-right hover:text-[#FE2844] drop-shadow-[0_3px_3px_rgba(43,42,58,1)]">
							Quick Match
						</p>
					</button>
					<button
						onPointerEnter={onHoverSound}
						onClick={() => {
							onClickSound();
							setGameMode("tournament");
						}}
					>
						<p className="text-right hover:text-[#FE2844] drop-shadow-[0_3px_3px_rgba(43,42,58,1)]">
							Tournament
						</p>
					</button>
					<button
						onPointerEnter={onHoverSound}
						onClick={() => {
							onClickSound();
							setGameMode("challenge");
							setCanPlayersMove(true);
							SDKStartGame();
						}}
					>
						<p className="text-right hover:text-[#FE2844] drop-shadow-[0_3px_3px_rgba(43,42,58,1)]">
							Challenge
						</p>
					</button>
					<button
						onPointerEnter={onHoverSound}
						onClick={() => {
							onClickSound();
							setGameMode("free");
							setCanPlayersMove(true);
							SDKStartGame();
						}}
					>
						<p className="text-right hover:text-[#FE2844] drop-shadow-[0_3px_3px_rgba(43,42,58,1)]">
							Practice
						</p>
					</button>
					<button
						onPointerEnter={onHoverSound}
						onClick={() => {
							onClickSound();
							setGameMode("credits");
						}}
					>
						<p className="text-right hover:text-[#FE2844] drop-shadow-[0_3px_3px_rgba(43,42,58,1)]">
							Credits
						</p>
					</button>
				</div>
			</div>
		</div>
	);
}

function LoadingScreen({ progress }: { progress: number }) {
	// const toggleFullscreen = () => {
	// 	if (document.fullscreenElement) {
	// 		document.exitFullscreen();
	// 	} else {
	// 		document.documentElement.requestFullscreen().catch((err) => {
	// 			console.error("Error toggling fullscreen:", err);
	// 		});
	// 	}
	// };

	// const checkOrientation = () => {
	// 	if (window.screen.orientation) {
	// 		if (!window.screen.orientation.lock) return;

	// 		if (window.screen.orientation.type.includes("portrait")) {
	// 			window.screen.orientation.lock("landscape").catch((err) => {
	// 				console.error("Error locking landscape orientation:", err);
	// 			});
	// 		} else {
	// 			window.screen.orientation.unlock();
	// 		}
	// 	}
	// };

	return (
		<div className="absolute flex flex-col items-center justify-center top-0 left-0 h-screen w-screen bg-gray-900 z-50 text-center gap-[50px]">
			<div className="relative mx-auto top-4 left-0 right-0 w-[44vw] h-[26vh]">
				<Image
					src={"/images/logo-full.png"}
					alt={"Court Kings"}
					fill
					className="object-fit object-center"
				/>
			</div>
			<div className="text-white font-bold text-7xl border-2 py-4 w-[50%]">
				{progress.toFixed(0)}%
			</div>
			{/* {progress < 100 ? (
			) : (
				<button
					onPointerEnter={onHoverSound}
					onClick={() => {
						handleStartGame();
						if (isMobile) {
							toggleFullscreen();
							checkOrientation();
						}
					}}
					className="text-white font-bold text-7xl border-2 py-4 w-[50%] hover:text-[#FE2844] hover:border-[#FE2844]"
				>
					Play
				</button>
			)} */}
		</div>
	);
}
