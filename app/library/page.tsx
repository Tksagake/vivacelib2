'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import { Search, BookOpen, Filter, Grid3X3, List, X, Download, Eye, Loader2, ChevronDown } from 'lucide-react';

// Initialize Supabase client with fallback values for build
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
const supabase = createClient(supabaseUrl, supabaseKey);

// Book cover images
const BOOK_COVERS = [
  '/BOOK1.png',
  '/BOOK2.png',
  '/BOOK3.png',
];

// Helper function to get random cover
const getRandomCover = () => {
  const randomIndex = Math.floor(Math.random() * BOOK_COVERS.length);
  return BOOK_COVERS[randomIndex];
};

interface Book {
  name: string;
  url: string;
  thumbnail: string;
  category?: string;
}

// PDF viewer component
const PDFViewer = ({ url }: { url: string }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--neutral-100)]">
          <div className="text-center">
            <Loader2 size={40} className="animate-spin text-[var(--primary-600)] mx-auto" />
            <p className="mt-4 text-[var(--neutral-600)]">Loading PDF...</p>
          </div>
        </div>
      )}
      <iframe
        src={`https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`}
        className="w-full h-full"
        style={{ border: 'none', backgroundColor: '#f0f0f0' }}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
};

// Categories for filtering
const CATEGORIES = [
  'All Resources',
  'Trinity',
  'Theory',
  'Workbook',
  'Practice',
  'Scales',
];

export default function Library() {
  const [books, setBooks] = useState<Book[]>([]);
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All Resources');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const router = useRouter();

  // Filter books based on search query and category
  const filteredBooks = books.filter((book) => {
    const searchLower = searchQuery.toLowerCase().trim();
    const bookNameLower = book.name.toLowerCase();
    const bookNameWithoutExt = bookNameLower.replace(/\.[^/.]+$/, '');
    
    const matchesSearch = searchLower === '' || bookNameWithoutExt.includes(searchLower) || bookNameLower.includes(searchLower);
    const matchesCategory = selectedCategory === 'All Resources' || bookNameLower.includes(selectedCategory.toLowerCase());
    
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  async function fetchBooks() {
    try {
      const { data: files, error: listError } = await supabase.storage.from('pdf-resources').list('', {
        sortBy: { column: 'name', order: 'asc' },
      });

      if (listError) {
        throw listError;
      }

      if (!files || files.length === 0) {
        return;
      }

      const bookList = files.map((file: { name: string }) => {
        const { data } = supabase.storage.from('pdf-resources').getPublicUrl(file.name);

        // Determine category based on filename
        let category = 'General';
        const nameLower = file.name.toLowerCase();
        if (nameLower.includes('trinity')) category = 'Trinity';
        else if (nameLower.includes('theory')) category = 'Theory';
        else if (nameLower.includes('workbook')) category = 'Workbook';
        else if (nameLower.includes('scale')) category = 'Scales';
        else if (nameLower.includes('practice')) category = 'Practice';

        return {
          name: file.name,
          url: data.publicUrl,
          thumbnail: getRandomCover(),
          category,
        };
      });

      setBooks(bookList);

      const shuffled = [...bookList].sort(() => 0.5 - Math.random());
      setRecommendedBooks(shuffled.slice(0, Math.min(4, shuffled.length)));
    } catch (error) {
      console.error('Error fetching books:', error);
      setError('Failed to load books');
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(searchQuery.trim() !== '');
  };

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.trim() === '') {
      setIsSearching(false);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All Resources');
    setIsSearching(false);
  };

  const getCleanName = (name: string) => {
    return name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ');
  };

  const BookCard = ({ book }: { book: Book }) => (
    <div className="group bg-white rounded-xl border border-[var(--neutral-200)] overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="relative aspect-[3/4] bg-[var(--neutral-100)] overflow-hidden">
        <Image
          src={book.thumbnail || BOOK_COVERS[0]}
          alt={book.name}
          fill
          className="object-contain group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute bottom-4 left-4 right-4 flex gap-2">
            <button
              onClick={() => setSelectedBook(book)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white text-[var(--primary-700)] text-sm font-medium rounded-lg hover:bg-[var(--primary-50)] transition-colors"
            >
              <Eye size={16} />
              <span>Read</span>
            </button>
            <a
              href={book.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-white/90 text-[var(--neutral-700)] rounded-lg hover:bg-white transition-colors"
            >
              <Download size={16} />
            </a>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="mb-2">
          <span className="inline-block px-2 py-0.5 bg-[var(--primary-100)] text-[var(--primary-700)] text-xs font-medium rounded">
            {book.category || 'General'}
          </span>
        </div>
        <h3 className="font-semibold text-[var(--primary-900)] line-clamp-2 group-hover:text-[var(--primary-700)] transition-colors">
          {getCleanName(book.name)}
        </h3>
      </div>
    </div>
  );

  const BookListItem = ({ book }: { book: Book }) => (
    <div className="group bg-white rounded-xl border border-[var(--neutral-200)] p-4 hover:shadow-lg transition-all duration-300 flex items-center gap-4">
      <div className="w-16 h-20 bg-[var(--neutral-100)] rounded-lg overflow-hidden shrink-0">
        <Image
          src={book.thumbnail || BOOK_COVERS[0]}
          alt={book.name}
          width={64}
          height={80}
          className="object-contain w-full h-full"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="mb-1">
          <span className="inline-block px-2 py-0.5 bg-[var(--primary-100)] text-[var(--primary-700)] text-xs font-medium rounded">
            {book.category || 'General'}
          </span>
        </div>
        <h3 className="font-semibold text-[var(--primary-900)] truncate group-hover:text-[var(--primary-700)] transition-colors">
          {getCleanName(book.name)}
        </h3>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => setSelectedBook(book)}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--primary-100)] text-[var(--primary-700)] text-sm font-medium rounded-lg hover:bg-[var(--primary-200)] transition-colors"
        >
          <Eye size={16} />
          <span>Read</span>
        </button>
        <a
          href={book.url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 bg-[var(--neutral-100)] text-[var(--neutral-700)] rounded-lg hover:bg-[var(--neutral-200)] transition-colors"
        >
          <Download size={16} />
        </a>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <Navbar />

      {/* PDF Viewer Modal */}
      {selectedBook && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedBook(null);
          }}
        >
          <div className="bg-white rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-[var(--neutral-200)]">
              <div>
                <h3 className="font-semibold text-[var(--primary-900)]">{getCleanName(selectedBook.name)}</h3>
                <span className="text-sm text-[var(--neutral-500)]">{selectedBook.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={selectedBook.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-[var(--primary-600)] text-white text-sm font-medium rounded-lg hover:bg-[var(--primary-700)] transition-colors"
                >
                  <Download size={16} />
                  <span>Download</span>
                </a>
                <button
                  onClick={() => setSelectedBook(null)}
                  className="p-2 hover:bg-[var(--neutral-100)] rounded-lg transition-colors"
                  aria-label="Close"
                >
                  <X size={24} className="text-[var(--neutral-600)]" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <PDFViewer url={selectedBook.url} />
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-br from-[var(--secondary-800)] to-[var(--secondary-900)] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                <BookOpen size={24} />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Digital Library</h1>
              </div>
            </div>
            <p className="text-lg text-white/80 mb-8">
              Access our comprehensive collection of music theory books, Trinity College London preparation materials, 
              and educational resources.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-3">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search size={20} className="text-[var(--neutral-400)]" />
                </div>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={handleSearchInput}
                  className="w-full pl-12 pr-4 py-4 bg-white text-[var(--neutral-900)] rounded-xl placeholder-[var(--neutral-400)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-500)]"
                  placeholder="Search for books, theory materials, Trinity resources..."
                />
              </div>
              <button
                type="submit"
                className="px-8 py-4 bg-[var(--accent-500)] hover:bg-[var(--accent-600)] text-white font-semibold rounded-xl transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b border-[var(--neutral-200)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="text-sm">
                <span className="text-[var(--neutral-500)]">Total Resources: </span>
                <span className="font-semibold text-[var(--primary-900)]">{books.length}</span>
              </div>
              {(isSearching || selectedCategory !== 'All Resources') && (
                <div className="text-sm">
                  <span className="text-[var(--neutral-500)]">Showing: </span>
                  <span className="font-semibold text-[var(--primary-900)]">{filteredBooks.length}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              {/* Category Filter */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2 bg-[var(--neutral-50)] border border-[var(--neutral-200)] rounded-lg text-sm text-[var(--neutral-700)] focus:outline-none focus:border-[var(--primary-400)]"
                >
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--neutral-400)] pointer-events-none" />
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 border border-[var(--neutral-200)] rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-[var(--primary-100)] text-[var(--primary-700)]' 
                      : 'text-[var(--neutral-500)] hover:bg-[var(--neutral-100)]'
                  }`}
                >
                  <Grid3X3 size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-[var(--primary-100)] text-[var(--primary-700)]' 
                      : 'text-[var(--neutral-500)] hover:bg-[var(--neutral-100)]'
                  }`}
                >
                  <List size={18} />
                </button>
              </div>

              {(isSearching || selectedCategory !== 'All Resources') && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--neutral-600)] hover:bg-[var(--neutral-100)] rounded-lg transition-colors"
                >
                  <X size={16} />
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 size={40} className="animate-spin text-[var(--primary-600)]" />
            <p className="mt-4 text-[var(--neutral-600)]">Loading library...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X size={32} className="text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--neutral-900)] mb-2">Failed to Load</h3>
            <p className="text-[var(--neutral-600)]">{error}</p>
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-[var(--neutral-100)] rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen size={32} className="text-[var(--neutral-400)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--neutral-900)] mb-2">No Books Available</h3>
            <p className="text-[var(--neutral-600)]">Check back later for new resources.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Recommended Books - Show FIRST when not filtering */}
            {!isSearching && selectedCategory === 'All Resources' && recommendedBooks.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-[var(--primary-900)]">Recommended for You</h2>
                    <p className="text-[var(--neutral-500)]">Curated resources to enhance your learning</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  {recommendedBooks.map((book, index) => (
                    <BookCard key={`recommended-${index}`} book={book} />
                  ))}
                </div>
              </section>
            )}

            {/* Search/Filter Results or All Books */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-[var(--primary-900)]">
                    {isSearching ? 'Search Results' : selectedCategory !== 'All Resources' ? selectedCategory : 'All Resources'}
                  </h2>
                  <p className="text-[var(--neutral-500)]">
                    {filteredBooks.length} {filteredBooks.length === 1 ? 'resource' : 'resources'} available
                  </p>
                </div>
              </div>

              {filteredBooks.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-[var(--neutral-200)]">
                  <Search size={40} className="mx-auto text-[var(--neutral-300)] mb-4" />
                  <h3 className="text-lg font-semibold text-[var(--neutral-900)] mb-2">No results found</h3>
                  <p className="text-[var(--neutral-600)] mb-4">
                    No books found matching "{searchQuery}"
                    {selectedCategory !== 'All Resources' && ` in ${selectedCategory}`}
                  </p>
                  <button
                    onClick={clearFilters}
                    className="text-[var(--primary-600)] hover:text-[var(--primary-700)] font-medium"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {filteredBooks.map((book, index) => (
                    <BookCard key={index} book={book} />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredBooks.map((book, index) => (
                    <BookListItem key={index} book={book} />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
