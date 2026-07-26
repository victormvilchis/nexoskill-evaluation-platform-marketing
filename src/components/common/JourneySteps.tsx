import type { JourneyStep } from '../../types/content';

interface JourneyStepsProps {
  items: JourneyStep[];
}

export function JourneySteps({ items }: JourneyStepsProps) {
  return (
    <div className="journey-list">
      {items.map((item) => (
        <article className="journey-item" key={item.number}>
          <span>{item.number}</span>
          <div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
