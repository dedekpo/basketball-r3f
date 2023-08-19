import { ballRef, players, useBallStore } from "@/lib/stores";
import { playAudio } from "@/lib/utils";
import { useFrame } from "@react-three/fiber";
import { BallCollider, RigidBody, vec3 } from "@react-three/rapier";
import { useRef } from "react";
import * as THREE from "three";
import { BallMesh } from "./models/ball-mesh";
import {
	DISTANCE_DIFFICULTY,
	MAX_DISTANCE,
	MAX_STRENGH,
	MIN_DISTANCE,
	MIN_STRENGH,
	SHOT_DIFFICULTY,
} from "@/lib/config";

export const direction = new THREE.Vector3();

export default function Ball() {
	const ballSoundRef = useRef({
		isSoundPlaying: false,
	});

	const { playerWithBall, setPlayerWithBall, currentHoop } = useBallStore(
		(state) => ({
			playerWithBall: state.playerWithBall,
			setPlayerWithBall: state.setPlayerWithBall,
			currentHoop: state.currentHoop,
		})
	);

	const playerRef = players[playerWithBall || 0].playerRef;
	const playerMeshRef = players[playerWithBall || 0].playerMeshRef;

	function handleBallPosition(elapsedTime: number) {
		const playerDirection = playerMeshRef.current
			?.getWorldDirection(direction)
			.normalize();

		const playerPosition = playerRef.current?.translation();

		ballRef.current?.setLinvel({ x: 0, y: 0, z: 0 }, true);
		ballRef.current?.setAngvel({ x: 0, y: 0, z: 0 }, true);
		ballRef.current?.setTranslation(
			{
				x: (playerPosition?.x || 0) + (playerDirection?.x || 0) * 0.14,
				y:
					(playerPosition?.y || 0) +
					0.09 +
					Math.cos(elapsedTime * 8) * 0.05,
				z: (playerPosition?.z || 0) + (playerDirection?.z || 0) * 0.14,
			},
			true
		);
	}

	const handleShot = () => {
		const ballPosition = vec3(playerRef.current?.translation());

		const ballInHeadPosition = vec3({
			x: ballPosition.x,
			y: 0.6,
			z: ballPosition.z,
		});

		ballRef.current?.setLinvel({ x: 0, y: 0, z: 0 }, true);
		ballRef.current?.setTranslation(ballInHeadPosition, true);

		direction.subVectors(currentHoop, ballInHeadPosition).normalize();

		const distanceToHoop = ballInHeadPosition.distanceTo(currentHoop);
		const delta = MAX_DISTANCE - MIN_DISTANCE;
		const shotHeight = 2;

		const fixDelta = Math.abs(
			Math.abs(delta * 0.5 - (distanceToHoop - MIN_DISTANCE)) - 1
		);

		const strenghGivenDistance = THREE.MathUtils.lerp(
			MIN_STRENGH,
			MAX_STRENGH,
			(distanceToHoop - MIN_DISTANCE) / (MAX_DISTANCE - MIN_DISTANCE)
		);
		const shotStrength = (strenghGivenDistance + 0.43 * fixDelta) / 10000;

		const shotPrecision = Math.abs(
			Math.round((ballRef.current?.shotProgress || 0) * 100) / 100 - 1
		);

		const distanceModifier = (distanceToHoop / delta) * DISTANCE_DIFFICULTY;

		// const randomnessX = Math.random() - 0.5 > 0 ? 1 : -1;
		// const randomnessY = Math.random() - 0.5 > 0 ? 1 : -1;
		// const randomnessZ = Math.random() - 0.5 > 0 ? 1 : -1;

		// if (shotPrecision < 0.02) {
		// 	playAudio("perfect-release");
		// 	ballRef.current?.applyImpulse(
		// 		{
		// 			x: direction.x * shotStrength,
		// 			y: (direction.y + shotHeight) * shotStrength,
		// 			z: direction.z * shotStrength,
		// 		},
		// 		true
		// 	);
		// } else {
		// 	const finalModifier =
		// 		0.8 + Math.abs(distanceModifier - 1) * shotPrecision;

		// 	console.log(Math.abs(distanceModifier - 1) * shotPrecision);
		// 	// shotStrength * 1.1 rim
		// 	ballRef.current?.applyImpulse(
		// 		{
		// 			x:
		// 				direction.x * shotStrength +
		// 				randomnessX *
		// 					(0.00003 +
		// 						0.00003 * Math.abs(distanceModifier - 1)) *
		// 					shotPrecision,
		// 			y:
		// 				(direction.y + shotHeight) * shotStrength +
		// 				randomnessY *
		// 					(0.00003 +
		// 						0.00003 * Math.abs(distanceModifier - 1)) *
		// 					shotPrecision,
		// 			z:
		// 				direction.z * shotStrength +
		// 				randomnessZ *
		// 					(0.00003 +
		// 						0.00003 * Math.abs(distanceModifier - 1)) *
		// 					shotPrecision,
		// 		},
		// 		true
		// 	);
		// }

		ballRef.current?.applyImpulse(
			{
				x:
					(direction.x +
						(Math.random() - 0.5) *
							SHOT_DIFFICULTY *
							shotPrecision *
							distanceModifier) *
					shotStrength,
				y: (direction.y + shotHeight) * shotStrength,
				z:
					(direction.z +
						(Math.random() - 0.5) *
							SHOT_DIFFICULTY *
							shotPrecision *
							distanceModifier) *
					shotStrength,
			},
			true
		);

		if (shotPrecision < 0.02) {
			playAudio("perfect-release");
		}

		setPlayerWithBall(undefined);
		playerMeshRef.current!.hasBall = false;
	};

	useFrame(({ clock }) => {
		const elapsedTime = clock.elapsedTime;
		if (playerWithBall !== undefined) {
			handleBallPosition(elapsedTime);
		}
		if (ballRef.current && ballRef.current.shouldShot) {
			handleShot();
			ballRef.current.shouldShot = false;
		}
	});

	return (
		<RigidBody
			ref={ballRef}
			name="ball"
			position={[0, 1, 0]}
			colliders={false}
			mass={0.01}
			restitution={1.2}
			ccd={true}
		>
			<BallMesh scale={0.001} />
			<BallCollider
				args={[0.04]}
				onCollisionEnter={({ other }) => {
					if (
						other.rigidBodyObject?.name === "floor" &&
						!ballSoundRef.current.isSoundPlaying
					) {
						playAudio("ball-hit-ground");
						ballSoundRef.current.isSoundPlaying = true;
						setTimeout(() => {
							ballSoundRef.current.isSoundPlaying = false;
						}, 300); // Adjust the time as needed to make sure the sound is played once.
						return;
					}
					if (
						other.rigidBodyObject?.name === "rim" &&
						!ballSoundRef.current.isSoundPlaying
					) {
						playAudio("ball-hit-rim");
						ballSoundRef.current.isSoundPlaying = true;
						setTimeout(() => {
							ballSoundRef.current.isSoundPlaying = false;
						}, 100); // Adjust the time as needed to make sure the sound is played once.
						return;
					}
				}}
			/>
		</RigidBody>
	);
}
