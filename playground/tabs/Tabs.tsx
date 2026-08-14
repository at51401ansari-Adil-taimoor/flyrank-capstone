'use client';

import React, { useState, useRef, useCallback, ReactNode } from 'react';

interface Tab {
  id: string;
  label: string;
  content: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTabIndex?: number;
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ tabs, defaultTabIndex = 0 }, ref) => {
    const [activeTabIndex, setActiveTabIndex] = useState(
      Math.min(defaultTabIndex, tabs.length - 1)
    );
    const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

    const handleTabClick = useCallback(
      (index: number) => {
        setActiveTabIndex(index);
        // Focus the clicked tab
        tabRefs.current[index]?.focus();
      },
      []
    );

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLButtonElement>) => {
        let newIndex = activeTabIndex;
        let handled = false;

        switch (event.key) {
          case 'ArrowRight':
            newIndex = (activeTabIndex + 1) % tabs.length;
            handled = true;
            break;
          case 'ArrowLeft':
            newIndex = (activeTabIndex - 1 + tabs.length) % tabs.length;
            handled = true;
            break;
          case 'Home':
            newIndex = 0;
            handled = true;
            break;
          case 'End':
            newIndex = tabs.length - 1;
            handled = true;
            break;
          default:
            break;
        }

        if (handled) {
          event.preventDefault();
          setActiveTabIndex(newIndex);
          // Focus the new tab
          setTimeout(() => {
            tabRefs.current[newIndex]?.focus();
          }, 0);
        }
      },
      [activeTabIndex, tabs.length]
    );

    return (
      <div ref={ref} className="w-full">
        <div role="tablist" className="flex border-b border-gray-300">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              role="tab"
              aria-selected={index === activeTabIndex}
              aria-controls={`panel-${tab.id}`}
              id={`tab-${tab.id}`}
              tabIndex={index === activeTabIndex ? 0 : -1}
              onClick={() => handleTabClick(index)}
              onKeyDown={handleKeyDown}
              className={`px-4 py-3 font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                index === activeTabIndex
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {tabs.map((tab, index) => (
          <div
            key={tab.id}
            id={`panel-${tab.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${tab.id}`}
            tabIndex={0}
            hidden={index !== activeTabIndex}
            className="p-6 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded"
          >
            {tab.content}
          </div>
        ))}
      </div>
    );
  }
);

Tabs.displayName = 'Tabs';

export default Tabs;
