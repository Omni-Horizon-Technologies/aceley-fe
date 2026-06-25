import { AskResultPage } from "@/app/components/aceley-pages";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function stringParam(value: string | string[] | undefined, fallback = "") {
  return Array.isArray(value) ? value[0] ?? fallback : value ?? fallback;
}

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;

  return (
    <AskResultPage
      question={stringParam(params.question, "How do I solve this?")}
      subject={stringParam(params.subject, "Biology")}
    />
  );
}
