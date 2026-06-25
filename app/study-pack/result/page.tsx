import { StudyPackResultPage } from "@/app/components/aceley-pages";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function stringParam(value: string | string[] | undefined, fallback = "") {
  return Array.isArray(value) ? value[0] ?? fallback : value ?? fallback;
}

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;

  return <StudyPackResultPage source={stringParam(params.source, "Cell biology notes")} />;
}
