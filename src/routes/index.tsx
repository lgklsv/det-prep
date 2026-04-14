import { createFileRoute } from "@tanstack/react-router";
import { SkillCard } from "@/components/skill-card";
import { skills } from "@/lib/skills";

export const Route = createFileRoute("/")({ component: HomePage });

function HomePage() {
	return (
		<div className="flex min-h-svh flex-col items-center px-6 py-12">
			<div className="w-full max-w-3xl">
				<h1 className="text-3xl font-bold tracking-tight">DET Practice</h1>
				<p className="mt-2 text-muted-foreground">Choose a skill to practice</p>
				<div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
					{skills.map((skill) => (
						<SkillCard key={skill.id} skill={skill} />
					))}
				</div>
			</div>
		</div>
	);
}
