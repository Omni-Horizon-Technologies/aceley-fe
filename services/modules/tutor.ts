import {apiClient} from "@/services/apiClient";import type{TutorMessage,TutorNote,TutorPage,TutorQuizStart,TutorSession,TutorUpload}from"@/services/dtos/tutor";
const root="/api/v1/tutor/sessions";
export const createTutorSession=(body:{subject?:string;title?:string})=>apiClient.post<TutorSession>(root,body);
export const getTutorSession=(id:string)=>apiClient.get<TutorSession>(`${root}/${id}`);
export const updateTutorSession=({id,title}:{id:string;title:string})=>apiClient.patch<TutorSession>(`${root}/${id}`,{title});
export const deleteTutorSession=(id:string)=>apiClient.delete<void>(`${root}/${id}`,{parseAs:"none"});
export const getTutorMessages=(id:string)=>apiClient.get<TutorPage<TutorMessage>>(`${root}/${id}/messages`);
export const sendTutorSessionMessage=({sessionId,text,attachmentIds}:{sessionId:string;text:string;attachmentIds?:string[]})=>apiClient.post<TutorMessage>(`${root}/${sessionId}/messages`,{text,attachment_ids:attachmentIds});
export const getTutorUploads=(id:string)=>apiClient.get<TutorPage<TutorUpload>>(`${root}/${id}/uploads`);
export async function uploadTutorFile(sessionId:string,file:File){const form=new FormData();form.append("file",file);return apiClient.post<TutorUpload>(`${root}/${sessionId}/uploads`,form);}
export const deleteTutorUpload=({sessionId,uploadId}:{sessionId:string;uploadId:string})=>apiClient.delete<void>(`${root}/${sessionId}/uploads/${uploadId}`,{parseAs:"none"});
export const getTutorNotes=(id:string)=>apiClient.get<TutorPage<TutorNote>>(`${root}/${id}/notes`);
export const createTutorNote=({sessionId,title,content}:{sessionId:string;title:string;content:string})=>apiClient.post<TutorNote>(`${root}/${sessionId}/notes`,{title,content});
export const deleteTutorNote=({sessionId,noteId}:{sessionId:string;noteId:string})=>apiClient.delete<void>(`${root}/${sessionId}/notes/${noteId}`,{parseAs:"none"});
export const startTutorQuiz=({sessionId,topic}:{sessionId:string;topic?:string})=>apiClient.post<TutorQuizStart>(`${root}/${sessionId}/quiz`,{topic:topic||undefined});
