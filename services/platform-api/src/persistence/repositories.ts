import type {
  AdultAccount,
  ChildProfile,
  FamilyCircle,
  ProjectDocument,
  WorldProgress
} from "@kids-coding-app/shared-domain";
import { JsonFileStore } from "./json-file-store.js";

export interface OnboardingRepository {
  getChild(childId: string): Promise<ChildProfile | null>;
  saveChild(profile: ChildProfile): Promise<void>;
  getAdult(adultId: string): Promise<AdultAccount | null>;
  saveAdult(account: AdultAccount): Promise<void>;
}

export interface ProgressRepository {
  getProgress(childId: string, worldId: string): Promise<WorldProgress | null>;
  saveProgress(progress: WorldProgress): Promise<void>;
}

export interface ProjectRepository {
  getProject(projectId: string): Promise<ProjectDocument | null>;
  createProject(project: ProjectDocument): Promise<void>;
  saveProject(project: ProjectDocument): Promise<void>;
}

export interface FamilyCircleRepository {
  getCircle(circleId: string): Promise<FamilyCircle | null>;
  createCircle(circle: FamilyCircle): Promise<void>;
  saveCircle(circle: FamilyCircle): Promise<void>;
}

export interface PlatformRepositories {
  onboarding: OnboardingRepository;
  progress: ProgressRepository;
  projects: ProjectRepository;
  familyCircles: FamilyCircleRepository;
}

const upsertBy = <T>(items: T[], predicate: (item: T) => boolean, candidate: T): T[] => {
  const index = items.findIndex(predicate);
  if (index === -1) {
    return [...items, candidate];
  }

  const next = [...items];
  next[index] = candidate;
  return next;
};

class JsonOnboardingRepository implements OnboardingRepository {
  private readonly childStore = new JsonFileStore<ChildProfile>("children.json");
  private readonly adultStore = new JsonFileStore<AdultAccount>("adults.json");

  async getChild(childId: string): Promise<ChildProfile | null> {
    const children = await this.childStore.readAll();
    return children.find((item) => item.childId === childId) ?? null;
  }

  async saveChild(profile: ChildProfile): Promise<void> {
    await this.childStore.updateAll((children) =>
      upsertBy(children, (item) => item.childId === profile.childId, profile)
    );
  }

  async getAdult(adultId: string): Promise<AdultAccount | null> {
    const accounts = await this.adultStore.readAll();
    return accounts.find((item) => item.adultId === adultId) ?? null;
  }

  async saveAdult(account: AdultAccount): Promise<void> {
    await this.adultStore.updateAll((accounts) =>
      upsertBy(accounts, (item) => item.adultId === account.adultId, account)
    );
  }
}

class JsonProgressRepository implements ProgressRepository {
  private readonly progressStore = new JsonFileStore<WorldProgress>("progress.json");

  async getProgress(childId: string, worldId: string): Promise<WorldProgress | null> {
    const records = await this.progressStore.readAll();
    return records.find((item) => item.childId === childId && item.worldId === worldId) ?? null;
  }

  async saveProgress(progress: WorldProgress): Promise<void> {
    await this.progressStore.updateAll((records) =>
      upsertBy(
        records,
        (item) => item.childId === progress.childId && item.worldId === progress.worldId,
        progress
      )
    );
  }
}

class JsonProjectRepository implements ProjectRepository {
  private readonly projectStore = new JsonFileStore<ProjectDocument>("projects.json");

  async getProject(projectId: string): Promise<ProjectDocument | null> {
    const records = await this.projectStore.readAll();
    return records.find((item) => item.projectId === projectId) ?? null;
  }

  async createProject(project: ProjectDocument): Promise<void> {
    await this.projectStore.updateAll((records) => [...records, project]);
  }

  async saveProject(project: ProjectDocument): Promise<void> {
    await this.projectStore.updateAll((records) =>
      upsertBy(records, (item) => item.projectId === project.projectId, project)
    );
  }
}

class JsonFamilyCircleRepository implements FamilyCircleRepository {
  private readonly circleStore = new JsonFileStore<FamilyCircle>("family-circles.json");

  async getCircle(circleId: string): Promise<FamilyCircle | null> {
    const circles = await this.circleStore.readAll();
    return circles.find((item) => item.circleId === circleId) ?? null;
  }

  async createCircle(circle: FamilyCircle): Promise<void> {
    await this.circleStore.updateAll((circles) => [...circles, circle]);
  }

  async saveCircle(circle: FamilyCircle): Promise<void> {
    await this.circleStore.updateAll((circles) =>
      upsertBy(circles, (item) => item.circleId === circle.circleId, circle)
    );
  }
}

export const createDefaultRepositories = (): PlatformRepositories => ({
  onboarding: new JsonOnboardingRepository(),
  progress: new JsonProgressRepository(),
  projects: new JsonProjectRepository(),
  familyCircles: new JsonFamilyCircleRepository()
});