import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuid } from "uuid";

interface TreeState {
  items: TreeItem[];
  editingItemId: string | undefined;
}

export interface TreeItem {
  id: string;
  parentId?: string;
  type: TreeItemType;
  name: string;
}

export interface Folder extends TreeItem {
  children: TreeItem[];
}

export enum TreeItemType {
  FILE,
  FOLDER,
}

export interface CreateItemPayload {
  parentId?: string;
  type: TreeItemType;
}

export interface RenamePayload {
  id: string;
  newName: string;
}

export interface MovePayload {
  id: string;
  newParentId: string;
}

const initialTreeState: TreeState = {
  items: [],
  editingItemId: undefined,
};

const deleteTreeItem = (items: TreeItem[], id: string): TreeItem[] => {
  const filteredItems = items
    .filter((item) => item.id !== id)
    .map((item) => {
      if (item.type === TreeItemType.FOLDER) {
        const filteredChildren = deleteTreeItem((item as Folder).children, id);
        (item as Folder).children = [...filteredChildren];
      }
      return item;
    });

  return filteredItems;
};

const renameTreeItem = (
  items: TreeItem[],
  id: string,
  newName: string
): TreeItem[] => {
  let isRenamed = false;

  const newItems = items.map((item) => {
    if (item.id === id) {
      item.name = newName;
      isRenamed = true;
    }
    return item;
  });

  if (isRenamed) {
    return newItems;
  }

  newItems.map((item) => {
    if (item.type === TreeItemType.FOLDER) {
      const newChildren: TreeItem[] = renameTreeItem(
        (item as Folder).children,
        id,
        newName
      );
      (item as Folder).children = [...newChildren];
    }
    return item;
  });

  return newItems;
};

const moveTreeItem = (
  items: TreeItem[],
  id: string,
  newParentId: string
): TreeItem[] => {
  const treeItem = findItemById(items, id);
  const parent = findItemById(items, newParentId);
  const newState = deleteTreeItem(items, id);

  if (!parent || !treeItem) {
    return items;
  }

  (parent as Folder).children = [...(parent as Folder).children, treeItem];

  return newState;
};

const findItemById = (items: TreeItem[], id: string) => {
  let foundItem = items.find((item) => item.id === id);

  if (!!foundItem) {
    return foundItem;
  }

  items.forEach((item) => {
    if (item.type === TreeItemType.FOLDER) {
      foundItem = findItemById((item as Folder).children, id);
      if (!!foundItem) {
        return;
      }
    }
  });

  if (!!foundItem) {
    return foundItem;
  }

  return undefined;
};

export const treeSlice = createSlice({
  name: "tree",
  initialState: initialTreeState,
  reducers: {
    addItem: (state: TreeState, action: PayloadAction<CreateItemPayload>) => {
      let newItem;

      if (action.payload.type === TreeItemType.FOLDER) {
        newItem = {
          id: uuid(),
          parentId: action.payload.parentId,
          type: action.payload.type,
          name: "New Tree Item",
          children: [],
        };
      } else {
        newItem = {
          id: uuid(),
          parentId: action.payload.parentId,
          type: action.payload.type,
          name: "New Tree Item",
        };
      }

      if (action.payload.parentId == undefined) {
        state.items = [...state.items, newItem];
      }

      const parent = findItemById(
        state.items,
        action.payload.parentId
      ) as Folder;

      if (!parent) {
        return;
      }

      parent.children = [...(parent as Folder).children, newItem];
      state.items = [...state.items];
    },
    renameItem: (state: TreeState, action: PayloadAction<RenamePayload>) => {
      const newItems = renameTreeItem(
        state.items,
        action.payload.id,
        action.payload.newName
      );
      state.items = [...newItems];
    },
    deleteItem: (state: TreeState, action: PayloadAction<string>) => {
      const newState = deleteTreeItem(state.items, action.payload);
      state.items = [...newState];
    },
    moveItem: (state: TreeState, action: PayloadAction<MovePayload>) => {
      const newState = moveTreeItem(
        state.items,
        action.payload.id,
        action.payload.newParentId
      );
      state.items = [...newState];
    },
    setEditingItemId: (
      state: TreeState,
      action: PayloadAction<string | undefined>
    ) => {
      state.editingItemId = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { addItem, renameItem, deleteItem, moveItem, setEditingItemId } =
  treeSlice.actions;

export default treeSlice.reducer;
