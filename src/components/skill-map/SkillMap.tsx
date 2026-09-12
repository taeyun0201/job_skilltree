"use client";

import { useState } from "react";
import { SKILLS } from "@/data/skill-map";
import type { Skill } from "@/types";
import { SkillDetail } from "./SkillDetail";

export function SkillMap() {
  const [selected, setSelected] = useState<Skill | null>(null);

  return (
    <div className="grid">
      <section className="card map">
        {SKILLS.map((skill) => (
          <button
            className={`node ${skill.status}`}
            key={skill.id}
            onClick={() => setSelected(skill)}
            style={{ left: skill.position.x, top: skill.position.y }}
          >
            {skill.name}
          </button>
        ))}
      </section>
      <SkillDetail skill={selected} />
    </div>
  );
}
