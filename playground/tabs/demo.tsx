'use client';

import React from 'react';
import Tabs from './Tabs';

export default function TabsDemo() {
  const tabs = [
    {
      id: 'tab1',
      label: 'React',
      content: (
        <div>
          <h3 className="text-2xl font-bold mb-3">React</h3>
          <p className="text-gray-700 mb-4">
            React is a JavaScript library for building user interfaces with
            reusable components and efficient rendering. It uses a virtual DOM
            to optimize performance and provides a declarative way to build UIs.
          </p>
          <div className="space-y-2 mb-4">
            <p className="font-semibold text-gray-800">Key Features:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Component-based architecture</li>
              <li>Virtual DOM for performance</li>
              <li>Unidirectional data flow</li>
              <li>Large ecosystem and community</li>
            </ul>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Learn More
          </button>
        </div>
      ),
    },
    {
      id: 'tab2',
      label: 'TypeScript',
      content: (
        <div>
          <h3 className="text-2xl font-bold mb-3">TypeScript</h3>
          <p className="text-gray-700 mb-4">
            TypeScript is a typed superset of JavaScript that compiles to clean,
            readable JavaScript code. It provides static type checking, better
            tooling, and more maintainable code at scale.
          </p>
          <div className="space-y-2 mb-4">
            <p className="font-semibold text-gray-800">Benefits:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Static type checking catches errors early</li>
              <li>Better IDE support and autocompletion</li>
              <li>Self-documenting code</li>
              <li>Improved refactoring capabilities</li>
            </ul>
          </div>
          <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
            Explore
          </button>
        </div>
      ),
    },
    {
      id: 'tab3',
      label: 'Accessibility',
      content: (
        <div>
          <h3 className="text-2xl font-bold mb-3">Accessibility (WCAG)</h3>
          <p className="text-gray-700 mb-4">
            Web accessibility ensures that websites are usable by everyone,
            including people with disabilities using assistive technologies.
            WCAG provides guidelines for making digital content accessible.
          </p>
          <div className="space-y-2 mb-4">
            <p className="font-semibold text-gray-800">WCAG Principles:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>
                <strong>Perceivable:</strong> Content must be perceivable to users
              </li>
              <li>
                <strong>Operable:</strong> Components must be operable via keyboard
              </li>
              <li>
                <strong>Understandable:</strong> Content must be understandable
              </li>
              <li>
                <strong>Robust:</strong> Compatible with assistive technologies
              </li>
            </ul>
          </div>
          <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
            Read Guidelines
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Tabs Component Demo</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <p className="text-gray-700 mb-6">
            This is a fully accessible Tabs component following the W3C ARIA
            Authoring Practices Guide. Test keyboard navigation with the following
            keys:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>
              <strong>Click</strong> any tab to select it
            </li>
            <li>
              <strong>Arrow Right</strong> moves focus to the next tab and selects it
              (wraps to first tab after the last)
            </li>
            <li>
              <strong>Arrow Left</strong> moves focus to the previous tab and selects
              it (wraps to last tab before the first)
            </li>
            <li>
              <strong>Home</strong> key moves focus to the first tab and selects it
            </li>
            <li>
              <strong>End</strong> key moves focus to the last tab and selects it
            </li>
            <li>
              <strong>Tab</strong> key moves focus from tabs into the active panel
              content (buttons inside the panel are focusable)
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <Tabs tabs={tabs} defaultTabIndex={0} />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-4">
            ♿ ARIA Features Implemented:
          </h2>
          <ul className="space-y-2 text-blue-800">
            <li>
              ✓ <code className="bg-white px-2 py-1 rounded">role="tablist"</code>
              {' on the tab list container'}
            </li>
            <li>
              ✓ <code className="bg-white px-2 py-1 rounded">role="tab"</code>,{' '}
              <code className="bg-white px-2 py-1 rounded">aria-selected</code>, and{' '}
              <code className="bg-white px-2 py-1 rounded">aria-controls</code>
              {' on each tab button'}
            </li>
            <li>
              ✓ <code className="bg-white px-2 py-1 rounded">role="tabpanel"</code>,{' '}
              <code className="bg-white px-2 py-1 rounded">aria-labelledby</code>,
              {' and '}
              <code className="bg-white px-2 py-1 rounded">tabIndex=0</code>
              {' on each panel'}
            </li>
            <li>
              ✓ Only active tab is in natural tab order (
              <code className="bg-white px-2 py-1 rounded">tabIndex=0</code>);
              inactive tabs have{' '}
              <code className="bg-white px-2 py-1 rounded">tabIndex=-1</code>
            </li>
            <li>✓ Arrow Right/Left navigate between tabs with wraparound</li>
            <li>✓ Home/End keys move to first/last tab</li>
            <li>✓ Tab key moves focus into active panel content</li>
            <li>✓ No 'any' types used in the component</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
