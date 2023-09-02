import * as THREE from "three";
import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { CuboidCollider, RigidBody, vec3 } from "@react-three/rapier";
import { player2MeshRef, playerMeshRef, useGameStore } from "@/lib/stores";
import { playAudio } from "@/lib/utils";

type GLTFResult = GLTF & {
	nodes: {
		Object_4: THREE.Mesh;
		Object_5: THREE.Mesh;
		Object_6: THREE.Mesh;
		Object_7: THREE.Mesh;
		Object_8: THREE.Mesh;
		Object_9: THREE.Mesh;
		Object_10: THREE.Mesh;
		Object_11: THREE.Mesh;
		Object_12: THREE.Mesh;
		Object_13: THREE.Mesh;
		Object_14: THREE.Mesh;
		Object_15: THREE.Mesh;
		Object_17: THREE.Mesh;
		Object_19: THREE.Mesh;
		Object_21: THREE.Mesh;
		Object_22: THREE.Mesh;
		Object_24: THREE.Mesh;
		Object_26: THREE.Mesh;
		Object_27: THREE.Mesh;
		Object_28: THREE.Mesh;
		Object_29: THREE.Mesh;
		Object_31: THREE.Mesh;
		Object_33: THREE.Mesh;
	};
	materials: {
		Outer_Floor: THREE.MeshStandardMaterial;
		Inner_Floor: THREE.MeshStandardMaterial;
		Wall: THREE.MeshStandardMaterial;
		Support_Pillars: THREE.MeshStandardMaterial;
		Mesh: THREE.MeshStandardMaterial;
		["Material.002"]: THREE.MeshStandardMaterial;
		Light_Pillars: THREE.MeshStandardMaterial;
		Bench_Top: THREE.MeshStandardMaterial;
		Bench_Bottom: THREE.MeshStandardMaterial;
		Dust_Bin: THREE.MeshStandardMaterial;
		Basketball_Stand: THREE.MeshStandardMaterial;
		White: THREE.MeshStandardMaterial;
		material: THREE.MeshStandardMaterial;
	};
};

export default function CourtModel(props: JSX.IntrinsicElements["group"]) {
	const { nodes, materials } = useGLTF(
		"/models/basketball_court2.glb"
	) as GLTFResult;

	const { gameMode, setPlayer1Score, setPlayer2Score, setIsShotClocking } =
		useGameStore((state) => ({
			gameMode: state.gameMode,
			setPlayer1Score: state.setPlayer1Score,
			setPlayer2Score: state.setPlayer2Score,
			setIsShotClocking: state.setIsShotClocking,
		}));

	const { resetShotClock } = useGameStore((state) => ({
		resetShotClock: state.resetShotClock,
	}));

	const pointsRef = useRef({
		canScore: true,
	});

	function handleScore(hoopSide: "left" | "right") {
		if (pointsRef.current.canScore) {
			if (gameMode === "match" || gameMode === "tournament") {
				resetShotClock();
				setIsShotClocking(false);
				if (hoopSide === "right") {
					setPlayer1Score();
					if (playerMeshRef.current) {
						playerMeshRef.current.IAShouldGoTo = vec3({
							x: -1,
							y: 0,
							z: 0,
						});
					}
				}
				if (hoopSide === "left") {
					setPlayer2Score();
					if (player2MeshRef.current) {
						player2MeshRef.current.IAShouldGoTo = vec3({
							x: 1,
							y: 0,
							z: 0,
						});
					}
				}
			}
			if (gameMode === "challenge" || gameMode === "free") {
				setPlayer1Score();
			}
			playAudio("ball-hit-net");
			playAudio("score");
			const isPlayerGoingToCelebrate = Math.random() > 0.8;
			if (isPlayerGoingToCelebrate) {
				setTimeout(() => {
					if (Math.random() < 0.8) {
						playAudio("male-win-1");
					} else {
						playAudio("male-win-2");
					}
				}, 500);
			}
			pointsRef.current.canScore = false;
		}
		setTimeout(() => {
			pointsRef.current.canScore = true;
		}, 300);
		return;
	}

	return (
		<group {...props} dispose={null}>
			<group position={[0, 0.1, 0]}>
				{/* Floor */}
				<RigidBody name="floor" type="fixed">
					<mesh
						castShadow
						receiveShadow
						geometry={nodes.Object_5.geometry}
						material={materials.Inner_Floor}
					/>
					<CuboidCollider args={[2.7, 0.1, 2.05]} />
				</RigidBody>
				{/* Walls */}
				<CuboidCollider
					args={[0.01, 2, 1.96]}
					position={[-2.57, 2, 0]}
				/>
				<CuboidCollider
					args={[0.01, 2, 1.96]}
					position={[2.57, 2, 0]}
				/>
				<CuboidCollider
					args={[0.01, 2, 2.77]}
					position={[0, 2, 1.7]}
					rotation={[0, Math.PI / 2, 0]}
				/>
				<CuboidCollider
					args={[0.01, 2, 2.77]}
					position={[0, 2, -1.7]}
					rotation={[0, Math.PI / 2, 0]}
				/>
				<mesh
					castShadow
					receiveShadow
					geometry={nodes.Object_6.geometry}
					material={materials.Wall}
				/>
				<mesh
					castShadow
					receiveShadow
					geometry={nodes.Object_7.geometry}
					material={materials.Support_Pillars}
				/>
			</group>
			<group position={[2.113, 0.313, -0.794]}>
				<mesh
					castShadow
					receiveShadow
					geometry={nodes.Object_21.geometry}
					material={materials.Bench_Top}
				/>
				<mesh
					castShadow
					receiveShadow
					geometry={nodes.Object_22.geometry}
					material={materials.Bench_Bottom}
				/>
			</group>
			{/* Aro */}
			<RigidBody name="rim" colliders="trimesh" type="fixed">
				<group position={[-2.24, 0.781, 0]}>
					<mesh
						castShadow
						receiveShadow
						geometry={nodes.Object_26.geometry}
						material={materials.Basketball_Stand}
					/>
					<mesh
						castShadow
						receiveShadow
						geometry={nodes.Object_27.geometry}
						material={materials.White}
					/>
					<mesh
						castShadow
						receiveShadow
						geometry={nodes.Object_28.geometry}
						material={materials.material}
					/>
					<mesh
						castShadow
						receiveShadow
						geometry={nodes.Object_29.geometry}
						material={materials.Bench_Bottom}
					/>
				</group>
			</RigidBody>
			<CuboidCollider
				sensor
				args={[0.01, 0.06, 0.06]}
				position={[1.9, 0.97, 0]}
				rotation={[0, 0, Math.PI / 2]}
				onIntersectionExit={({ other }) => {
					if (other.rigidBodyObject?.name === "ball") {
						handleScore("right");
					}
				}}
			/>
			<CuboidCollider
				sensor
				args={[0.01, 0.06, 0.06]}
				position={[-1.9, 0.97, 0]}
				rotation={[0, 0, Math.PI / 2]}
				onIntersectionExit={({ other }) => {
					if (other.rigidBodyObject?.name === "ball") {
						handleScore("left");
					}
				}}
			/>
			<mesh
				castShadow
				receiveShadow
				geometry={nodes.Object_17.geometry}
				material={materials["Material.002"]}
				position={[0, 0.135, 0]}
			/>
			<mesh
				castShadow
				receiveShadow
				geometry={nodes.Object_19.geometry}
				material={materials.Light_Pillars}
				position={[-0.005, 0.1, -0.078]}
			/>
			<mesh
				castShadow
				receiveShadow
				geometry={nodes.Object_24.geometry}
				material={materials.Dust_Bin}
				position={[2.113, 0.313, -0.794]}
			/>
		</group>
	);
}

useGLTF.preload("/models/basketball_court2.glb");
