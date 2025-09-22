import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import { api } from '@/lib/api'
import Head from 'next/head'

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
    bio?: string
  }
  read_time?: number
  likes?: number
}

export default function PostDetail() {
  const router = useRouter()
  const { id } = router.query

  const { data: post, isLoading, isError } = useQuery<Post>({
    queryKey: ['post', id],
    queryFn: async () => {
      const response = await api.get(`/posts/${id}`)
      return {
        ...response.data,
        read_time: Math.ceil(response.data.content.length / 500)
      }
    },
    enabled: !!id
  })

  if (isLoading) return <Layout><div className="text-center py-12">Loading post...</div></Layout>
  if (isError) return <Layout><div className="text-center py-12 text-red-500">Error loading post</div></Layout>

  return (
    <Layout>
      <Head>
        <title>{post?.title} | Nairobi Narratives</title>
        <meta name="description" content={post?.content.substring(0, 160) + '...'} />
      </Head>

      <article className="max-w-3xl mx-auto px-4 py-8 lg:py-12">
        {/* Post Header */}
        <header className="mb-12">
          <div className="flex flex-wrap gap-2 mb-6">
            {post?.tags.map(tag => (
              <span 
                key={tag} 
                className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full hover:bg-gray-200 transition"
              >
                {tag}
              </span>
            ))}
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {post?.title}
          </h1>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center space-x-4">
              {post?.author && (
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {post.author.avatar ? (
                      <img 
                        src={post.author.avatar} 
                        alt={post.author.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-600 text-xl font-medium">
                        {post.author.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{post.author.name}</p>
                    {post.author.bio && (
                      <p className="text-sm text-gray-500">{post.author.bio}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4 text-gray-500 text-sm sm:text-base">
              <span>
                {post && new Date(post.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
              <span>•</span>
              <span>{post?.read_time} min read</span>
              <span>•</span>
              <span>{post?.comment_count} comments</span>
            </div>
          </div>

          {post?.content.length > 2000 && (
            <div className="mb-8 p-4 bg-blue-50 border border-blue-100 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">Article Summary</h3>
              <p className="text-blue-700">
                {post.content.substring(0, 300)}... 
                <button className="ml-2 text-blue-600 font-medium">Read more</button>
              </p>
            </div>
          )}
        </header>

        {/* Featured Image Placeholder */}
        <div className="w-full h-64 md:h-96 bg-gray-200 rounded-xl mb-12 flex items-center justify-center text-gray-400">
          Featured Image
        </div>

        {/* Post Content */}
        <div className="prose prose-lg max-w-none mb-16">
          {post?.content.split('\n\n').map((paragraph, i) => (
            <div key={i} className="mb-6">
              {paragraph.split('\n').map((line, j) => (
                <p key={j} className="text-gray-700 leading-relaxed mb-4">
                  {line}
                </p>
              ))}
            </div>
          ))}
        </div>

        {/* Article Actions */}
        <div className="flex items-center justify-between border-t border-b border-gray-200 py-6 mb-12">
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
              <span>{post?.likes || 42} Likes</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <span>Comment</span>
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-gray-900">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
            <button className="text-gray-600 hover:text-gray-900">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Author Bio */}
        {post?.author && (
          <div className="bg-gray-50 rounded-xl p-6 mb-12">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {post.author.avatar ? (
                  <img 
                    src={post.author.avatar} 
                    alt={post.author.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-600 text-2xl font-medium">
                    {post.author.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">About {post.author.name}</h3>
                <p className="text-gray-600 mt-1">
                  {post.author.bio || "Writer at Nairobi Narratives. Sharing stories that matter."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Comments Section */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-8">
            {post?.comment_count} {post?.comment_count === 1 ? 'Comment' : 'Comments'}
          </h2>
          
          {/* Comment Form */}
          <div className="mb-10 p-6 bg-gray-50 rounded-xl">
            <h3 className="font-bold text-lg mb-4">Leave a comment</h3>
            <textarea 
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black mb-4"
              rows={5}
              placeholder="Share your thoughts..."
            />
            <div className="flex justify-end">
              <button className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition">
                Post Comment
              </button>
            </div>
          </div>

          {/* Comment List */}
          <div className="space-y-8">
            {Array.from({ length: Math.min(3, post?.comment_count || 0) }).map((_, i) => (
              <div key={i} className="flex space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-600 text-lg font-medium">U{i+1}</span>
                  </div>
                </div>
                <div className="flex-grow">
                  <div className="bg-white p-5 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="font-bold">User {i+1}</span>
                        <span className="text-gray-500 text-sm ml-3">@{i+1}dayago</span>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-gray-700 mb-3">
                      This is a sample comment. In a real application, this would be replaced with actual comment data from your API.
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <button className="flex items-center space-x-1 hover:text-gray-700">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                        </svg>
                        <span>Like (24)</span>
                      </button>
                      <button className="flex items-center space-x-1 hover:text-gray-700">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span>Reply</span>
                      </button>
                    </div>
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