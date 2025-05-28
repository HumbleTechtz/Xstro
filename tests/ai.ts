import { chatGpt } from "../src/utils/ai.ts";

(async () => {
	const tasks = [chatGpt("Hello World")];
	for (const task of tasks) {
		const result = await task;
		console.log(result);
	}
})();
