import { Link } from "@tanstack/react-router";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { Skill } from "@/lib/skills";

export function SkillCard({ skill }: { skill: Skill }) {
	const Icon = skill.icon;

	return (
		<Link to={skill.path} className="block no-underline">
			<Card className="cursor-pointer transition-shadow hover:shadow-lg">
				<CardHeader>
					<div className="flex items-center gap-3">
						<div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
							<Icon className="size-5" />
						</div>
						<CardTitle>{skill.name}</CardTitle>
					</div>
				</CardHeader>
				<CardContent>
					<CardDescription>{skill.description}</CardDescription>
				</CardContent>
			</Card>
		</Link>
	);
}
