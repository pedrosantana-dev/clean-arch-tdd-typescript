import { CacheStore, CachePolicy } from '@/data/contracts/cache';
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
			return CachePolicy.validate(cache.timestamp, this.currentDate) ? cache.value : [];
		} catch (error) {
			return [];
		}
	}

	validate(): void {
		try {
			const cache = this.chacheStore.fetch(this.key);
			if (!CachePolicy.validate(cache.timestamp, this.currentDate)) {
				throw new Error();
			}
		} catch (error) {
			this.chacheStore.delete(this.key);
		}
	}
}
