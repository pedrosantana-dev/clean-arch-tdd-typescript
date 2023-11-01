import { CacheStore } from "@/data/contracts/cache";
import { SavePurchases } from "@/domain/usecases";

export class LocalSavePurchases implements SavePurchases {
	constructor(private readonly chacheStore: CacheStore) {}

	async save(purchases: Array<SavePurchases.Params>): Promise<void> {
		this.chacheStore.delete("purchases");
		this.chacheStore.insert("purchases", purchases);
	}
}
