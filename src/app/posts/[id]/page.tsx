import { supabase } from "@/lib/supabase";
import PostDetailClient from "./PostDetailClient";

// Revalidate every 60 seconds (ISR)
export const revalidate = 60;

type Props = {
  params: Promise<{ id: string }>
};

export default async function PostPage({ params }: Props) {
  const resolvedParams = await params;
  const rawId = resolvedParams.id as string;
  const uuidMatch = rawId ? rawId.match(/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/) : null;
  const id = uuidMatch ? uuidMatch[0] : null;

  let post = null;
  let trendingPosts = [];

  if (id) {
    // Fetch main post
    const { data: postData } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .single();
    
    if (postData) {
      post = postData;
    }

    // Fetch trending posts
    const { data: trendingData } = await supabase
      .from("posts")
      .select("*")
      .order("id", { ascending: false })
      .limit(4);
      
    if (trendingData) {
      trendingPosts = trendingData;
    }
  }

  return <PostDetailClient initialPost={post} initialTrending={trendingPosts} />;
}
