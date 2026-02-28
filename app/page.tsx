import BookCard from "@/components/BookCard";
import LibraryHero from "@/components/LibraryHero";
import { getAllBooks } from "@/lib/actions/book.actions";

async function page() {
  const bookResult = await getAllBooks();
  const books = bookResult.success ? bookResult.data ?? []: [];

  return (
      <main className="wrapper container">
        <LibraryHero />
        <div className="library-books-grid mt-10">
            {books.map((book) => (
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