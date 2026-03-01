import BookCard from "@/components/BookCard";
import LibraryHero from "@/components/LibraryHero";
import SearchBar from "@/components/SearchBar";
import { getAllBooks } from "@/lib/actions/book.actions";

interface SearchParams {
  search?: string;
}

async function page({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { search } = await searchParams;
  const bookResult = await getAllBooks(search);
  const books = bookResult.success ? bookResult.data ?? [] : [];

  return (
    <main className="wrapper container">
      <LibraryHero />

      <div className="mt-12 mb-8 bg-white/50 backdrop-blur-md p-6 rounded-2xl border border-(--border-subtle) shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <h2 className="section-title">Recent Books</h2>
          <SearchBar />
        </div>
      </div>

      <div className="library-books-grid">
        {books.length > 0 ? (
          books.map((book) => (
            <BookCard
              key={book._id}
              title={book.title}
              author={book.author}
              coverURL={book.coverURL}
              slug={book.slug}
            />
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <p className="text-xl text-(--text-secondary) font-medium">No books found matching your search.</p>
            <p className="text-(--text-muted) mt-2">Try searching for something else!</p>
          </div>
        )}
      </div>
    </main>
  );
}

export default page;