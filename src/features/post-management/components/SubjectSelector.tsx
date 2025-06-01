// SubjectSelector.tsx

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { MdAdd, MdClose } from "react-icons/md";
import { Button } from "@mui/material"; // MUI components for internal use if any

// This is a type for Subject, which is a simplified version of Category to display on the UI.
export type Subject = {
  // Exporting for SubjectPicker
  id: number;
  name: string;
  description?: string | null;
  examples?: string[];
};

interface SubjectSelectorProps {
  cate_ids: number[];
  setCateIds: (value: number[]) => void;
  currentSearchTerm: string; // Search term from SubjectPicker
  allSubjects: Subject[];
}

const SubjectSelector: React.FC<SubjectSelectorProps> = ({
  cate_ids,
  setCateIds,
  currentSearchTerm,
  allSubjects,
}) => {
  // Using cate_ids directly for selected state logic, no separate 'selected' state needed here for IDs.
  // 'selectedSubjects' can be derived for display if needed, or just use allSubjects and filter by cate_ids.
  const [hovered, setHovered] = useState<Subject | undefined>();

  const handleHover = useCallback(
    (s: Subject) => setHovered((prev) => (prev?.id === s.id ? prev : s)),
    [],
  );

  // --- Start: Logic mostly from your original SubjectSelector ---
  const isSelected = useCallback(
    (subject: Subject) => cate_ids.includes(subject.id), // Check against cate_ids prop
    [cate_ids],
  );

  const toggleSubject = useCallback(
    (subjectToToggle: Subject) => {
      const currentIds = new Set(cate_ids);
      if (currentIds.has(subjectToToggle.id)) {
        currentIds.delete(subjectToToggle.id);
      } else {
        if (currentIds.size < 3) {
          currentIds.add(subjectToToggle.id);
        } else {
          console.warn("Max 3 categories");
          return;
        }
      }
      setCateIds(Array.from(currentIds));
      // The search input is now in SubjectPicker, so no setSearch("") here.
    },
    [cate_ids, setCateIds],
  );

  // Your original SubjectRow with its original styling
  const SubjectRow = React.memo(
    ({
      subject,
      // isSelected prop is now derived inside SubjectRow or passed based on the main isSelected function
      toggle,
      handleHover,
    }: {
      subject: Subject;
      toggle: (s: Subject) => void;
      handleHover: (s: Subject) => void;
    }) => {
      const subjectIsSelected = isSelected(subject); // Use the main isSelected function
      const isDisabled = cate_ids.length >= 3 && !subjectIsSelected;

      return (
        <li
          className="flex justify-between items-center gap-2 hover:bg-gray-100 dark:hover:bg-mountain-800 px-2 py-2 rounded text-sm cursor-pointer"
          onMouseEnter={() => handleHover(subject)}
        >
          {/* Changed from flex-1 to max-w-[60%] or similar if that was your original intent for space */}
          <span className="flex-1 truncate pr-2">{subject.name}</span>{" "}
          {/* Using flex-1 as it's common */}
          <Button
            onClick={() => toggle(subject)}
            className={`${
              // YOUR ORIGINAL CONDITIONAL CLASSES FOR THE BUTTON
              isDisabled
                ? "dark:text-mountain-500 text-gray-400" // Disabled state
                : "dark:text-white text-black" // Enabled state
            } flex justify-center items-center gap-1 bg-white hover:bg-gray-100 dark:bg-mountain-950 dark:hover:bg-mountain-900 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded min-w-[110px] text-sm`}
            disabled={isDisabled}
          >
            {!subjectIsSelected ? (
              <>
                <MdAdd size={16} className="text-indigo-500" />
                <span className="text-sm">Add</span>
              </>
            ) : (
              <>
                <MdClose size={16} className="text-red-400" />
                <span className="text-sm">Remove</span>
              </>
            )}
          </Button>
        </li>
      );
    },
  );
  SubjectRow.displayName = "SubjectRowFromSelector";

  // Effect to update 'hovered' when 'cate_ids' or 'allSubjects' change
  useEffect(() => {
    if (allSubjects.length > 0) {
      const currentSelectedSubjects = allSubjects.filter((s) =>
        cate_ids.includes(s.id),
      );
      if (currentSelectedSubjects.length > 0) {
        if (!hovered || !cate_ids.includes(hovered.id)) {
          setHovered(currentSelectedSubjects[0]);
        }
      } else if (
        allSubjects.length > 0 &&
        (!hovered || !allSubjects.find((s) => s.id === hovered.id))
      ) {
        setHovered(allSubjects[0]);
      }
    } else if (allSubjects.length === 0) {
      setHovered(undefined);
    }
  }, [cate_ids, allSubjects, hovered]);

  const filteredSubjects = useMemo(() => {
    const searchTerm = currentSearchTerm.toLowerCase();
    if (!searchTerm) return allSubjects;
    return allSubjects.filter((s) => s.name.toLowerCase().includes(searchTerm));
  }, [allSubjects, currentSearchTerm]);

  const remainingSlots = 3 - cate_ids.length;
  // --- End: Logic mostly from your original SubjectSelector ---

  // This root div is the content of the Popper.
  // It should define its own size and internal layout.
  // The Tailwind classes for colors (bg-white dark:bg-mountain-950 etc.) should match your app's theme for dropdowns.
  return (
    <div
      className="p-3 bg-white dark:bg-mountain-900 text-black dark:text-white w-[820px] max-h-[70vh] flex flex-col rounded-lg"
      style={{ scrollbarGutter: "stable" }} /* reserve scroll‑bar width */
    >
      {" "}
      {/* Removed the specific title "How would you categorize..." - that's now in SubjectPicker's context */}
      {/* Removed the "Top Selection Bar" with chips and search - that's now in SubjectPicker */}
      {/* Main layout (two columns) - this is what was originally in your SubjectSelector's main layout div */}
      <div className="flex flex-row gap-4 flex-grow overflow-hidden">
        {" "}
        {/* Ensure this takes up available space */}
        {/* Left column: List of subjects */}
        {/* Apply your original styling for this column's wrapper */}
        <div className="flex flex-col w-2/5 h-full pr-2">
          {" "}
          {/* e.g. 40% width for more space */}
          {/* Your original "CHOOSE ANOTHER..." text */}
          <p className="mb-3 py-1.5 text-gray-700 dark:text-gray-400 text-sm">
            CHOOSE ANOTHER {remainingSlots} ART TYPE
            {remainingSlots !== 1 ? "S" : ""}
          </p>
          {allSubjects.length === 0 && !currentSearchTerm ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 italic text-center py-4">
              Loading art types...
            </p>
          ) : filteredSubjects.length > 0 ? (
            // Your original list styling
            <ul
              className="flex-1 space-y-2 pr-1 overflow-y-auto custom-scroll"
              style={{ scrollbarGutter: "stable" }}
            >
              {" "}
              {filteredSubjects.map((subject) => (
                <SubjectRow
                  key={subject.id}
                  subject={subject}
                  // isSelected is handled inside SubjectRow now or pass isSelected(subject)
                  toggle={toggleSubject} // Use the main toggleSubject
                  handleHover={handleHover}
                />
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 italic text-center py-4">
              No art types match "{currentSearchTerm}".
            </p>
          )}
        </div>
        {/* Right preview panel */}
        {/* Apply your original styling for this column's wrapper */}
        <div className="flex flex-col w-3/5 h-full overflow-hidden border-l border-gray-300 dark:border-gray-700">
          {/* Your original preview panel structure and styling */}
          {hovered ? (
            // The div below was your "bg-gray-100 dark:bg-mountain-950 p-5 border ..."
            <div className="h-[357px]  p-3 md:p-4 rounded-md flex flex-col overflow-y-auto custom-scroll">
              <div className="mb-3">
                <h3 className="font-semibold text-lg md:text-xl">
                  {hovered.name}
                </h3>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 break-words">
                  {hovered.description}
                </p>
              </div>
              {hovered.examples !== undefined ? (
                <>
                  <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                    Examples
                  </p>
                  {hovered.examples.length > 0 ? (
                    <div className="flex gap-2 md:gap-3 overflow-x-auto max-w-full custom-scroll-x pb-1">
                      {hovered.examples.map((url, idx) => (
                        <img
                          key={idx}
                          src={url}
                          alt={`Example ${idx + 1} for ${hovered.name}`}
                          // Your original image classes
                          className="rounded w-28 h-28 md:w-32 md:h-32 object-cover flex-shrink-0"
                          loading="lazy"
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 italic">
                      No examples available for this art type.
                    </p>
                  )}
                </>
              ) : null}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-mountain-900 rounded-md">
              <p className="text-gray-400 dark:text-gray-500 text-sm">
                {allSubjects.length > 0
                  ? "Select or hover an art type."
                  : "Loading details..."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubjectSelector;
