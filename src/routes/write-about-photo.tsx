import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, X } from "lucide-react";
import { useCallback, useState } from "react";
import { useTimer } from "react-timer-hook";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { fetchRandomImage, type UnsplashImage } from "@/lib/unsplash";

export const Route = createFileRoute("/write-about-photo")({
	component: WriteAboutPhoto,
});

type SessionState = "idle" | "active" | "expired";

function WriteAboutPhoto() {
	const [sessionState, setSessionState] = useState<SessionState>("idle");
	const [response, setResponse] = useState("");
	const [image, setImage] = useState<UnsplashImage | null>(null);
	const [imageLoading, setImageLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleStart = useCallback(async () => {
		setResponse("");
		setError(null);
		setImageLoading(true);

		try {
			const img = await fetchRandomImage();
			setImage(img);
			setSessionState("active");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to load image");
		} finally {
			setImageLoading(false);
		}
	}, []);

	const handleTryAgain = useCallback(() => {
		setSessionState("idle");
		setImage(null);
		setResponse("");
	}, []);

	if (sessionState === "idle") {
		return (
			<StartScreen onStart={handleStart} loading={imageLoading} error={error} />
		);
	}

	return (
		<PracticeScreen
			image={image!}
			sessionState={sessionState}
			response={response}
			onResponseChange={setResponse}
			onExpire={() => setSessionState("expired")}
			onTryAgain={handleTryAgain}
		/>
	);
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
					Write about the photo
				</h1>
				<p className="text-muted-foreground">
					You will see a photo and have{" "}
					<span className="font-semibold text-foreground">1 minute</span> to
					write a description. Try to be as detailed and clear as possible.
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
	sessionState,
	response,
	onResponseChange,
	onExpire,
	onTryAgain,
}: {
	image: UnsplashImage;
	sessionState: "active" | "expired";
	response: string;
	onResponseChange: (value: string) => void;
	onExpire: () => void;
	onTryAgain: () => void;
}) {
	const expiryTimestamp = useState(() => {
		const time = new Date();
		time.setSeconds(time.getSeconds() + 60);
		return time;
	})[0];

	const { seconds, minutes } = useTimer({
		expiryTimestamp,
		onExpire,
		autoStart: true,
	});

	const isExpired = sessionState === "expired";
	const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;
	const wordCount = response.trim() ? response.trim().split(/\s+/).length : 0;

	return (
		<div className="flex min-h-svh flex-col">
			{/* Header */}
			<div className="flex items-center justify-between border-b px-6 py-4">
				<div className="flex items-center gap-2">
					<Clock
						className={`size-5 ${isExpired ? "text-destructive" : "text-muted-foreground"}`}
					/>
					<span
						className={`font-mono text-lg font-semibold ${isExpired ? "text-destructive" : ""}`}
					>
						{formattedTime}
					</span>
					<span className="text-sm text-muted-foreground">
						for this question
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
					Write a description of the image below for 1 minute
				</h2>

				<div className="flex w-full max-w-4xl flex-1 flex-col gap-6 md:flex-row">
					{/* Image */}
					<div className="flex flex-1 flex-col gap-2">
						<div className="aspect-[4/3] overflow-hidden rounded-xl border">
							<img
								src={image.url}
								alt="Describe this image"
								width={800}
								height={600}
								className="h-full w-full object-cover"
							/>
						</div>
						<p className="text-xs text-muted-foreground">
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

					{/* Textarea */}
					<div className="flex flex-1 flex-col gap-2">
						<Textarea
							placeholder="Your response"
							value={response}
							onChange={(e) => onResponseChange(e.target.value)}
							disabled={isExpired}
							className="min-h-[300px] flex-1 resize-none rounded-xl border border-border bg-background text-xl md:text-xl shadow-sm"
						/>
						<p className="text-right text-xs text-muted-foreground">
							{wordCount} {wordCount === 1 ? "word" : "words"}
						</p>
					</div>
				</div>

				{/* Expired message */}
				{isExpired && (
					<p className="font-medium text-destructive">Time&apos;s up!</p>
				)}
			</div>

			{/* Footer */}
			<div className="flex items-center justify-end gap-3 border-t px-6 py-4">
				{isExpired && (
					<Button variant="outline" size="lg" onClick={onTryAgain}>
						Try again
					</Button>
				)}
				<Button size="lg" disabled={!response.trim()}>
					Submit
				</Button>
			</div>
		</div>
	);
}
