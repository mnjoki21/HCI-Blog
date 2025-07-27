import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import Layout from '@/components/Layout'
import { api } from '@/lib/api'

type Post = {
  id: number
  title: string
  content: string
  created_at: string
  comment_count: number
  tags: string[]
  author?: string
  // Frontend-specific fields with fallbacks
  category?: string
  readTime?: string
  featured?: boolean
}

// Pseudo data for UI development
const pseudoPosts: Post[] = [
  {
    id: 1,
    title: "The Rise of Kenyan Afrofuturism",
    content: "How Nairobi artists are reimagining Africa's future through art and technology",
    created_at: "2023-05-15T00:00:00Z",
    comment_count: 12,
    tags: ["Culture", "Art"],
    category: "Culture",
    readTime: "4 min read",
    featured: true
  },
  {
    id: 2,
    title: "Sustainable Architecture in Mombasa",
    content: "Coastal designers blending Swahili traditions with eco-friendly materials",
    created_at: "2023-04-28T00:00:00Z",
    comment_count: 8,
    tags: ["Design", "Sustainability"],
    category: "Design",
    readTime: "6 min read"
  }
]

export default function Home() {
  const { data: apiResponse, isLoading, isError } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      try {
        const response = await api.get('/posts')
        // Transform API response to match frontend needs
        return {
          posts: response.data.posts?.map((post: any) => ({
            ...post,
            category: post.tags?.[0] || 'General',
            readTime: `${Math.ceil(post.content.length / 500)} min read`,
            featured: false // Or implement real featured logic
          })) || []
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.warn("API failed, using pseudo data")
          return { posts: pseudoPosts }
        }
        throw error
      }
    },
  })

  if (isLoading) return <Layout><div className="text-center py-8">Loading posts...</div></Layout>
  if (isError) return <Layout><div className="text-center py-8 text-red-500">Error loading posts</div></Layout>

  // Safely handle data with proper fallbacks
  const posts = apiResponse?.posts || pseudoPosts
  const featuredPost = posts.find(post => post.featured) || posts[0]

  return (
    <Layout>
      {/* Hero Section */}
      {featuredPost && (
        <section className="bg-gray-100 py-12 px-4 mb-8">
          <div className="max-w-4xl mx-auto">
            <span className="bg-black text-white px-3 py-1 text-sm rounded-full">
              {featuredPost.category || featuredPost.tags?.[0] || 'General'}
            </span>
            <h1 className="text-3xl font-bold mt-4 mb-2">
              <Link href={`/posts/${featuredPost.id}`} className="hover:underline">
                {featuredPost.title}
              </Link>
            </h1>
            <p className="text-gray-600 mb-4 line-clamp-2">{featuredPost.content}</p>
            <div className="flex items-center text-sm text-gray-500">
              <span>{new Date(featuredPost.created_at).toLocaleDateString()}</span>
              <span className="mx-2">•</span>
              <span>{featuredPost.readTime || `${Math.ceil(featuredPost.content.length / 500)} min read`}</span>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Latest Posts</h1>
          <Link
            href="/posts/create"
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            Create Post
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {posts
            ?.filter(post => !post.featured)
            ?.map((post) => (
              <div key={post.id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="flex flex-col h-full">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {(post.tags || []).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link href={`/posts/${post.id}`}>
                    <h2 className="text-xl font-semibold text-gray-800 hover:text-blue-600 mb-2">
                      {post.title}
                    </h2>
                  </Link>
                  <p className="text-gray-600 line-clamp-2 mb-4 flex-grow">{post.content}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                    <span>{post.comment_count} comments</span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </Layout>
  )
}