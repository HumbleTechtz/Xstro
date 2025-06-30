export async function fact() {
	const response = await fetch(
		"https://uselessfacts.jsph.pl/random.json?language=en"
	);
	const data = (await response.json()) as { text: string };
	return data.text;
}

export async function getQuote() {
	const response = await fetch("https://zenquotes.io/api/random");
	const data = (await response.json()) as [{ q: string; a: string }];
	return `"${data[0].q}"\n\n— ${data[0].a}`;
}

export async function getAdvice() {
	const response = await fetch("https://api.adviceslip.com/advice");
	const data = (await response.json()) as { slip: { advice: string } };
	return data.slip.advice;
}

export async function getInsult() {
	const useFirstApi = Math.random() < 0.5;
	if (useFirstApi) {
		const response = await fetch(
			"https://evilinsult.com/generate_insult.php?lang=en&type=json"
		);
		const data = (await response.json()) as { insult: string };
		return data.insult;
	} else {
		const response = await fetch("https://insult.mattbas.org/api/insult");
		const insult = await response.text();
		return insult;
	}
}

export async function getJoke() {
	const apiChoice = Math.floor(Math.random() * 3);

	if (apiChoice === 0) {
		const response = await fetch(
			"https://v2.jokeapi.dev/joke/Any?type=single,twopart&blacklistFlags=nsfw,religious,political,racist,sexist,explicit"
		);
		const data = (await response.json()) as {
			joke?: string;
			setup?: string;
			delivery?: string;
			type: string;
		};
		if (data.type === "twopart" && data.setup && data.delivery) {
			return `${data.setup}\n\n${data.delivery}`;
		}
		return data.joke || "No joke found.";
	} else if (apiChoice === 1) {
		const response = await fetch(
			"https://official-joke-api.appspot.com/random_joke"
		);
		const joke = (await response.json()) as {
			setup: string;
			punchline: string;
		};
		return `${joke.setup}\n${joke.punchline}`;
	} else {
		const response = await fetch(
			"https://backend-omega-seven.vercel.app/api/getjoke"
		);
		const jokes = (await response.json()) as [
			{ question: string; punchline: string }
		];
		if (jokes && jokes.length > 0) {
			return `${jokes[0].question}\n${jokes[0].punchline}`;
		}
		return "No joke found.";
	}
}

export async function getRizz() {
	const response = await fetch("https://rizzapi.vercel.app/random");
	const data = (await response.json()) as { text: string };
	return data.text;
}
export async function getCatFact() {
	const response = await fetch("https://catfact.ninja/fact");
	const data = (await response.json()) as { fact: string };
	return `🐱 ${data.fact}`;
}
export async function getDogFact() {
	const response = await fetch("https://dog-api.kinduff.com/api/facts");
	const data = (await response.json()) as { facts: string[] };
	return `🐶 ${data.facts[0]}`;
}
export async function getNumberFact() {
	const randomNum = Math.floor(Math.random() * 1000);
	const response = await fetch(`http://numbersapi.com/${randomNum}`);
	const text = await response.text();
	return `🔢 ${text}`;
}
export async function getAffirmation() {
	const response = await fetch("https://www.affirmations.dev/");
	const data = (await response.json()) as { affirmation: string };
	return `✨ ${data.affirmation}`;
}
export async function getKanyeQuote() {
	const response = await fetch("https://api.kanye.rest/");
	const data = (await response.json()) as { quote: string };
	return `🎤 "${data.quote}"\n\n— Kanye West`;
}
