'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { useTransition } from 'react';

const SearchBar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('search', term);
    } else {
      params.delete('search');
    }

    startTransition(() => {
      router.push(`/?${params.toString()}`);
    });
  };

  return (
    <div className="library-search-wrapper">
      <div className="pl-4 text-(--text-muted)">
        <Search size={18} />
      </div>
      <input
        type="text"
        placeholder="Search books or authors..."
        className="library-search-input"
        defaultValue={searchParams.get('search')?.toString()}
        onChange={(e) => handleSearch(e.target.value)}
      />
      {isPending && (
        <div className="pr-4">
          <div className="w-4 h-4 border-2 border-(--color-brand) border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};

export default SearchBar;
