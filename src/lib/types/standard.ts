
export interface Root {
  /**
   * name with version, combined with `@`
   * @example
   * 'uuid@1.0.0'
   */
  fullname: string;
  name: string;
  version: string;
}

export interface Package extends Root {
  // id: string;
  from: string;
  resolved: string;
}

export interface Graph {
  root: Root;
  rootKey: string;
  packages: Record<string, Package>;
  /**
   * like `{ package: dependencies[] }` or `{ sourceId: targetIds[] }`
   */
  relations: Record<string, string[]>;
}
