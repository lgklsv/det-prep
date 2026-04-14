import type { LucideIcon } from "lucide-react";
import { Image } from "lucide-react";

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
];
