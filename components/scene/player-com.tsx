import { useFrame } from "@react-three/fiber";
import {
	CapsuleCollider,
	ConeCollider,
	RigidBody,
	vec3,
} from "@react-three/rapier";
import * as THREE from "three";
import {
	ballRef,
	playerRef,
	player2Ref,
	playerMeshRef,
	player2MeshRef,
	useBallStore,
	usePlayer2Store,
	useGameStore,
} from "@/lib/stores";
import { SHOT_METTER_VELOCITY, leftHoop, rightHoop } from "@/lib/config";
import ShotPlayer2Metter from "./shot-metter2";
import Player2Mesh from "./models/player2-mesh";
import {
	calculateShotPenalty,
	getRandomNumber,
	movePlayer,
	playAudio,
	rotatePlayer,
} from "@/lib/utils";
import { useEffect, useState } from "react";

const auxVector = new THREE.Vector3();

export default function PlayerCom() {
	const [shouldAggroTo, setShouldAggroTo] = useState<
		THREE.Vector3 | undefined
	>(undefined);
	const [timer, setTimer] = useState(true);

	useEffect(() => {
		setTimeout(() => {
			setTimer(!timer);
			setShouldAggroTo(
				Math.random() < 0.25
					? vec3(ballRef.current?.translation())
					: undefined
			);
		}, 500);
	}, [timer]);

	const { characterState, setCharacterState } = usePlayer2Store((state) => ({
		characterState: state.characterState,
		setCharacterState: state.setCharacterState,
	}));

	const { playerWithBall, setPlayerWithBall, setCurrentHoop } = useBallStore(
		(state) => ({
			playerWithBall: state.playerWithBall,
			setPlayerWithBall: state.setPlayerWithBall,
			setCurrentHoop: state.setCurrentHoop,
		})
	);

	const {
		gameMode,
		shotClock,
		resetShotClock,
		setIsShotClocking,
		canPlayersMove,
	} = useGameStore((state) => ({
		gameMode: state.gameMode,
		shotClock: state.shotClock,
		resetShotClock: state.resetShotClock,
		setIsShotClocking: state.setIsShotClocking,
		canPlayersMove: state.canPlayersMove,
	}));

	useEffect(() => {
		player2Ref.current?.collider(1).setEnabled(false);
	}, []);

	const handleMovement = (delta: number) => {
		if (
			!player2MeshRef.current ||
			player2MeshRef.current.isShooting ||
			!player2Ref.current ||
			!playerRef.current ||
			!canPlayersMove
		) {
			return;
		}
		let rightP2 = false;
		let leftP2 = false;
		let backwardP2 = false;
		let forwardP2 = false;

		const playerPosition = vec3(player2Ref.current?.translation());
		const otherPlayerPosition = vec3(playerRef.current?.translation());

		const distanceBetweenPlayers =
			playerPosition.distanceTo(otherPlayerPosition);
		if (
			playerMeshRef.current?.isShooting &&
			!player2MeshRef.current?.isJumping &&
			distanceBetweenPlayers < 0.5 &&
			ballRef.current?.shouldBlock
		) {
			ballRef.current.shouldBlock = false;
			setCharacterState("Block");
			player2MeshRef.current!.isJumping = true;

			setTimeout(() => {
				player2Ref.current!.collider(1).setEnabled(true);
			}, 300);

			setTimeout(() => {
				player2MeshRef.current!.isJumping = false;
				player2Ref.current!.collider(1).setEnabled(false);
			}, 1000);

			return;
		}

		if (player2MeshRef.current.IAShouldGoTo) {
			if (
				playerPosition.distanceTo(player2MeshRef.current.IAShouldGoTo) <
				0.22
			) {
				setShouldAggroTo(undefined);
				player2MeshRef.current.IAShouldGoTo = undefined;
				return;
			}
			const directionToGo = auxVector.subVectors(
				player2MeshRef.current.IAShouldGoTo,
				playerPosition
			);
			if (directionToGo.x > 0) {
				rightP2 = true;
			}
			if (directionToGo.x < 0) {
				leftP2 = true;
			}
			if (directionToGo.z > 0) {
				backwardP2 = true;
			}
			if (directionToGo.z < 0) {
				forwardP2 = true;
			}
			movePlayer(
				player2Ref,
				player2MeshRef,
				rightP2,
				leftP2,
				forwardP2,
				backwardP2,
				characterState,
				setCharacterState
			);
			rotatePlayer(
				1,
				rightP2,
				leftP2,
				forwardP2,
				backwardP2,
				player2MeshRef,
				delta * 0.5
			);
			return;
		}

		if (!playerWithBall) {
			// No player with the ball
			const ballPosition = vec3(ballRef.current?.translation());
			const directionToGo = ballPosition.sub(playerPosition);
			if (directionToGo.x > 0) {
				rightP2 = true;
			}
			if (directionToGo.x < 0) {
				leftP2 = true;
			}
			if (directionToGo.z > 0) {
				backwardP2 = true;
			}
			if (directionToGo.z < 0) {
				forwardP2 = true;
			}
		}
		if (playerWithBall === 0) {
			// Player without ball
			let positionToGo;
			if (shouldAggroTo) {
				positionToGo = shouldAggroTo;
			} else {
				positionToGo = auxVector
					.addVectors(rightHoop, otherPlayerPosition)
					.divideScalar(2);
			}
			const directionToGo = positionToGo.sub(playerPosition);
			if (directionToGo.x > 0) {
				rightP2 = true;
			}
			if (directionToGo.x < 0) {
				leftP2 = true;
			}
			if (directionToGo.z > 0) {
				backwardP2 = true;
			}
			if (directionToGo.z < 0) {
				forwardP2 = true;
			}
		}
		if (playerWithBall === 1) {
			// Player with ball

			const distanceToPlaceToShoot = playerPosition.distanceTo(
				player2MeshRef.current?.IAPlaceToShoot || leftHoop
			);
			if (distanceToPlaceToShoot > 0.22 && shotClock > 1) {
				const directionToGo = auxVector.subVectors(
					player2MeshRef.current?.IAPlaceToShoot || leftHoop,
					playerPosition
				);
				if (directionToGo.x > 0) {
					rightP2 = true;
				}
				if (directionToGo.x < 0) {
					leftP2 = true;
				}
				if (directionToGo.z > 0) {
					backwardP2 = true;
				}
				if (directionToGo.z < 0) {
					forwardP2 = true;
				}
			} else {
				if (player2MeshRef.current.hasBall) {
					player2MeshRef.current.shotProgress = 0;
					player2MeshRef.current.IAShotPrecision = Math.random();
					player2MeshRef.current.isShooting = true;
					setCharacterState("Shoot");
				}
			}
		}
		movePlayer(
			player2Ref,
			player2MeshRef,
			rightP2,
			leftP2,
			forwardP2,
			backwardP2,
			characterState,
			setCharacterState
		);
		rotatePlayer(
			1,
			rightP2,
			leftP2,
			forwardP2,
			backwardP2,
			player2MeshRef,
			delta * 0.5
		);
	};

	function handleCurrentHoop() {
		if (
			(gameMode === "match" || gameMode === "tournament") &&
			player2MeshRef.current?.hasBall
		) {
			setCurrentHoop(leftHoop);
		}
	}

	function handleShotMeter(delta: number) {
		if (!player2MeshRef.current?.isShooting) {
			return;
		}
		player2MeshRef.current.lookAt(
			vec3({
				x: leftHoop.x,
				y: 0.3,
				z: leftHoop.z,
			})
		);
		if (
			(player2MeshRef.current?.shotProgress || 0) <
			(player2MeshRef.current?.IAShotPrecision || 0)
		) {
			player2MeshRef.current.shotProgress =
				(player2MeshRef.current.shotProgress || 0) +
				delta * SHOT_METTER_VELOCITY * 0.5;
			return;
		}

		if (player2MeshRef.current.isShooting && ballRef.current) {
			const distanceBetweenPlayers = vec3(
				playerRef.current?.translation()
			).distanceTo(vec3(player2Ref.current?.translation()));
			let shotPenalty = calculateShotPenalty(
				distanceBetweenPlayers,
				playerMeshRef.current?.isJumping
			);
			if (distanceBetweenPlayers) ballRef.current.shouldShot = true;
			ballRef.current.shotProgress =
				(player2MeshRef.current.shotProgress || 0) - shotPenalty;
			player2MeshRef.current.isShooting = false;
		}
	}

	useFrame((_, delta) => {
		handleMovement(delta);
		handleShotMeter(delta * 0.1);
		handleCurrentHoop();
	});

	return (
		<>
			<RigidBody
				ref={player2Ref}
				name="player2"
				colliders={false}
				position={[1, 0.22, 0]}
				enabledRotations={[false, false, false]}
				onCollisionEnter={({ target, other }) => {
					if (
						target.rigidBodyObject?.name === "player2" &&
						other.rigidBodyObject?.name === "ball"
					) {
						if (
							!player2MeshRef.current?.hasBall &&
							!playerMeshRef.current?.isShooting &&
							!ballRef.current?.cantSteal
						) {
							if (
								player2MeshRef.current!.isJumping &&
								!playerMeshRef.current!.hasBall
							) {
								// Player blocked
								ballRef.current?.applyImpulse(
									{
										x: getRandomNumber(-0.1, 0.1) / 1000,
										y: getRandomNumber(0, 0.1) / 1000,
										z: getRandomNumber(-0.1, 0.1) / 1000,
									},
									true
								);
								playAudio("block");
								return;
							}

							playAudio("grab");
							playerMeshRef.current!.hasBall = false;
							player2MeshRef.current!.hasBall = true;
							if (ballRef.current!.lastPlayerWithBall !== 1) {
								resetShotClock();
							}
							setIsShotClocking(true);
							ballRef.current!.lastPlayerWithBall = 1;
							setPlayerWithBall(1);
							ballRef.current!.cantSteal = true;
							setTimeout(() => {
								ballRef.current!.cantSteal = false;
							}, 1000);
							if (player2MeshRef.current) {
								player2MeshRef.current.IAPlaceToShoot = vec3({
									x: getRandomNumber(-2, 0),
									y: 0,
									z: getRandomNumber(-1.29, 1.29),
								});
							}
						}
					}
				}}
			>
				<CapsuleCollider args={[0.09, 0.1]} position={[0, 0.19, 0]} />
				<ConeCollider
					args={[0.12, 0.17]}
					position={[0, 0.55, 0]}
					rotation={[0, 0, Math.PI]}
				/>
				<Player2Mesh />
				<ShotPlayer2Metter />
			</RigidBody>
		</>
	);
}
