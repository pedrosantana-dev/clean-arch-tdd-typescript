import { LocalSavePurchases } from '@/data/usecases';
import { mockPurchases, CacheStoreSpy } from '@/data/tests';

type SutTypes = {
	sut: LocalSavePurchases;
	cacheStore: CacheStoreSpy;
};

const makeSut = (timestamp = new Date()): SutTypes => {
	const cacheStore = new CacheStoreSpy();
	const sut = new LocalSavePurchases(cacheStore, timestamp);
	return {
		sut,
		cacheStore,
	};
};

describe('LocalSavePurchases', () => {
	test('Should not delete or insert cache on sut.init', () => {
		const { cacheStore } = makeSut();
		expect(cacheStore.messages).toEqual([]);
	});

	test('Should not insert new Cache if delete fails', async () => {
		const { cacheStore, sut } = makeSut();
		cacheStore.simulateDeleteError();
		// try {
		// 	await sut.save();
		// } catch (error) {
		// 	expect(error.message).toBe("Delete failed");
		// }
		const purchases = mockPurchases();
		await expect(sut.save(purchases)).rejects.toThrow();
		expect(cacheStore.messages).toEqual([CacheStoreSpy.Message.delete]);
	});

	test('Should insert new Cache if delete succeeds', async () => {
		const timestamp = new Date();
		const { cacheStore, sut } = makeSut(timestamp);
		const purchases = mockPurchases();
		await expect(sut.save(purchases)).resolves.toBeFalsy();
		expect(cacheStore.messages).toEqual([CacheStoreSpy.Message.delete, CacheStoreSpy.Message.insert]);
		expect(cacheStore.deleteKey).toBe('purchases');
		expect(cacheStore.insertKey).toBe('purchases');
		expect(cacheStore.insertValues).toEqual({
			timestamp,
			value: purchases,
		});
	});

	test('Should throw if insert throws', async () => {
		const { cacheStore, sut } = makeSut();
		cacheStore.simulateInsertError();
		await expect(sut.save(mockPurchases())).rejects.toThrow();
		expect(cacheStore.messages).toEqual([CacheStoreSpy.Message.delete, CacheStoreSpy.Message.insert]);
	});
});
