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
  category?: string
  readTime?: string
  featured?: boolean
}

// Expanded pseudo data for UI development
const pseudoPosts: Post[] = [
  {
    id: 1,
    title: "The Rise of Kenyan Afrofuturism",
    content: "How Nairobi artists are reimagining Africa's future through art and technology",
    created_at: "2023-05-15T00:00:00Z",
    comment_count: 12,
    tags: ["Culture", "Art", "Technology"],
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
    readTime: "6 min read",
    featured: true
  },
  {
    id: 3,
    title: "Nairobi's Thriving Coffee Culture",
    content: "Exploring the specialty coffee shops revolutionizing Kenya's coffee scene",
    created_at: "2023-06-10T00:00:00Z",
    comment_count: 15,
    tags: ["Food", "Culture"],
    category: "Food",
    readTime: "5 min read"
  },
  {
    id: 4,
    title: "Tech Startups in Silicon Savannah",
    content: "How Nairobi is becoming Africa's innovation hub with cutting-edge startups",
    created_at: "2023-05-22T00:00:00Z",
    comment_count: 20,
    tags: ["Technology", "Business"],
    category: "Technology",
    readTime: "7 min read"
  },
  {
    id: 5,
    title: "Traditional Music in Modern Kenya",
    content: "Young musicians preserving cultural heritage through contemporary sounds",
    created_at: "2023-06-05T00:00:00Z",
    comment_count: 9,
    tags: ["Music", "Culture"],
    category: "Music",
    readTime: "4 min read"
  },
  {
    id: 6,
    title: "Urban Farming in Nairobi",
    content: "How residents are transforming small spaces into productive gardens",
    created_at: "2023-05-30T00:00:00Z",
    comment_count: 11,
    tags: ["Sustainability", "Lifestyle"],
    category: "Lifestyle",
    readTime: "5 min read"
  },
  {
    id: 7,
    title: "The Future of Maasai Tourism",
    content: "Balancing cultural preservation with modern tourism demands",
    created_at: "2023-06-15T00:00:00Z",
    comment_count: 7,
    tags: ["Travel", "Culture"],
    category: "Travel",
    readTime: "6 min read"
  }
]

export default function Home() {
  const { data: apiResponse, isLoading, isError } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      try {
        const response = await api.get('/posts')
        return {
          posts: response.data.posts?.map((post: any) => ({
            ...post,
            category: post.tags?.[0] || 'General',
            readTime: `${Math.ceil(post.content.length / 500)} min read`,
            featured: post.id % 3 === 0 // Example featured logic
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

  const posts = apiResponse?.posts || pseudoPosts
  const featuredPosts = posts.filter(post => post.featured)
  const recentPosts = [...posts]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gray-100 py-12 px-4 mb-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-gray-900">Nairobi Narratives</h1>
          <p className="text-xl text-gray-600 mb-8">
            Where Nairobi's stories come to life. Discover, share, and connect with our community of writers.
          </p>
        </div>
      </section>

      {/* Featured Posts - Horizontal Scroll */}
      <section className="mb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Featured Stories</h2>
          <div className="relative">
            <div className="flex space-x-6 overflow-x-auto pb-6 scrollbar-hide">
              {featuredPosts.map((post) => (
                <div key={post.id} className="flex-shrink-0 w-80 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <Link href={`/posts/${post.id}`} className="block h-full">
                    <div className="p-6 h-full flex flex-col">
                      <span className="bg-black text-white px-3 py-1 text-xs rounded-full self-start mb-3">
                        {post.category || post.tags?.[0] || 'General'}
                      </span>
                      <h3 className="text-xl font-semibold mb-2 line-clamp-2">{post.title}</h3>
                      <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow">{post.content}</p>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 mb-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Latest Articles</h2>
          <Link
            href="/posts/create"
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            Create Post
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {posts
            .filter(post => !post.featured)
            .slice(0, 4)
            .map((post) => (
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

      {/* Recent Posts - Horizontal Scroll */}
      <section className="mb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Recent Stories</h2>
          <div className="relative">
            <div className="flex space-x-6 overflow-x-auto pb-6 scrollbar-hide">
              {recentPosts.map((post) => (
                <div key={post.id} className="flex-shrink-0 w-64 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <Link href={`/posts/${post.id}`} className="block h-full">
                    <div className="p-6 h-full flex flex-col">
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 text-xs rounded-full self-start mb-3">
                        {post.category || post.tags?.[0] || 'General'}
                      </span>
                      <h3 className="text-lg font-semibold mb-2 line-clamp-2">{post.title}</h3>
                      <div className="flex justify-between text-xs text-gray-500 mt-auto">
                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}