import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useClickAwayListener } from "../hooks/useClickAwayListener";
import { RootState } from "../store/store";

interface EditableTextProps {
  isEditing: boolean;
  onSubmit: (value: string) => void;
  text: string;
}

export const EditableText: React.FC<EditableTextProps> = ({
  isEditing,
  onSubmit,
  text,
}) => {
  const [value, setValue] = useState<string>(text);
  const state = useSelector((state: RootState) => state.tree);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValue(text);
  }, [text]);

  useEffect(() => {
    if (!isEditing) {
      onSubmit(value);
    } else {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSubmit(value);
    }
  };

  return (
    <div>
      {isEditing ? (
        <input
          className="bg-transparent px-2"
          id={`input-${state.editingItemId}`}
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyPress={handleKeyPress}
          onBlur={() => onSubmit(value)}
        ></input>
      ) : (
        value
      )}
    </div>
  );
};
