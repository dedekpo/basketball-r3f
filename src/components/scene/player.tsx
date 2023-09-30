import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  ConeCollider,
  CapsuleCollider,
  RigidBody,
  vec3,
} from "@react-three/rapier";
import * as THREE from "three";
import ShotPlayer1Metter from "./shot-metter";
import PlayerMesh from "./models/player-mesh";
import { useEffect } from "react";
import {
  ballRef,
  player2MeshRef,
  player2Ref,
  playerMeshRef,
  playerRef,
  useBallStore,
  useGameStore,
  useJoystickStore,
  usePlayer1Store,
} from "../../lib/stores";
import {
  calculateShotPenalty,
  getRandomNumber,
  movePlayer,
  playAudio,
  rotatePlayer,
} from "../../lib/utils";
import { SHOT_METTER_VELOCITY, leftHoop, rightHoop } from "../../lib/config";

const auxVector = new THREE.Vector3();

export default function Player() {
  const { characterState, setCharacterState } = usePlayer1Store((state) => ({
    characterState: state.characterState,
    setCharacterState: state.setCharacterState,
  }));

  const { setPlayerWithBall, currentHoop, setCurrentHoop } = useBallStore(
    (state) => ({
      setPlayerWithBall: state.setPlayerWithBall,
      currentHoop: state.currentHoop,
      setCurrentHoop: state.setCurrentHoop,
    })
  );

  const { gameMode, setIsShotClocking, resetShotClock, canPlayersMove } =
    useGameStore((state) => ({
      gameMode: state.gameMode,
      setIsShotClocking: state.setIsShotClocking,
      resetShotClock: state.resetShotClock,
      canPlayersMove: state.canPlayersMove,
    }));

  const { direction, jump } = useJoystickStore((state) => ({
    direction: state.direction,
    jump: state.jump,
  }));

  const [, get] = useKeyboardControls();

  useEffect(() => {
    playerRef.current!.collider(1).setEnabled(false);
  }, []);

  const handleMovement = (delta: number) => {
    const { forwardP1, backwardP1, leftP1, rightP1, jumpP1 } = get();

    const forward = forwardP1 || direction.up;
    const backward = backwardP1 || direction.down;
    const left = leftP1 || direction.left;
    const right = rightP1 || direction.right;
    const jumpPressed = jumpP1 || jump;

    if (
      !playerMeshRef.current ||
      !playerRef.current ||
      playerMeshRef.current.isShooting ||
      !canPlayersMove
    ) {
      return;
    }
    if (
      jumpPressed &&
      !playerMeshRef.current.hasBall &&
      !playerMeshRef.current!.isJumping
    ) {
      setCharacterState("Block");
      playerMeshRef.current!.isJumping = true;

      setTimeout(() => {
        playerRef.current!.collider(1).setEnabled(true);
      }, 300);

      setTimeout(() => {
        playerMeshRef.current!.isJumping = false;
        playerRef.current!.collider(1).setEnabled(false);
      }, 1000);
    }

    if (playerMeshRef.current.IAShouldGoTo) {
      let right = false;
      let left = false;
      let backward = false;
      let forward = false;
      const playerPosition = vec3(playerRef.current?.translation());

      if (
        playerPosition.distanceTo(playerMeshRef.current.IAShouldGoTo) < 0.22
      ) {
        playerMeshRef.current.IAShouldGoTo = undefined;
        return;
      }
      const directionToGo = auxVector.subVectors(
        playerMeshRef.current.IAShouldGoTo,
        playerPosition
      );
      if (directionToGo.x > 0) {
        right = true;
      }
      if (directionToGo.x < 0) {
        left = true;
      }
      if (directionToGo.z > 0) {
        backward = true;
      }
      if (directionToGo.z < 0) {
        forward = true;
      }
      movePlayer(
        playerRef,
        playerMeshRef,
        right,
        left,
        forward,
        backward,
        characterState,
        setCharacterState
      );
      rotatePlayer(0, right, left, forward, backward, playerMeshRef, delta);
      return;
    }
    movePlayer(
      playerRef,
      playerMeshRef,
      right,
      left,
      forward,
      backward,
      characterState,
      setCharacterState
    );
    rotatePlayer(0, right, left, forward, backward, playerMeshRef, delta);
  };

  function handleCurrentHoop() {
    if (
      (gameMode === "challenge" || gameMode === "free") &&
      playerMeshRef.current?.hasBall
    ) {
      const playerPosition = vec3(playerRef.current?.translation());

      const distanceToLeftHoop = playerPosition.distanceTo(leftHoop);
      const distanceToRightHoop = playerPosition.distanceTo(rightHoop);

      if (distanceToLeftHoop < distanceToRightHoop) {
        setCurrentHoop(leftHoop);
        return;
      }
      setCurrentHoop(rightHoop);
      return;
    }
    if (
      (gameMode === "match" || gameMode === "tournament") &&
      playerMeshRef.current?.hasBall
    ) {
      setCurrentHoop(rightHoop);
    }
  }

  function handleShotMeter(delta: number) {
    const { jumpP1 } = get();
    const jumpPressed = jumpP1 || jump;

    if (!playerMeshRef.current?.hasBall || !playerMeshRef.current) {
      return;
    }

    if (jumpPressed) {
      if (!playerMeshRef.current.isShooting) {
        playerMeshRef.current.isShooting = true;
        setCharacterState("Shoot");
        playerMeshRef.current.lookAt(
          vec3({
            x: currentHoop.x,
            y: 0.3,
            z: currentHoop.z,
          })
        );
      }

      if (playerMeshRef.current.isIncreasing === undefined) {
        playerMeshRef.current.isIncreasing = true;
      }

      if ((playerMeshRef.current.shotProgress || 0) > 1) {
        playerMeshRef.current.isIncreasing = false;
      }

      if ((playerMeshRef.current.shotProgress || 0) < 0 && ballRef.current) {
        ballRef.current.shouldShot = true;
        ballRef.current.shotProgress = 0;
        ballRef.current.shouldBlock = Math.random() > 0.5;
        playerMeshRef.current.isShooting = false;
        playerMeshRef.current.isIncreasing = true;
        playerMeshRef.current.shotProgress = 0;
        return;
      }

      if (playerMeshRef.current.isShooting) {
        const factor = playerMeshRef.current.isIncreasing ? 1 : -1;

        playerMeshRef.current.shotProgress =
          (playerMeshRef.current.shotProgress || 0) +
          delta * SHOT_METTER_VELOCITY * factor;
      }

      return;
    }

    if (playerMeshRef.current.isShooting && ballRef.current) {
      let shotPenalty = 0;
      if (gameMode === "match" || gameMode === "tournament") {
        const distanceBetweenPlayers = vec3(
          playerRef.current?.translation()
        ).distanceTo(vec3(player2Ref.current?.translation()));
        shotPenalty = calculateShotPenalty(
          distanceBetweenPlayers,
          player2MeshRef.current?.isJumping
        );
      }
      ballRef.current.shouldShot = true;
      ballRef.current.shotProgress =
        (playerMeshRef.current.shotProgress || 0) - shotPenalty;
      ballRef.current.shouldBlock = Math.random() > 0.5;
      playerMeshRef.current.isShooting = false;
      playerMeshRef.current.isIncreasing = true;
      playerMeshRef.current.shotProgress = 0;
    }
  }

  useFrame(({ camera }, delta) => {
    handleMovement(delta);
    handleShotMeter(delta * 0.1);
    handleCurrentHoop();
    if (playerRef.current) {
      camera.lookAt(
        vec3(playerRef.current?.translation()).normalize().multiplyScalar(0.5)
      );
    }
  });

  return (
    <>
      <RigidBody
        ref={playerRef}
        name="player"
        colliders={false}
        enabledRotations={[false, false, false]}
        position={[-1, 0.22, 0]}
        friction={0.4}
        onCollisionEnter={({ target, other }) => {
          if (
            target.rigidBodyObject?.name === "player" &&
            other.rigidBodyObject?.name === "ball"
          ) {
            if (
              (gameMode === "challenge" || gameMode === "free") &&
              !playerMeshRef.current!.hasBall
            ) {
              playerMeshRef.current!.hasBall = true;
              playAudio("grab");
              setPlayerWithBall(0);
              return;
            }
            if (gameMode === "match" || gameMode === "tournament") {
              if (
                !playerMeshRef.current?.hasBall &&
                !player2MeshRef.current?.isShooting &&
                !ballRef.current?.cantSteal &&
                !playerMeshRef.current?.IAShouldGoTo
              ) {
                if (
                  playerMeshRef.current!.isJumping &&
                  !player2MeshRef.current!.hasBall
                ) {
                  // Player blocked
                  playerRef.current?.collider(1).setEnabled(false);
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
                player2MeshRef.current!.hasBall = false;
                playerMeshRef.current!.hasBall = true;
                if (ballRef.current!.lastPlayerWithBall !== 0) {
                  resetShotClock();
                }
                setIsShotClocking(true);
                ballRef.current!.lastPlayerWithBall = 0;
                setPlayerWithBall(0);
                ballRef.current!.grabbedAt = Date.now();
                ballRef.current!.cantSteal = true;
                setTimeout(() => {
                  ballRef.current!.cantSteal = false;
                }, 200);
              }
              return;
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
        <PlayerMesh />
        <ShotPlayer1Metter />
      </RigidBody>
    </>
  );
}
