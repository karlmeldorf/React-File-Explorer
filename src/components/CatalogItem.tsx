import React, { useState } from "react";
import {
  Folder,
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
  treeItem: TreeItem;
  level: number;
  handleRightClick: (e: React.MouseEvent, id: string) => void;
}

export const CatalogItem: React.FC<TreeFileProps> = ({
  treeItem,
  level,
  handleRightClick,
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

  return (
    <>
      <div
        onContextMenu={(e: React.MouseEvent) =>
          handleRightClick(e, treeItem.id)
        }
        className="flex items-center bg-gray-900 w-full m-1 px-4 py-2 rounded shadow opacity-90"
        style={{
          marginLeft: `${3 * level}rem`,
          width: `calc(100% - ${3 * level}rem)`,
        }}
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
      {isExpanded &&
        treeItem.type === TreeItemType.FOLDER &&
        (treeItem as Folder).children.map((child) => {
          return (
            <CatalogItem
              treeItem={child}
              level={level + 1}
              handleRightClick={handleRightClick}
              key={child.id}
            />
          );
        })}
    </>
  );
};
