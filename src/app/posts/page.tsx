import { supabase } from "@/lib/supabase";
import PostsClient from "./PostsClient";

// ISR: Revalidate this page every 60 seconds
export const revalidate = 60;

export default async function PostsPage() {
  // Fetch initial posts on the server
  const { data: posts } = await supabase
    .from("posts")
    .select(`
      *,
      users:created_by_user_id (
        username
      )
    `)
    .order("id", { ascending: false });

  return <PostsClient initialPosts={posts || []} />;
}
