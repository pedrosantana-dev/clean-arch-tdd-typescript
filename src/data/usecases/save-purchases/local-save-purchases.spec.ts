import { CacheStore } from "@/data/contracts/cache";
import { LocalSavePurchases } from "@/data/usecases";
import { SavePurchases } from "@/domain";

class CacheStoreSpy implements CacheStore {
	deleteCallsCount = 0;
	insertCallsCount = 0;
	deleteKey: string;
	insertKey: string;
	insertValues: Array<SavePurchases.Params> = [];

	delete(key: string): void {
		this.deleteCallsCount++;
		this.deleteKey = key;
	}

	insert(key: string, value: any): void {
		this.insertCallsCount++;
		this.insertKey = key;
		this.insertValues = value;
	}

	simulateDeleteError(): void {
		jest.spyOn(CacheStoreSpy.prototype, "delete").mockImplementationOnce(() => {
			throw new Error("Delete failed");
		});
	}

	simulateInsertError(): void {
		jest.spyOn(CacheStoreSpy.prototype, "insert").mockImplementationOnce(() => {
			throw new Error("Delete failed");
		});
	}
}

const mockPurchases = (): Array<SavePurchases.Params> => [
	{
		id: "1",
		date: new Date(),
		value: 50,
	},
	{
		id: "2",
		date: new Date(),
		value: 70,
	},
];

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
		const purchases = mockPurchases();
		await sut.save(purchases);
		expect(cacheStore.deleteKey).toBe("purchases");
		expect(cacheStore.deleteCallsCount).toBe(1);
	});

	test("Should not insert new Cache if delete fails", async () => {
		const { cacheStore, sut } = makeSut();
		cacheStore.simulateDeleteError();
		// try {
		// 	await sut.save();
		// } catch (error) {
		// 	expect(error.message).toBe("Delete failed");
		// }
		const purchases = mockPurchases();
		await expect(sut.save(purchases)).rejects.toThrow();
		expect(cacheStore.insertCallsCount).toBe(0);
	});

	test("Should insert new Cache if delete succeeds", async () => {
		const { cacheStore, sut } = makeSut();
		const purchases = mockPurchases();
		await sut.save(purchases);
		expect(cacheStore.insertCallsCount).toBe(1);
		expect(cacheStore.deleteCallsCount).toBe(1);
		expect(cacheStore.insertKey).toBe("purchases");
		expect(cacheStore.insertValues).toEqual(purchases);
	});

	test("Should throw if insert throws", async () => {
		const { cacheStore, sut } = makeSut();
		cacheStore.simulateInsertError();
		await expect(sut.save(mockPurchases())).rejects.toThrow();
	});
});
