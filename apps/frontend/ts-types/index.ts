import { ReactNode } from "react";
import { NexusGenObjects } from "./nexus-typegen";

// kinda hacky but its works
export interface Model extends NexusGenObjects { }

export interface WithChildren {
    children: ReactNode
}