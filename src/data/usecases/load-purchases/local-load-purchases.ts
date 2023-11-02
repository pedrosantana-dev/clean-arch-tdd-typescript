import { CacheStore } from '@/data/contracts/cache';
import { SavePurchases, LoadPurchases } from '@/domain/usecases';

export class LocalLoadPurchases implements SavePurchases, LoadPurchases {
	private readonly key = 'purchases';
	constructor(private readonly chacheStore: CacheStore, private readonly currentDate: Date) {}

	async save(purchases: Array<SavePurchases.Params>): Promise<void> {
		this.chacheStore.replace(this.key, {
			timestamp: this.currentDate,
			value: purchases,
		});
	}

	async loadAll(): Promise<Array<LoadPurchases.Result>> {
		try {
			const cache = this.chacheStore.fetch(this.key);
			const maxAge = new Date(cache.timestamp);
			maxAge.setDate(maxAge.getDate() + 3);
			if (maxAge > this.currentDate) {
				return cache.value;
			} else {
				throw new Error();
			}
		} catch (error) {
			this.chacheStore.delete(this.key);
			return [];
		}
	}
}
