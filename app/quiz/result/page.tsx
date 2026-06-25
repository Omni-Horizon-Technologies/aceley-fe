import { QuizResultPage } from "@/app/components/aceley-pages";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function stringParam(value: string | string[] | undefined, fallback = "") {
  return Array.isArray(value) ? value[0] ?? fallback : value ?? fallback;
}

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const score = Number(stringParam(params.score, "0"));
  const total = Number(stringParam(params.total, "5"));

  return (
    <QuizResultPage
      score={Number.isFinite(score) ? score : 0}
      title={stringParam(params.title, "Cell Biology Check")}
      total={Number.isFinite(total) ? total : 5}
    />
  );
}
