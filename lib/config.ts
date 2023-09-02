import { vec3 } from "@react-three/rapier";
import * as THREE from "three";

export const rightHoop = vec3({
	x: 1.89,
	y: 1,
	z: 0,
});

export const leftHoop = vec3({
	x: -1.89,
	y: 1,
	z: 0,
});

export const MAX_STRENGH = 6.9;
export const MAX_DISTANCE = 2.665;

export const MIN_STRENGH = 3.1;
export const MIN_DISTANCE = 0.5;

export const SHOT_METTER_VELOCITY = 30;
export const SHOT_DIFFICULTY = 0.8; // 0 -> easy / 1 -> hard
export const DISTANCE_DIFFICULTY = 0.8; // 0 -> easy / 1 -> hard

export const cameraMenuPosition = new THREE.Vector3(-1.3, 0.8, 0.5);
export const cameraGamePosition = new THREE.Vector3(0, 2.5, 3);
export const cameraCreditsPosition = new THREE.Vector3(-4, 2, 0);

export const MOVEMENT_SPEED = 0.003;
export const MAX_VEL = 0.8;
export const RUN_VEL = 0.4;
