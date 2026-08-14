'use client';

import React, {
  ReactNode,
  useEffect,
  useRef,
  useCallback,
  useState,
} from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  titleId?: string;
}

interface FocusableElement extends HTMLElement {
  focus: () => void;
}

const FOCUSABLE_SELECTORS = [
  'button',
  '[href]',
  'input',
  'select',
  'textarea',
  '[tabindex]:not([tabindex="-1"])',
];

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  ({ isOpen, onClose, title, children, titleId = 'modal-title' }, ref) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLElement | null>(null);
    const [focusableElements, setFocusableElements] = useState<
      FocusableElement[]
    >([]);

    // Get all focusable elements inside the modal
    const getFocusableElements = useCallback((): FocusableElement[] => {
      if (!modalRef.current) return [];

      const selector = FOCUSABLE_SELECTORS.join(', ');
      const elements = Array.from(
        modalRef.current.querySelectorAll<FocusableElement>(selector)
      );

      // Filter out hidden or disabled elements
      return elements.filter((el) => {
        const style = window.getComputedStyle(el);
        const isVisible = style.display !== 'none' && style.visibility !== 'hidden';
        const isDisabled = el instanceof HTMLButtonElement && el.disabled;
        return isVisible && !isDisabled;
      });
    }, []);

    // Handle opening the modal: store trigger element and manage focus
    useEffect(() => {
      if (!isOpen) return;

      // Store the currently focused element (the trigger)
      triggerRef.current = document.activeElement as HTMLElement;

      // Get focusable elements
      const focusable = getFocusableElements();
      setFocusableElements(focusable);

      // Move focus to first focusable element, or the modal itself
      const firstFocusable = focusable[0];
      if (firstFocusable) {
        firstFocusable.focus();
      } else if (modalRef.current) {
        modalRef.current.focus();
      }

      // Prevent body scroll
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }, [isOpen, getFocusableElements]);

    // Handle Escape key and Tab key
    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          onClose();
          return;
        }

        if (event.key === 'Tab') {
          if (focusableElements.length === 0) {
            // No focusable elements, trap focus at the modal
            event.preventDefault();
            return;
          }

          const activeElement = document.activeElement;
          const currentIndex = focusableElements.indexOf(
            activeElement as FocusableElement
          );

          if (event.shiftKey) {
            // Shift+Tab - move to previous element
            event.preventDefault();
            const previousIndex =
              currentIndex <= 0 ? focusableElements.length - 1 : currentIndex - 1;
            focusableElements[previousIndex].focus();
          } else {
            // Tab - move to next element
            event.preventDefault();
            const nextIndex =
              currentIndex === -1 || currentIndex === focusableElements.length - 1
                ? 0
                : currentIndex + 1;
            focusableElements[nextIndex].focus();
          }
        }
      },
      [focusableElements, onClose]
    );

    // Handle overlay click
    const handleOverlayClick = useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      },
      [onClose]
    );

    // Handle closing: restore focus to trigger element
    useEffect(() => {
      if (isOpen) return;

      if (triggerRef.current) {
        triggerRef.current.focus();
      }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        onClick={handleOverlayClick}
        role="presentation"
      >
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onKeyDown={handleKeyDown}
          className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg focus:outline-none"
          tabIndex={-1}
        >
          {/* Close button for visual/keyboard access */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 inline-flex items-center justify-center h-8 w-8 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            aria-label="Close dialog"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <h2 id={titleId} className="text-2xl font-bold mb-4 pr-8">
            {title}
          </h2>

          {children}
        </div>
      </div>
    );
  }
);

Modal.displayName = 'Modal';

export default Modal;
