import type { ObjectId } from "mongodb";

export type SkillStatus = "locked" | "available" | "completed";

export interface Position { x: number; y: number }

export interface Job {
  id: string;
  name: string;
  description: string;
  position: Position;
  themeColor: string;
}

export interface Skill {
  id: string;
  skillKey: string;
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
  characterVariant: 1 | 2;
  major?: string;
  age?: number;
  interest?: string;
  targetJobId: string;
  onboardingCompleted: boolean;
}

export interface UserDocument {
  _id?: ObjectId;
  email: string;
  passwordHash: string;
  nickname?: string;
  characterGender?: "male" | "female";
  characterVariant?: 1 | 2;
  major?: string;
  age?: number;
  interest?: string;
  targetJobId?: string;
  onboardingCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSkill {
  userId: string;
  skillId: string;
  unlockedAt: Date;
}
