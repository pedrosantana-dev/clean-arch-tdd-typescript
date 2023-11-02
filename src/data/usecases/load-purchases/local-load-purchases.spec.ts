import { LocalLoadPurchases } from '@/data/usecases';
import { CacheStoreSpy, mockPurchases, getCacheExpirationDate } from '@/data/tests';

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
		expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch]);
	});

	test('Should return a list of purchases if cache is valid', async () => {
		const currentDate = new Date();
		const timestamp = getCacheExpirationDate(currentDate);
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

	test('Should return an empty list if chace is expired', async () => {
		const currentDate = new Date();
		const timestamp = getCacheExpirationDate(currentDate);
		timestamp.setSeconds(timestamp.getSeconds() - 1);
		const { cacheStore, sut } = makeSut(currentDate);
		cacheStore.fectchResult = {
			timestamp,
			value: mockPurchases(),
		};
		await expect(sut.loadAll()).resolves.toEqual([]);
		expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch]);
		expect(cacheStore.fetchKey).toBe('purchases');
	});

	test('Should return an empty list if cache is on expiration date', async () => {
		const currentDate = new Date();
		const timestamp = getCacheExpirationDate(currentDate);
		const { cacheStore, sut } = makeSut(currentDate);
		cacheStore.fectchResult = {
			timestamp,
			value: mockPurchases(),
		};
		await expect(sut.loadAll()).resolves.toEqual([]);
		expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch]);
		expect(cacheStore.fetchKey).toBe('purchases');
	});

	test('Should return an empty list if cache is lempty', async () => {
		const currentDate = new Date();
		const timestamp = getCacheExpirationDate(currentDate);
		timestamp.setSeconds(timestamp.getSeconds() + 1);
		const { cacheStore, sut } = makeSut(currentDate);
		cacheStore.fectchResult = {
			timestamp,
			value: [],
		};
		await expect(sut.loadAll()).resolves.toEqual([]);
		expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch]);
		expect(cacheStore.fetchKey).toBe('purchases');
	});
});
