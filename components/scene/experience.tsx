"use client";

import Ball from "@/components/scene/ball";
import CourtModel from "@/components/scene/court";
import Player from "@/components/scene/player";
import { useGameStore } from "@/lib/stores";
import {
	Environment,
	KeyboardControls,
	useKeyboardControls,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Suspense } from "react";

import {
	cameraMenuPosition,
	cameraGamePosition,
	cameraCreditsPosition,
} from "@/lib/config";
import PlayerCom from "./player-com";
import { isMobile } from "react-device-detect";
import { City } from "./city";
import { onClickSound } from "@/lib/utils";
import { useResetPositions } from "@/hooks/useResetPositions";

export default function Experience() {
	const { gameMode } = useGameStore((state) => ({
		gameMode: state.gameMode,
	}));

	return (
		<>
			<KeyboardControls
				map={[
					{ name: "escape", keys: ["Escape"] },
					{ name: "forwardP1", keys: ["w", "W", "ArrowUp"] },
					{ name: "backwardP1", keys: ["s", "S", "ArrowDown"] },
					{ name: "leftP1", keys: ["a", "A", "ArrowLeft"] },
					{ name: "rightP1", keys: ["d", "D", "ArrowRight"] },
					{ name: "jumpP1", keys: ["Space", "Numpad0"] },
				]}
			>
				<Canvas
					gl={{
						preserveDrawingBuffer: false,
						powerPreference: "high-performance",
						antialias: isMobile ? false : true,
					}}
					shadows={isMobile ? false : true}
					// dpr={isMobile ? 0.9 : 1}
					camera={{
						position: [-1.5, 0.7, 0.5],
						fov: 45,
						far: 100,
						near: 0.01,
					}}
				>
					{/* <Perf matrixUpdate deepAnalyze overClock /> */}
					<Lights />
					<CameraControls />
					{/* <OrbitControls /> */}
					<Suspense>
						<Physics>
							<Player />
							{(gameMode === "match" ||
								gameMode === "tournament") && <PlayerCom />}
							<Ball />
							<CourtModel />
							<City />
						</Physics>
					</Suspense>
				</Canvas>
			</KeyboardControls>
		</>
	);
}

function CameraControls() {
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

function Lights() {
	return (
		<>
			<Environment preset="park" />
			<directionalLight
				position={[-5, 5, 5]}
				castShadow
				shadow-mapSize={1024}
				shadow-bias={-0.0001}
			/>
		</>
	);
}
