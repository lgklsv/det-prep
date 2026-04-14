const CATEGORIES = [
	"street",
	"people",
	"beach",
	"city",
	"interior",
	"forest",
	"market",
	"park",
	"restaurant",
	"classroom",
	"office",
	"farm",
	"garden",
	"playground",
	"train station",
	"library",
	"construction",
	"wedding",
	"festival",
	"cooking",
	"sports",
	"traffic",
	"airport",
	"harbor",
	"mountain",
	"river",
	"desert",
	"snow",
	"sunset",
	"bridge",
	"museum",
	"grocery store",
	"campfire",
	"fishing",
	"hiking",
	"concert",
	"bakery",
	"laundry",
	"garage sale",
	"picnic",
] as const;

export interface UnsplashImage {
	url: string;
	photographer: string;
	photographerUrl: string;
}

function getRandomCategory(): string {
	return CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
}

export async function fetchRandomImage(): Promise<UnsplashImage> {
	const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

	if (!accessKey) {
		throw new Error(
			"Missing VITE_UNSPLASH_ACCESS_KEY environment variable. Get a free key at https://unsplash.com/developers",
		);
	}

	const category = getRandomCategory();
	const response = await fetch(
		`https://api.unsplash.com/photos/random?query=${encodeURIComponent(category)}&orientation=landscape&content_filter=high`,
		{
			headers: {
				Authorization: `Client-ID ${accessKey}`,
			},
		},
	);

	if (!response.ok) {
		throw new Error(`Unsplash API error: ${response.status}`);
	}

	const data = await response.json();

	return {
		url: `${data.urls.regular}&w=800&h=600&fit=crop`,
		photographer: data.user.name,
		photographerUrl: data.user.links.html,
	};
}
