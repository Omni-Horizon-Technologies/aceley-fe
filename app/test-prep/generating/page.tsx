"use client";
import { Suspense } from "react";
import { AppLayout } from "@/app/components/app-layout";
import { TestPrepGenerating } from "@/app/components/test-prep-pages";
export default function Page(){return <AppLayout><Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-slate-200"/>}><TestPrepGenerating/></Suspense></AppLayout>;}
