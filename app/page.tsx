"use client";

import Challenge from "@/components/interface/challenge";
import HomeButton from "@/components/interface/home-button";
import Match from "@/components/interface/match";
import MusicPlayer from "@/components/interface/music-player";
// import Score from "@/components/interface/score";
import Experience from "@/components/scene/experience";
import { initSDK } from "@/lib/game-controll";
import dynamic from "next/dynamic";
import { useEffect } from "react";

const Menu = dynamic(() => import("@/components/interface/menu"), {
	ssr: false,
});
const Joystick = dynamic(() => import("@/components/interface/joystick"), {
	ssr: false,
});

export default function Home() {
	useEffect(() => {
		initSDK();
	}, []);

	return (
		<div className="h-screen">
			<Experience />
			<Menu />
			<Match />
			<Challenge />
			<MusicPlayer />
			<HomeButton />
			{/* <Score /> */}
			{/* <Footer /> */}
			<Joystick />
		</div>
	);
}
