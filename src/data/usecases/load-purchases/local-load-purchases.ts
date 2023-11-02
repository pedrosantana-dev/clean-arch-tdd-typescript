import { CacheStore } from '@/data/contracts/cache';
import { SavePurchases } from '@/domain/usecases';

export class LocalLoadPurchases implements SavePurchases {
	constructor(private readonly chacheStore: CacheStore, private readonly timestamp: Date) {}

	async save(purchases: Array<SavePurchases.Params>): Promise<void> {
		this.chacheStore.replace('purchases', {
			timestamp: this.timestamp,
			value: purchases,
		});
	}
}
