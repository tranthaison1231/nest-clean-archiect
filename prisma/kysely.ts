import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export const UserRole = {
    STUDENT: "STUDENT",
    INSTRUCTOR: "INSTRUCTOR"
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];
export type Answer = {
    id: string;
    content: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp | null;
    authorId: string;
    questionId: string;
};
export type Question = {
    id: string;
    title: string;
    slug: string;
    content: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp | null;
    authorId: string;
    bestAnswerId: string | null;
};
export type User = {
    id: string;
    name: string;
    email: string;
    password: string;
    role: Generated<UserRole>;
};
export type DB = {
    answers: Answer;
    questions: Question;
    users: User;
};
