"use client";

import { useGameStore, useJoystickStore } from "@/lib/stores";
import { useEffect, useRef } from "react";
import Nipple from "nipplejs";
import { isMobile } from "react-device-detect";

export default function Joystick() {
	const joystickRef = useRef<HTMLDivElement | null>(null);

	const { setDirection, setJump } = useJoystickStore((state) => ({
		setDirection: state.setDirection,
		setJump: state.setJump,
	}));

	const { gameMode } = useGameStore((state) => ({
		gameMode: state.gameMode,
	}));

	const handleButtonPress = () => {
		setJump(true);
	};

	const handleButtonRelease = () => {
		setJump(false);
	};

	useEffect(() => {
		if (!joystickRef.current) return;
		const nipple = Nipple.create({
			zone: joystickRef.current,
			color: "white",
			size: 100,
		});

		nipple.on("start", () => {
			setDirection({
				right: false,
				left: false,
				up: false,
				down: false,
			});
		});

		nipple.on("move", (evt, data) => {
			// Update the direction state using Zustand's setDirection
			const { angle, force } = data;

			if (force > 0.5) {
				setDirection({
					right:
						angle.degree <= 60 || angle.degree >= 300
							? true
							: false,
					left:
						angle.degree > 120 && angle.degree < 240 ? true : false,
					up:
						angle.degree >= 30 && angle.degree <= 150
							? true
							: false,
					down:
						angle.degree > 210 && angle.degree <= 330
							? true
							: false,
				});
			}
		});

		nipple.on("end", () => {
			setDirection({
				right: false,
				left: false,
				up: false,
				down: false,
			});
		});

		return () => {
			nipple.destroy();
		};
	}, []);

	const isInvisible =
		(gameMode !== "challenge" &&
			gameMode !== "tournament" &&
			gameMode !== "free" &&
			gameMode !== "match") ||
		!isMobile;

	return (
		<div className={isInvisible ? "hidden" : ""}>
			<div
				ref={joystickRef}
				className="z-50 absolute bottom-[10%] w-[70%] h-[70%]"
			></div>
			<button
				className="z-50 absolute border-2 rounded-full flex items-center justify-center bottom-[15%] right-[10%] w-[20%] h-[20%]"
				onMouseDown={handleButtonPress}
				onMouseUp={handleButtonRelease}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={1.5}
					stroke="currentColor"
					className="w-10 h-10"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z"
					/>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z"
					/>
				</svg>
			</button>
		</div>
	);
}
