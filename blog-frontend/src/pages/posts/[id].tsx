import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import { api } from '@/lib/api'

type Post = {
  id: number
  title: string
  content: string
  created_at: string
  comment_count: number
  tags: string[]
  author?: {
    name: string
    avatar?: string
  }
}

export default function PostDetail() {
  const router = useRouter()
  const { id } = router.query

  const { data: post, isLoading, isError } = useQuery<Post>({
    queryKey: ['post', id],
    queryFn: async () => {
      const response = await api.get(`/posts/${id}`)
      return response.data
    },
    enabled: !!id
  })

  if (isLoading) return <Layout><div className="text-center py-12">Loading post...</div></Layout>
  if (isError) return <Layout><div className="text-center py-12 text-red-500">Error loading post</div></Layout>

  return (
    <Layout>
      <article className="max-w-3xl mx-auto px-4 py-8">
        {/* Post Header */}
        <header className="mb-10">
          <div className="flex flex-wrap gap-2 mb-4">
            {post?.tags.map(tag => (
              <span 
                key={tag} 
                className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {post?.title}
          </h1>
          
          <div className="flex items-center space-x-4">
            {post?.author && (
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                  {post.author.avatar ? (
                    <img 
                      src={post.author.avatar} 
                      alt={post.author.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-600 text-lg">
                      {post.author.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <span className="ml-3 font-medium text-gray-700">
                  {post.author.name}
                </span>
              </div>
            )}
            <span className="text-gray-500">
              {post && new Date(post.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
            <span className="text-gray-500">
              • {post && Math.ceil(post.content.length / 500)} min read
            </span>
          </div>
        </header>

        {/* Post Content */}
        <div className="prose max-w-none">
          {post?.content.split('\n').map((paragraph, i) => (
            <p key={i} className="mb-6 text-gray-700 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Comments Section */}
        <section className="mt-16 border-t pt-8">
          <h2 className="text-xl font-bold mb-6">
            {post?.comment_count} {post?.comment_count === 1 ? 'Comment' : 'Comments'}
          </h2>
          
          {/* Comment Form */}
          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-3">Leave a comment</h3>
            <textarea 
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-1 focus:ring-black focus:border-black mb-3"
              rows={4}
              placeholder="Share your thoughts..."
            />
            <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition">
              Post Comment
            </button>
          </div>

          {/* Comment List - Mock Data */}
          <div className="space-y-6">
            {Array.from({ length: Math.min(3, post?.comment_count || 0) }).map((_, i) => (
              <div key={i} className="flex space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-600">U{i+1}</span>
                  </div>
                </div>
                <div className="flex-grow">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">User {i+1}</span>
                      <span className="text-sm text-gray-500">2 days ago</span>
                    </div>
                    <p className="text-gray-700">
                      This is a sample comment. Replace with actual comment data from your API.
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </article>
    </Layout>
  )
}