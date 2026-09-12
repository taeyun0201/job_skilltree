export type SkillStatus = "locked" | "available" | "completed";

export interface Position { x: number; y: number }

export interface Job {
  id: string;
  name: string;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  xp: number;
  jobIds: string[];
  prerequisiteIds: string[];
  position: Position;
  status: SkillStatus;
}

export interface UserProfile {
  userId: string;
  nickname: string;
  characterGender: "male" | "female";
  major?: string;
  age?: number;
  interest?: string;
  targetJobId: string;
  onboardingCompleted: boolean;
}

export interface UserSkill {
  userId: string;
  skillId: string;
  unlockedAt: Date;
}
