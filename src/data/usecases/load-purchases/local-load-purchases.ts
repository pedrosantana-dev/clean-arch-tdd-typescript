import { CacheStore } from '@/data/contracts/cache';
import { SavePurchases, LoadPurchases } from '@/domain/usecases';

export class LocalLoadPurchases implements SavePurchases, LoadPurchases {
	private readonly key = 'purchases';
	constructor(private readonly chacheStore: CacheStore, private readonly timestamp: Date) {}

	async save(purchases: Array<SavePurchases.Params>): Promise<void> {
		this.chacheStore.replace(this.key, {
			timestamp: this.timestamp,
			value: purchases,
		});
	}

	async loadAll(): Promise<Array<LoadPurchases.Result>> {
		try {
			this.chacheStore.fetch(this.key);
			return [];
		} catch (error) {
			this.chacheStore.delete(this.key);
			return [];
		}
	}
}
