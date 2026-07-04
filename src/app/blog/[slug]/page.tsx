import { BlogPostView } from "@/components/modules/blog-post";

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  return <BlogPostView slug={params.slug} />;
}
