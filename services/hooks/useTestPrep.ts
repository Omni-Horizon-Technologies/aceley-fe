"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTestPrepTrack, getReusableTestPrepMaterials, getTestPrepExams, getTestPrepTrack, getTestPrepTracks, startTestPrepPractice, toggleTestPrepTask } from "@/services/modules/test-prep";

export const testPrepExamsKey = ["test-prep", "exams"] as const;
export const testPrepTracksKey = ["test-prep", "tracks"] as const;
export const testPrepTrackKey = (id: string) => ["test-prep", "tracks", id] as const;
export const testPrepReusableKey = (params: { examId?: string; customSubject?: string }) => ["test-prep", "reusable", params.examId ?? `custom:${params.customSubject ?? ""}`] as const;

export const useTestPrepExams = () => useQuery({ queryKey: testPrepExamsKey, queryFn: getTestPrepExams, staleTime: 60 * 60 * 1000 });
export const useReusableTestPrepMaterials = (params: { examId?: string; customSubject?: string }) => useQuery({ queryKey: testPrepReusableKey(params), queryFn: () => getReusableTestPrepMaterials(params), enabled: Boolean(params.examId || params.customSubject) });
export function useCreateTestPrepTrack() {
  const client = useQueryClient();
  return useMutation({ mutationFn: createTestPrepTrack, onSuccess: (track) => { client.setQueryData(testPrepTrackKey(track.id), track); void client.invalidateQueries({ queryKey: testPrepTracksKey }); } });
}
export const useTestPrepTracks = () => useQuery({ queryKey: testPrepTracksKey, queryFn: getTestPrepTracks });
export const useTestPrepTrack = (id: string) => useQuery({ queryKey: testPrepTrackKey(id), queryFn: () => getTestPrepTrack(id), enabled: Boolean(id), staleTime: 30_000 });
export function useToggleTestPrepTask(trackId: string) {
  const client = useQueryClient();
  return useMutation({ mutationFn: (taskId: string) => toggleTestPrepTask(trackId, taskId), onSuccess: (track) => client.setQueryData(testPrepTrackKey(trackId), track) });
}
export const useStartTestPrepPractice = () => useMutation({ mutationFn: startTestPrepPractice });
