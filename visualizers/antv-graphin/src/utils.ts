import { GraphinTreeData } from '@antv/graphin';
import { Graph, Package } from '../../../src/lib/types/standard';

export function transformDepGraphToGraphinTree(graph: Graph) {
  const treeData: GraphinTreeData = {
    id: graph.root.fullname,
    style: {
      label: {
        // value: graph.root.name,
        value: 'Project',
      },
    },
    children: [],
  };
  recurseBuildTreeData(graph, graph.rootKey, treeData);
  return treeData;
}

function recurseBuildTreeData(graph: Graph, curPkgId: string, treeNode: GraphinTreeData) {
  const { packages, relations } = graph;
  const depPkgIds = relations[curPkgId] || [];

  const children = treeNode.children || [];
  depPkgIds.forEach(depPkgId => {
    const pkg = packages[depPkgId];
    if (!pkg) return;
    const node = transformPackageToTreeNode(pkg);
    children.push(node);
    const childRelations = relations[depPkgId];
    if (childRelations && childRelations.length > 0) {
      recurseBuildTreeData(graph, depPkgId, node);
    }
  });
}

function transformPackageToTreeNode(pkg: Package) {
  return {
    id: pkg.fullname,
    style: {
      label: {
        value: pkg.name,
      },
    },
    children: [],
  };
}

export function readFileAsString(file: File) {
  // file.stream().getReader().read().then(result => {
  //   console.log(result);
  // });
  return new Promise<string | null>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      resolve(reader.result as string | null);
    };
  });
}
