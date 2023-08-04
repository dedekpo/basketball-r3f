"use client";

import { useGameStore } from "@/lib/stores";
import { onHoverSound, playAudio } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function Challenge() {
	const [highestScore, setHighestScore] = useState(0);

	const [timeLeft, setTimeLeft] = useState(60);
	const [isCountingDown, setIsCountingDown] = useState(false);

	const { gameMode, gameScore, resetGameScore } = useGameStore((state) => ({
		gameMode: state.gameMode,
		gameScore: state.gameScore,
		resetGameScore: state.resetGameScore,
	}));

	useEffect(() => {
		if (timeLeft === 0) {
			// End game
			setIsCountingDown(false);
			playAudio("referee");
			if (gameScore > highestScore) {
				setHighestScore(gameScore);
			}
		}
		const interval = setInterval(() => {
			setTimeLeft(timeLeft - 1);
		}, 1000);

		return () => clearInterval(interval);
	}, [timeLeft, isCountingDown]);

	function handleNewChallenge() {
		resetGameScore();
		setTimeLeft(60);
		setIsCountingDown(true);
		playAudio("referee-short");
		playAudio("clock-60");
	}

	if (gameMode !== "challenge") return;

	return (
		<>
			{isCountingDown ? (
				<div className="absolute top-3 flex justify-center items-center w-full">
					<div className="font-bold shadow-lg rounded-md flex flex-col gap-3 p-4 bg-white bg-opacity-50">
						<div className="flex items-center gap-3">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="w-6 h-6"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
								/>
							</svg>
							<span>Score: {gameScore}</span>
						</div>
						<div className="flex items-center gap-3">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="w-6 h-6"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<span>Time left: {timeLeft}s</span>
						</div>
					</div>
				</div>
			) : (
				<>
					{highestScore > 0 && (
						<div className="absolute top-3 flex justify-center items-center w-full">
							<span className="font-bold p-2 bg-white rounded-md shadow-lg">
								Highest score: {highestScore}
							</span>
						</div>
					)}

					<div className="absolute flex items-center justify-center top-0 left-0 h-screen w-screen">
						<div className="flex w-[50vw] h-[200px] text-center rounded-md bg-white bg-opacity-50 font-bold shadow-lg">
							<div className="flex flex-col gap-3 w-full my-auto">
								<p className="text-3xl">Ready?</p>
								<p className="text-gray-700">
									Make as many points you can in 60 seconds!
								</p>
								<button
									onPointerEnter={onHoverSound}
									onClick={handleNewChallenge}
									className="mx-auto font-bold text-xl border-2 py-4 w-[50%] hover:text-[#FE2844] hover:border-[#FE2844]"
								>
									Start
								</button>
							</div>
						</div>
					</div>
				</>
			)}
		</>
	);
}
