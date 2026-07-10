import { ShareView } from "@/features/share/components/share-view";
import type { Metadata, NextPage } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Shared ${id.slice(0, 8)} — GitVerse`,
    openGraph: { title: `Shared content — GitVerse` },
  };
}

const Page: NextPage<Props> = async ({ params }) => {
  const { id } = await params;
  return <ShareView id={id} />;
};

export default Page;
