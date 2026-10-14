import { Link, useMatch } from "react-router-dom";
import { COURSE_LENGTH, getTechnique, techniques } from "../lib/techniques";
import ThemeToggle from "./ThemeToggle";
import "./Header.css";

export default function Header() {
  const match = useMatch("/technique/:id");
  const current = getTechnique(match?.params.id);

  return (
    <header className="container">
      <div className="header">
        <div className="header__title">
          <Link to={`/technique/${techniques[0].id}`} className="header__name">
            Мой визуальный язык
          </Link>
          {current && (
            <span className="header__counter">
              приём {current.order} / {COURSE_LENGTH}
            </span>
          )}
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
