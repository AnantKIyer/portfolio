import { BlogList } from "@/components/modules/blog-list";

export const metadata = {
  title: "Blog",
  description: "Notes and essays on engineering, design, and building products.",
};

export default function BlogPage() {
  return <BlogList />;
}
