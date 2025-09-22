import Head from 'next/head'
import Link from 'next/link'
import { SearchBar } from './SearchBar'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>NAIROBI NARRATIVES</title>
        <meta name="description" content="where nairobi writters write and unite" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-gray-800 whitespace-nowrap">
            NAIROBI NARRATIVES
          </Link>
          <nav className="flex items-center space-x-2 md:space-x-4">
            <div className="hidden md:block">
              <SearchBar />
            </div>
            <div className="flex items-center space-x-2 md:space-x-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900 whitespace-nowrap">
                Home
              </Link>
              <Link href="/posts/create" className="text-gray-600 hover:text-gray-900 whitespace-nowrap">
                New Post
              </Link>
              <Link href="/login" className="text-gray-600 hover:text-gray-900 px-2 py-2 rounded-md transition whitespace-nowrap">
                Login
              </Link>
              <Link href="/sign up" className="bg-black text-white px-3 py-2 rounded-md hover:bg-gray-800 transition whitespace-nowrap">
                SignUp
              </Link>
              <Link href="/login" className="text-gray-600 hover:text-gray-900 px-2 py-2 rounded-md transition whitespace-nowrap">
                Join Our Community
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">{children}</main>

      <footer className="bg-white border-t mt-8 py-4">
        <div className="max-w-4xl mx-auto px-4 text-center text-gray-500">
          © {new Date().getFullYear()} My Blog. All rights reserved.
        </div>
      </footer>
    </div>
  )
}