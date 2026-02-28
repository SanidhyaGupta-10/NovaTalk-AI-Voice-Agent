"use client"

import BookCard from "@/components/BookCard";
import LibraryHero from "@/components/LibraryHero";
import { sampleBooks } from "@/lib/constants";

function page() {
  return (
      <main className="wrapper container">
        <LibraryHero />
        <div className="library-books-grid mt-10">
            {sampleBooks.map((book) => (
                <BookCard 
                  key={book._id} 
                  title={book.title}
                  author={book.author}
                  coverURL={book.coverURL}
                  slug={book.slug}
                />
            ))}
        </div>
      </main>
  )
}

export default page;