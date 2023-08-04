"use client";

import { useGameStore } from "@/lib/stores";
import { Chakra_Petch } from "next/font/google";

const chakraPetch = Chakra_Petch({
	subsets: ["latin"],
	weight: ["500", "700"],
});

export default function Score() {
	const { gameScore, gameMode } = useGameStore((state) => ({
		gameScore: state.gameScore,
		gameMode: state.gameMode,
	}));

	if (gameMode !== "free") return;

	return (
		<div
			style={chakraPetch.style}
			className="absolute left-0 right-0 top-4 w-[200px] mx-auto rounded-md border-4 opacity-90 bg-[conic-gradient(at_top_left,_var(--tw-gradient-stops))] from-gray-900 to-gray-600 bg-gradient-to-r"
		>
			<div className="flex flex-col text-white text-center py-2 ">
				<p className="text-xs">SCORE:</p>
				<p className="text-3xl font-bold">{gameScore}</p>
			</div>
		</div>
	);
}
