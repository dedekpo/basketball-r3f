"use client";

import {
	ballRef,
	player2MeshRef,
	playerMeshRef,
	useBallStore,
	useGameStore,
} from "@/lib/stores";
import { onClickSound, onHoverSound, playAudio } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function Match() {
	const {
		player1Score,
		player2Score,
		gameMode,
		gameTime,
		decreaseTime,
		shotClock,
		decreaseShotClock,
		resetShotClock,
		resetTime,
		isShotClocking,
		setGameMode,
		resetGameScore,
		setCanPlayersMove,
	} = useGameStore((state) => ({
		player1Score: state.player1Score,
		player2Score: state.player2Score,
		gameMode: state.gameMode,
		gameTime: state.gameTime,
		decreaseTime: state.decreaseTime,
		shotClock: state.shotClock,
		decreaseShotClock: state.decreaseShotClock,
		resetShotClock: state.resetShotClock,
		resetTime: state.resetTime,
		isShotClocking: state.isShotClocking,
		setGameMode: state.setGameMode,
		resetGameScore: state.resetGameScore,
		setCanPlayersMove: state.setCanPlayersMove,
	}));

	const { setPlayerWithBall } = useBallStore((state) => ({
		setPlayerWithBall: state.setPlayerWithBall,
	}));

	const [isGameRunning, setIsGameRunning] = useState(true);
	const [isGameEnded, setIsGameEnded] = useState(false);

	useEffect(() => {
		if (gameTime === 0) {
			playAudio("referee-short");
			setIsGameRunning(false);
			setCanPlayersMove(false);
			setTimeout(() => {
				setIsGameEnded(true);
			}, 2000);
			return;
		}
		if (shotClock <= 5 && shotClock > 0) {
			playAudio("tick");
		}
		if (shotClock === 0) {
			playAudio("referee");
		}
		if (
			shotClock <= 0 &&
			!(ballRef.current?.isOnAir || false) &&
			player2MeshRef.current &&
			playerMeshRef.current
		) {
			setPlayerWithBall(undefined);
			player2MeshRef.current.hasBall = false;
			player2MeshRef.current.isShooting = false;
			player2MeshRef.current.isIncreasing = true;
			playerMeshRef.current.hasBall = false;
			playerMeshRef.current.isShooting = false;
			playerMeshRef.current.isIncreasing = true;
			ballRef.current?.setTranslation({ x: 0, y: 2, z: 0 }, true);
			resetShotClock();
		}
		const interval = setInterval(() => {
			if (isGameRunning) {
				decreaseTime();
				if (isShotClocking || gameTime < 12) {
					decreaseShotClock();
				}
			}
		}, 1000);

		return () => clearInterval(interval);
	}, [gameTime, isGameRunning, shotClock]);

	if (gameMode !== "match") return;

	const gameMinutes = Math.floor(gameTime / 60);
	const gameSeconds = (gameTime % 60).toLocaleString(undefined, {
		minimumIntegerDigits: 2,
		useGrouping: false,
	});

	return (
		<div>
			{isGameEnded ? (
				<div className="absolute top-0 h-screen w-screen flex items-center justify-center ">
					<div className="w-[50%] h-[80%] border-2 flex flex-col items-center justify-center rounded-md bg-gray-100 bg-opacity-50">
						<span>Game Ended</span>
						<div className="flex items-center gap-2">
							<div className="flex flex-col items-center">
								<span className="text-7xl font-bold">
									{player1Score}
								</span>
								<span>Player 1</span>
							</div>
							<span>—</span>
							<div className="flex flex-col items-center">
								<span className="text-7xl font-bold">
									{player2Score}
								</span>
								<span>Player 2</span>
							</div>
						</div>
						<div className="border-t-2 w-[80%] mt-5" />
						<span className="text-7xl font-bold my-5">
							{player1Score > player2Score
								? "Player 1 Wins!"
								: "Player 2 Wins!"}
						</span>
						<button
							onPointerEnter={onHoverSound}
							onClick={() => {
								onClickSound();
								resetGameScore();
								resetTime();
								resetShotClock();
								playAudio("referee-short");
								setIsGameRunning(true);
								setIsGameEnded(false);
								setCanPlayersMove(true);
							}}
							className="border-2 rounded-md w-[80%] text-2xl font-bold mt-3 text-white hover:text-[#FE2844] drop-shadow-[0_3px_3px_rgba(43,42,58,1)] h-[10%] hover:bg-gray-100"
						>
							Play Again
						</button>
						<button
							onPointerEnter={onHoverSound}
							onClick={() => {
								onClickSound();
								setIsGameEnded(false);
								setGameMode("menu");
							}}
							className="border-2 rounded-md w-[80%] text-2xl font-bold mt-3 text-white hover:text-[#FE2844] drop-shadow-[0_3px_3px_rgba(43,42,58,1)] h-[10%] hover:bg-gray-100"
						>
							Go to Menu
						</button>
					</div>
				</div>
			) : (
				<div className="flex flex-col items-center absolute left-0 right-0 top-4">
					<div className="flex justify-evenly w-[200px]  rounded-md border-4 opacity-90 bg-[conic-gradient(at_top_left,_var(--tw-gradient-stops))] from-gray-900 to-gray-600 bg-gradient-to-r">
						<div className="flex flex-col text-white text-center py-2 ">
							<p className="text-xs">Player 1:</p>
							<p className="text-3xl font-bold">{player1Score}</p>
						</div>
						<div className="flex flex-col text-white text-center py-2 ">
							<p className="text-xs">Player 2:</p>
							<p className="text-3xl font-bold">{player2Score}</p>
						</div>
					</div>
					<div className="flex justify-evenly w-[200px] text-xl">
						<div className="">
							{gameMinutes}:{gameSeconds}
						</div>
						<div>{shotClock}</div>
					</div>
				</div>
			)}
		</div>
	);
}
