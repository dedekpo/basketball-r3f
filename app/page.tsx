import Challenge from "@/components/interface/challenge";
import Footer from "@/components/interface/footer";
import LightSwitch from "@/components/interface/light-switch";
import MusicPlayer from "@/components/interface/music-player";
import Score from "@/components/interface/score";
import Experience from "@/components/scene/experience";
import dynamic from "next/dynamic";

const Menu = dynamic(() => import("@/components/interface/menu"), {
	ssr: false,
});

export default function Home() {
	return (
		<div className="h-screen">
			<Experience />
			<Menu />
			<Challenge />
			<MusicPlayer />
			<Score />
			<LightSwitch />
			<Footer />
		</div>
	);
}
