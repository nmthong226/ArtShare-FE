import React, { useEffect, useState } from "react";
import { categoriesData } from "./mocks";
import {
  Button,
  Fade,
  Input,
  Paper,
  Popper,
  PopperPlacementType,
} from "@mui/material";

import "react-horizontal-scrolling-menu/dist/styles.css";
import "./Categories.css";
import { FiSearch } from "react-icons/fi";
import { TiDeleteOutline } from "react-icons/ti";
import { HorizontalSlider } from "../HorizontalSlider";

interface CategoriesProps {
  onSelectCategory: (categoryName: string) => void;
  selectedCategories: string[];
}

interface DataPopperProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onSave: (selectedData: string[]) => void;
  selectedData: string[];
  data: { name: string; thumbnail?: string }[];
  renderItem: string;
  placement?: PopperPlacementType;
}

export const Categories: React.FC<CategoriesProps> = ({
  onSelectCategory,
  selectedCategories,
}) => {
  const renderCategoryItem = (category: {
    name: string;
    thumbnail?: string;
  }) => {
    const isSelected = selectedCategories.includes(category.name);
    return (
      <div
        className={`category-item max-w-48 flex justify-center items-center ${
          isSelected
            ? "bg-mountain-200 dark:bg-mountain-800"
            : "hover:bg-mountain-100 dark:hover:bg-mountain-900"
        } cursor-pointer rounded-lg p-2 gap-2 border ${
          isSelected ? "border-primary-500" : "border-transparent"
        }`}
        onClick={() => onSelectCategory(category.name)}
        title={category.name}
      >
        {category.thumbnail && (
          <img
            src={category.thumbnail}
            alt={category.name}
            className="object-cover object-center w-10 h-10 aspect-[1/1] rounded-lg border dark:border-mountain-700"
            loading="lazy"
          />
        )}
        <span className="text-sm text-mountain-800 dark:text-mountain-200 line-clamp-2">
          {category.name}
        </span>
      </div>
    );
  };

  const getCategoryId = (category: { name: string; thumbnail?: string }) => {
    return category.name;
  };

  return (
    <HorizontalSlider
      data={categoriesData}
      renderItem={renderCategoryItem}
      getItemId={getCategoryId}
    />
  );
};

const renderCategoryItem = (
  item: { name: string; thumbnail?: string },
  isSelected: boolean,
  onClick: () => void,
) => (
  <div
    key={item.name}
    className={`flex items-center cursor-pointer ${
      isSelected ? "bg-mountain-200" : "hover:bg-mountain-100"
    } rounded-lg p-2 gap-1 my-2`}
    onClick={onClick}
  >
    {item.thumbnail && (
      <img
        src={item.thumbnail}
        alt={item.name}
        className="object-cover object-center w-12 aspect-[1/1] rounded-lg"
      />
    )}
    <span className="text-sm text-gray-800 text-wrap">{item.name}</span>
  </div>
);

const renderPropItem = (
  item: { name: string; thumbnail?: string },
  isSelected: boolean,
  onClick: () => void,
) => (
  <div
    key={item.name}
    className="flex items-center cursor-pointer hover:bg-mountain-100 rounded-lg p-2 gap-2"
    onClick={onClick}
  >
    <input
      type="checkbox"
      id={item.name}
      checked={isSelected}
      className="pointer-events-none"
      readOnly
    />
    <label
      htmlFor={item.name}
      className="text-sm text-gray-800 w-full pointer-events-none"
    >
      {item.name}
    </label>
  </div>
);

export const DataPopper: React.FC<DataPopperProps> = ({
  open,
  anchorEl,
  onClose,
  onSave,
  selectedData: selectedDataProp,
  data,
  renderItem,
  placement,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedData, setSelectedData] = useState<string[]>(selectedDataProp);

  useEffect(() => {
    setSelectedData(selectedDataProp);
  }, [selectedDataProp]);

  const handleDataClick = (name: string) => {
    setSelectedData((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name],
    );
  };

  return (
    <Popper
      sx={{ zIndex: 1200 }}
      open={open}
      anchorEl={anchorEl}
      placement={placement}
      transition
      className="mr-4 mt-4"
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={350}>
          <Paper className="max-h-[70vh] overflow-y-auto w-72 rounded-lg">
            <div className="sticky top-0 bg-white p-4 w-full border-b">
              <div className="relative flex items-center bg-mountain-50 dark:bg-mountain-1000 rounded-2xl h-10 text-mountain-500">
                <FiSearch className="left-2 absolute w-5 h-5" />
                <Input
                  className="shadow-inner pr-8 pl-8 border-1 border-mountain-500 rounded-2xl w-full h-full"
                  placeholder="Search"
                  disableUnderline
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <TiDeleteOutline
                  className="right-2 absolute w-5 h-5 cursor-pointer"
                  onClick={() => setSearchQuery("")}
                />
              </div>
            </div>

            <div className="px-4">
              {data
                .filter((item) =>
                  item.name.toLowerCase().includes(searchQuery.toLowerCase()),
                )
                .map((item) =>
                  (renderItem === "category"
                    ? renderCategoryItem
                    : renderPropItem)(
                    item,
                    selectedData.includes(item.name),
                    () => handleDataClick(item.name),
                  ),
                )}
            </div>

            <div className="sticky bottom-0 bg-white p-4 flex justify-end gap-2 border-t">
              <Button
                variant="outlined"
                onClick={() => {
                  onClose();
                  setSelectedData(selectedDataProp);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                disableElevation
                onClick={() => {
                  onSave(selectedData);
                  onClose();
                }}
              >
                Save
              </Button>
            </div>
          </Paper>
        </Fade>
      )}
    </Popper>
  );
};
