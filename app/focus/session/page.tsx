import { FocusSessionPage } from "@/app/components/aceley-pages";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function stringParam(value: string | string[] | undefined, fallback = "") {
  return Array.isArray(value) ? value[0] ?? fallback : value ?? fallback;
}

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const minutes = Number(stringParam(params.minutes, "25"));

  return (
    <FocusSessionPage
      audio={stringParam(params.audio, "Silence")}
      minutes={Number.isFinite(minutes) ? minutes : 25}
      preset={stringParam(params.preset, "Pomodoro")}
    />
  );
}
