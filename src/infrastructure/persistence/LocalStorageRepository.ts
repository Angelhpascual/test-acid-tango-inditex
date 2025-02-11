export class LocalStorageRepository<T> {
  constructor(private readonly key: string) {
    if (!key) {
      throw new Error("Storage key is required");
    }
  }

  async save(data: T[]): Promise<void> {
    if (!data) {
      throw new Error("Data to save is required");
    }
    localStorage.setItem(this.key, JSON.stringify(data));
  }

  async load(): Promise<T[]> {
    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(data) : [];
  }

  async clear(): Promise<void> {
    localStorage.removeItem(this.key);
  }
}
