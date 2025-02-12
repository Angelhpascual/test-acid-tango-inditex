export abstract class LocalStorageRepository<T> {
  constructor(private readonly key: string) {
    if (!key) {
      throw new Error("Storage key is required");
    }
  }

  protected async load(): Promise<T[]> {
    const data = localStorage.getItem(this.key);
    console.log(`Loading data for key ${this.key}:`, data);
    if (!data) return [];
    try {
      const parsed = JSON.parse(data);
      console.log("Parsed data:", parsed);
      return parsed;
    } catch (error) {
      console.error("Error parsing data:", error);
      return [];
    }
  }

  protected async saveItems(items: T[]): Promise<void> {
    if (!items) {
      throw new Error("Data to save is required");
    }
    console.log(`Saving data for key ${this.key}:`, items);
    const data = JSON.stringify(items);
    localStorage.setItem(this.key, data);
  }

  protected async clear(): Promise<void> {
    localStorage.removeItem(this.key);
  }
}
