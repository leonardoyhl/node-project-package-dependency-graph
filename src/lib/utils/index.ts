import { exec } from 'child_process';
import chlak from 'chalk';
import { Dependencies, DependencyTree } from '../types/npm';
import { Package } from '../types/standard';

/**
 * Gain dependency tree via command `npm ls`
 * @param packages packages to search
 * @returns 
 */
export function gainDependencyTree(packages: string[]) {
  const baseCmd = 'npm ls --json';
  const cmd = `${baseCmd} ${packages.join(' ')}`;
  return new Promise<DependencyTree>((resolve, reject) => {
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        // console.error(chlak.red(err.stack));
        console.error(chlak.red(err.message));
        // console.log('stderr', stderr);
        // throw new Error(err.message);
        reject(err.message);
      }
      console.log(stdout);
      const jsonTree = JSON.parse(stdout) as DependencyTree;
      resolve(jsonTree);
    });
  });
}

function recurse(packageMap: Map<string, Package>, dependencies: Dependencies) {
  Object.keys(dependencies).forEach(pkgName => {
    const childNode = dependencies![pkgName];
    const { version, from, resolved } = childNode;
    const fullname = `${pkgName}@${version}`;
    if (packageMap.get(fullname)) return;
    packageMap.set(fullname, {
      // id: fullname,
      fullname,
      name: pkgName,
      version,
      from,
      resolved,
    });
    if (childNode.dependencies) {
      recurse(packageMap, childNode.dependencies);
    }
  });
}

export function collectPackages(tree: DependencyTree) {
  /**
   * key - fullname
   */
  const packageMap = new Map<string, Package>();
  if (tree.dependencies) {
    recurse(packageMap, tree.dependencies);
  }
  return packageMap;
}

export function transformTreeToGraph(tree: DependencyTree) {
  // do
}
