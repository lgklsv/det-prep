import type { LucideIcon } from "lucide-react";
import { Image, Mic } from "lucide-react";

export interface Skill {
	id: string;
	name: string;
	description: string;
	icon: LucideIcon;
	path: string;
}

export const skills: Skill[] = [
	{
		id: "write-about-photo",
		name: "Write about the photo",
		description:
			"Describe a photo in one minute. Practice writing clearly under time pressure.",
		icon: Image,
		path: "/write-about-photo",
	},
	{
		id: "speak-about-photo",
		name: "Speak about the photo",
		description:
			"Describe a photo out loud. 20 seconds to prepare, then 1.5 minutes to speak.",
		icon: Mic,
		path: "/speak-about-photo",
	},
];
