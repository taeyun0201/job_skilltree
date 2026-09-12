import { readFileSync } from "node:fs";

const source = readFileSync("src/data/skill-map.ts", "utf8");
const offsets = {
  frontend: [0, 0],
  fullstack: [500, 0],
  backend: [1000, 0],
  "data-analyst": [300, 700],
  "data-scientist": [1000, 700],
};
const careers = [
  ["frontend", 420, 400],
  ["fullstack", 1730, 360],
  ["backend", 3070, 400],
  ["data-analyst", 920, 2070],
  ["data-scientist", 2680, 2070],
];

const nodes = [...source.matchAll(/defineSkill\("([^"]+)", "([^"]+)".*?,\s*(-?\d+),\s*(-?\d+)\),$/gm)].map(
  ([, jobId, skillKey, x, y]) => ({
    id: `${jobId}:${skillKey}`,
    x: Number(x) + offsets[jobId][0],
    y: Number(y) + offsets[jobId][1],
  }),
);

const collisions = [];
for (let index = 0; index < nodes.length; index += 1) {
  for (let other = index + 1; other < nodes.length; other += 1) {
    if (Math.abs(nodes[index].x - nodes[other].x) < 164 && Math.abs(nodes[index].y - nodes[other].y) < 110) {
      collisions.push(`${nodes[index].id} <-> ${nodes[other].id}`);
    }
  }
}

for (const [jobId, x, y] of careers) {
  for (const node of nodes) {
    if (Math.abs(x - node.x) < 211 && Math.abs(y - node.y) < 120) {
      collisions.push(`${jobId} career card <-> ${node.id}`);
    }
  }
}

if (collisions.length > 0) {
  console.error(collisions.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Checked ${nodes.length} nodes and 5 career cards: no layout collisions.`);
}
