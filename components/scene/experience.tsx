"use client";

import Ball from "@/components/scene/ball";
import { City } from "@/components/scene/city";
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
import * as THREE from "three";
import { Perf } from "r3f-perf";

const cameraMenuPosition = new THREE.Vector3(-1.5, 0.7, 0.5);
const cameraGamePosition = new THREE.Vector3(0, 2.5, 3.5);
const cameraCreditsPosition = new THREE.Vector3(-4, 2, 0);

const spotlight1 = new THREE.SpotLight("#fff");
const spotlight2 = new THREE.SpotLight("#fff");
const spotlight3 = new THREE.SpotLight("#fff");
const spotlight4 = new THREE.SpotLight("#fff");

export default function Experience() {
	return (
		<>
			<KeyboardControls
				map={[
					{ name: "escape", keys: ["Escape"] },
					{ name: "forward", keys: ["ArrowUp", "w", "W"] },
					{ name: "backward", keys: ["ArrowDown", "s", "S"] },
					{ name: "left", keys: ["ArrowLeft", "a", "A"] },
					{ name: "right", keys: ["ArrowRight", "d", "D"] },
					{ name: "jump", keys: ["Space"] },
				]}
			>
				<Canvas
					gl={{ preserveDrawingBuffer: true }}
					shadows
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
					<Suspense>
						<Physics>
							<Player />
							<City
								scale={[0.3, 0.3, 0.3]}
								position={[-1.1, -1.5, -0.2]}
							/>
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

	const { escape } = get();

	return useFrame(({ camera }) => {
		if (escape) {
			setGameMode("menu");
		}
		if (gameMode === "menu") {
			camera.position.lerp(cameraMenuPosition, 0.05);
		}
		if (gameMode === "challenge" || gameMode === "free") {
			camera.position.lerp(cameraGamePosition, 0.05);
		}
		if (gameMode === "credits") {
			camera.position.lerp(cameraCreditsPosition, 0.05);
		}
	});
}

function Lights() {
	const { gameTime } = useGameStore((state) => ({
		gameTime: state.gameTime,
	}));

	return (
		<>
			<Environment preset={gameTime === "night" ? "night" : "park"} />
			<directionalLight
				visible={gameTime === "day"}
				position={[-5, 5, 5]}
				castShadow
				shadow-mapSize={1024}
				shadow-bias={-0.0001}
			/>
			<group visible={gameTime === "night"}>
				<group>
					<primitive
						object={spotlight1}
						castShadow
						position={[1.9, 1.65, 1.5]}
						intensity={2}
						angle={2}
						penumbra={0.5}
						distance={5}
						shadow-mapSize={1024}
						shadow-bias={-0.0001}
					/>
					<primitive
						object={spotlight1.target}
						position={[1.9, 0, 1.5]}
					/>
				</group>
				<group>
					<primitive
						object={spotlight2}
						castShadow
						position={[-1.9, 1.65, 1.5]}
						intensity={2}
						angle={2}
						penumbra={0.5}
						distance={5}
						shadow-mapSize={1024}
						shadow-bias={-0.0001}
					/>
					<primitive
						object={spotlight2.target}
						position={[-1.9, 0, 1.5]}
					/>
				</group>
				<group>
					<primitive
						object={spotlight3}
						castShadow
						position={[-1.9, 1.65, -1.5]}
						intensity={2}
						angle={2}
						penumbra={0.5}
						distance={5}
						shadow-mapSize={1024}
						shadow-bias={-0.0001}
					/>
					<primitive
						object={spotlight3.target}
						position={[-1.9, 0, -1.5]}
					/>
				</group>
				<group>
					<primitive
						object={spotlight4}
						castShadow
						position={[1.9, 1.65, -1.5]}
						intensity={2}
						angle={2}
						penumbra={0.5}
						distance={5}
						shadow-mapSize={1024}
						shadow-bias={-0.0001}
					/>
					<primitive
						object={spotlight4.target}
						position={[1.9, 0, -1.5]}
					/>
				</group>
			</group>
		</>
	);
}
