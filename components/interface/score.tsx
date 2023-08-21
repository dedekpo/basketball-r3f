"use client";

import { useGameStore } from "@/lib/stores";

export default function Score() {
	const { player1Score, player2Score, gameMode } = useGameStore((state) => ({
		player1Score: state.player1Score,
		player2Score: state.player2Score,
		gameMode: state.gameMode,
	}));

	if (gameMode !== "tournament") return;

	return (
		<div className="absolute flex justify-evenly left-0 right-0 top-4 w-[200px] mx-auto rounded-md border-4 opacity-90 bg-[conic-gradient(at_top_left,_var(--tw-gradient-stops))] from-gray-900 to-gray-600 bg-gradient-to-r">
			<div className="flex flex-col text-white text-center py-2 ">
				<p className="text-xs">Player 1:</p>
				<p className="text-3xl font-bold">{player1Score}</p>
			</div>
			<div className="flex flex-col text-white text-center py-2 ">
				<p className="text-xs">Player 2:</p>
				<p className="text-3xl font-bold">{player2Score}</p>
			</div>
		</div>
	);
}
