import { AppLayout } from "@/app/components/app-layout";
import { PlanDetailPage } from "@/app/components/aceley-pages";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <AppLayout>
      <PlanDetailPage id={id} />
    </AppLayout>
  );
}
