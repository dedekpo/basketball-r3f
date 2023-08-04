import { useAnimations, useGLTF, useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { CapsuleCollider, RigidBody, vec3 } from "@react-three/rapier";
import { useEffect, useRef } from "react";
import { GLTF } from "three-stdlib";
import * as THREE from "three";
import { useGameStore } from "@/lib/stores";
import { leftHoop, rightHoop } from "@/lib/config";
import ShotMetter from "./shot-metter";

type GLTFResult = GLTF & {
	nodes: {
		Ch09: THREE.SkinnedMesh;
		mixamorig6Hips: THREE.Bone;
	};
	materials: {
		Ch09_body: THREE.MeshPhysicalMaterial;
	};
};

const MOVEMENT_SPEED = 0.003;
const MAX_VEL = 0.8;
const RUN_VEL = 0.4;

const modelEuler = new THREE.Euler();
const modelQuat = new THREE.Quaternion();
const pivot = new THREE.Object3D();

export default function Player() {
	const { nodes, materials, animations } = useGLTF(
		"/models/timmy2.glb"
	) as GLTFResult;

	const {
		playerRef,
		playerMeshRef,
		playerHasBall,
		characterState,
		setCharacterState,
		setPlayerHasBall,
		setCurrentHoop,
	} = useGameStore((state) => ({
		playerRef: state.playerRef,
		playerMeshRef: state.playerMeshRef,
		playerHasBall: state.playerHasBall,
		characterState: state.characterState,
		setCharacterState: state.setCharacterState,
		setPlayerHasBall: state.setPlayerHasBall,
		setCurrentHoop: state.setCurrentHoop,
	}));

	const { actions } = useAnimations<any>(animations, playerMeshRef);

	useEffect(() => {
		actions[characterState]?.reset().fadeIn(0.2).play();
		return () => {
			actions[characterState]?.fadeOut(0.2);
		};
	}, [characterState]);

	useEffect(() => {
		if (playerHasBall && actions) {
			actions["Dribbling"]?.reset().fadeIn(0.1).play();
		}
		return () => {
			actions["Dribbling"]?.fadeOut(0.1);
		};
	}, [playerHasBall]);

	const [, get] = useKeyboardControls();

	const handleMovement = (delta: number) => {
		const { forward, backward, left, right } = get();

		if (
			!playerMeshRef.current ||
			playerMeshRef.current.isShooting ||
			!playerRef.current
		) {
			setCharacterState("Idle");
			return;
		}

		const impulse = { x: 0, y: 0, z: 0 };

		const linvel = playerRef.current?.linvel();

		// Move player
		if (right) {
			impulse.x += MOVEMENT_SPEED;
		}
		if (left) {
			impulse.x -= MOVEMENT_SPEED;
		}
		if (backward) {
			impulse.z += MOVEMENT_SPEED;
		}
		if (forward) {
			impulse.z -= MOVEMENT_SPEED;
		}

		// Adjust velocity if player is moving above speed limit - this happens mostly when running diagonally
		const playerVelocity = vec3(linvel).length();
		if (playerVelocity > MAX_VEL) {
			playerRef.current.setLinvel(
				vec3(linvel).normalize().multiplyScalar(MAX_VEL),
				true
			);
		}

		playerRef.current?.applyImpulse(impulse, true);

		// Getting moving directions
		if (forward) {
			// Apply camera rotation to character
			modelEuler.y = pivot.rotation.y + Math.PI;
		} else if (backward) {
			// Apply camera rotation to character model
			modelEuler.y = pivot.rotation.y;
		} else if (left) {
			// Apply camera rotation to character model
			modelEuler.y = pivot.rotation.y - Math.PI / 2;
		} else if (right) {
			// Apply camera rotation to character model
			modelEuler.y = pivot.rotation.y + Math.PI / 2;
		}
		if (forward && left) {
			// Apply camera rotation to character model
			modelEuler.y = pivot.rotation.y + Math.PI / 4 + Math.PI;
		} else if (forward && right) {
			// Apply camera rotation to character model
			modelEuler.y = pivot.rotation.y - Math.PI / 4 + Math.PI;
		} else if (backward && left) {
			// Apply camera rotation to character model
			modelEuler.y = pivot.rotation.y - Math.PI / 4;
		} else if (backward && right) {
			// Apply camera rotation to character model
			modelEuler.y = pivot.rotation.y + Math.PI / 4;
		}

		modelQuat.setFromEuler(modelEuler);
		playerMeshRef.current.quaternion.rotateTowards(modelQuat, delta * 10);

		if (Math.abs(linvel.x) > RUN_VEL || Math.abs(linvel.z) > RUN_VEL) {
			if (characterState !== "Running") {
				setCharacterState("Running");
			}
		} else {
			if (characterState !== "Idle") {
				setCharacterState("Idle");
			}
		}
	};

	function handleCurrentHoop() {
		const playerPosition = vec3(playerRef.current?.translation());

		const distanceToLeftHoop = playerPosition.distanceTo(leftHoop);
		const distanceToRightHoop = playerPosition.distanceTo(rightHoop);

		if (distanceToLeftHoop < distanceToRightHoop) {
			setCurrentHoop(leftHoop);
			return;
		}
		setCurrentHoop(rightHoop);
	}

	useFrame(({ camera }, delta) => {
		handleMovement(delta);
		handleCurrentHoop();
		if (playerRef.current) {
			camera.lookAt(
				vec3(playerRef.current?.translation())
					.normalize()
					.multiplyScalar(0.5)
			);
		}
	});

	return (
		<>
			<RigidBody
				ref={playerRef}
				name="player"
				colliders={false}
				position={[-1, 0.22, 0]}
				enabledRotations={[false, false, false]}
				onCollisionEnter={({ target, other }) => {
					if (
						target.rigidBodyObject?.name === "player" &&
						other.rigidBodyObject?.name === "ball"
					) {
						if (!playerHasBall) {
							setPlayerHasBall(true);
						}
					}
				}}
			>
				<CapsuleCollider args={[0.09, 0.1]} position={[0, 0.19, 0]} />
				<group ref={playerMeshRef} name="Scene">
					<group
						name="Armature"
						rotation={[Math.PI / 2, 0, 0]}
						scale={0.0022}
					>
						<skinnedMesh
							castShadow
							name="Ch09"
							geometry={nodes.Ch09.geometry}
							material={materials.Ch09_body}
							skeleton={nodes.Ch09.skeleton}
						/>
						<primitive object={nodes.mixamorig6Hips} />
					</group>
				</group>
				<ShotMetter />
			</RigidBody>
		</>
	);
}

useGLTF.preload("/models/timmy2.glb");
