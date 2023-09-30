import * as THREE from "three";
import { vec3 } from "@react-three/rapier";
import { CharacterStates } from "./stores";
import { MAX_VEL, MOVEMENT_SPEED, RUN_VEL } from "./config";

const rotate = [
  {
    modelEuler: new THREE.Euler(),
    modelQuat: new THREE.Quaternion(),
    pivot: new THREE.Object3D(),
  },
  {
    modelEuler: new THREE.Euler(),
    modelQuat: new THREE.Quaternion(),
    pivot: new THREE.Object3D(),
  },
];

//2.45 - 2.17 - 0.87

export function distanceShotPenalty(distance: number) {
  if (distance > 2.45) {
    return 0.9;
  }
  if (distance > 1.67) {
    return 0.6;
  }
  if (distance > 0.87) {
    return 0.3;
  }
  return 0;
}

export function calculateShotPenalty(
  distance: number,
  isBlocking: boolean | undefined
) {
  if (distance < 0.3) {
    return isBlocking ? 0.4 : 0.3;
  }
  if (distance < 0.4) {
    return isBlocking ? 0.15 : 0.1;
  }
  return 0;
}

export function rotatePlayer(
  player: number,
  right: boolean,
  left: boolean,
  forward: boolean,
  backward: boolean,
  playerMeshRef: any,
  delta: number
) {
  if (playerMeshRef.current.IAShouldGoTo) {
    playerMeshRef.current.lookAt(
      playerMeshRef.current.IAShouldGoTo.x,
      0.21,
      playerMeshRef.current.IAShouldGoTo.z
    );
    return;
  }
  if (
    playerMeshRef.current.IAPlaceToShoot &&
    playerMeshRef.current.hasBall &&
    !playerMeshRef.current.isShooting
  ) {
    playerMeshRef.current.lookAt(
      playerMeshRef.current.IAPlaceToShoot.x,
      0.21,
      playerMeshRef.current.IAPlaceToShoot.z
    );
    return;
  }

  if (!forward && !backward && !left && !right) return;

  const modelEuler = rotate[player].modelEuler;
  const modelQuat = rotate[player].modelQuat;
  const pivot = rotate[player].pivot;

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
}

export function movePlayer(
  playerRef: any,
  playerMeshRef: any,

  right: boolean,
  left: boolean,
  forward: boolean,
  backward: boolean,

  characterState: CharacterStates,
  setCharacterState: (state: CharacterStates) => void
) {
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

  if (!playerMeshRef.current.isShooting && !playerMeshRef.current.isJumping) {
    if (Math.abs(linvel.x) > RUN_VEL || Math.abs(linvel.z) > RUN_VEL) {
      // Player is running
      if (playerMeshRef.current.hasBall) {
        // Player has the ball
        if (characterState !== "RunD") {
          setCharacterState("RunD");
        }
      } else {
        // Player does not has the ball
        if (characterState !== "Running") {
          setCharacterState("Running");
        }
      }
      return;
    }
    if (playerMeshRef.current.hasBall) {
      // Player has the ball but is not running
      if (characterState !== "Dribble") {
        setCharacterState("Dribble");
      }
      return;
    }
    if (characterState !== "Idle") {
      setCharacterState("Idle");
    }
  }
}

export function playAudio(path: string, loop?: boolean) {
  const audio = new Audio(`/sounds/${path}.mp3`);
  if (loop) {
    audio.loop = true;
  }
  audio.play();
  return;
}

export function onHoverSound() {
  playAudio("hover-sound");
}

export function onClickSound() {
  playAudio("click-sound");
}

export const trackList = [
  {
    name: "C.B.P.D",
    artist: "Arulo",
    path: "/sounds/songs/C.B.P.D by Arulo.mp3",
  },
  {
    name: "Trip Hop Vibes",
    artist: "Alejandro Magaña",
    path: "/sounds/songs/Trip Hop Vibes by Alejandro Magaña.mp3",
  },
  {
    name: "Complicated",
    artist: "Arulo",
    path: "/sounds/songs/Complicated by Arulo.mp3",
  },
  {
    name: "Funky Hip Hop",
    artist: "Chad Crouch",
    path: "/sounds/songs/Funky Hip Hop by Arulo.mp3",
  },
  {
    name: "Try Me",
    artist: "Arulo",
    path: "/sounds/songs/Try Me by Arulo.mp3",
  },
];

export function getRandomNumber(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
