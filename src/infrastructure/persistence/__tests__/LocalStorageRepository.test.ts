import { describe, it, expect, beforeEach } from "vitest";
import { LocalStorageRepository } from "../LocalStorageRepository";

// Clase concreta para testing
class TestRepository extends LocalStorageRepository<{
  id: string;
  value: string;
}> {
  constructor() {
    super("test-key");
  }

  async getAll() {
    return this.load();
  }

  async saveAll(items: { id: string; value: string }[]) {
    await this.saveItems(items);
  }

  async clearAll() {
    await this.clear();
  }
}

describe("LocalStorageRepository", () => {
  let repository: TestRepository;

  beforeEach(() => {
    localStorage.clear();
    repository = new TestRepository();
  });

  it("should save and load items", async () => {
    const items = [
      { id: "1", value: "test" },
      { id: "2", value: "test2" },
    ];

    await repository.saveAll(items);
    const loaded = await repository.getAll();
    expect(loaded).toEqual(items);
  });

  it("should return empty array when no data exists", async () => {
    const items = await repository.getAll();
    expect(items).toEqual([]);
  });

  it("should clear data", async () => {
    const items = [{ id: "1", value: "test" }];
    await repository.saveAll(items);
    await repository.clearAll();
    const loaded = await repository.getAll();
    expect(loaded).toEqual([]);
  });
});
