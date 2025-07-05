import type { CacheStore } from "baileys";

export default (): CacheStore => {
	const store = new Map<string, unknown>();
	const stats = { hits: 0, misses: 0, sets: 0, deletes: 0 };

	return {
		get<T>(key: string): T | undefined {
			const value = store.get(key) as T | undefined;
			value !== undefined ? stats.hits++ : stats.misses++;
			return value;
		},

		set<T>(key: string, value: T): void {
			store.set(key, value);
			stats.sets++;
		},

		del(key: string): void {
			store.delete(key) && stats.deletes++;
		},

		flushAll(): void {
			store.clear();
			stats.hits = stats.misses = stats.sets = stats.deletes = 0;
		},
	};
};
