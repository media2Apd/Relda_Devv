import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
// import { AiFillCaretDown } from "react-icons/ai";
import { Search, X, Check, ChevronDown  } from "lucide-react";

const SelectDropdown = ({
  label,
  options = [],
  value,
  onChange,
  labelKey = "label",
  valueKey = "id",
  placeholder = "Select an option",
  parentClassName = "",
  ChildClassName = "",
  inputClassName = "",
  dropdownClassName = "",
  itemClassName = "",
  labelClassName = "",
  iconSize = 18,
  disabled = false,
  disabledOptions = [],
  error = false,
  searchable = false,
  searchPlaceholder = "Search...",
  multiple = false,
  maxSelectedItems = null,
  showSelectedCount = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 'auto',
    bottom: 'auto',
    left: 'auto',
    right: 'auto',
    maxHeight: '240px',
    transformOrigin: 'top'
  });

  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const listRef = useRef(null);
  const searchInputRef = useRef(null);

  // Normalize value to array for multiple select
  const normalizedValue = useMemo(() => {
    if (!multiple) return value;
    return Array.isArray(value) ? value : (value !== null && value !== undefined ? [value] : []);
  }, [value, multiple]);

  // Helper function to check if a value is "empty"
  const isValueEmpty = (val) => {
    return val === null || val === undefined || val === '';
  };

  // Helper function to compare values (handles different types)
  const areValuesEqual = (val1, val2) => {
    // Handle null/undefined cases
    if (val1 === val2) return true;
    
    // Convert to string for comparison if types don't match
    if (typeof val1 !== typeof val2) {
      return String(val1) === String(val2);
    }
    
    return val1 === val2;
  };

  // Filter options based on search query
  const filteredOptions = useMemo(() => {
    if (!searchable || !searchQuery.trim()) return options;
    
    const query = searchQuery.toLowerCase().trim();
    return options.filter(option => {
      const labelValue = option[labelKey];
      if (labelValue === null || labelValue === undefined) return false;
      
      const labelStr = String(labelValue).toLowerCase();
      return labelStr.includes(query);
    });
  }, [options, searchQuery, searchable, labelKey]);

  // Calculate dropdown position with viewport awareness
  const calculatePosition = useCallback(() => {
    if (!buttonRef.current || !isOpen) return;

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    const dropdownMaxHeight = 240;
    const itemHeight = 40;
    const searchBarHeight = searchable ? 48 : 0;
    const actualDropdownHeight = Math.min(
      (filteredOptions.length + 1) * itemHeight + searchBarHeight,
      dropdownMaxHeight
    );

    const padding = 10;

    let position = {
      top: 'auto',
      bottom: 'auto',
      left: '0',
      right: 'auto',
      maxHeight: `${dropdownMaxHeight}px`,
      transformOrigin: 'top',
      width: `${buttonRect.width}px`
    };

    // Vertical positioning
    const spaceBelow = viewport.height - buttonRect.bottom - padding;
    const spaceAbove = buttonRect.top - padding;

    if (spaceBelow >= actualDropdownHeight) {
      position.top = '100%';
      position.transformOrigin = 'top';
    } else if (spaceAbove >= actualDropdownHeight) {
      position.bottom = '100%';
      position.transformOrigin = 'bottom';
    } else {
      if (spaceBelow > spaceAbove) {
        position.top = '100%';
        position.maxHeight = `${spaceBelow - 20}px`;
        position.transformOrigin = 'top';
      } else {
        position.bottom = '100%';
        position.maxHeight = `${spaceAbove - 20}px`;
        position.transformOrigin = 'bottom';
      }
    }

    // Horizontal positioning
    const spaceOnRight = viewport.width - buttonRect.left - padding;
    const spaceOnLeft = buttonRect.right - padding;

    if (spaceOnRight < buttonRect.width) {
      if (spaceOnLeft >= buttonRect.width) {
        position.left = 'auto';
        position.right = '0';
      } else {
        const leftOffset = Math.max(
          padding - buttonRect.left,
          Math.min(
            viewport.width - buttonRect.width - padding - buttonRect.left,
            0
          )
        );
        position.left = `${leftOffset}px`;
      }
    }

    setDropdownPosition(position);
  }, [isOpen, filteredOptions.length, searchable]);

  // Toggle dropdown
  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen((prev) => !prev);
      if (!isOpen) {
        setSearchQuery("");
      }
    }
  };

  // Handle single selection
  const handleSingleSelect = (option) => {
    const optionValue = option[valueKey];
    
    if (isValueEmpty(optionValue)) {
      onChange('');
      setIsOpen(false);
      setSearchQuery("");
      return;
    }

    if (disabledOptions.some(disabled => areValuesEqual(disabled, optionValue))) {
      return;
    }
    
    onChange(optionValue);
    setIsOpen(false);
    setSearchQuery("");
  };

  // Handle multiple selection
  const handleMultipleSelect = (option) => {
    const optionValue = option[valueKey];
    
    if (disabledOptions.some(disabled => areValuesEqual(disabled, optionValue))) {
      return;
    }

    const currentValues = normalizedValue;
    const isSelected = currentValues.some(val => areValuesEqual(val, optionValue));
    
    let newValues;
    if (isSelected) {
      // Remove from selection
      newValues = currentValues.filter(v => !areValuesEqual(v, optionValue));
    } else {
      // Add to selection
      if (maxSelectedItems && currentValues.length >= maxSelectedItems) {
        return; // Don't add if max limit reached
      }
      newValues = [...currentValues, optionValue];
    }
    
    onChange(newValues);
  };

  // Handle selection based on mode
  const handleSelect = (option) => {
    if (multiple) {
      handleMultipleSelect(option);
    } else {
      handleSingleSelect(option);
    }
  };

  // Remove a selected item (for multiple select)
  const removeSelectedItem = (itemValue, e) => {
    e.stopPropagation();
    const newValues = normalizedValue.filter(v => !areValuesEqual(v, itemValue));
    onChange(newValues);
  };

  // Clear all selections (for multiple select)
  const clearAll = (e) => {
    e.stopPropagation();
    onChange([]);
  };

  // Click outside handler
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
      setSearchQuery("");
    }
  };

  // Setup click outside listener
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Calculate position when dropdown opens
  useEffect(() => {
    if (isOpen) {
      calculatePosition();
      if (searchable && searchInputRef.current) {
        setTimeout(() => searchInputRef.current?.focus(), 50);
      }
    }
  }, [isOpen, calculatePosition, searchable]);

  // Handle resize and scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleResize = () => calculatePosition();
    const handleScroll = () => calculatePosition();

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen, calculatePosition]);

  // Get selected label(s)
  const getSelectedLabel = () => {
    if (!multiple) {
      if (isValueEmpty(value)) return placeholder;
      
      // Find the option that matches the current value
      const match = options.find((opt) => areValuesEqual(opt[valueKey], value));
      return match?.[labelKey] || placeholder;
    } else {
      // Multiple select
      if (!normalizedValue.length) return placeholder;
      
      if (showSelectedCount && normalizedValue.length > 2) {
        return `${normalizedValue.length} items selected`;
      }
      
      const selectedLabels = normalizedValue.map(val => {
        const match = options.find(opt => areValuesEqual(opt[valueKey], val));
        return match?.[labelKey] || String(val);
      });
      
      return selectedLabels.join(', ');
    }
  };

  // Check if option is selected
  const isOptionSelected = (option) => {
    if (!multiple) {
      return areValuesEqual(value, option[valueKey]);
    }
    return normalizedValue.some(val => areValuesEqual(val, option[valueKey]));
  };

  // Check if option is disabled
  const isOptionDisabled = (option) => {
    return disabledOptions.some(disabled => areValuesEqual(disabled, option[valueKey]));
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchQuery("");
    }
  };

  // Check if value is set (handles different types)
  const hasValue = !isValueEmpty(value) && (multiple ? normalizedValue.length > 0 : true);

  return (
    <div className={`w-full ${parentClassName}`}>
      {label && (
        <label className={`block text-sm font-medium mb-1 text-textPrimary ${labelClassName}`}>
          {label}
        </label>
      )}
      <div className="relative" ref={dropdownRef}>
        <button
          ref={buttonRef}
          type="button"
          onClick={toggleDropdown}
          disabled={disabled}
          className={`${ChildClassName} flex justify-between items-center w-full border rounded-[7px] py-1.5 px-4 text-left shadow-sm focus:outline-none transition-all duration-200
            ${disabled ? "opacity-50 cursor-not-allowed bg-neutralLight dark:bg-neutral/10" : "cursor-pointer bg-white dark:bg-surface"}
            ${error
              ? 'border-highlight dark:border-highlight'
              : (hasValue
                ? "border-primary dark:border-primary text-primary" 
                : "border-neutral/20 dark:border-neutral/30 text-textPrimary")
            }
            ${!disabled && "hover:border-primary dark:hover:border-primary focus:border-primary dark:focus:border-primary focus:ring-2 focus:ring-primary/20"}
          `}
        >
          <span className={`whitespace-nowrap overflow-hidden text-ellipsis ${inputClassName}`}>
            {getSelectedLabel()}
          </span>
          <div className="flex items-center gap-1 ml-2">
            {multiple && normalizedValue.length > 0 && !disabled && (
              <X
                className="flex-shrink-0 hover:bg-neutralLight dark:hover:bg-neutral/20 rounded-full p-0.5 text-textMuted"
                size={16}
                onClick={clearAll}
              />
            )}
            <ChevronDown 
              className={`flex-shrink-0 transition-transform duration-200 text-textMuted ${isOpen ? 'rotate-180' : ''}`}
              size={iconSize}
            />
          </div>
        </button>

        {/* Selected items tags (for multiple select with showSelectedCount=false) */}
        {multiple && !showSelectedCount && normalizedValue.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {normalizedValue.map((val) => {
              const option = options.find(opt => areValuesEqual(opt[valueKey], val));
              if (!option) return null;
              
              return (
                <span
                  key={String(val)}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-primaryLight dark:bg-primary/20 text-primary rounded-md text-sm"
                >
                  {option[labelKey]}
                  {!disabled && (
                    <X
                      className="cursor-pointer hover:bg-primary/20 dark:hover:bg-primary/30 rounded-full"
                      size={14}
                      onClick={(e) => removeSelectedItem(val, e)}
                    />
                  )}
                </span>
              );
            })}
          </div>
        )}

        {isOpen && !disabled && (
          <div
            className={`absolute z-[999] mt-1 rounded-[7px] border shadow-lg bg-white dark:bg-surface border-neutral/20 dark:border-neutral/30 ${dropdownClassName}`}
            style={{
              ...dropdownPosition,
              animation: 'dropdownFade 0.2s ease-out'
            }}
            onKeyDown={handleKeyDown}
          >
            {/* Search Input */}
            {searchable && (
              <div className="p-2 border-b border-neutral/10 dark:border-neutral/20 bg-neutralLight/50 dark:bg-neutral/5">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-textMuted" size={16} />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="w-full pl-9 pr-3 py-2 border border-neutral/20 dark:border-neutral/30 rounded-md 
                      bg-white dark:bg-surface text-textPrimary placeholder-textMuted
                      focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm transition-all duration-200"
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            )}

            {/* Options List */}
            <ul
              ref={listRef}
              className="overflow-y-auto"
              style={{
                maxHeight: searchable 
                  ? `calc(${dropdownPosition.maxHeight} - 56px)` 
                  : dropdownPosition.maxHeight,
                overflowX: 'hidden'
              }}
            >
              {/* Placeholder option (only for single select) */}
              {!multiple && (
                <li
                  onClick={() => {
                    onChange('');
                    setIsOpen(false);
                    setSearchQuery("");
                  }}
                  className={`px-4 py-2 cursor-pointer hover:bg-neutralLight dark:hover:bg-neutral/10 text-textPrimary transition-colors duration-150
                    ${isValueEmpty(value) ? "bg-neutralLight dark:bg-neutral/10 font-semibold" : ""} ${itemClassName}`}
                >
                  {placeholder}
                </li>
              )}

              {/* Select/Deselect All option (only for multiple select) */}
              {multiple && filteredOptions.length > 0 && (
                <li
                  onClick={() => {
                    const allValues = filteredOptions
                      .filter(opt => !isOptionDisabled(opt))
                      .map(opt => opt[valueKey]);
                    
                    const allSelected = allValues.every(val => 
                      normalizedValue.some(nVal => areValuesEqual(nVal, val))
                    );
                    
                    if (allSelected) {
                      // Deselect all
                      const newValues = normalizedValue.filter(val => 
                        !allValues.some(aVal => areValuesEqual(aVal, val))
                      );
                      onChange(newValues);
                    } else {
                      // Select all
                      const newValues = [...new Set([...normalizedValue, ...allValues])];
                      if (!maxSelectedItems || newValues.length <= maxSelectedItems) {
                        onChange(newValues);
                      }
                    }
                  }}
                  className="px-4 py-2 cursor-pointer hover:bg-neutralLight dark:hover:bg-neutral/10 border-b border-neutral/10 dark:border-neutral/20 font-medium text-primary transition-colors duration-150"
                >
                  {filteredOptions.filter(opt => !isOptionDisabled(opt)).every(opt => 
                    normalizedValue.some(nVal => areValuesEqual(nVal, opt[valueKey]))
                  ) ? 'Deselect All' : 'Select All'}
                </li>
              )}

              {/* Filtered options */}
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => {
                  const isDisabled = isOptionDisabled(option);
                  const isSelected = isOptionSelected(option);
                  
                  return (
                    <li
                      key={`${option[valueKey]}-${index}`}
                      onClick={() => !isDisabled && handleSelect(option)}
                      className={`
                        px-4 py-2 flex items-center justify-between transition-colors duration-150
                        ${isDisabled
                          ? 'cursor-not-allowed opacity-50 bg-neutralLight/50 dark:bg-neutral/5 text-textMuted'
                          : 'cursor-pointer hover:bg-neutralLight dark:hover:bg-neutral/10 text-textPrimary'
                        }
                        ${(!isDisabled && isSelected) ? "bg-primaryLight dark:bg-primary/10" : ""} 
                        ${itemClassName}
                      `}
                      title={isDisabled ? 'This option is not available' : ''}
                    >
                      <span>{option[labelKey]}</span>
                      {multiple && isSelected && !isDisabled && (
                        <Check className="text-primary" size={16} />
                      )}
                    </li>
                  );
                })
              ) : (
                <li className="px-4 py-3 text-center text-textMuted text-sm">
                  {searchQuery ? 'No results found' : 'No options available'}
                </li>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Add animation styles */}
      <style>{`
        @keyframes dropdownFade {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default SelectDropdown;