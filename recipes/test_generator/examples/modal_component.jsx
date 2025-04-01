import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import './Modal.css';

const Modal = ({
  isOpen,
  onClose,
  title,
  size = 'md',
  closeOnBackdropClick = true,
  closeOnEsc = true,
  hideCloseButton = false,
  children,
  headerContent,
  footerContent,
  className = '',
  testId = 'modal',
}) => {
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);
  
  // Trap focus within modal for accessibility
  const focusableElementsString = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled])';
  const handleTabKey = (e) => {
    if (!modalRef.current) return;
    
    const focusableElements = modalRef.current.querySelectorAll(focusableElementsString);
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];
    
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstFocusableElement) {
          lastFocusableElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusableElement) {
          firstFocusableElement.focus();
          e.preventDefault();
        }
      }
    }
  };
  
  // Handle ESC key
  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && closeOnEsc) {
      onClose();
    }
    
    handleTabKey(e);
  };
  
  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target) && closeOnBackdropClick) {
      onClose();
    }
  };
  
  // Set up event listeners and manage body scroll locking
  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element
      previousActiveElement.current = document.activeElement;
      
      // Add keyboard and click event listeners
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleBackdropClick);
      
      // Lock body scroll
      document.body.style.overflow = 'hidden';
      
      // Focus the first focusable element in the modal
      setTimeout(() => {
        const focusableElements = modalRef.current?.querySelectorAll(focusableElementsString);
        if (focusableElements && focusableElements.length > 0) {
          focusableElements[0].focus();
        } else {
          // If no focusable elements, focus the modal itself
          modalRef.current?.focus();
        }
      }, 0);
    }
    
    return () => {
      // Clean up event listeners
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleBackdropClick);
      
      // Restore body scroll when modal is closed
      if (isOpen) {
        document.body.style.overflow = '';
        
        // Return focus to previous element
        if (previousActiveElement.current) {
          previousActiveElement.current.focus();
        }
      }
    };
  }, [isOpen, closeOnBackdropClick, closeOnEsc]);
  
  // Return null if modal is not open
  if (!isOpen) return null;
  
  // Size class mapping
  const sizeClass = {
    sm: 'modal-small',
    md: 'modal-medium',
    lg: 'modal-large',
    full: 'modal-full',
  }[size] || 'modal-medium';
  
  const modalContent = (
    <div className="modal-backdrop" data-testid={`${testId}-backdrop`}>
      <div
        ref={modalRef}
        className={`modal ${sizeClass} ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? `${testId}-title` : undefined}
        tabIndex="-1"
        data-testid={testId}
      >
        <div className="modal-header">
          {headerContent || (
            <>
              {title && <h2 id={`${testId}-title`} className="modal-title">{title}</h2>}
              {!hideCloseButton && (
                <button
                  type="button"
                  className="modal-close-button"
                  aria-label="Close"
                  onClick={onClose}
                  data-testid={`${testId}-close-button`}
                >
                  ×
                </button>
              )}
            </>
          )}
        </div>
        
        <div className="modal-body" data-testid={`${testId}-body`}>
          {children}
        </div>
        
        {footerContent && (
          <div className="modal-footer" data-testid={`${testId}-footer`}>
            {footerContent}
          </div>
        )}
      </div>
    </div>
  );
  
  // Use portal to render modal outside the normal DOM hierarchy
  return ReactDOM.createPortal(
    modalContent,
    document.body
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.node,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'full']),
  closeOnBackdropClick: PropTypes.bool,
  closeOnEsc: PropTypes.bool,
  hideCloseButton: PropTypes.bool,
  children: PropTypes.node.isRequired,
  headerContent: PropTypes.node,
  footerContent: PropTypes.node,
  className: PropTypes.string,
  testId: PropTypes.string,
};

export default Modal;