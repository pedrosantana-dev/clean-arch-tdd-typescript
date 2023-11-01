class LocalSavePurchases {
	constructor(private readonly chacheStore: CacheStore) {}
}

interface CacheStore {}

class CacheStoreSpy {
	deleteCallsCount = 0;
}

describe('LocalSavePurchases', () => {
	test('Should not delete cache on sut.init', () => {
		const cacheStore = new CacheStoreSpy();
		new LocalSavePurchases(cacheStore);
		expect(cacheStore.deleteCallsCount).toBe(0);
	});
});
