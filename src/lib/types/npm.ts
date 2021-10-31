export interface DependencyTree {
  name: string;
  version: string;
  dependencies: Dependencies;
}

export interface DependencyNode {
  version: string;
  from: string;
  resolved: string;
  dependencies?: Dependencies;
}

export type Dependencies = Record<string, DependencyNode>;
