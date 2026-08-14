'use client';

import React, { useState } from 'react';
import Modal from './Modal';

export default function ModalDemo() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Modal Dialog Demo</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <p className="text-gray-700 mb-6">
            Click the button below to open the modal. Test the focus trapping by:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>
              <strong>Tab</strong> through the focusable elements (buttons) inside
              the modal
            </li>
            <li>
              When you reach the last button and press <strong>Tab</strong>, focus
              should return to the first button (focus trap)
            </li>
            <li>
              Press <strong>Escape</strong> to close the modal
            </li>
            <li>
              Click outside the modal (on the dark overlay) to close it
            </li>
            <li>
              After closing, focus should return to the "Open Modal" button
            </li>
          </ul>

          <button
            onClick={openModal}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Open Modal
          </button>
        </div>

        {/* Accessibility notes */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-4">
            ♿ ARIA Features Implemented:
          </h2>
          <ul className="space-y-2 text-blue-800">
            <li>
              ✓ <code className="bg-white px-2 py-1 rounded">role="dialog"</code>
              {' and '}
              <code className="bg-white px-2 py-1 rounded">aria-modal="true"</code>
            </li>
            <li>
              ✓ <code className="bg-white px-2 py-1 rounded">aria-labelledby</code>
              {' points to the modal title'}
            </li>
            <li>✓ Focus automatically moves to first focusable element</li>
            <li>✓ Focus is trapped inside the modal (Tab cycles internally)</li>
            <li>✓ Escape key closes the modal</li>
            <li>✓ Focus returns to trigger button when modal closes</li>
            <li>✓ Clicking overlay closes the modal</li>
            <li>✓ No 'any' types used in the component</li>
          </ul>
        </div>
      </div>

      {/* Modal Component */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Example Modal Dialog"
        titleId="modal-title"
      >
        <p className="text-gray-600 mb-6">
          This is a fully accessible modal component following the W3C ARIA
          Authoring Practices Guide. Try navigating with your keyboard to see the
          focus trap in action.
        </p>

        <div className="space-y-4 flex flex-col">
          <button
            onClick={() => {
              alert('First button clicked!');
            }}
            className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
          >
            Action Button 1
          </button>

          <button
            onClick={closeModal}
            className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
          >
            Close Modal
          </button>
        </div>
      </Modal>
    </div>
  );
}
