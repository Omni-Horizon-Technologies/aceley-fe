import type { Page } from "./ask";
export type TutorSession={session_id:string;subject?:string;title?:string;created_at:string;updated_at:string};
export type TutorMessage={id:string;session_id:string;role:"user"|"tutor";text:string;level:"simple"|"detailed";created_at:string};
export type TutorUpload={id:string;session_id:string;file_url:string;file_name:string;created_at:string};
export type TutorNote={id:string;session_id:string;title:string;content:string;created_at:string};
export type TutorQuizStart={quiz_id:string;attempt_id:string};
export type TutorPage<T>=Page<T>;
