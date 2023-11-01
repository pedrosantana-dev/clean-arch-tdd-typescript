import { CacheStore } from "@/data/contracts/cache";
import { LocalSavePurchases } from "@/data/usecases";

class CacheStoreSpy implements CacheStore {
	deleteCallsCount = 0;
	insertCallsCount = 0;
	key: string;

	delete(key: string): void {
		this.deleteCallsCount++;
		this.key = key;
	}
}

type SutTypes = {
	sut: LocalSavePurchases;
	cacheStore: CacheStoreSpy;
};

const makeSut = (): SutTypes => {
	const cacheStore = new CacheStoreSpy();
	const sut = new LocalSavePurchases(cacheStore);
	return {
		sut,
		cacheStore,
	};
};

describe("LocalSavePurchases", () => {
	test("Should not delete cache on sut.init", () => {
		const { cacheStore } = makeSut();
		expect(cacheStore.deleteCallsCount).toBe(0);
	});

	test("Should call delete with correct key", async () => {
		const { cacheStore, sut } = makeSut();
		await sut.save();
		expect(cacheStore.key).toBe("purchases");
		expect(cacheStore.deleteCallsCount).toBe(1);
	});

	test("Should not insert new Cache if delete fails", async () => {
		const { cacheStore, sut } = makeSut();
		jest.spyOn(cacheStore, "delete").mockImplementationOnce(() => {
			throw new Error("Delete failed");
		});
		// try {
		// 	await sut.save();
		// } catch (error) {
		// 	expect(error.message).toBe("Delete failed");
		// }
		await expect(sut.save()).rejects.toThrow();
		expect(cacheStore.insertCallsCount).toBe(0);
	});
});
