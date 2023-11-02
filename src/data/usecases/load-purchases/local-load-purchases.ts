import { CacheStore } from '@/data/contracts/cache';
import { SavePurchases } from '@/domain/usecases';

export class LocalLoadPurchases implements SavePurchases {
	private readonly key = 'purchases';
	constructor(private readonly chacheStore: CacheStore, private readonly timestamp: Date) {}

	async save(purchases: Array<SavePurchases.Params>): Promise<void> {
		this.chacheStore.replace(this.key, {
			timestamp: this.timestamp,
			value: purchases,
		});
	}

	async loadAll(): Promise<void> {
		this.chacheStore.fetch(this.key);
	}
}
