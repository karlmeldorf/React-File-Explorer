import React from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { FiTrash } from "react-icons/fi";
import { BsPencil } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { useClickAwayListener } from "../hooks/useClickAwayListener";
import {
  addItem,
  deleteItem,
  setEditingItemId,
  TreeItemType,
} from "../store/slices/treeSlice";

interface ContextMenuProps {
  x: number;
  y: number;
  activeItemId: string;
  onClose: any;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  onClose,
  activeItemId,
}) => {
  const dispatch = useDispatch();
  const { ref } = useClickAwayListener(onClose);

  const handleRename = () => {
    dispatch(setEditingItemId(activeItemId));
    onClose();
  };

  const handleDelete = () => {
    dispatch(deleteItem(activeItemId));
    onClose();
  };

  const handleAdd = (type: TreeItemType) => {
    dispatch(addItem({ parentId: activeItemId, type }));
    onClose();
  };

  return (
    <div
      ref={ref}
      style={{ top: y, left: x }}
      className="flex flex-col items-start bg-gray-800 rounded shadow absolute"
    >
      <button
        onClick={() => handleAdd(TreeItemType.FILE)}
        className="flex items-center px-2 pr-3 py-1 w-full hover:bg-gray-900 cursor-pointer"
      >
        <AiOutlinePlus className="mr-2" />
        Add file
      </button>
      <button
        onClick={() => handleAdd(TreeItemType.FOLDER)}
        className="flex items-center px-2 pr-3 py-1 w-full hover:bg-gray-900 cursor-pointer"
      >
        <AiOutlinePlus className="mr-2" />
        Add folder
      </button>
      <button
        onClick={handleRename}
        className="flex items-center px-2 pr-3 py-1 w-full hover:bg-gray-900 cursor-pointer"
      >
        <BsPencil className="mr-2" />
        Rename
      </button>
      <button
        onClick={handleDelete}
        className="flex items-center px-2 pr-3 py-1 w-full hover:bg-gray-900 cursor-pointer"
      >
        <FiTrash className="mr-2" />
        Delete
      </button>
    </div>
  );
};
