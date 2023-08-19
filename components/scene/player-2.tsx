// import { useKeyboardControls } from "@react-three/drei";
// import { useFrame } from "@react-three/fiber";
// import { CapsuleCollider, RigidBody, vec3 } from "@react-three/rapier";
// import * as THREE from "three";
// import {
// 	ballRef,
// 	player2Ref,
// 	playerMeshRef,
// 	player2MeshRef,
// 	useBallStore,
// 	usePlayer2Store,
// 	useGameStore,
// } from "@/lib/stores";
// import { SHOT_METTER_VELOCITY, leftHoop } from "@/lib/config";
// import ShotPlayer2Metter from "./shot-metter2";
// import Player2Mesh from "./models/player2-mesh";

// import { MOVEMENT_SPEED, MAX_VEL, RUN_VEL } from "@/lib/config";

// const modelEuler = new THREE.Euler();
// const modelQuat = new THREE.Quaternion();
// const pivot = new THREE.Object3D();

// export default function Player2() {
// 	const { characterState, setCharacterState } = usePlayer2Store((state) => ({
// 		characterState: state.characterState,
// 		setCharacterState: state.setCharacterState,
// 	}));
// 	const { setPlayerWithBall, currentHoop, setCurrentHoop } = useBallStore(
// 		(state) => ({
// 			setPlayerWithBall: state.setPlayerWithBall,
// 			currentHoop: state.currentHoop,
// 			setCurrentHoop: state.setCurrentHoop,
// 		})
// 	);

// 	const { gameMode } = useGameStore((state) => ({
// 		gameMode: state.gameMode,
// 	}));

// 	const [, get] = useKeyboardControls();

// 	const handleMovement = (delta: number) => {
// 		const { forwardP2, backwardP2, leftP2, rightP2 } = get();

// 		if (!player2MeshRef.current || !player2Ref.current) {
// 			return;
// 		}

// 		const impulse = { x: 0, y: 0, z: 0 };

// 		const linvel = player2Ref.current?.linvel();

// 		// Move player
// 		if (rightP2) {
// 			impulse.x += MOVEMENT_SPEED;
// 		}
// 		if (leftP2) {
// 			impulse.x -= MOVEMENT_SPEED;
// 		}
// 		if (backwardP2) {
// 			impulse.z += MOVEMENT_SPEED;
// 		}
// 		if (forwardP2) {
// 			impulse.z -= MOVEMENT_SPEED;
// 		}

// 		// Adjust velocity if player is moving above speed limit - this happens mostly when running diagonally
// 		const playerVelocity = vec3(linvel).length();
// 		if (playerVelocity > MAX_VEL) {
// 			player2Ref.current.setLinvel(
// 				vec3(linvel).normalize().multiplyScalar(MAX_VEL),
// 				true
// 			);
// 		}

// 		player2Ref.current?.applyImpulse(impulse, true);

// 		// Getting moving directions
// 		if (forwardP2) {
// 			// Apply camera rotation to character
// 			modelEuler.y = pivot.rotation.y + Math.PI;
// 		} else if (backwardP2) {
// 			// Apply camera rotation to character model
// 			modelEuler.y = pivot.rotation.y;
// 		} else if (leftP2) {
// 			// Apply camera rotation to character model
// 			modelEuler.y = pivot.rotation.y - Math.PI / 2;
// 		} else if (rightP2) {
// 			// Apply camera rotation to character model
// 			modelEuler.y = pivot.rotation.y + Math.PI / 2;
// 		}
// 		if (forwardP2 && leftP2) {
// 			// Apply camera rotation to character model
// 			modelEuler.y = pivot.rotation.y + Math.PI / 4 + Math.PI;
// 		} else if (forwardP2 && rightP2) {
// 			// Apply camera rotation to character model
// 			modelEuler.y = pivot.rotation.y - Math.PI / 4 + Math.PI;
// 		} else if (backwardP2 && leftP2) {
// 			// Apply camera rotation to character model
// 			modelEuler.y = pivot.rotation.y - Math.PI / 4;
// 		} else if (backwardP2 && rightP2) {
// 			// Apply camera rotation to character model
// 			modelEuler.y = pivot.rotation.y + Math.PI / 4;
// 		}

// 		modelQuat.setFromEuler(modelEuler);
// 		player2MeshRef.current.quaternion.rotateTowards(modelQuat, delta * 10);

// 		if (!player2MeshRef.current.isShooting) {
// 			if (Math.abs(linvel.x) > RUN_VEL || Math.abs(linvel.z) > RUN_VEL) {
// 				if (characterState !== "Running") {
// 					setCharacterState("Running");
// 				}
// 			} else {
// 				if (characterState !== "Idle") {
// 					setCharacterState("Idle");
// 				}
// 			}
// 		}
// 	};

// 	function handleCurrentHoop() {
// 		if (
// 			(gameMode === "match" || gameMode === "tournament") &&
// 			player2MeshRef.current?.hasBall
// 		) {
// 			setCurrentHoop(leftHoop);
// 		}
// 	}

// 	function handleShotMeter(delta: number) {
// 		const { jumpP2 } = get();

// 		if (!player2MeshRef.current?.hasBall || !player2MeshRef.current) {
// 			return;
// 		}
// 		// if (!player2MeshRef.current) {
// 		// 	return;
// 		// }

// 		if (jumpP2) {
// 			if (!player2MeshRef.current.isShooting) {
// 				player2MeshRef.current.isShooting = true;
// 				player2MeshRef.current.lookAt(
// 					vec3({
// 						x: currentHoop.x,
// 						y: 0.3,
// 						z: currentHoop.z,
// 					})
// 				);
// 			}

// 			if (player2MeshRef.current.isIncreasing === undefined) {
// 				player2MeshRef.current.isIncreasing = true;
// 			}

// 			if ((player2MeshRef.current.shotProgress || 0) > 1) {
// 				player2MeshRef.current.isIncreasing = false;
// 			}

// 			if (
// 				(player2MeshRef.current.shotProgress || 0) < 0 &&
// 				ballRef.current
// 			) {
// 				ballRef.current.shouldShot = true;
// 				ballRef.current.shotProgress =
// 					player2MeshRef.current.shotProgress;
// 				player2MeshRef.current.isShooting = false;
// 				player2MeshRef.current.isIncreasing = true;
// 				player2MeshRef.current.shotProgress = 0;
// 				return;
// 			}

// 			if (player2MeshRef.current.isShooting) {
// 				const factor = player2MeshRef.current.isIncreasing ? 1 : -1;

// 				player2MeshRef.current.shotProgress =
// 					(player2MeshRef.current.shotProgress || 0) +
// 					delta * SHOT_METTER_VELOCITY * factor;
// 			}

// 			return;
// 		}

// 		if (player2MeshRef.current.isShooting && ballRef.current) {
// 			ballRef.current.shouldShot = true;
// 			ballRef.current.shotProgress = player2MeshRef.current.shotProgress;
// 			player2MeshRef.current.isShooting = false;
// 			player2MeshRef.current.isIncreasing = true;
// 			player2MeshRef.current.shotProgress = 0;
// 		}
// 	}

// 	useFrame((_, delta) => {
// 		handleMovement(delta);
// 		handleShotMeter(delta * 0.1);
// 		handleCurrentHoop();
// 	});

// 	return (
// 		<>
// 			<RigidBody
// 				ref={player2Ref}
// 				name="player2"
// 				colliders={false}
// 				position={[1, 0.22, 0]}
// 				enabledRotations={[false, false, false]}
// 				onCollisionEnter={({ target, other }) => {
// 					if (
// 						target.rigidBodyObject?.name === "player2" &&
// 						other.rigidBodyObject?.name === "ball"
// 					) {
// 						if (
// 							!player2MeshRef.current?.hasBall &&
// 							!playerMeshRef.current?.isShooting
// 						) {
// 							playerMeshRef.current!.hasBall = false;
// 							player2MeshRef.current!.hasBall = true;
// 							setPlayerWithBall(1);
// 						}
// 					}
// 				}}
// 			>
// 				<CapsuleCollider args={[0.09, 0.1]} position={[0, 0.19, 0]} />
// 				<Player2Mesh />
// 				<ShotPlayer2Metter />
// 			</RigidBody>
// 		</>
// 	);
// }
