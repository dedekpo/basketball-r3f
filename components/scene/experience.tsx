"use client";

import Ball from "@/components/scene/ball";
import CourtModel from "@/components/scene/court";
import Player from "@/components/scene/player";
import { useGameStore } from "@/lib/stores";
import {
	Environment,
	KeyboardControls,
	OrbitControls,
	useKeyboardControls,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Suspense } from "react";
import { Perf } from "r3f-perf";

import {
	cameraMenuPosition,
	cameraGamePosition,
	cameraCreditsPosition,
} from "@/lib/config";
import Player2 from "./player-2";
import PlayerCom from "./player-com";
import { City } from "./city";
import { isMobile } from "react-device-detect";

export default function Experience() {
	const { gameMode } = useGameStore((state) => ({
		gameMode: state.gameMode,
	}));

	return (
		<>
			<KeyboardControls
				// map={[
				// 	{ name: "escape", keys: ["Escape"] },
				// 	{ name: "forwardP1", keys: ["w", "W"] },
				// 	{ name: "forwardP2", keys: ["ArrowUp"] },
				// 	{ name: "backwardP1", keys: ["s", "S"] },
				// 	{ name: "backwardP2", keys: ["ArrowDown"] },
				// 	{ name: "leftP1", keys: ["a", "A"] },
				// 	{ name: "leftP2", keys: ["ArrowLeft"] },
				// 	{ name: "rightP1", keys: ["d", "D"] },
				// 	{ name: "rightP2", keys: ["ArrowRight"] },
				// 	{ name: "jumpP1", keys: ["Space"] },
				// 	{ name: "jumpP2", keys: ["Numpad0"] },
				// ]}
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
					dpr={isMobile ? 0.8 : 1}
					camera={{
						position: [-1.5, 0.7, 0.5],
						fov: 45,
						far: 100,
						near: 0.01,
					}}
				>
					<Perf />
					<Lights />
					<CameraControls />
					{/* <OrbitControls /> */}
					<Suspense>
						<Physics>
							<Player />
							{(gameMode === "match" ||
								gameMode === "tournament") && <PlayerCom />}
							{/* {(gameMode === "match" ||
								gameMode === "tournament") && <Player2 />} */}
							{/* <City
								scale={[0.3, 0.3, 0.3]}
								position={[-1.1, -1.5, -0.2]}
							/> */}
							<Ball />
							<CourtModel />
						</Physics>
					</Suspense>
				</Canvas>
			</KeyboardControls>
		</>
	);
}

function CameraControls() {
	const [, get] = useKeyboardControls();

	const { gameMode, setGameMode } = useGameStore((state) => ({
		gameMode: state.gameMode,
		setGameMode: state.setGameMode,
	}));

	return useFrame(({ camera }) => {
		const { escape } = get();

		if (escape) {
			setGameMode("menu");
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
