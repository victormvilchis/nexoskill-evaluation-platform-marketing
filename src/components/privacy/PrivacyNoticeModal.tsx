import { useEffect, useId, useRef, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '../common/Icon';
import { PrivacyNoticeContent } from './PrivacyNoticeContent';

interface PrivacyNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  returnFocusRef?: RefObject<HTMLButtonElement | null>;
}

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export function PrivacyNoticeModal({ isOpen, onClose, returnFocusRef }: PrivacyNoticeModalProps) {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const previousActiveElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key !== 'Tab' || !dialogRef.current) return;

      const focusableElements = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(focusableSelector))
        .filter((element) => !element.hasAttribute('hidden') && element.getAttribute('aria-hidden') !== 'true');

      if (focusableElements.length === 0) {
        event.preventDefault();
        dialogRef.current.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      window.requestAnimationFrame(() => {
        const returnTarget = returnFocusRef?.current || previousActiveElement;
        returnTarget?.focus({ preventScroll: true });
      });
    };
  }, [isOpen, returnFocusRef]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="privacy-modal-layer"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCloseRef.current();
      }}
    >
      <div
        aria-describedby={descriptionId}
        aria-labelledby={titleId}
        aria-modal="true"
        className="privacy-modal"
        ref={dialogRef}
        role="dialog"
        tabIndex={-1}
      >
        <header className="privacy-modal__header">
          <div>
            <span className="privacy-modal__eyebrow">Privacidad</span>
            <h2 id={titleId}>Aviso de privacidad</h2>
            <p id={descriptionId}>Revisa cómo Valtieris utilizará la información de esta solicitud sin abandonar el formulario.</p>
          </div>
          <button
            aria-label="Cerrar aviso de privacidad"
            className="privacy-modal__close"
            onClick={() => onCloseRef.current()}
            ref={closeButtonRef}
            type="button"
          >
            <Icon name="close" size={22} />
          </button>
        </header>

        <div className="privacy-modal__body" role="document">
          <PrivacyNoticeContent context="modal" />
        </div>

        <footer className="privacy-modal__footer">
          <p><Icon name="lock" size={16} /> Cerrar este aviso no modifica ni elimina los datos capturados.</p>
          <button className="button button--primary" onClick={() => onCloseRef.current()} type="button">
            Cerrar y continuar con el formulario
          </button>
        </footer>
      </div>
    </div>,
    document.body,
  );
}
