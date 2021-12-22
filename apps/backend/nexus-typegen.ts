/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */


import type { Context } from "./api/context"
import type { FieldAuthorizeResolver } from "nexus/dist/plugins/fieldAuthorizePlugin"
import type { core } from "nexus"
declare global {
  interface NexusGenCustomInputMethods<TypeName extends string> {
    /**
     * A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
     */
    DateTime<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void // "DateTime";
    /**
     * The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).
     */
    Json<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void // "JSONObject";
  }
}
declare global {
  interface NexusGenCustomOutputMethods<TypeName extends string> {
    /**
     * A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
     */
    DateTime<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "DateTime";
    /**
     * The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).
     */
    Json<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "JSONObject";
  }
}


declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
}

export interface NexusGenEnums {
  AccessType: "BRONZE" | "COUNSELOR" | "GOLD" | "HEADMASTER" | "HOMEROOM" | "PLUS" | "SCHOOLADMINISTRATOR" | "SILVER"
  AgendaAbsentTargetStatus: "ACCEPTED" | "PENDING" | "REJECTED"
  FileType: "AUDIO" | "EXCEL" | "IMAGE" | "PDF" | "VIDEO" | "WORD"
  MeetingContentType: "MEDIA" | "WHITEBOARD" | "YOUTUBE"
  PaymentMethod: "BALANCE" | "XENDIT"
  PostType: "ANNOUNCEMENT" | "NEWS"
  QuizDifficulty: "EASY" | "HARD" | "MEDIUM"
  Status: "ACTIVE" | "INACTIVE" | "SETTLED"
  Storage: "CLOUD" | "LOCAL"
  TransactionStatus: "FAILED" | "PENDING" | "SUCCESS"
  Visibility: "PRIVATE" | "PUBLIC" | "SELECT"
}

export interface NexusGenScalars {
  String: string
  Int: number
  Float: number
  Boolean: boolean
  ID: string
  DateTime: any
  JSONObject: any
}

export interface NexusGenObjects {
  Absent: { // root type
    content: string; // String!
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    description: string; // String!
    id: number; // Int!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
  Agenda: { // root type
    content: string; // String!
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    fromDate: NexusGenScalars['DateTime']; // DateTime!
    id: number; // Int!
    toDate: NexusGenScalars['DateTime']; // DateTime!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    uuid: string; // String!
  }
  Chat: { // root type
    content: string; // String!
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: number; // Int!
    type: string; // String!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
  City: { // root type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: number; // Int!
    name: string; // String!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
  Classroom: { // root type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: number; // Int!
    name: string; // String!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    userId: number; // Int!
  }
  Classtype: { // root type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: number; // Int!
    level: number; // Int!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
  Consultation: { // root type
    content: string; // String!
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: number; // Int!
    name: string; // String!
    status: NexusGenEnums['Status']; // Status!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
  CourseVideo: { // root type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    files: string[]; // [String!]!
    filesType: NexusGenEnums['FileType'][]; // [FileType!]!
    id: number; // Int!
    name: string; // String!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    views: number; // Int!
  }
  District: { // root type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: number; // Int!
    name: string; // String!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
  Exam: { // root type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    description?: string | null; // String
    hint?: string | null; // String
    id: number; // Int!
    name: string; // String!
    odd: boolean; // Boolean!
    showResult: boolean; // Boolean!
    shuffle: boolean; // Boolean!
    timeLimit: string; // String!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    yearEnd?: number | null; // Int
    yearStart?: number | null; // Int
  }
  Examplay: { // root type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    finishAt?: NexusGenScalars['DateTime'] | null; // DateTime
    grade: number; // Float!
    graded: boolean; // Boolean!
    id: number; // Int!
    lastActivity: NexusGenScalars['DateTime']; // DateTime!
    score: number; // Int!
    startAt: NexusGenScalars['DateTime']; // DateTime!
    timePassed: number; // Int!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
  Examsession: { // root type
    closeAt: NexusGenScalars['DateTime']; // DateTime!
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: number; // Int!
    name: string; // String!
    openAt: NexusGenScalars['DateTime']; // DateTime!
    token: string; // String!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
  Meeting: { // root type
    contentText?: string | null; // String
    contentType: NexusGenEnums['MeetingContentType']; // MeetingContentType!
    contentUrl?: string | null; // String
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    documents: string[]; // [String!]!
    filesTypes: string[]; // [String!]!
    finishAt?: NexusGenScalars['DateTime'] | null; // DateTime
    id: number; // Int!
    name: string; // String!
    startAt: NexusGenScalars['DateTime']; // DateTime!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    uuid: string; // String!
  }
  Notification: { // root type
    context: string; // String!
    contextContent: string; // String!
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: number; // Int!
    message: string; // String!
    pictureUrl: string; // String!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
  Post: { // root type
    content: string; // String!
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: number; // Int!
    pictureUrl: string; // String!
    title: string; // String!
    type: NexusGenEnums['PostType']; // PostType!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
  Province: { // root type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: number; // Int!
    name: string; // String!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
  Query: {};
  Question: { // root type
    answers: string[]; // [String!]!
    answersDocuments: string[]; // [String!]!
    answersTypes: string[]; // [String!]!
    correctAnswerIndex: number; // Int!
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    files: string[]; // [String!]!
    filesType: NexusGenEnums['FileType'][]; // [FileType!]!
    id: number; // Int!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    visibility: NexusGenEnums['Visibility']; // Visibility!
  }
  Quiz: { // root type
    coverUrl: string; // String!
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    difficulty: NexusGenEnums['QuizDifficulty']; // QuizDifficulty!
    id: number; // Int!
    name: string; // String!
    playedCount: number; // Int!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    visibility: NexusGenEnums['Visibility']; // Visibility!
  }
  Quizmatch: { // root type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    finishAt?: NexusGenScalars['DateTime'] | null; // DateTime
    id: number; // Int!
    password?: string | null; // String
    startAt?: NexusGenScalars['DateTime'] | null; // DateTime
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
  Quizplayer: { // root type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: number; // Int!
    score: number; // Int!
    streak: number; // Int!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
  Room: { // root type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: number; // Int!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
  School: { // root type
    address: string; // String!
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: number; // Int!
    name: string; // String!
    npsn: string; // String!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
  Subject: { // root type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    description?: string | null; // String
    id: number; // Int!
    name: string; // String!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
  Transaction: { // root type
    amount: number; // Float!
    content?: string | null; // String
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    description: string; // String!
    discount: number; // Float!
    extraContent?: string | null; // String
    id: number; // Int!
    paid: boolean; // Boolean!
    paymentMethod: NexusGenEnums['PaymentMethod']; // PaymentMethod!
    paymentUrl?: string | null; // String
    purchaseId?: number | null; // Int
    purchaseType?: string | null; // String
    status: NexusGenEnums['TransactionStatus']; // TransactionStatus!
    tax: number; // Float!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    uuid: string; // String!
  }
  Tutoring: { // root type
    address: string; // String!
    approved: boolean; // Boolean!
    finishAt: NexusGenScalars['DateTime']; // DateTime!
    id: number; // Int!
    notes: string; // String!
    rate: number; // Float!
    rejectedReason: string; // String!
    startAt: NexusGenScalars['DateTime']; // DateTime!
    status: NexusGenEnums['Status']; // Status!
  }
  User: { // root type
    address: string; // String!
    balance: number; // Float!
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    email: string; // String!
    id: number; // Int!
    name: string; // String!
    phone: string; // String!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    username: string; // String!
  }
  Voucher: { // root type
    code: string; // String!
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    expiredAt: NexusGenScalars['DateTime']; // DateTime!
    id: number; // Int!
    name: string; // String!
    percentage: number; // Float!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
  Withdraw: { // root type
    amount: number; // Float!
    content?: string | null; // String
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    extraContent?: string | null; // String
    id: number; // Int!
    paid: boolean; // Boolean!
    status: NexusGenEnums['TransactionStatus']; // TransactionStatus!
    tax: number; // Float!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    uuid: string; // String!
  }
}

export interface NexusGenInterfaces {
}

export interface NexusGenUnions {
}

export type NexusGenRootTypes = NexusGenObjects

export type NexusGenAllTypes = NexusGenRootTypes & NexusGenScalars & NexusGenEnums

export interface NexusGenFieldTypes {
  Absent: { // field return type
    content: string; // String!
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    description: string; // String!
    id: number; // Int!
    target: NexusGenRootTypes['User']; // User!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    user: NexusGenRootTypes['User']; // User!
  }
  Agenda: { // field return type
    content: string; // String!
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    exam: NexusGenRootTypes['Exam'][]; // [Exam!]!
    fromDate: NexusGenScalars['DateTime']; // DateTime!
    id: number; // Int!
    meetings: NexusGenRootTypes['Meeting'][]; // [Meeting!]!
    toDate: NexusGenScalars['DateTime']; // DateTime!
    tutoring: NexusGenRootTypes['Tutoring'] | null; // Tutoring
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    user: NexusGenRootTypes['User']; // User!
    uuid: string; // String!
  }
  Chat: { // field return type
    content: string; // String!
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    from: NexusGenRootTypes['User']; // User!
    id: number; // Int!
    room: NexusGenRootTypes['Room']; // Room!
    type: string; // String!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
  City: { // field return type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    districts: NexusGenRootTypes['District'][]; // [District!]!
    id: number; // Int!
    name: string; // String!
    province: NexusGenRootTypes['Province']; // Province!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
  Classroom: { // field return type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: number; // Int!
    name: string; // String!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    user: NexusGenRootTypes['User']; // User!
    userId: number; // Int!
  }
  Classtype: { // field return type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: number; // Int!
    level: number; // Int!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
  Consultation: { // field return type
    consultant: NexusGenRootTypes['User']; // User!
    content: string; // String!
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: number; // Int!
    name: string; // String!
    room: NexusGenRootTypes['Room']; // Room!
    status: NexusGenEnums['Status']; // Status!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    user: NexusGenRootTypes['User']; // User!
  }
  CourseVideo: { // field return type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    files: string[]; // [String!]!
    filesType: NexusGenEnums['FileType'][]; // [FileType!]!
    id: number; // Int!
    name: string; // String!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    views: number; // Int!
  }
  District: { // field return type
    city: NexusGenRootTypes['City']; // City!
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: number; // Int!
    name: string; // String!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
  Exam: { // field return type
    agenda: NexusGenRootTypes['Agenda']; // Agenda!
    classroom: NexusGenRootTypes['Classroom']; // Classroom!
    classtype: NexusGenRootTypes['Classtype'] | null; // Classtype
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    description: string | null; // String
    examplayers: NexusGenRootTypes['Examplay'][]; // [Examplay!]!
    examsessions: NexusGenRootTypes['Examsession'][]; // [Examsession!]!
    hint: string | null; // String
    id: number; // Int!
    name: string; // String!
    odd: boolean; // Boolean!
    questions: NexusGenRootTypes['Question'][]; // [Question!]!
    showResult: boolean; // Boolean!
    shuffle: boolean; // Boolean!
    subject: NexusGenRootTypes['Subject']; // Subject!
    supervisors: NexusGenRootTypes['User'][]; // [User!]!
    timeLimit: string; // String!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    yearEnd: number | null; // Int
    yearStart: number | null; // Int
  }
  Examplay: { // field return type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    finishAt: NexusGenScalars['DateTime'] | null; // DateTime
    grade: number; // Float!
    graded: boolean; // Boolean!
    id: number; // Int!
    lastActivity: NexusGenScalars['DateTime']; // DateTime!
    score: number; // Int!
    startAt: NexusGenScalars['DateTime']; // DateTime!
    timePassed: number; // Int!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    user: NexusGenRootTypes['User']; // User!
  }
  Examsession: { // field return type
    closeAt: NexusGenScalars['DateTime']; // DateTime!
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    exam: NexusGenRootTypes['Exam']; // Exam!
    examplayers: NexusGenRootTypes['Examplay'][]; // [Examplay!]!
    id: number; // Int!
    name: string; // String!
    openAt: NexusGenScalars['DateTime']; // DateTime!
    token: string; // String!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
  Meeting: { // field return type
    classroom: NexusGenRootTypes['Classroom']; // Classroom!
    contentText: string | null; // String
    contentType: NexusGenEnums['MeetingContentType']; // MeetingContentType!
    contentUrl: string | null; // String
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    documents: string[]; // [String!]!
    filesTypes: string[]; // [String!]!
    finishAt: NexusGenScalars['DateTime'] | null; // DateTime
    id: number; // Int!
    name: string; // String!
    room: NexusGenRootTypes['Room'][]; // [Room!]!
    startAt: NexusGenScalars['DateTime']; // DateTime!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    user: NexusGenRootTypes['User']; // User!
    uuid: string; // String!
  }
  Notification: { // field return type
    context: string; // String!
    contextContent: string; // String!
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: number; // Int!
    message: string; // String!
    pictureUrl: string; // String!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    user: NexusGenRootTypes['User']; // User!
  }
  Post: { // field return type
    content: string; // String!
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: number; // Int!
    pictureUrl: string; // String!
    school: NexusGenRootTypes['School'] | null; // School
    title: string; // String!
    type: NexusGenEnums['PostType']; // PostType!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    user: NexusGenRootTypes['User']; // User!
  }
  Province: { // field return type
    cities: NexusGenRootTypes['City'][]; // [City!]!
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: number; // Int!
    name: string; // String!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
  Query: { // field return type
    absents: Array<NexusGenRootTypes['Absent'] | null>; // [Absent]!
    agendas: Array<NexusGenRootTypes['Agenda'] | null>; // [Agenda]!
    chats: Array<NexusGenRootTypes['Chat'] | null>; // [Chat]!
    cities: Array<NexusGenRootTypes['City'] | null>; // [City]!
    classrooms: Array<NexusGenRootTypes['Classroom'] | null>; // [Classroom]!
    classtypes: Array<NexusGenRootTypes['Classtype'] | null>; // [Classtype]!
    consultation: Array<NexusGenRootTypes['Consultation'] | null>; // [Consultation]!
    districts: Array<NexusGenRootTypes['District'] | null>; // [District]!
    examplays: Array<NexusGenRootTypes['Examplay'] | null>; // [Examplay]!
    examssessions: Array<NexusGenRootTypes['Examsession'] | null>; // [Examsession]!
    meetings: Array<NexusGenRootTypes['Meeting'] | null>; // [Meeting]!
    notifications: Array<NexusGenRootTypes['Notification'] | null>; // [Notification]!
    posts: Array<NexusGenRootTypes['Post'] | null>; // [Post]!
    provinces: Array<NexusGenRootTypes['Province'] | null>; // [Province]!
    questions: Array<NexusGenRootTypes['Question'] | null>; // [Question]!
    quizes: Array<NexusGenRootTypes['Quiz'] | null>; // [Quiz]!
    quizmatches: Array<NexusGenRootTypes['Quizmatch'] | null>; // [Quizmatch]!
    quizplayers: Array<NexusGenRootTypes['Quizplayer'] | null>; // [Quizplayer]!
    rooms: Array<NexusGenRootTypes['Room'] | null>; // [Room]!
    schools: Array<NexusGenRootTypes['School'] | null>; // [School]!
    subjects: Array<NexusGenRootTypes['Subject'] | null>; // [Subject]!
    transactions: Array<NexusGenRootTypes['Transaction'] | null>; // [Transaction]!
    tutorings: Array<NexusGenRootTypes['Tutoring'] | null>; // [Tutoring]!
    users: Array<NexusGenRootTypes['User'] | null>; // [User]!
    vouchers: Array<NexusGenRootTypes['Voucher'] | null>; // [Voucher]!
    withdraws: Array<NexusGenRootTypes['Withdraw'] | null>; // [Withdraw]!
  }
  Question: { // field return type
    answers: string[]; // [String!]!
    answersDocuments: string[]; // [String!]!
    answersTypes: string[]; // [String!]!
    classtype: NexusGenRootTypes['Classtype']; // Classtype!
    correctAnswerIndex: number; // Int!
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    files: string[]; // [String!]!
    filesType: NexusGenEnums['FileType'][]; // [FileType!]!
    id: number; // Int!
    subject: NexusGenRootTypes['Subject']; // Subject!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    user: NexusGenRootTypes['User']; // User!
    visibility: NexusGenEnums['Visibility']; // Visibility!
  }
  Quiz: { // field return type
    coverUrl: string; // String!
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    difficulty: NexusGenEnums['QuizDifficulty']; // QuizDifficulty!
    id: number; // Int!
    name: string; // String!
    playedCount: number; // Int!
    questions: NexusGenRootTypes['Question'][]; // [Question!]!
    subject: NexusGenRootTypes['Subject']; // Subject!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    user: NexusGenRootTypes['User']; // User!
    visibility: NexusGenEnums['Visibility']; // Visibility!
  }
  Quizmatch: { // field return type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    finishAt: NexusGenScalars['DateTime'] | null; // DateTime
    id: number; // Int!
    password: string | null; // String
    quiz: NexusGenRootTypes['Quiz']; // Quiz!
    quizplayers: NexusGenRootTypes['Quizplayer'][]; // [Quizplayer!]!
    room: NexusGenRootTypes['Room']; // Room!
    startAt: NexusGenScalars['DateTime'] | null; // DateTime
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    user: NexusGenRootTypes['User']; // User!
  }
  Quizplayer: { // field return type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: number; // Int!
    quiz: NexusGenRootTypes['Quiz']; // Quiz!
    quizmatch: NexusGenRootTypes['Quizmatch']; // Quizmatch!
    score: number; // Int!
    streak: number; // Int!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    user: NexusGenRootTypes['User']; // User!
  }
  Room: { // field return type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: number; // Int!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    user: NexusGenRootTypes['User']; // User!
  }
  School: { // field return type
    address: string; // String!
    city: NexusGenRootTypes['City']; // City!
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    district: NexusGenRootTypes['District']; // District!
    id: number; // Int!
    name: string; // String!
    npsn: string; // String!
    province: NexusGenRootTypes['Province']; // Province!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
  Subject: { // field return type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    description: string | null; // String
    id: number; // Int!
    name: string; // String!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
  Transaction: { // field return type
    amount: number; // Float!
    content: string | null; // String
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    description: string; // String!
    discount: number; // Float!
    extraContent: string | null; // String
    id: number; // Int!
    paid: boolean; // Boolean!
    paymentMethod: NexusGenEnums['PaymentMethod']; // PaymentMethod!
    paymentUrl: string | null; // String
    purchaseId: number | null; // Int
    purchaseType: string | null; // String
    status: NexusGenEnums['TransactionStatus']; // TransactionStatus!
    target: NexusGenRootTypes['User']; // User!
    tax: number; // Float!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    user: NexusGenRootTypes['User']; // User!
    uuid: string; // String!
    voucher: NexusGenRootTypes['Voucher']; // Voucher!
  }
  Tutoring: { // field return type
    address: string; // String!
    approved: boolean; // Boolean!
    finishAt: NexusGenScalars['DateTime']; // DateTime!
    id: number; // Int!
    notes: string; // String!
    rate: number; // Float!
    rejectedReason: string; // String!
    room: NexusGenRootTypes['Room'] | null; // Room
    startAt: NexusGenScalars['DateTime']; // DateTime!
    status: NexusGenEnums['Status']; // Status!
    teacher: NexusGenRootTypes['User']; // User!
    user: NexusGenRootTypes['User']; // User!
  }
  User: { // field return type
    address: string; // String!
    balance: number; // Float!
    city: NexusGenRootTypes['City']; // City!
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    district: NexusGenRootTypes['District']; // District!
    email: string; // String!
    id: number; // Int!
    name: string; // String!
    phone: string; // String!
    province: NexusGenRootTypes['Province']; // Province!
    school: NexusGenRootTypes['School'] | null; // School
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    username: string; // String!
  }
  Voucher: { // field return type
    code: string; // String!
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    expiredAt: NexusGenScalars['DateTime']; // DateTime!
    id: number; // Int!
    name: string; // String!
    percentage: number; // Float!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
  Withdraw: { // field return type
    amount: number; // Float!
    content: string | null; // String
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    extraContent: string | null; // String
    id: number; // Int!
    paid: boolean; // Boolean!
    status: NexusGenEnums['TransactionStatus']; // TransactionStatus!
    tax: number; // Float!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    user: NexusGenRootTypes['User']; // User!
    uuid: string; // String!
  }
}

export interface NexusGenFieldTypeNames {
  Absent: { // field return type name
    content: 'String'
    createdAt: 'DateTime'
    description: 'String'
    id: 'Int'
    target: 'User'
    updatedAt: 'DateTime'
    user: 'User'
  }
  Agenda: { // field return type name
    content: 'String'
    createdAt: 'DateTime'
    exam: 'Exam'
    fromDate: 'DateTime'
    id: 'Int'
    meetings: 'Meeting'
    toDate: 'DateTime'
    tutoring: 'Tutoring'
    updatedAt: 'DateTime'
    user: 'User'
    uuid: 'String'
  }
  Chat: { // field return type name
    content: 'String'
    createdAt: 'DateTime'
    from: 'User'
    id: 'Int'
    room: 'Room'
    type: 'String'
    updatedAt: 'DateTime'
  }
  City: { // field return type name
    createdAt: 'DateTime'
    districts: 'District'
    id: 'Int'
    name: 'String'
    province: 'Province'
    updatedAt: 'DateTime'
  }
  Classroom: { // field return type name
    createdAt: 'DateTime'
    id: 'Int'
    name: 'String'
    updatedAt: 'DateTime'
    user: 'User'
    userId: 'Int'
  }
  Classtype: { // field return type name
    createdAt: 'DateTime'
    id: 'Int'
    level: 'Int'
    updatedAt: 'DateTime'
  }
  Consultation: { // field return type name
    consultant: 'User'
    content: 'String'
    createdAt: 'DateTime'
    id: 'Int'
    name: 'String'
    room: 'Room'
    status: 'Status'
    updatedAt: 'DateTime'
    user: 'User'
  }
  CourseVideo: { // field return type name
    createdAt: 'DateTime'
    files: 'String'
    filesType: 'FileType'
    id: 'Int'
    name: 'String'
    updatedAt: 'DateTime'
    views: 'Int'
  }
  District: { // field return type name
    city: 'City'
    createdAt: 'DateTime'
    id: 'Int'
    name: 'String'
    updatedAt: 'DateTime'
  }
  Exam: { // field return type name
    agenda: 'Agenda'
    classroom: 'Classroom'
    classtype: 'Classtype'
    createdAt: 'DateTime'
    description: 'String'
    examplayers: 'Examplay'
    examsessions: 'Examsession'
    hint: 'String'
    id: 'Int'
    name: 'String'
    odd: 'Boolean'
    questions: 'Question'
    showResult: 'Boolean'
    shuffle: 'Boolean'
    subject: 'Subject'
    supervisors: 'User'
    timeLimit: 'String'
    updatedAt: 'DateTime'
    yearEnd: 'Int'
    yearStart: 'Int'
  }
  Examplay: { // field return type name
    createdAt: 'DateTime'
    finishAt: 'DateTime'
    grade: 'Float'
    graded: 'Boolean'
    id: 'Int'
    lastActivity: 'DateTime'
    score: 'Int'
    startAt: 'DateTime'
    timePassed: 'Int'
    updatedAt: 'DateTime'
    user: 'User'
  }
  Examsession: { // field return type name
    closeAt: 'DateTime'
    createdAt: 'DateTime'
    exam: 'Exam'
    examplayers: 'Examplay'
    id: 'Int'
    name: 'String'
    openAt: 'DateTime'
    token: 'String'
    updatedAt: 'DateTime'
  }
  Meeting: { // field return type name
    classroom: 'Classroom'
    contentText: 'String'
    contentType: 'MeetingContentType'
    contentUrl: 'String'
    createdAt: 'DateTime'
    documents: 'String'
    filesTypes: 'String'
    finishAt: 'DateTime'
    id: 'Int'
    name: 'String'
    room: 'Room'
    startAt: 'DateTime'
    updatedAt: 'DateTime'
    user: 'User'
    uuid: 'String'
  }
  Notification: { // field return type name
    context: 'String'
    contextContent: 'String'
    createdAt: 'DateTime'
    id: 'Int'
    message: 'String'
    pictureUrl: 'String'
    updatedAt: 'DateTime'
    user: 'User'
  }
  Post: { // field return type name
    content: 'String'
    createdAt: 'DateTime'
    id: 'Int'
    pictureUrl: 'String'
    school: 'School'
    title: 'String'
    type: 'PostType'
    updatedAt: 'DateTime'
    user: 'User'
  }
  Province: { // field return type name
    cities: 'City'
    createdAt: 'DateTime'
    id: 'Int'
    name: 'String'
    updatedAt: 'DateTime'
  }
  Query: { // field return type name
    absents: 'Absent'
    agendas: 'Agenda'
    chats: 'Chat'
    cities: 'City'
    classrooms: 'Classroom'
    classtypes: 'Classtype'
    consultation: 'Consultation'
    districts: 'District'
    examplays: 'Examplay'
    examssessions: 'Examsession'
    meetings: 'Meeting'
    notifications: 'Notification'
    posts: 'Post'
    provinces: 'Province'
    questions: 'Question'
    quizes: 'Quiz'
    quizmatches: 'Quizmatch'
    quizplayers: 'Quizplayer'
    rooms: 'Room'
    schools: 'School'
    subjects: 'Subject'
    transactions: 'Transaction'
    tutorings: 'Tutoring'
    users: 'User'
    vouchers: 'Voucher'
    withdraws: 'Withdraw'
  }
  Question: { // field return type name
    answers: 'String'
    answersDocuments: 'String'
    answersTypes: 'String'
    classtype: 'Classtype'
    correctAnswerIndex: 'Int'
    createdAt: 'DateTime'
    files: 'String'
    filesType: 'FileType'
    id: 'Int'
    subject: 'Subject'
    updatedAt: 'DateTime'
    user: 'User'
    visibility: 'Visibility'
  }
  Quiz: { // field return type name
    coverUrl: 'String'
    createdAt: 'DateTime'
    difficulty: 'QuizDifficulty'
    id: 'Int'
    name: 'String'
    playedCount: 'Int'
    questions: 'Question'
    subject: 'Subject'
    updatedAt: 'DateTime'
    user: 'User'
    visibility: 'Visibility'
  }
  Quizmatch: { // field return type name
    createdAt: 'DateTime'
    finishAt: 'DateTime'
    id: 'Int'
    password: 'String'
    quiz: 'Quiz'
    quizplayers: 'Quizplayer'
    room: 'Room'
    startAt: 'DateTime'
    updatedAt: 'DateTime'
    user: 'User'
  }
  Quizplayer: { // field return type name
    createdAt: 'DateTime'
    id: 'Int'
    quiz: 'Quiz'
    quizmatch: 'Quizmatch'
    score: 'Int'
    streak: 'Int'
    updatedAt: 'DateTime'
    user: 'User'
  }
  Room: { // field return type name
    createdAt: 'DateTime'
    id: 'Int'
    updatedAt: 'DateTime'
    user: 'User'
  }
  School: { // field return type name
    address: 'String'
    city: 'City'
    createdAt: 'DateTime'
    district: 'District'
    id: 'Int'
    name: 'String'
    npsn: 'String'
    province: 'Province'
    updatedAt: 'DateTime'
  }
  Subject: { // field return type name
    createdAt: 'DateTime'
    description: 'String'
    id: 'Int'
    name: 'String'
    updatedAt: 'DateTime'
  }
  Transaction: { // field return type name
    amount: 'Float'
    content: 'String'
    createdAt: 'DateTime'
    description: 'String'
    discount: 'Float'
    extraContent: 'String'
    id: 'Int'
    paid: 'Boolean'
    paymentMethod: 'PaymentMethod'
    paymentUrl: 'String'
    purchaseId: 'Int'
    purchaseType: 'String'
    status: 'TransactionStatus'
    target: 'User'
    tax: 'Float'
    updatedAt: 'DateTime'
    user: 'User'
    uuid: 'String'
    voucher: 'Voucher'
  }
  Tutoring: { // field return type name
    address: 'String'
    approved: 'Boolean'
    finishAt: 'DateTime'
    id: 'Int'
    notes: 'String'
    rate: 'Float'
    rejectedReason: 'String'
    room: 'Room'
    startAt: 'DateTime'
    status: 'Status'
    teacher: 'User'
    user: 'User'
  }
  User: { // field return type name
    address: 'String'
    balance: 'Float'
    city: 'City'
    createdAt: 'DateTime'
    district: 'District'
    email: 'String'
    id: 'Int'
    name: 'String'
    phone: 'String'
    province: 'Province'
    school: 'School'
    updatedAt: 'DateTime'
    username: 'String'
  }
  Voucher: { // field return type name
    code: 'String'
    createdAt: 'DateTime'
    expiredAt: 'DateTime'
    id: 'Int'
    name: 'String'
    percentage: 'Float'
    updatedAt: 'DateTime'
  }
  Withdraw: { // field return type name
    amount: 'Float'
    content: 'String'
    createdAt: 'DateTime'
    extraContent: 'String'
    id: 'Int'
    paid: 'Boolean'
    status: 'TransactionStatus'
    tax: 'Float'
    updatedAt: 'DateTime'
    user: 'User'
    uuid: 'String'
  }
}

export interface NexusGenArgTypes {
}

export interface NexusGenAbstractTypeMembers {
}

export interface NexusGenTypeInterfaces {
}

export type NexusGenObjectNames = keyof NexusGenObjects;

export type NexusGenInputNames = never;

export type NexusGenEnumNames = keyof NexusGenEnums;

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = keyof NexusGenScalars;

export type NexusGenUnionNames = never;

export type NexusGenObjectsUsingAbstractStrategyIsTypeOf = never;

export type NexusGenAbstractsUsingStrategyResolveType = never;

export type NexusGenFeaturesConfig = {
  abstractTypeStrategies: {
    isTypeOf: false
    resolveType: true
    __typename: false
  }
}

export interface NexusGenTypes {
  context: Context;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  inputTypeShapes: NexusGenInputs & NexusGenEnums & NexusGenScalars;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  fieldTypeNames: NexusGenFieldTypeNames;
  allTypes: NexusGenAllTypes;
  typeInterfaces: NexusGenTypeInterfaces;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractTypeMembers: NexusGenAbstractTypeMembers;
  objectsUsingAbstractStrategyIsTypeOf: NexusGenObjectsUsingAbstractStrategyIsTypeOf;
  abstractsUsingStrategyResolveType: NexusGenAbstractsUsingStrategyResolveType;
  features: NexusGenFeaturesConfig;
}


declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginInputTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
    /**
     * Authorization for an individual field. Returning "true"
     * or "Promise<true>" means the field can be accessed.
     * Returning "false" or "Promise<false>" will respond
     * with a "Not Authorized" error for the field.
     * Returning or throwing an error will also prevent the
     * resolver from executing.
     */
    authorize?: FieldAuthorizeResolver<TypeName, FieldName>
  }
  interface NexusGenPluginInputFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginSchemaConfig {
  }
  interface NexusGenPluginArgConfig {
  }
}