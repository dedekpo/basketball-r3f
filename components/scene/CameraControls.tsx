"use client";
import { useGameStore } from "@/lib/stores";
import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
	cameraMenuPosition,
	cameraGamePosition,
	cameraCreditsPosition,
} from "@/lib/config";
import { onClickSound } from "@/lib/utils";
import { useResetPositions } from "@/hooks/useResetPositions";

export function CameraControls() {
	const [, get] = useKeyboardControls();

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

	return useFrame(({ camera }) => {
		const { escape } = get();

		if (escape) {
			setGameMode("menu");
			onClickSound();
			setCanPlayersMove(false);
			SDKStopGame();
			resetShotClock();
			resetTime();
			resetGameScore();
			resetPlayersPosition();
			setIsGameRunning(false);
			resetBallPosition();
		}
		if (gameMode === "menu") {
			camera.position.lerp(cameraMenuPosition, 0.05);
		}
		if (
			gameMode === "challenge" ||
			gameMode === "free" ||
			gameMode === "match" ||
			gameMode === "tournament"
		) {
			camera.position.lerp(cameraGamePosition, 0.05);
		}
		if (gameMode === "credits") {
			camera.position.lerp(cameraCreditsPosition, 0.05);
		}
	});
}
