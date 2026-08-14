'use client';

import React from 'react';
import Disclosure from './Disclosure';

export default function DisclosureDemo() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Disclosure Component Demo</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <p className="text-gray-700 mb-6">
            This is a fully accessible Disclosure component (also called an
            Accordion when used in groups) following the W3C ARIA Authoring
            Practices Guide. Test keyboard navigation with the following keys:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>
              <strong>Click</strong> the button to toggle the disclosure open/closed
            </li>
            <li>
              <strong>Tab</strong> to focus on the button
            </li>
            <li>
              <strong>Enter</strong> or <strong>Space</strong> to toggle while
              focused on the button
            </li>
            <li>
              When closed, the content is not rendered and not in the tab order
            </li>
            <li>
              When open, the content is rendered and becomes focusable if it
              contains focusable elements
            </li>
          </ul>
        </div>

        <div className="space-y-4 mb-8">
          <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>

          <Disclosure
            trigger="What is React?"
            contentId="disclosure-1"
            defaultOpen={false}
          >
            <div>
              <p className="text-gray-700 mb-4">
                React is a JavaScript library for building user interfaces using
                reusable components. It was developed by Facebook and is now
                maintained by Facebook and the community.
              </p>
              <p className="text-gray-700 mb-4">
                React uses a virtual DOM to efficiently update the UI when data
                changes. Components in React are typically written as functions or
                classes that return JSX (a syntax extension that looks like HTML).
              </p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Learn More About React
              </button>
            </div>
          </Disclosure>

          <Disclosure
            trigger="What is TypeScript?"
            contentId="disclosure-2"
            defaultOpen={false}
          >
            <div>
              <p className="text-gray-700 mb-4">
                TypeScript is a typed superset of JavaScript that compiles to
                clean, readable JavaScript code. It was developed by Microsoft and
                provides static type checking and other features to improve code
                quality and development experience.
              </p>
              <p className="text-gray-700 mb-4">
                With TypeScript, you can catch type-related errors during
                development rather than at runtime. It provides excellent IDE
                support with features like autocompletion, type hints, and
                refactoring tools.
              </p>
              <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                Explore TypeScript
              </button>
            </div>
          </Disclosure>

          <Disclosure
            trigger="What is Web Accessibility (WCAG)?"
            contentId="disclosure-3"
            defaultOpen={false}
          >
            <div>
              <p className="text-gray-700 mb-4">
                Web Accessibility means making websites and applications usable by
                everyone, including people with disabilities. The Web Content
                Accessibility Guidelines (WCAG) is a set of recommendations for
                making web content more accessible.
              </p>
              <p className="text-gray-700 mb-4">
                Accessible web design benefits everyone, not just people with
                disabilities. It improves usability, SEO, and provides a better
                experience for users on slow connections or using mobile devices.
              </p>
              <p className="text-gray-700 mb-4">
                Key principles include: Perceivable (content must be perceivable),
                Operable (components must be operable), Understandable (content
                must be understandable), and Robust (compatible with assistive
                technologies).
              </p>
              <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                Read WCAG Guidelines
              </button>
            </div>
          </Disclosure>

          <Disclosure
            trigger="How do you implement focus management in React?"
            contentId="disclosure-4"
            defaultOpen={true}
          >
            <div>
              <p className="text-gray-700 mb-4">
                Focus management in React involves using refs to access DOM
                elements and controlling which element receives focus. This is
                especially important for accessible components like modals,
                disclosures, and autocomplete widgets.
              </p>
              <p className="text-gray-700 mb-4">
                Common techniques include:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Using useRef to store references to focusable elements</li>
                <li>
                  Using element.focus() to programmatically move focus when needed
                </li>
                <li>
                  Implementing keyboard navigation for custom interactive components
                </li>
                <li>Restoring focus when components unmount or change state</li>
              </ul>
              <p className="text-gray-700 mb-4">
                Proper focus management ensures keyboard users can navigate your
                application efficiently and screen reader users understand the
                logical flow of your content.
              </p>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                View Code Example
              </button>
            </div>
          </Disclosure>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-4">
            ♿ ARIA Features Implemented:
          </h2>
          <ul className="space-y-2 text-blue-800">
            <li>
              ✓ Real <code className="bg-white px-2 py-1 rounded">&lt;button&gt;</code>
              {' element as trigger'}
            </li>
            <li>
              ✓ <code className="bg-white px-2 py-1 rounded">aria-expanded</code>
              {' reflects the current state (true/false)'}
            </li>
            <li>
              ✓ <code className="bg-white px-2 py-1 rounded">aria-controls</code>
              {' points to the id of the content region'}
            </li>
            <li>
              ✓ Content only rendered when expanded (not in DOM when collapsed)
            </li>
            <li>
              ✓ Click button or press Enter/Space to toggle expanded state
            </li>
            <li>✓ Smooth animation with rotating disclosure indicator icon</li>
            <li>✓ No 'any' types used in the component</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
