import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import TechniquePage from "./pages/TechniquePage";
import NotFound from "./pages/NotFound";
import { useProgress } from "./lib/progress";
import { techniques } from "./lib/techniques";

/** «/» ведёт на первый приём без оценки, а если оценены все — на первый приём. */
function StartRedirect() {
  const { progress } = useProgress();
  const next = techniques.find((t) => !progress.entries[t.id]) ?? techniques[0];
  return <Navigate to={`/technique/${next.id}`} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<StartRedirect />} />
        <Route path="technique/:id" element={<TechniquePage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
