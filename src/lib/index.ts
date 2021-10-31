import { DependencyGraphBuilder } from './DependencyGraphBuilder';
import { Root } from './types/standard';
import { collectPackages, gainDependencyTree } from './utils';
import * as fs from 'fs';

async function test() {
  // const pkgNames = ['lodash'];
  const pkgNames = ['color-name', 'uuid'];
  // const tree = await getDependencyTree(pkgNames);
  const tree = await gainDependencyTree(pkgNames);
  // console.log('tree', tree);
  const root: Root = {
    name: tree.name,
    version: tree.version,
    fullname: `${tree.name}@${tree.version}`,
  };
  const packageMap = collectPackages(tree);
  const packagesInTree = Array.from(packageMap.keys());

  const analyzedPackages: string[] = [];
  const toAnalyzePackages: string[] = [];
  packagesInTree.forEach(pkgFullname => {
    for (let i = 0; i < pkgNames.length; i++) {
      const pkgName = pkgNames[i];
      if (
        pkgName === pkgFullname
        // example: `uuid@1.0.0` matches `uuid` or `uuid@1*`
        // example: `@angular/core@2.0.0` matches `@angular/core` or `@angular/core@2*`
        || pkgName.indexOf('@') <= 0 && pkgFullname.startsWith(pkgName + '@')
        || pkgName.indexOf('@') > 0 && pkgFullname.startsWith(pkgName)
      ) {
        analyzedPackages.push(pkgFullname);
        break;
      }
      // not matched packages, require to analyze again
      toAnalyzePackages.push(pkgFullname);
    }
  });

  // const tree2 = await gainDependencyTree(toAnalyzePackages);

  const graph = await new DependencyGraphBuilder(pkgNames).build();
  fs.writeFile('./lib/test.graph.json', JSON.stringify(graph, null, 2), (err) => {
    console.log(err);
  });
}

test();
