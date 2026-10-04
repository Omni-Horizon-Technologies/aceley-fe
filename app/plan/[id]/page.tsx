import { AppLayout } from "@/app/components/app-layout";
import { PlanDetailView } from "@/app/components/plan-detail-view";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <AppLayout>
      <PlanDetailView id={id} />
    </AppLayout>
  );
}
