"use client";

import { useResetPositions } from "@/hooks/useResetPositions";
import { SDKStopGame } from "@/lib/game-controll";
import { useGameStore } from "@/lib/stores";
import { onClickSound, onHoverSound } from "@/lib/utils";

export default function HomeButton() {
	const {
		gameMode,
		setGameMode,
		setCanPlayersMove,
		resetShotClock,
		resetTime,
		resetGameScore,
		setIsGameRunning,
	} = useGameStore((state) => ({
		gameMode: state.gameMode,
		setGameMode: state.setGameMode,
		setCanPlayersMove: state.setCanPlayersMove,
		resetShotClock: state.resetShotClock,
		resetTime: state.resetTime,
		resetGameScore: state.resetGameScore,
		setIsGameRunning: state.setIsGameRunning,
	}));

	const { resetBallPosition, resetPlayersPosition } = useResetPositions();

	function handleClick() {
		onClickSound();
		setGameMode("menu");
		setCanPlayersMove(false);
		SDKStopGame();
		resetShotClock();
		resetTime();
		resetGameScore();
		resetPlayersPosition();
		setIsGameRunning(false);
		resetBallPosition();
	}

	if (gameMode === "menu") return;

	return (
		<button
			onPointerEnter={onHoverSound}
			onClick={handleClick}
			className="absolute top-4 right-4 border-2 p-2 rounded-full bg-white"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				strokeWidth={1.5}
				stroke="currentColor"
				className="w-6 h-6"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
				/>
			</svg>
		</button>
	);
}
