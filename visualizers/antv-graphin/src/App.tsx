import { GraphinTreeData } from '@antv/graphin';
import React, { useCallback, useState } from 'react';
import AntvGraphin from './AntvGraphin';
import { readFileAsString, transformDepGraphToGraphinTree } from './utils';

const errMsgStyle: React.CSSProperties = {
  color: 'red',
};

function App() {
  const [treeData, setTreeData] = useState<GraphinTreeData>();
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('handleFileChange', e, e.target.files);
    // check file
    const files = e.target.files;
    if (!files || files.length < 1) {
      return setErrMsg('No any file');
    }
    const file = files[0]; // read first file only
    if (file.type !== 'application/json') {
      return setErrMsg('Unsupported file');
    }
    const jsonStr = await readFileAsString(file);
    if (!jsonStr) {
      return setErrMsg('No content in the file');
    }

    let graphJson: any;
    try {
      graphJson = JSON.parse(jsonStr);
    } catch (error) {
      console.log(error);
      return setErrMsg('Invalid json content');
    }

    const treeData = transformDepGraphToGraphinTree(graphJson);
    setTreeData(treeData);
  }, []);

  return (
    <div className="App">
      <div>
        <input type="file" multiple={false} accept={'application/json'} placeholder="选择Graph JSON File"
          onChange={handleFileChange}
          />
        { errMsg && <span style={errMsgStyle}>{errMsg}</span> }
      </div>
      { !errMsg && treeData && <AntvGraphin data={treeData} /> }
    </div>
  );
}

export default App;
