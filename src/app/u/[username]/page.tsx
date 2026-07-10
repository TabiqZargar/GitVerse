import { PublicProfilePage } from "@/features/public-profile/components/public-profile-page";
import type { Metadata, NextPage } from "next";

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  return {
    title: `@${username} — GitVerse Profile`,
    openGraph: { title: `@${username} — GitVerse Profile` },
  };
}

const Page: NextPage<Props> = async ({ params }) => {
  const { username } = await params;
  return <PublicProfilePage username={username} />;
};

export default Page;
