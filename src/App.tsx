import React from "react";
import { useDispatch } from "react-redux";
import { TreeModal } from "./components/TreeModal";
import { addItem, TreeItemType } from "./store/slices/treeSlice";

function App() {
  const dispatch = useDispatch();

  return (
    <div className="flex flex-col items-center p-5">
      <div className="m-8">
        <button
          className="uppercase m-2 py-2 px-6 bg-green-500 text-white hover:bg-green-600 rounded focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50"
          onClick={() => dispatch(addItem({ type: TreeItemType.FILE }))}
        >
          add file
        </button>
        <button
          className="uppercase m-2 py-2 px-6 bg-purple-500 text-white hover:bg-purple-600 rounded focus:outline-none focus:ring-2 focus:ring-green-purple focus:ring-opacity-50"
          onClick={() => dispatch(addItem({ type: TreeItemType.FOLDER }))}
        >
          add folder
        </button>
      </div>
      <TreeModal></TreeModal>
    </div>
  );
}

export default App;
