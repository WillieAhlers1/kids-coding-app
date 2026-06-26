import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";

const resolveDefaultDataDir = (): string => {
  const override = process.env.API_DATA_DIR;
  if (override) {
    return resolve(override);
  }

  const workspaceDataDir = resolve(process.cwd(), "services/platform-api/.data");
  if (existsSync(resolve(process.cwd(), "services/platform-api"))) {
    return workspaceDataDir;
  }

  return resolve(process.cwd(), ".data");
};

const asJson = <T>(value: T): string => JSON.stringify(value, null, 2);

const readJson = async <T>(filePath: string, fallback: T): Promise<T> => {
  try {
    const raw = await readFile(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    await mkdir(dirname(filePath), { recursive: true });
    await writeFile(filePath, asJson(fallback), "utf-8");
    return fallback;
  }
};

export class JsonFileStore<T> {
  private static queues = new Map<string, Promise<void>>();
  private readonly filePath: string;

  constructor(fileName: string) {
    this.filePath = resolve(resolveDefaultDataDir(), fileName);
  }

  async readAll(): Promise<T[]> {
    return readJson<T[]>(this.filePath, []);
  }

  async writeAll(items: T[]): Promise<void> {
    await this.enqueueWrite(async () => {
      await this.atomicWrite(items);
    });
  }

  async updateAll(updater: (items: T[]) => T[]): Promise<T[]> {
    let updatedItems: T[] = [];
    await this.enqueueWrite(async () => {
      const current = await readJson<T[]>(this.filePath, []);
      updatedItems = updater(current);
      await this.atomicWrite(updatedItems);
    });

    return updatedItems;
  }

  private async atomicWrite(items: T[]): Promise<void> {
    await mkdir(dirname(this.filePath), { recursive: true });
    const tempPath = `${this.filePath}.tmp-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    await writeFile(tempPath, asJson(items), "utf-8");
    await rename(tempPath, this.filePath);
  }

  private async enqueueWrite(task: () => Promise<void>): Promise<void> {
    const previous = JsonFileStore.queues.get(this.filePath) ?? Promise.resolve();
    const run = previous.then(task);
    JsonFileStore.queues.set(this.filePath, run.catch(() => undefined));
    await run;
  }
}
