import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { useTimer } from "react-timer-hook";
import { Button } from "@/components/ui/button";
import { fetchRandomImage, type UnsplashImage } from "@/lib/unsplash";

export const Route = createFileRoute("/speak-about-photo")({
	component: SpeakAboutPhoto,
});

const PREP_SECONDS = 20;
const SPEAK_SECONDS = 90;

function SpeakAboutPhoto() {
	const [started, setStarted] = useState(false);
	const [image, setImage] = useState<UnsplashImage | null>(null);
	const [imageLoading, setImageLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleStart = useCallback(async () => {
		setError(null);
		setImageLoading(true);

		try {
			const img = await fetchRandomImage();
			setImage(img);
			setStarted(true);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to load image");
		} finally {
			setImageLoading(false);
		}
	}, []);

	const handleTryAgain = useCallback(() => {
		setStarted(false);
		setImage(null);
	}, []);

	if (!started) {
		return (
			<StartScreen onStart={handleStart} loading={imageLoading} error={error} />
		);
	}

	return <PracticeScreen image={image!} onTryAgain={handleTryAgain} />;
}

function StartScreen({
	onStart,
	loading,
	error,
}: {
	onStart: () => void;
	loading: boolean;
	error: string | null;
}) {
	return (
		<div className="flex min-h-svh items-center justify-center px-6">
			<div className="flex w-full max-w-md flex-col items-center gap-6 text-center">
				<h1 className="text-2xl font-bold tracking-tight">
					Speak about the photo
				</h1>
				<p className="text-muted-foreground">
					You will see a photo and have{" "}
					<span className="font-semibold text-foreground">20 seconds</span> to
					prepare, then{" "}
					<span className="font-semibold text-foreground">
						1 minute 30 seconds
					</span>{" "}
					to speak about it.
				</p>
				{error && <p className="text-sm text-destructive">{error}</p>}
				<Button size="lg" onClick={onStart} disabled={loading}>
					{loading ? "Loading..." : "Start"}
				</Button>
				<Link
					to="/"
					className="text-sm text-muted-foreground hover:text-foreground"
				>
					Back to home
				</Link>
			</div>
		</div>
	);
}

function PracticeScreen({
	image,
	onTryAgain,
}: {
	image: UnsplashImage;
	onTryAgain: () => void;
}) {
	const [imageLoaded, setImageLoaded] = useState(false);
	const [phase, setPhase] = useState<"prep" | "speaking" | "done">("prep");
	const phaseRef = useRef<"prep" | "speaking">("prep");

	const expiryTimestamp = useState(() => {
		const time = new Date();
		time.setSeconds(time.getSeconds() + PREP_SECONDS);
		return time;
	})[0];

	const { seconds, minutes, restart } = useTimer({
		expiryTimestamp,
		onExpire: () => {
			if (phaseRef.current === "prep") {
				phaseRef.current = "speaking";
				setPhase("speaking");
				// Defer restart to next tick — the library sets isRunning=false
				// after this callback returns, which would kill a synchronous restart.
				setTimeout(() => {
					const time = new Date();
					time.setSeconds(time.getSeconds() + SPEAK_SECONDS);
					restart(time, true);
				}, 0);
			} else {
				setPhase("done");
			}
		},
		autoStart: false,
	});

	const handleImageLoaded = useCallback(() => {
		setImageLoaded(true);
		const time = new Date();
		time.setSeconds(time.getSeconds() + PREP_SECONDS);
		restart(time, true);
	}, [restart]);

	const isDone = phase === "done";
	const isPrep = phase === "prep";
	const timerReady = imageLoaded || isDone;
	const formattedTime = timerReady
		? `${minutes}:${seconds.toString().padStart(2, "0")}`
		: `0:${PREP_SECONDS}`;

	const timerLabel = isPrep ? "to prepare" : "to speak";

	return (
		<div className="flex min-h-svh flex-col">
			{/* Header */}
			<div className="flex items-center justify-between border-b px-6 py-4">
				<div className="flex items-center gap-2">
					<Clock
						className={`size-5 ${isDone ? "text-destructive" : "text-muted-foreground"}`}
					/>
					<span
						className={`font-mono text-lg font-semibold ${isDone ? "text-destructive" : ""}`}
					>
						{formattedTime}
					</span>
					<span className="text-sm text-muted-foreground">
						{isDone ? "time's up" : timerLabel}
					</span>
				</div>
				<Link to="/">
					<Button variant="ghost" size="icon">
						<X className="size-5" />
					</Button>
				</Link>
			</div>

			{/* Main content */}
			<div className="flex flex-1 flex-col items-center gap-8 px-6 py-8">
				<h2 className="text-center text-lg font-semibold">
					{isPrep
						? "Prepare to speak about the image"
						: isDone
							? "Time's up!"
							: "Speak about the image now"}
				</h2>

				<div className="w-full max-w-2xl">
					<div className="aspect-[4/3] overflow-hidden rounded-xl border">
						<img
							src={image.url}
							alt="Speak about this image"
							width={800}
							height={600}
							onLoad={handleImageLoaded}
							className="h-full w-full object-cover"
						/>
					</div>
					<p className="mt-2 text-xs text-muted-foreground">
						&copy;{" "}
						<a
							href={`${image.photographerUrl}?utm_source=det_practice&utm_medium=referral`}
							target="_blank"
							rel="noopener noreferrer"
							className="hover:underline"
						>
							{image.photographer}
						</a>
						/Unsplash
					</p>
				</div>
			</div>

			{/* Footer */}
			<div className="flex items-center justify-end gap-3 border-t px-6 py-4">
				<Button
					variant="outline"
					size="lg"
					onClick={onTryAgain}
					disabled={!isDone}
				>
					Try again
				</Button>
			</div>
		</div>
	);
}
