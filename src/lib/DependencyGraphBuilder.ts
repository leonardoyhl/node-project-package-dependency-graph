import { Dependencies } from './types/npm';
import { Graph, Package, Root } from './types/standard';
import { gainDependencyTree } from './utils';
import { transformMapToJson } from './utils/common';

export const ROOT_KEY = '__ROOT__';

export class DependencyGraphBuilder {
  /**
   * key - fullname
   */
  private packageMap = new Map<string, Package>();

  private relations = new Map<string, Set<string>>();

  /**
   * @internal
   */
  private analyzedPackages = new Set<string>();

  /**
   * cache packages to analyze for next loop
   * @internal
   */
  private toAnalyzePackages = new Set<string>();

  constructor(
    private entries: string[],
  ) {}

  async build(): Promise<Graph> {
    const givenPackages = this.entries;
    // const firstTree = await gainDependencyTree(givenPackages);
    const firstTree = await this.loop(givenPackages);
    const root: Root = {
      fullname: `${firstTree.name}@${firstTree.version}`,
      name: firstTree.name,
      version: firstTree.version,
    };

    const packages = transformMapToJson(this.packageMap);
    const relations = transformMapToJson(this.relations);
    return {
      root,
      rootKey: ROOT_KEY,
      packages,
      relations,
    };
  }

  /**
   * @param packages packages to analyze
   * @internal
   */
  private async loop(packages: string[]) {
    console.log('loop begin', packages);
    const tree = await gainDependencyTree(packages);
    this.recurse(ROOT_KEY, tree.dependencies);
    // packages to analyze for next loop
    const toAnalyzePackages = Array.from(this.toAnalyzePackages);
    // clear cache
    this.toAnalyzePackages.clear();
    // if (noLoop) {
    //   return tree;
    // }
    console.log('loop end');
    if (toAnalyzePackages.length > 0) {
      await this.loop(toAnalyzePackages);
    }
    return tree;
  }

  // packageMap: Map<string, Package>,
  /**
   * analyze dependencies recursively, build relations, and mark those packages that has been analyzed
   * @param curPkgId id of current package of analyzing dependencies, for building relations
   * @param dependencies dependencies to analyze
   * @internal
   */
  private recurse(curPkgId: string, dependencies: Dependencies) {
    console.log('recurse curPkgId', curPkgId);
    const { packageMap, analyzedPackages, toAnalyzePackages } = this;
    Object.keys(dependencies).forEach(pkgName => {
      const childNode = dependencies[pkgName];
      const { version, from, resolved } = childNode;
      const fullname = `${pkgName}@${version}`;

      if (packageMap.has(fullname)) return;
      packageMap.set(fullname, {
        // id: fullname,
        fullname,
        name: pkgName,
        version,
        from,
        resolved,
      });

      // relate dependency to current package
      if (!this.relations.has(curPkgId)) {
        this.relations.set(curPkgId, new Set<string>());
      }
      const dependenciesOfCurPkg = this.relations.get(curPkgId)!;
      dependenciesOfCurPkg.add(fullname);

      if (childNode.dependencies) {
        toAnalyzePackages.add(fullname);
        this.recurse(fullname, childNode.dependencies);
      } else {
        // if a dependency is a leaf node, no need to analyze
        analyzedPackages.add(fullname);
      }
    });
  }
}
