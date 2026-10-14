import { Link } from "react-router-dom";
import { techniques } from "../lib/techniques";
import "./NotFound.css";

export default function NotFound() {
  const first = techniques[0];

  return (
    <section className="not-found">
      <h1 className="not-found__title">Такого приёма нет</h1>
      <p className="not-found__text">
        Возможно, ссылка устарела. Начни с первого приёма —{" "}
        <Link to={`/technique/${first.id}`}>«{first.title}»</Link>.
      </p>
    </section>
  );
}
