import { CacheStore } from '@/data/contracts/cache';

export class LocalSavePurchases {
	constructor(private readonly chacheStore: CacheStore) {}

	async save(): Promise<void> {
		this.chacheStore.delete('purchases');
	}
}
