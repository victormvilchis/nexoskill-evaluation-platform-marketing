import { useState } from 'react';
import type { FaqItem } from '../../types/content';

interface FaqAccordionProps {
  items: FaqItem[];
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="faq-list">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const contentId = `faq-answer-${index}`;

        return (
          <article className={`faq-item ${isOpen ? 'faq-item--open' : ''}`} key={item.question}>
            <h3>
              <button
                aria-controls={contentId}
                aria-expanded={isOpen}
                className="faq-item__question"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                type="button"
              >
                <span>{item.question}</span>
                <span className="faq-item__indicator" aria-hidden="true">{isOpen ? '−' : '+'}</span>
              </button>
            </h3>
            <div className="faq-item__answer" id={contentId} hidden={!isOpen}>
              <p>{item.answer}</p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
