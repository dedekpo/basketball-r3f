import { useFrame } from "@react-three/fiber";
import { BallCollider, RigidBody, vec3 } from "@react-three/rapier";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { BallMesh } from "./models/ball-mesh";
import { ballRef, players, useBallStore, useGameStore } from "../../lib/stores";
import {
  DISTANCE_DIFFICULTY,
  MAX_DISTANCE,
  MAX_STRENGH,
  MIN_DISTANCE,
  MIN_STRENGH,
  SHOT_DIFFICULTY,
} from "../../lib/config";
import { distanceShotPenalty, playAudio } from "../../lib/utils";

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

  const { resetShotClock } = useGameStore((state) => ({
    resetShotClock: state.resetShotClock,
  }));

  const playerRef = players[playerWithBall || 0].playerRef;
  const playerMeshRef = players[playerWithBall || 0].playerMeshRef;

  useEffect(() => {
    if (
      ballRef.current &&
      ballRef.current.shouldShot &&
      playerMeshRef.current
    ) {
      setPlayerWithBall(undefined);
      playerMeshRef.current.hasBall = false;
      ballRef.current.shouldShot = false;
      handleShot();
    }
  }, [ballRef.current?.shouldShot]);

  function handleBallPosition(elapsedTime: number) {
    if (
      !ballRef.current ||
      playerWithBall === undefined ||
      ballRef.current.shouldShot
    )
      return;
    const playerDirection = playerMeshRef.current
      ?.getWorldDirection(direction)
      .normalize();

    const playerPosition = playerRef.current?.translation();

    ballRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
    ballRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
    ballRef.current.setTranslation(
      {
        x: (playerPosition?.x || 0) + (playerDirection?.x || 0) * 0.14,
        y: (playerPosition?.y || 0) + 0.095 + Math.cos(elapsedTime * 8) * 0.06,
        z: (playerPosition?.z || 0) + (playerDirection?.z || 0) * 0.14,
      },
      true
    );
  }

  const handleShot = () => {
    if (!ballRef.current || !playerRef.current) return;
    ballRef.current.isOnAir = true;

    const ballPosition = vec3(playerRef.current.translation());
    direction.subVectors(currentHoop, ballPosition).normalize();

    const ballInHeadPosition = vec3({
      x: ballPosition.x,
      y: 0.55,
      z: ballPosition.z,
    }).add(direction.clone().multiplyScalar(0.1));

    direction.subVectors(currentHoop, ballInHeadPosition).normalize();
    ballRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
    ballRef.current.setTranslation(ballInHeadPosition, true);

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

    const isPerfectShot = ballRef.current.shotProgress || 0 >= 0.98;
    const perfectShotPenalty = isPerfectShot ? 0 : 1;

    const shotPrecision =
      Math.abs(
        Math.round((ballRef.current.shotProgress || 0) * 100) / 100 - 1
      ) -
      distanceShotPenalty(distanceToHoop) * perfectShotPenalty;

    const distanceModifier = (distanceToHoop / delta) * DISTANCE_DIFFICULTY;

    ballRef.current.applyImpulse(
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
  };

  useFrame(({ clock }) => {
    const elapsedTime = clock.elapsedTime;
    handleBallPosition(elapsedTime);
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
            ballRef.current &&
            ballRef.current.isOnAir &&
            other.rigidBodyObject?.name !== "player" &&
            other.rigidBodyObject?.name !== "player2"
          ) {
            ballRef.current.isOnAir = false;
          }
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
            resetShotClock();
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
