export default async function (): Promise<string> {
	const res = await fetch(
		"https://evilinsult.com/generate_insult.php?lang=en&type=json"
	);
	const data = await res.json();
	return data.insult;
}
