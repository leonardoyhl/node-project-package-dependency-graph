// import React from 'react';
import Graphin, { Behaviors, GraphinTreeData, Layout, Utils } from '@antv/graphin';

const { TreeCollapse } = Behaviors;

const data: GraphinTreeData = Utils.mock(20)
.tree()
.graphinTree();

const layout: Layout = {
  type: 'mindmap', // dendrogram mindmap compactBox indented
  options: {
    direction: 'LR',  // H / V / LR / RL / TB / BT
    // dropCap: false,
    // indent: 200,
    // getHeight: () => {
    //   return 30;
    // },
  }
};

const walk = (node: GraphinTreeData, callback: (node: GraphinTreeData) => void) => {
  callback(node);
  if (node.children && node.children.length > 0) {
    node.children.forEach(child => {
      walk(child, callback);
    });
  }
};

walk(data, node => {
  node.style = {
    label: {
      value: node.id,
    },
  };
});

export interface AntvGraphinProps {
  data: GraphinTreeData;
}

export default function AntvGraphin(props: AntvGraphinProps) {
  const { data } = props;
  console.log('AntvGraphin data', data);
  return (
    <Graphin data={data} layout={layout} fitView>
      <TreeCollapse />
    </Graphin>
  );
}
