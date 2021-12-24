import { DateTimeResolver, JSONObjectResolver, } from 'graphql-scalars'
import { GraphQLUpload } from 'graphql-upload';
import { asNexusMethod, enumType } from 'nexus';
import {
    AccessType as AccessTypeEnum,
    TransactionStatus as TransactionStatusEnum,
    PaymentMethod as PaymentMethodEnum,
    PostType as PostTypeEnum,
    QuizDifficulty as QuizDifficultyEnum,
    Visibility as VisibilityEnum,
    Status as StatusEnum,
    AgendaAbsentTargetStatus as AgendaAbsentTargetStatusEnum,
    MeetingContentType as MeetingContentTypeEnum,
    Storage as StorageEnum,
    FileType as FileTypeEnum,
    Roles as RolesEnum
} from 'nexus-prisma';

export const Roles = enumType(RolesEnum);
export const AccessType = enumType(AccessTypeEnum);
export const TransactionStatus = enumType(TransactionStatusEnum);
export const PaymentMethod = enumType(PaymentMethodEnum);
export const PostType = enumType(PostTypeEnum);
export const QuizDifficulty = enumType(QuizDifficultyEnum);
export const Visibility = enumType(VisibilityEnum);
export const Status = enumType(StatusEnum);
export const AgendaAbsentTargetStatus = enumType(AgendaAbsentTargetStatusEnum);
export const MeetingContentType = enumType(MeetingContentTypeEnum);
export const Storage = enumType(StorageEnum);
export const FileType = enumType(FileTypeEnum);

export const DateTime = asNexusMethod(DateTimeResolver, 'DateTime');
export const Json = asNexusMethod(JSONObjectResolver, 'Json');

export const Upload = GraphQLUpload

export * from "./User";
export * from "./City";
export * from "./Province";
export * from "./Classroom";
export * from "./School";
export * from "./Subject";
export * from "./Classtype";
export * from "./CourseVideo";
export * from "./Voucher";
export * from "./Transaction";
export * from "./Room";
export * from "./Withdraw";
export * from "./Chat";
export * from "./Notification";
export * from "./Post";
export * from "./Question";
export * from "./Quiz";
export * from "./Quizmatch";
export * from "./Quizplayer";
export * from "./Consultation";
export * from "./Exam";
export * from "./Absent";
export * from "./Agenda";
export * from "./Tutoring";
export * from "./Examsession";
export * from "./Examplay";
export * from "./Meeting";
export * from "./Report";
export * from "./Assigment";
export * from "./AssigmentSubmission";
export * from "./FileData";
export * from "./Packagequestion";
