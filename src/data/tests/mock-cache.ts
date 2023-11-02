import { SavePurchases, LoadPurchases } from '@/domain/usecases';
import { CacheStore } from '@/data/contracts/cache';

export class CacheStoreSpy implements CacheStore {
	actions: Array<CacheStoreSpy.Action> = [];
	deleteKey: string;
	insertKey: string;
	fetchKey: string;
	insertValues: Array<SavePurchases.Params> = [];
	fectchResult: any;

	fetch(key: string): any {
		this.actions.push(CacheStoreSpy.Action.fetch);
		this.fetchKey = key;
		return this.fectchResult;
	}

	delete(key: string): void {
		this.actions.push(CacheStoreSpy.Action.delete);
		this.deleteKey = key;
	}

	insert(key: string, value: any): void {
		this.actions.push(CacheStoreSpy.Action.insert);
		this.insertKey = key;
		this.insertValues = value;
	}

	replace(key: string, value: any): void {
		this.delete(key);
		this.insert(key, value);
	}

	simulateDeleteError(): void {
		jest.spyOn(CacheStoreSpy.prototype, 'delete').mockImplementationOnce(() => {
			this.actions.push(CacheStoreSpy.Action.delete);
			throw new Error('Delete failed');
		});
	}

	simulateInsertError(): void {
		jest.spyOn(CacheStoreSpy.prototype, 'insert').mockImplementationOnce(() => {
			this.actions.push(CacheStoreSpy.Action.insert);
			throw new Error('Insert failed');
		});
	}

	simulateFetchError(): void {
		jest.spyOn(CacheStoreSpy.prototype, 'fetch').mockImplementationOnce(() => {
			this.actions.push(CacheStoreSpy.Action.fetch);
			throw new Error('Fetch failed');
		});
	}
}

export namespace CacheStoreSpy {
	export enum Action {
		delete,
		insert,
		fetch,
	}
}
