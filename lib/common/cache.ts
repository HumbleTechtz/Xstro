export type CacheStore = {
	get<T>(key: string): T | undefined;
	set<T>(key: string, value: T): void;
	del(key: string): void;
	flushAll(): void;
};

export class MemoryCache implements CacheStore {
	private store = new Map<string, unknown>();
	private stats = { hits: 0, misses: 0, sets: 0, deletes: 0 };

	get<T>(key: string): T | undefined {
		const value = this.store.get(key) as T | undefined;
		value !== undefined ? this.stats.hits++ : this.stats.misses++;
		return value;
	}

	set<T>(key: string, value: T): void {
		this.store.set(key, value);
		this.stats.sets++;
	}

	del(key: string): void {
		this.store.delete(key) && this.stats.deletes++;
	}

	flushAll(): void {
		this.store.clear();
		this.stats = { hits: 0, misses: 0, sets: 0, deletes: 0 };
	}

	getStats() {
		return { ...this.stats, size: this.store.size };
	}
}
