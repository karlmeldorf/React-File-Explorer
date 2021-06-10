import React, { useEffect, useState } from "react";
import {
  Folder,
  moveItem,
  renameItem,
  setEditingItemId,
  TreeItem,
  TreeItemType,
} from "../store/slices/treeSlice";
import { AiOutlineFile, AiOutlineFolder, AiFillFolder } from "react-icons/ai";
import { EditableText } from "./EditableText";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";

export interface TreeFileProps {
  index: number;
  treeItem: TreeItem;
  level: number;
  isShown?: boolean;
  handleRightClick: (e: React.MouseEvent, id: string) => void;
}

export const CatalogItem: React.FC<TreeFileProps> = ({
  index,
  treeItem,
  level,
  handleRightClick,
  isShown = true,
}) => {
  const state = useSelector((state: RootState) => state.tree);
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const handleRename = (value: string) => {
    if (!!state.editingItemId) {
      dispatch(
        renameItem({
          id: state.editingItemId,
          newName: value,
        })
      );
      dispatch(setEditingItemId(undefined));
    }
  };

  const handleClick = () => {
    if (treeItem.type === TreeItemType.FOLDER) {
      setIsExpanded(!isExpanded);
    }
  };

  const handleDragStart = (e: any) => {
    e.dataTransfer.setData("text/plain", treeItem.id);
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleOnDrop = (e: any) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    const id = e.dataTransfer.getData("text/plain");
    dispatch(moveItem({ id, newParentId: treeItem.id }));
    console.log("drop", id);
  };

  return (
    <div
      className="transition-all duration-500 ease-in-out"
      style={
        isShown || level === 0
          ? {
              marginLeft: level === 0 ? "" : `${2 + level}rem`,
              width: level === 0 ? "100%" : `calc(100% - ${2 + level}rem)`,
              transform: `unset`,
              opacity: "100",
            }
          : {
              marginLeft: `${2 + level}rem`,
              width: `calc(100% - ${2 + level}rem)`,
              transform: `translateY(calc(${index + 1} * 42px * -1))`,
              opacity: "0",
            }
      }
      id={`${treeItem.id}-treeItem`}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleOnDrop}
      draggable
    >
      {isShown && (
        <div
          onContextMenu={(e: React.MouseEvent) =>
            handleRightClick(e, treeItem.id)
          }
          className="transition-all flex items-center bg-gray-900 w-full m-1 px-4 py-2 rounded shadow opacity-90"
          onClick={handleClick}
        >
          {treeItem.type === TreeItemType.FILE ? (
            <AiOutlineFile className="text-2xl mr-4" />
          ) : (
            <>
              {(treeItem as Folder).children.length > 0 ? (
                <>
                  {isExpanded ? (
                    <AiOutlineFolder className="text-2xl mr-4 cursor-pointer" />
                  ) : (
                    <AiFillFolder className="text-2xl mr-4 cursor-pointer" />
                  )}
                </>
              ) : (
                <AiOutlineFolder className="text-2xl mr-4 text-gray-700 cursor-pointer" />
              )}
            </>
          )}
          <EditableText
            text={treeItem.name}
            isEditing={state.editingItemId === treeItem.id}
            onSubmit={handleRename}
          />
        </div>
      )}
      {treeItem.type === TreeItemType.FOLDER &&
        (treeItem as Folder).children.map((child, i) => {
          return (
            <CatalogItem
              index={i}
              treeItem={child}
              level={level + 1}
              isShown={isExpanded && isShown}
              handleRightClick={handleRightClick}
              key={child.id}
            />
          );
        })}
    </div>
  );
};
