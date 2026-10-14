import { useState } from "react";
import { publicUrl } from "../lib/techniques";
import type { Technique } from "../types";
import "./TechniqueImage.css";

/** Картинка-пример. Если её нет в данных или файл не загрузился — рамка-заглушка 16:7. */
export default function TechniqueImage({ image }: { image: Technique["image"] }) {
  const [failed, setFailed] = useState(false);
  const showImage = image && !failed;

  return (
    <figure className="technique-image">
      {showImage ? (
        <img
          className="technique-image__img"
          src={publicUrl(image.src)}
          alt={image.alt}
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="technique-image__placeholder">Пример появится позже</div>
      )}
      {image?.caption && <figcaption className="technique-image__caption">{image.caption}</figcaption>}
    </figure>
  );
}
