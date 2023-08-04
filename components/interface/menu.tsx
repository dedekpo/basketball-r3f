"use client";

import { useGameStore } from "@/lib/stores";
import { onClickSound, onHoverSound } from "@/lib/utils";
import { useProgress } from "@react-three/drei";

export default function Menu() {
	const { progress } = useProgress();

	const { gameMode, setGameMode } = useGameStore((state) => ({
		gameMode: state.gameMode,
		setGameMode: state.setGameMode,
	}));

	if (progress < 100 || gameMode === "loading")
		return <LoadingScreen progress={progress} setGameMode={setGameMode} />;

	if (gameMode !== "menu") return;

	return (
		<div className="absolute flex items-center justify-center top-0 left-0 h-screen w-screen z-50">
			<div className="flex flex-col text-white font-bold text-7xl gap-3 w-[80%]">
				<button
					onPointerEnter={onHoverSound}
					onClick={() => {
						onClickSound();
						setGameMode("challenge");
					}}
				>
					<p className="text-right hover:text-[#FE2844] drop-shadow-[0_3px_3px_rgba(43,42,58,1)]">
						Challenge
					</p>
				</button>
				<button
					onPointerEnter={onHoverSound}
					onClick={() => {
						onClickSound();
						setGameMode("free");
					}}
				>
					<p className="text-right hover:text-[#FE2844] drop-shadow-[0_3px_3px_rgba(43,42,58,1)]">
						Training
					</p>
				</button>
				<button
					onPointerEnter={onHoverSound}
					onClick={() => {
						onClickSound();
						setGameMode("credits");
					}}
				>
					<p className="text-right hover:text-[#FE2844] drop-shadow-[0_3px_3px_rgba(43,42,58,1)]">
						Credits
					</p>
				</button>
			</div>
		</div>
	);
}

function LoadingScreen({
	progress,
	setGameMode,
}: {
	progress: number;
	setGameMode: (
		newGameMode: "menu" | "challenge" | "free" | "credits" | "loading"
	) => void;
}) {
	function handleStartGame() {
		onClickSound();
		setGameMode("menu");
	}

	return (
		<div className="absolute flex items-center justify-center top-0 left-0 h-screen w-screen bg-gray-900 z-50 text-center">
			{progress < 100 ? (
				<div className="text-white font-bold text-7xl border-2 py-4 w-[50%]">
					{progress.toFixed(0)}%
				</div>
			) : (
				<button
					onPointerEnter={onHoverSound}
					onClick={handleStartGame}
					className="text-white font-bold text-7xl border-2 py-4 w-[50%] hover:text-[#FE2844] hover:border-[#FE2844]"
				>
					Play
				</button>
			)}
		</div>
	);
}
