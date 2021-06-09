import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { CatalogItem } from "./CatalogItem";
import { ContextMenu } from "./ContextMenu";

interface Position {
  x: number;
  y: number;
}

export const TreeModal = () => {
  const [contextMenuPos, setContextMenuPos] = useState<Position>();
  const [activeItemId, setActiveItemId] = useState<string>("");
  const state = useSelector((state: RootState) => state.tree);

  const handleRightClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setContextMenuPos({
      //@ts-ignore
      x: e.nativeEvent.offsetX + e.target.offsetLeft + 15,
      //@ts-ignore
      y: e.nativeEvent.offsetY + e.target.offsetTop,
    });
    console.log(id);

    setActiveItemId(id);
  };

  return (
    <div className="relative flex flex-col items-center w-2/3 min-h-1/4 shadow-md rounded-2xl bg-gray-800 p-6 text-white">
      <h1 className="text-xl m-3 uppercase">tree</h1>
      {state.items.map((item, i) => (
        <CatalogItem
          index={i}
          handleRightClick={handleRightClick}
          treeItem={item}
          level={0}
          key={item.id}
        />
      ))}
      {contextMenuPos && (
        <ContextMenu
          x={contextMenuPos.x}
          y={contextMenuPos.y}
          activeItemId={activeItemId}
          onClose={() => setContextMenuPos(undefined)}
        />
      )}
    </div>
  );
};
