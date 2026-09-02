"use client";
import { Suspense } from "react";
import { AppLayout } from "@/app/components/app-layout";
import { AskSession } from "@/app/components/ask-pages";
export default function Page(){return <AppLayout><Suspense fallback={<div className="h-[70vh] animate-pulse rounded-3xl bg-slate-200"/>}><AskSession/></Suspense></AppLayout>;}
