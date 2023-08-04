import { RapierRigidBody } from "@react-three/rapier";
import { RefObject, createRef } from "react";
import { Group, Vector3 } from "three";
import { create } from "zustand";
import { rightHoop } from "./config";

interface BallMeshProps extends Group {
	shotProgress?: number;
	isShooting?: boolean;
	isIncreasing?: boolean;
}

interface GameStateProps {
	gameMode: "menu" | "challenge" | "free" | "credits" | "loading";
	setGameMode: (
		newGameMode: "menu" | "challenge" | "free" | "credits" | "loading"
	) => void;

	gameScore: number;
	setGameScore: () => void;
	resetGameScore: () => void;
	currentHoop: Vector3;
	setCurrentHoop: (newHoop: Vector3) => void;
	gameTime: "day" | "night";
	setGameTime: (newTime: "day" | "night") => void;

	playerRef: RefObject<RapierRigidBody>;
	playerMeshRef: RefObject<BallMeshProps>;
	characterState: string;
	setCharacterState: (newState: string) => void;
	playerHasBall: boolean;
	setPlayerHasBall: (newState: boolean) => void;

	ballRef: RefObject<RapierRigidBody>;
}

let playerRef = createRef() as RefObject<RapierRigidBody>;
let playerMeshRef = createRef() as RefObject<BallMeshProps>;
let ballRef = createRef() as RefObject<RapierRigidBody>;

export const useGameStore = create<GameStateProps>()((set) => ({
	/**
	 * MENU
	 */

	gameMode: "loading",
	setGameMode: (newGameMode) => set(() => ({ gameMode: newGameMode })),

	/**
	 * GAME
	 */

	gameScore: 0,
	setGameScore: () => set((state) => ({ gameScore: state.gameScore + 1 })),
	resetGameScore: () => set(() => ({ gameScore: 0 })),
	currentHoop: rightHoop,
	setCurrentHoop: (newState) => set(() => ({ currentHoop: newState })),
	gameTime: "day",
	setGameTime: (newTime: "day" | "night") =>
		set(() => ({ gameTime: newTime })),

	/**
	 * PLAYER
	 */

	playerRef: playerRef,
	playerMeshRef: playerMeshRef,
	characterState: "Idle",
	setCharacterState: (newState: string) =>
		set(() => ({ characterState: newState })),
	playerHasBall: false,
	setPlayerHasBall: (newState: boolean) =>
		set(() => ({ playerHasBall: newState })),

	/**
	 * BALL
	 */

	ballRef: ballRef,
}));
