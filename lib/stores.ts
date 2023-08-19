import { RapierRigidBody } from "@react-three/rapier";
import { RefObject, createRef } from "react";
import { Group, Vector3 } from "three";
import { create } from "zustand";
import { rightHoop } from "./config";

interface ShotMeterProps extends Group {
	hasBall?: boolean;
	isJumping?: boolean;
	shotProgress?: number;
	isShooting?: boolean;
	isIncreasing?: boolean;
	IAShotPrecision?: number;
	IAShouldGoTo?: Vector3;
	IAPlaceToShoot?: Vector3;
}

interface BallRefProps extends RapierRigidBody {
	shouldShot?: boolean;
	shotProgress?: number;
	cantSteal?: boolean;
}

export const playerRef = createRef() as RefObject<RapierRigidBody>;
export const playerMeshRef = createRef() as RefObject<ShotMeterProps>;
export const player2Ref = createRef() as RefObject<RapierRigidBody>;
export const player2MeshRef = createRef() as RefObject<ShotMeterProps>;
export const ballRef = createRef() as RefObject<BallRefProps>;

export const players = [
	{
		playerRef,
		playerMeshRef,
	},
	{
		playerRef: player2Ref,
		playerMeshRef: player2MeshRef,
	},
];

type gameModes =
	| "menu"
	| "match"
	| "tournament"
	| "challenge"
	| "free"
	| "credits"
	| "loading";

interface GameStateProps {
	gameMode: gameModes;
	setGameMode: (newGameMode: gameModes) => void;

	player1Score: number;
	player2Score: number;
	setPlayer1Score: () => void;
	setPlayer2Score: () => void;
	resetGameScore: () => void;
}

export type CharacterStates =
	| "Dribble"
	| "Idle"
	| "Running"
	| "RunD"
	| "Shoot"
	| "Block";

interface PlayerProps {
	characterState: CharacterStates;
	setCharacterState: (newState: CharacterStates) => void;
}

interface BallProps {
	playerWithBall: number | undefined;
	setPlayerWithBall: (newState: number | undefined) => void;

	currentHoop: Vector3;
	setCurrentHoop: (newHoop: Vector3) => void;
}

export const usePlayer1Store = create<PlayerProps>()((set) => ({
	characterState: "Idle",
	setCharacterState: (newState: CharacterStates) =>
		set(() => ({ characterState: newState })),
}));

export const usePlayer2Store = create<PlayerProps>()((set) => ({
	characterState: "Idle",
	setCharacterState: (newState: CharacterStates) =>
		set(() => ({ characterState: newState })),
}));

export const useBallStore = create<BallProps>()((set) => ({
	playerWithBall: undefined,
	setPlayerWithBall: (newState) => set(() => ({ playerWithBall: newState })),

	currentHoop: rightHoop,
	setCurrentHoop: (newState) => set(() => ({ currentHoop: newState })),
}));

export const useGameStore = create<GameStateProps>()((set) => ({
	gameMode: "loading",
	setGameMode: (newGameMode) => set(() => ({ gameMode: newGameMode })),

	player1Score: 0,
	player2Score: 0,

	setPlayer1Score: () =>
		set((state) => ({ player1Score: state.player1Score + 1 })),
	setPlayer2Score: () =>
		set((state) => ({ player2Score: state.player2Score + 1 })),

	resetGameScore: () => set(() => ({ player1Score: 0, player2Score: 0 })),
}));

export const useJoystickStore = create<any>()((set) => ({
	direction: {
		right: false,
		left: false,
		up: false,
		down: false,
	},
	setDirection: (direction: {
		right: boolean;
		left: boolean;
		up: boolean;
		down: boolean;
	}) => set({ direction }),
	jump: false,
	setJump: (jump: boolean) => set({ jump }),
}));
