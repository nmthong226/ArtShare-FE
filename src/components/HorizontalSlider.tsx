import React, { useContext } from "react";
import { FiChevronRight as RightArrowIcon, FiChevronLeft as LeftArrowIcon} from "react-icons/fi";
import {
  ScrollMenu,
  VisibilityContext,
  type publicApiType,
} from "react-horizontal-scrolling-menu";
import { Button } from "@mui/material";

import "react-horizontal-scrolling-menu/dist/styles.css";

const DefaultLeftArrow: React.FC = () => {
  const visibility = useContext<publicApiType>(VisibilityContext);
  const isFirstItemVisible = visibility.useIsVisible("first", true);

  return (
    <div className="react-horizontal-scrolling-menu--arrow-left flex items-center justify-center mr-2">
      <Button
        variant="contained"
        color="primary"
        disableElevation
        disabled={isFirstItemVisible}
        aria-label="Scroll Left"
        className="min-w-auto aspect-[1/1] p-1 rounded-full shadow-md"
        onClick={() => visibility.scrollPrev()}
        size="small"
      >
        <LeftArrowIcon fontSize={20} />
      </Button>
    </div>
  );
};

const DefaultRightArrow: React.FC = () => {
  const visibility = useContext<publicApiType>(VisibilityContext);
  const isLastItemVisible = visibility.useIsVisible("last", false);

  return (
    <div className="react-horizontal-scrolling-menu--arrow-right flex items-center justify-center ml-2">
      <Button
        variant="contained"
        color="primary"
        disableElevation
        disabled={isLastItemVisible}
        aria-label="Scroll Right"
        className="min-w-auto aspect-[1/1] p-1 rounded-full shadow-md"
        onClick={() => visibility.scrollNext()}
        size="small"
      >
        <RightArrowIcon fontSize={20} />
      </Button>
    </div>
  );
};

interface HorizontalSliderProps<T> {
  /** Array of data items to render in the slider. */
  data: T[];
  /** Function to render a single item. Receives the item and its index. */
  renderItem: (item: T, index: number) => React.ReactNode;
  /** Function to get a unique key/ID for each item. Crucial for the library. */
  getItemId: (item: T) => string | number;
  /** Optional CSS class name to apply to each item's wrapper div. Useful for spacing/layout. */
  itemClassName?: string;
  /** Optional custom component to use for the left arrow. */
  LeftArrowComponent?: React.FC;
  /** Optional custom component to use for the right arrow. */
  RightArrowComponent?: React.FC;
  /** Optional: Styling applied to the main ScrollMenu wrapper */
  wrapperClassName?: string;
}

export const HorizontalSlider = <T extends object>({
  data,
  renderItem,
  getItemId,
  itemClassName = "flex-shrink-0 flex items-center mx-1",
  LeftArrowComponent = DefaultLeftArrow,
  RightArrowComponent = DefaultRightArrow,
  wrapperClassName = "",
}: HorizontalSliderProps<T>) => {
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className={`horizontal-slider-wrapper ${wrapperClassName}`}>
      <ScrollMenu
        LeftArrow={LeftArrowComponent}
        RightArrow={RightArrowComponent}
        itemClassName={itemClassName}
      >
        {data.map((item, index) => {
          const itemId = getItemId(item);
          return (
            <div
              key={itemId}
              data-testid={`slider-item-${itemId}`}
              className="h-full"
            >
              {renderItem(item, index)}
            </div>
          );
        })}
      </ScrollMenu>
    </div>
  );
};
