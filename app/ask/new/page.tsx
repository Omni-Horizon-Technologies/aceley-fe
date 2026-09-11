"use client";
import { Suspense } from "react";
import { AppLayout } from "@/app/components/app-layout";
import { AskNewDocument } from "@/app/components/ask-pages";
export default function Page(){return <AppLayout><Suspense fallback={<div className="h-80 animate-pulse rounded-3xl bg-slate-200"/>}><AskNewDocument/></Suspense></AppLayout>;}
