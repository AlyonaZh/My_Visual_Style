import { useParams } from "react-router-dom";
import PromptCard from "../components/PromptCard";
import RatingForm from "../components/RatingForm";
import Section from "../components/Section";
import TechniqueImage from "../components/TechniqueImage";
import { useProgress } from "../lib/progress";
import { AXIS_LABELS, getTechnique } from "../lib/techniques";
import NotFound from "./NotFound";
import "./TechniquePage.css";

export default function TechniquePage() {
  const { id } = useParams();
  const technique = getTechnique(id);
  const { progress, resetCount, save } = useProgress();

  if (!technique) return <NotFound />;

  return (
    <article className="technique">
      <header className="technique__intro">
        <p className="technique__axis">
          <span className="technique__axis-dot" style={{ background: `var(--axis-${technique.axis})` }} aria-hidden="true" />
          {AXIS_LABELS[technique.axis]}
        </p>
        <h1 className="technique__title">{technique.title}</h1>
        <p className="technique__summary">{technique.summary}</p>
        <p className="technique__history">{technique.history}</p>
      </header>

      <div className="technique__example">
        <TechniqueImage key={technique.id} image={technique.image} />
      </div>

      <Section label={`Задание · ${technique.duration}`}>
        <p className="technique__task">{technique.task}</p>
        <ul className="technique__tips">
          {technique.tips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </Section>

      <Section label="У кого посмотреть">
        <ul className="technique__artists">
          {technique.artists.map((artist) => (
            <li key={artist.name}>
              <span className="technique__artist-name">{artist.name}</span>
              <span className="technique__artist-note">{artist.note}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section label="Быстрее с нейросетью">
        <p className="technique__prompt-intro">{technique.promptIntro}</p>
        <div className="technique__prompts">
          <PromptCard
            language="English"
            lang="en"
            text={technique.prompt.en}
            copyLabel="Скопировать промт на английском"
          />
          <PromptCard
            language="Русский"
            lang="ru"
            text={technique.prompt.ru}
            copyLabel="Скопировать промт на русском"
          />
        </div>
        <p className="technique__prompt-note">{technique.promptNote}</p>
      </Section>

      <Section label="Твоя оценка" variant="strong">
        <RatingForm
          key={`${technique.id}:${resetCount}`}
          entry={progress.entries[technique.id]}
          onSave={(rating, note) => save(technique.id, rating, note)}
        />
      </Section>
    </article>
  );
}
