export function startClockAlignedScheduler(callback: () => void): void {
	const run = () => {
		callback();
		const now = new Date();
		const delay = 60000 - (now.getSeconds() * 1000 + now.getMilliseconds());
		setTimeout(run, delay);
	};
	run();
}