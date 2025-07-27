import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import Layout from '@components/Layout'
import Link from 'next/link'
import { api } from '@lib/api'

type Post = {
  id: number
  title: string
  content: string
  created_at: string
  comment_count: number
  tags: string[]
}

export default function SearchPage() {
  const router = useRouter()
  const { q: searchQuery } = router.query

  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: ['search', searchQuery],
    queryFn: async () => {
      const response = await api.get('/search', {
        params: { q: searchQuery },
      })
      return response.data
    },
    enabled: !!searchQuery,
  })
}