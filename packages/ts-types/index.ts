import { NexusGenObjects, NexusGenEnums } from "./nexus-typegen";

// kinda hacky but its works
export interface Model extends NexusGenObjects {}
export interface Enum extends NexusGenEnums {}
