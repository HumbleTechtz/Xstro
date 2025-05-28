import useSqliteAuthState from "../src/utils/useSqliteAuthState.ts";
import { randomBytes, randomUUID } from "node:crypto";
import { performance } from "node:perf_hooks";

const delay = (ms: number): Promise<void> =>
	new Promise(resolve => setTimeout(resolve, ms));

const generateRandomData = (size: number): string =>
	randomBytes(size).toString("base64");
const generateRandomId = (): string => randomUUID();

interface Metrics {
	operation: string;
	duration: number;
	success: boolean;
	error?: string;
}

const metrics: Metrics[] = [];

const logMetric = (
	operation: string,
	start: number,
	success: boolean,
	error?: string,
): void => {
	metrics.push({
		operation,
		duration: performance.now() - start,
		success,
		error,
	});
};

(async (): Promise<void> => {
	console.log(
		"Starting Extreme useSqliteAuthState Stress Test Suite at " +
			new Date().toISOString(),
	);
	const startTime = performance.now();

	const { state, saveCreds } = await useSqliteAuthState();
	console.log(
		"Successfully initialized authentication state at " +
			new Date().toISOString(),
	);

	const TEST_DURATION = 3 * 60 * 1000;
	const CONCURRENT_OPERATIONS = 50;
	const LARGE_DATA_SIZE = 1024 * 10;
	const BATCH_SIZE = 1000;

	const generateLargeDataset = (
		count: number,
	): Record<string, Record<string, any>> => {
		const dataset: Record<string, Record<string, any>> = {
			session: {},
			"pre-key": {},
			"app-state": {},
			nested: {},
		};

		for (let i = 0; i < count; i++) {
			const id = generateRandomId();
			dataset.session[id] = {
				id,
				session: generateRandomData(LARGE_DATA_SIZE),
				timestamp: Date.now(),
				valid: Math.random() > 0.5,
			};
			dataset["pre-key"][id] = {
				id,
				preKey: generateRandomData(LARGE_DATA_SIZE / 2),
				valid: Math.random() > 0.5,
			};
			dataset["app-state"][id] = {
				keyData: generateRandomData(256),
				fingerprint: Math.floor(Math.random() * 10000),
			};
			dataset.nested[id] = {
				meta: {
					roles: Array.from({ length: Math.floor(Math.random() * 5) }, () =>
						generateRandomId(),
					),
					profile: {
						name: generateRandomData(32),
						stats: {
							logins: Math.floor(Math.random() * 1000),
							lastLogin: new Date().toISOString(),
						},
						data: generateRandomData(LARGE_DATA_SIZE),
					},
				},
			};
		}
		return dataset;
	};

	console.log(
		"Test 1: Initiating bulk data insertion of " +
			BATCH_SIZE +
			" records at " +
			new Date().toISOString(),
	);
	const bulkData = generateLargeDataset(BATCH_SIZE);
	const bulkStart = performance.now();
	try {
		await state.keys.set(bulkData);
		logMetric("Bulk Insert", bulkStart, true);
		console.log(
			"Successfully inserted " +
				BATCH_SIZE +
				" records in " +
				(performance.now() - bulkStart).toFixed(2) +
				"ms at " +
				new Date().toISOString(),
		);
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		logMetric("Bulk Insert", bulkStart, false, errorMessage);
		console.error(
			"Bulk insertion failed with error: " +
				errorMessage +
				" at " +
				new Date().toISOString(),
		);
	}
	await delay(100);

	console.log(
		"Test 2: Initiating " +
			CONCURRENT_OPERATIONS +
			" concurrent read operations at " +
			new Date().toISOString(),
	);
	const readPromises: Promise<void>[] = [];
	const readIds = Object.keys(bulkData.session).slice(0, CONCURRENT_OPERATIONS);
	for (let i = 0; i < CONCURRENT_OPERATIONS; i++) {
		const start = performance.now();
		readPromises.push(
			(async () => {
				try {
					const result = await state.keys.get("session", [
						readIds[i % readIds.length],
					]);
					const expected = JSON.stringify(
						bulkData.session[readIds[i % readIds.length]],
					);
					const actual = JSON.stringify(result[readIds[i % readIds.length]]);
					if (expected === actual) {
						logMetric(`Concurrent Read ${i}`, start, true);
						console.log(
							"Concurrent read " +
								i +
								" for ID " +
								readIds[i % readIds.length] +
								" succeeded in " +
								(performance.now() - start).toFixed(2) +
								"ms at " +
								new Date().toISOString(),
						);
					} else {
						logMetric(`Concurrent Read ${i}`, start, false, "Data mismatch");
						console.error(
							"Concurrent read " +
								i +
								" for ID " +
								readIds[i % readIds.length] +
								" failed due to data mismatch at " +
								new Date().toISOString(),
						);
					}
				} catch (error: unknown) {
					const errorMessage =
						error instanceof Error ? error.message : String(error);
					logMetric(`Concurrent Read ${i}`, start, false, errorMessage);
					console.error(
						"Concurrent read " +
							i +
							" failed with error: " +
							errorMessage +
							" at " +
							new Date().toISOString(),
					);
				}
			})(),
		);
	}
	await Promise.all(readPromises);
	console.log(
		"Completed " +
			CONCURRENT_OPERATIONS +
			" concurrent read operations at " +
			new Date().toISOString(),
	);
	await delay(100);

	console.log(
		"Test 3: Initiating " +
			CONCURRENT_OPERATIONS +
			" concurrent update operations at " +
			new Date().toISOString(),
	);
	const updatePromises: Promise<void>[] = [];
	for (let i = 0; i < CONCURRENT_OPERATIONS; i++) {
		const id = readIds[i % readIds.length];
		const start = performance.now();
		updatePromises.push(
			(async () => {
				try {
					const newData = {
						session: {
							[id]: {
								...bulkData.session[id],
								session: generateRandomData(LARGE_DATA_SIZE),
								timestamp: Date.now(),
							},
						},
					};
					await state.keys.set(newData);
					const result = await state.keys.get("session", [id]);
					if (result[id].session === newData.session[id].session) {
						logMetric(`Concurrent Update ${i}`, start, true);
						console.log(
							"Concurrent update " +
								i +
								" for ID " +
								id +
								" succeeded in " +
								(performance.now() - start).toFixed(2) +
								"ms at " +
								new Date().toISOString(),
						);
					} else {
						logMetric(`Concurrent Update ${i}`, start, false, "Update mismatch");
						console.error(
							"Concurrent update " +
								i +
								" for ID " +
								id +
								" failed due to update mismatch at " +
								new Date().toISOString(),
						);
					}
				} catch (error: unknown) {
					const errorMessage =
						error instanceof Error ? error.message : String(error);
					logMetric(`Concurrent Update ${i}`, start, false, errorMessage);
					console.error(
						"Concurrent update " +
							i +
							" failed with error: " +
							errorMessage +
							" at " +
							new Date().toISOString(),
					);
				}
			})(),
		);
	}
	await Promise.all(updatePromises);
	console.log(
		"Completed " +
			CONCURRENT_OPERATIONS +
			" concurrent update operations at " +
			new Date().toISOString(),
	);
	await delay(100);

	console.log(
		"Test 4: Initiating stress test loop for approximately " +
			TEST_DURATION / 1000 +
			" seconds at " +
			new Date().toISOString(),
	);
	const stressStart = performance.now();
	let operationCount = 0;
	while (performance.now() - startTime < TEST_DURATION) {
		const batchData = generateLargeDataset(10);
		const start = performance.now();
		try {
			await state.keys.set(batchData);
			const randomId = Object.keys(batchData.session)[0];
			await state.keys.get("session", [randomId]);
			await state.keys.set({ session: { [randomId]: null } });
			logMetric(`Stress Operation ${operationCount}`, start, true);
			operationCount++;
			if (operationCount % 100 === 0) {
				console.log(
					"Stress test loop progress: Completed " +
						operationCount +
						" operations at " +
						new Date().toISOString(),
				);
			}
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : String(error);
			logMetric(`Stress Operation ${operationCount}`, start, false, errorMessage);
			console.error(
				"Stress operation " +
					operationCount +
					" failed with error: " +
					errorMessage +
					" at " +
					new Date().toISOString(),
			);
			operationCount++;
		}
		await delay(10);
	}
	console.log(
		"Completed " +
			operationCount +
			" stress test operations at " +
			new Date().toISOString(),
	);

	console.log(
		"Test 5: Initiating credentials save/load stress test with 100 iterations at " +
			new Date().toISOString(),
	);
	const credsStart = performance.now();
	try {
		for (let i = 0; i < 100; i++) {
			await saveCreds();
			const creds = await state.keys.get("creds", [""]);
			if (creds[""]) {
				logMetric(`Credentials Operation ${i}`, credsStart, true);
				console.log(
					"Credentials operation " + i + " succeeded at " + new Date().toISOString(),
				);
			} else {
				logMetric(
					`Credentials Operation ${i}`,
					credsStart,
					false,
					"Credentials not found",
				);
				console.error(
					"Credentials operation " +
						i +
						" failed: Credentials not found at " +
						new Date().toISOString(),
				);
			}
		}
		console.log(
			"Completed credentials stress test at " + new Date().toISOString(),
		);
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		logMetric("Credentials Stress", credsStart, false, errorMessage);
		console.error(
			"Credentials stress test failed with error: " +
				errorMessage +
				" at " +
				new Date().toISOString(),
		);
	}

	console.log(
		"Test 6: Initiating edge case testing at " + new Date().toISOString(),
	);
	const edgeCases = [
		{ category: "session", id: "", data: { id: "", session: "" } },
		{ category: "session", id: generateRandomId(), data: null },
		{
			category: generateRandomData(256),
			id: generateRandomId(),
			data: { id: generateRandomId() },
		},
	];
	for (const { category, id, data } of edgeCases) {
		const start = performance.now();
		try {
			await state.keys.set({ [category]: { [id]: data } });
			const result = await state.keys.get(category, [id]);
			logMetric(`Edge Case ${category}:${id}`, start, true);
			console.log(
				"Edge case test for category " +
					category +
					" and ID " +
					id +
					" succeeded in " +
					(performance.now() - start).toFixed(2) +
					"ms at " +
					new Date().toISOString(),
			);
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : String(error);
			logMetric(`Edge Case ${category}:${id}`, start, false, errorMessage);
			console.error(
				"Edge case test for category " +
					category +
					" and ID " +
					id +
					" failed with error: " +
					errorMessage +
					" at " +
					new Date().toISOString(),
			);
		}
	}
	console.log("Completed edge case testing at " + new Date().toISOString());

	console.log("Generating Performance Report at " + new Date().toISOString());
	const totalDuration = (performance.now() - startTime) / 1000;
	const successRate =
		(metrics.filter(m => m.success).length / metrics.length) * 100;
	const avgDuration =
		metrics.reduce((sum, m) => sum + m.duration, 0) / metrics.length / 1000;

	console.log(
		"Performance Report - Total Duration: " +
			totalDuration.toFixed(2) +
			" seconds",
	);
	console.log("Performance Report - Total Operations: " + metrics.length);
	console.log(
		"Performance Report - Success Rate: " + successRate.toFixed(2) + "%",
	);
	console.log(
		"Performance Report - Average Operation Time: " +
			avgDuration.toFixed(2) +
			" seconds",
	);

	const operations = Array.from(
		new Set(metrics.map(m => m.operation.split(" ")[0])),
	);
	for (const op of operations) {
		const opMetrics = metrics.filter(m => m.operation.startsWith(op));
		const opSuccess =
			(opMetrics.filter(m => m.success).length / opMetrics.length) * 100;
		const opAvg =
			opMetrics.reduce((sum, m) => sum + m.duration, 0) / opMetrics.length / 1000;
		console.log("Performance Report - " + op + " Operations:");
		console.log(
			"Performance Report - " + op + " Operations - Count: " + opMetrics.length,
		);
		console.log(
			"Performance Report - " +
				op +
				" Operations - Success Rate: " +
				opSuccess.toFixed(2) +
				"%",
		);
		console.log(
			"Performance Report - " +
				op +
				" Operations - Average Time: " +
				opAvg.toFixed(2) +
				" seconds",
		);
	}

	console.log("Stress Test Suite Completed at " + new Date().toISOString());
})();
