"use client";

import {
	ballRef,
	player2MeshRef,
	playerMeshRef,
	useGameStore,
} from "@/lib/stores";
import { onClickSound, onHoverSound, playAudio } from "@/lib/utils";
import { useEffect, useState } from "react";
import Typewriter from "../ui/typewritter";
import { useResetPositions } from "@/hooks/useResetPositions";

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
		increaseTime,
		isShotClocking,
		setGameMode,
		resetGameScore,
		setCanPlayersMove,
		tournamentRound,
		setTournamentRound,
		isGameRunning,
		setIsGameRunning,
	} = useGameStore((state) => ({
		player1Score: state.player1Score,
		player2Score: state.player2Score,
		gameMode: state.gameMode,
		gameTime: state.gameTime,
		increaseTime: state.increaseTime,
		decreaseTime: state.decreaseTime,
		shotClock: state.shotClock,
		decreaseShotClock: state.decreaseShotClock,
		resetShotClock: state.resetShotClock,
		resetTime: state.resetTime,
		isShotClocking: state.isShotClocking,
		setGameMode: state.setGameMode,
		resetGameScore: state.resetGameScore,
		setCanPlayersMove: state.setCanPlayersMove,
		tournamentRound: state.tournamentRound,
		setTournamentRound: state.setTournamentRound,
		isGameRunning: state.isGameRunning,
		setIsGameRunning: state.setIsGameRunning,
	}));

	const { resetBallPosition, resetPlayersPosition } = useResetPositions();

	const [isGameEnded, setIsGameEnded] = useState(false);
	const [hasLost, setHasLost] = useState(false);

	useEffect(() => {
		setIsGameEnded(false);
	}, []);

	useEffect(() => {
		if (gameTime === 0) {
			handleEndGame();
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
			resetPlayersPosition();
			resetBallPosition();
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
	}, [gameTime, shotClock, isGameRunning]);

	function handleStartGame() {
		onClickSound();
		resetGameScore();
		resetTime();
		resetShotClock();
		playAudio("referee-short");
		setIsGameRunning(true);
		setIsGameEnded(false);
		setCanPlayersMove(true);
		resetPlayersPosition();
		resetBallPosition();
	}

	function handleEndGame() {
		if (!isGameRunning) return;
		if (gameMode === "tournament") {
			if (player1Score > player2Score) {
				setTournamentRound(tournamentRound + 1);
			} else if (player1Score < player2Score) {
				setHasLost(true);
				setTournamentRound(1);
			} else {
				increaseTime();
				return;
			}
		}
		playAudio("referee-short");
		setIsGameRunning(false);
		setCanPlayersMove(false);
		resetPlayersPosition();
		resetBallPosition();
		setTimeout(() => {
			setIsGameEnded(true);
		}, 2000);
	}

	if (gameMode !== "match" && gameMode !== "tournament") return;

	const gameMinutes = Math.floor(gameTime / 60);
	const gameSeconds = (gameTime % 60).toLocaleString(undefined, {
		minimumIntegerDigits: 2,
		useGrouping: false,
	});

	return (
		<div>
			{gameMode === "tournament" &&
				((tournamentRound === 1 && !isGameRunning) || isGameEnded) && (
					<div className="absolute top-0 h-screen w-screen flex flex-col items-center justify-center">
						<div className="relative flex flex-col items-center border-2 bg-white h-[100vh] w-[100vw] lg:h-[80%] lg:w-[80%] lg:rounded-[50px] shadow-md">
							<h1 className="text-xl lg:text-4xl font-bold mt-2 lg:mt-4">
								City Tournament
							</h1>
							<span>Round: {tournamentRound}</span>
							<button
								onClick={() => {
									if (tournamentRound === 5 || hasLost) {
										setGameMode("menu");
										setTournamentRound(1);
										onClickSound();
										resetGameScore();
										resetTime();
										resetShotClock();
										setHasLost(false);
										return;
									}
									handleStartGame();
								}}
								className="z-10 border-2 rounded-md bg-green-500 font-bold text-sm lg:text-2xl text-gray-100 px-2 py-1 lg:px-4 lg:py-2 lg:mt-4 shadow-md hover:bg-green-600 uppercase"
							>
								{tournamentRound < 5 && !hasLost
									? "Play next round"
									: "Go to menu"}
							</button>
							<div className="relative mt-auto">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={1}
									stroke="currentColor"
									className="w-[100px] h-[100px] fill-yellow-500"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0"
									/>
								</svg>
								{tournamentRound === 5 && (
									<div
										className={`absolute w-[100px] h-[20px] bg-gray-200 text-center bottom-[18px] text-sm`}
									>
										Player 1
									</div>
								)}
							</div>

							<div className="flex gap-4 w-[80%] mx-auto mb-2 border-2 rounded-[50px] shadow-md h-[110px] lg:h-[140px] overflow-hidden">
								{hasLost ? (
									<img
										src="/images/mayor-sad.jpg"
										alt=""
										className="w-[100px] h-[136px] object-cover rounded-md"
									/>
								) : (
									<img
										src="/images/mayor-happy.jpg"
										alt=""
										className="w-[100px] h-[136px] object-cover rounded-md"
									/>
								)}

								<div className="text-xs lg:text-xl py-2 pr-4">
									{!hasLost ? (
										<div>
											{tournamentRound === 1 && (
												<span>
													<strong>Mayor:</strong>{" "}
													<Typewriter
														text={
															"Welcome to the tournament, future champs! I'm Mayor Jack Rivers, and I'm thrilled to see you join our exciting city basketball showdown. The court is yours to conquer, and I believe in your incredible skills. Show them what you're made of!"
														}
													/>
												</span>
											)}
											{tournamentRound === 2 && (
												<span>
													<strong>Mayor:</strong>{" "}
													<Typewriter
														text={
															"Congratulations on that electrifying victory! Your moves on the court are as dazzling as fireworks on a summer night. Get ready for the next challenge – you've got this!"
														}
													/>
												</span>
											)}
											{tournamentRound === 3 && (
												<span>
													<strong>Mayor:</strong>{" "}
													<Typewriter
														text={
															"You're on fire! Shooting your way into the semi-finals has brought you one step closer to victory. The finals await, and the crowd can hardly contain their excitement. Keep shining, champ!"
														}
													/>
												</span>
											)}
											{tournamentRound === 4 && (
												<span>
													<strong>Mayor:</strong>{" "}
													<Typewriter
														text={
															"Ladies and gentlemen, we've reached the pinnacle – the finals! It's a showdown against the reigning titan, a legend who's taken the crown seven times. But remember, you've got the skills to outshine even the brightest stars."
														}
													/>
												</span>
											)}
											{tournamentRound === 5 && (
												<span>
													<strong>Mayor:</strong>{" "}
													<Typewriter
														text={
															"Incredible! The crowd roars your name as you emerge as the city tournament champion! Your dedication and spirit have earned you the title. The court is forever yours, and the trophy is a testament to your basketball prowess."
														}
													/>
												</span>
											)}
										</div>
									) : (
										<div>
											<span>
												<strong>Mayor:</strong>{" "}
												<Typewriter
													text={
														"Hey there, don't hang your head low. Even the greatest players face tough matches. Remember, the court will always welcome you, and there's another chance waiting next year. Keep that hoop dream alive!"
													}
												/>
											</span>
										</div>
									)}
								</div>
							</div>
							<div className="absolute w-full h-[50%] mt-[50px] lg:mt-[100px] text-sm text-center">
								<div className="flex justify-between h-full">
									<div className="w-full flex flex-col justify-evenly items-center">
										<PlayerBracket
											name="Player 1"
											round={1}
										/>
										<PlayerBracket
											name="Ethan"
											round={1}
											lostRound={1}
										/>
										<PlayerBracket
											name="Liam"
											round={1}
											lostRound={1}
										/>
										<PlayerBracket
											name="Noah"
											round={1}
											lostRound={2}
										/>
										<PlayerBracket
											name="Lucas"
											round={1}
											lostRound={3}
										/>
										<PlayerBracket
											name="Aiden"
											round={1}
											lostRound={1}
										/>
										<PlayerBracket
											name="Carter"
											round={1}
											lostRound={2}
										/>
										<PlayerBracket
											name="Harper"
											round={1}
											lostRound={1}
										/>
									</div>
									<div className="w-full flex flex-col justify-evenly items-center">
										<PlayerBracket
											name="Player 1"
											round={2}
										/>
										<PlayerBracket
											name="Noah"
											round={2}
											lostRound={2}
										/>
										<PlayerBracket
											name="Lucas"
											round={2}
											lostRound={3}
										/>
										<PlayerBracket
											name="Carter"
											round={2}
											lostRound={2}
										/>
									</div>
									<div className="w-full flex flex-col justify-evenly items-center">
										<PlayerBracket
											name="Player 1"
											round={3}
										/>
										<PlayerBracket
											name="Lucas"
											round={3}
											lostRound={3}
										/>
									</div>
									<div className="w-full flex flex-col justify-evenly items-center">
										<PlayerBracket
											name="Player 1"
											round={4}
										/>
									</div>
									<div className="w-full flex flex-col justify-evenly items-center">
										<PlayerBracket
											name="Mason"
											round={4}
											lostRound={4}
										/>
									</div>
									<div className="w-full flex flex-col justify-evenly items-center">
										<PlayerBracket
											name="Mason"
											round={3}
											lostRound={4}
										/>
										<PlayerBracket
											name="Isaac"
											round={3}
											lostRound={3}
										/>
									</div>
									<div className="w-full flex flex-col justify-evenly items-center">
										<PlayerBracket
											name="Mason"
											round={2}
											lostRound={4}
										/>
										<PlayerBracket
											name="Owen"
											round={2}
											lostRound={2}
										/>
										<PlayerBracket
											name="Isaac"
											round={2}
											lostRound={3}
										/>
										<PlayerBracket
											name="Abigail"
											round={2}
											lostRound={2}
										/>
									</div>
									<div className="w-full flex flex-col justify-evenly items-center">
										<PlayerBracket
											name="Mason"
											round={1}
											lostRound={4}
										/>
										<PlayerBracket
											name="Caleb"
											round={1}
											lostRound={1}
										/>
										<PlayerBracket
											name="Owen"
											round={1}
											lostRound={2}
										/>
										<PlayerBracket
											name="Logan"
											round={1}
											lostRound={1}
										/>
										<PlayerBracket
											name="Zoe"
											round={1}
											lostRound={1}
										/>
										<PlayerBracket
											name="Isaac"
											round={1}
											lostRound={3}
										/>
										<PlayerBracket
											name="Gabriel"
											round={1}
											lostRound={1}
										/>
										<PlayerBracket
											name="Abigail"
											round={1}
											lostRound={2}
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
			{gameMode === "match" && !isGameRunning && (
				<div className="absolute top-0 h-screen w-screen flex flex-col items-center justify-center">
					<button
						className="z-10 border-2 rounded-md bg-green-500 font-bold text-2xl text-gray-100 px-4 py-2 mt-4 shadow-md hover:bg-green-600 uppercase"
						onClick={handleStartGame}
					>
						Start game
					</button>
				</div>
			)}
			{gameMode === "match" && isGameEnded && (
				<div className="absolute top-0 h-screen w-screen flex items-center justify-center">
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
							onClick={handleStartGame}
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
			)}
			{isGameRunning && (
				<div className="flex flex-col items-center absolute left-0 right-0 top-2 lg:top-4">
					<div className="flex justify-evenly w-[200px] rounded-md border-4 opacity-90 bg-[conic-gradient(at_top_left,_var(--tw-gradient-stops))] from-gray-900 to-gray-600 bg-gradient-to-r">
						<div className="flex flex-col text-white text-center py-2 ">
							<p className="text-xs">Player 1:</p>
							<p className="text-xl lg:text-3xl font-bold">
								{player1Score}
							</p>
						</div>
						<div className="flex flex-col text-white text-center py-2 ">
							<p className="text-xs">Player 2:</p>
							<p className="text-xl lg:text-3xl font-bold">
								{player2Score}
							</p>
						</div>
					</div>
					<div className="flex justify-evenly w-[200px] text-sm lg:text-xl">
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

function PlayerBracket({
	name,
	round,
	lostRound = 5,
}: {
	name: string;
	round: number;
	lostRound?: number;
}) {
	const { tournamentRound } = useGameStore((state) => ({
		tournamentRound: state.tournamentRound,
	}));
	return (
		<div
			className={`text-xs lg:text-base w-[50px] lg:w-[100px] h-[20px] bg-gray-200 ${
				lostRound < tournamentRound && tournamentRound > round
					? "opacity-50"
					: ""
			}`}
		>
			{tournamentRound >= round && <span>{name}</span>}
		</div>
	);
}
