import { LocalLoadPurchases } from '@/data/usecases';
import { CacheStoreSpy, mockPurchases } from '@/data/tests';

type SutTypes = {
	sut: LocalLoadPurchases;
	cacheStore: CacheStoreSpy;
};

const makeSut = (timestamp = new Date()): SutTypes => {
	const cacheStore = new CacheStoreSpy();
	const sut = new LocalLoadPurchases(cacheStore, timestamp);
	return {
		sut,
		cacheStore,
	};
};

describe('LocalSavePurchases', () => {
	test('Should not delete or insert cache on sut.init', () => {
		const { cacheStore } = makeSut();
		expect(cacheStore.actions).toEqual([]);
	});

	test('Should return empty list if load fails', async () => {
		const { cacheStore, sut } = makeSut();
		cacheStore.simulateFetchError();
		await expect(sut.loadAll()).resolves.toEqual([]);
		expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch, CacheStoreSpy.Action.delete]);
		expect(cacheStore.deleteKey).toBe('purchases');
	});

	test('Should return a list of purchases if cache is less than 3 days old', async () => {
		const currentDate = new Date();
		const timestamp = new Date(currentDate);
		timestamp.setDate(timestamp.getDate() - 3);
		timestamp.setSeconds(timestamp.getSeconds() + 1);
		const { cacheStore, sut } = makeSut(currentDate);
		cacheStore.fectchResult = {
			timestamp,
			value: mockPurchases(),
		};
		await expect(sut.loadAll()).resolves.toEqual(cacheStore.fectchResult.value);
		expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch]);
		expect(cacheStore.fetchKey).toBe('purchases');
	});

	test('Should return an empty list if chace is more than 3 days old', async () => {
		const currentDate = new Date();
		const timestamp = new Date(currentDate);
		timestamp.setDate(timestamp.getDate() - 3);
		timestamp.setSeconds(timestamp.getSeconds() - 1);
		const { cacheStore, sut } = makeSut(currentDate);
		cacheStore.fectchResult = {
			timestamp,
			value: mockPurchases(),
		};
		await expect(sut.loadAll()).resolves.toEqual([]);
		expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch, CacheStoreSpy.Action.delete]);
		expect(cacheStore.fetchKey).toBe('purchases');
		expect(cacheStore.deleteKey).toBe('purchases');
	});

	test('Should return an empty list if chace is 3 days old', async () => {
		const currentDate = new Date();
		const timestamp = new Date(currentDate);
		timestamp.setDate(timestamp.getDate() - 3);
		const { cacheStore, sut } = makeSut(currentDate);
		cacheStore.fectchResult = {
			timestamp,
			value: mockPurchases(),
		};
		await expect(sut.loadAll()).resolves.toEqual([]);
		expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch, CacheStoreSpy.Action.delete]);
		expect(cacheStore.fetchKey).toBe('purchases');
		expect(cacheStore.deleteKey).toBe('purchases');
	});
});
