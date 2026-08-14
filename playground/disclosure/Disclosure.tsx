'use client';

import React, { useState, useRef, useCallback, ReactNode } from 'react';

interface DisclosureProps {
  trigger: ReactNode;
  children: ReactNode;
  contentId?: string;
  defaultOpen?: boolean;
}

const Disclosure = React.forwardRef<HTMLDivElement, DisclosureProps>(
  (
    { trigger, children, contentId = `disclosure-content-${Math.random()}`, defaultOpen = false },
    ref
  ) => {
    const [isExpanded, setIsExpanded] = useState(defaultOpen);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleToggle = useCallback(() => {
      setIsExpanded((prev) => !prev);
    }, []);

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLButtonElement>) => {
        // Enter and Space are the standard keys for activating buttons,
        // but since we have an actual <button> element, the browser handles
        // these automatically. However, we can ensure consistent handling.
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleToggle();
        }
      },
      [handleToggle]
    );

    return (
      <div ref={ref} className="w-full">
        <button
          ref={buttonRef}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          aria-expanded={isExpanded}
          aria-controls={contentId}
          className="w-full px-4 py-3 text-left font-semibold bg-gray-100 hover:bg-gray-200 text-gray-900 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-between"
        >
          <span>{trigger}</span>
          <svg
            className={`h-5 w-5 transition-transform ${
              isExpanded ? 'transform rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </button>

        {isExpanded && (
          <div
            id={contentId}
            className="px-4 py-4 bg-white border border-t-0 border-gray-200 rounded-b"
          >
            {children}
          </div>
        )}
      </div>
    );
  }
);

Disclosure.displayName = 'Disclosure';

export default Disclosure;
