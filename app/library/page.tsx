'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar'; // Adjust the path as necessary
import { TypeAnimation } from 'react-type-animation';

// Initialize Supabase client
const supabase = createClientComponentClient();

// Replace the single DEFAULT_THUMBNAIL with an array of covers
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
}

// Create a custom PDF viewer component
const PDFViewer = ({ url }: { url: string }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto"></div>
            <p className="mt-4 text-cyan-600">Loading PDF...</p>
          </div>
        </div>
      )}
      <iframe
        src={`https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`}
        className="w-full h-full"
        style={{
          border: 'none',
          backgroundColor: '#f0f0f0',
        }}
        frameBorder="0"
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
};

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const router = useRouter();

  // Filter books based on search query
  const filteredBooks = books.filter((book) => {
    const searchLower = searchQuery.toLowerCase().trim();
    const bookNameLower = book.name.toLowerCase();

    // Remove file extension for better matching
    const bookNameWithoutExt = bookNameLower.replace(/\.[^/.]+$/, '');

    return bookNameWithoutExt.includes(searchLower) || bookNameLower.includes(searchLower);
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  async function fetchBooks() {
    try {
      console.log('Starting to fetch books...');

      // Try direct file access first to test bucket access
      const { data: testFile } = await supabase.storage.from('pdf-resources').getPublicUrl('ABRSM GRADE 7 WORKBOOK.pdf');

      console.log('Test file URL:', testFile);

      // List files in the bucket
      const { data: files, error: listError } = await supabase.storage.from('pdf-resources').list('', {
        sortBy: { column: 'name', order: 'asc' },
      });

      if (listError) {
        console.error('Error listing files:', listError);
        throw listError;
      }

      console.log('Raw files response:', files);

      if (!files || files.length === 0) {
        console.log('No files returned from Supabase');
        return;
      }

      // Process all files
      const bookList = files.map((file: { name: any }) => {
        const { data } = supabase.storage.from('pdf-resources').getPublicUrl(file.name);

        return {
          name: file.name,
          url: data.publicUrl,
          thumbnail: getRandomCover(), // Assign a random cover
        };
      });

      console.log('Final processed books:', bookList);
      setBooks(bookList);

      const shuffled = [...bookList].sort(() => 0.5 - Math.random());
      setRecommendedBooks(shuffled.slice(0, Math.min(3, shuffled.length)));
    } catch (error) {
      console.error('Error fetching books:', error);
      setError('Failed to load books');
    } finally {
      setLoading(false);
    }
  }

  // Update the search handler
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);

    const results = books.filter((book) => {
      const searchLower = searchQuery.toLowerCase().trim();
      const bookNameLower = book.name.toLowerCase();
      const bookNameWithoutExt = bookNameLower.replace(/\.[^/.]+$/, '');

      return bookNameWithoutExt.includes(searchLower) || bookNameLower.includes(searchLower);
    });

    setSearchResults(results);
    console.log('Search results:', results);
  };

  // Update the search input handler
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.trim() === '') {
      setIsSearching(false);
      setSearchResults([]);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Use the Navbar component */}
      <Navbar />

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* User welcome and search bar */}
          <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center">
            <div>
        
                <h1 className="text-4xl font-bold text-cyan-800 ">
                    Welcome to the Library! 📚
                </h1>
                <p className="mt-2 text-lg text-gray-700">
                    Discover a world of knowledge and creativity.
                </p>
                
            </div>
            <div className="flex items-center space-x-4">
              <form onSubmit={handleSearch} className="flex items-center space-x-2">
                <input
                  type="search"
                  placeholder="Search books..."
                  className="px-4 py-2 border border-cyan-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900 bg-cyan-50"
                  value={searchQuery}
                  onChange={handleSearchInput}
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  Search
                </button>
              </form>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto"></div>
              <p className="mt-4 text-cyan-600">Loading books...</p>
            </div>
          ) : error ? (
            <div className="text-center text-red-600 p-4 bg-red-50 rounded-lg">
              {error}
            </div>
          ) : books.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No books available at the moment.</p>
            </div>
          ) : (
            <>
              {/* PDF Viewer Modal */}
              {selectedBook && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-lg w-full max-w-6xl h-[90vh] flex flex-col">
                    <div className="p-4 border-b flex justify-between items-center">
                      <h3 className="text-lg font-medium">{selectedBook.name}</h3>
                      <button
                        onClick={() => setSelectedBook(null)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        Close
                      </button>
                    </div>
                    <div className="flex-1 overflow-hidden bg-gray-100">
                      <PDFViewer url={selectedBook.url} />
                    </div>
                  </div>
                </div>
              )}

              {/* All Books and Search Results Section */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-cyan-800">
                  {isSearching ? 'Search Results' : 'All Books'}
                </h2>
                {isSearching && searchResults.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600">No books found matching "{searchQuery}"</p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setIsSearching(false);
                        setSearchResults([]);
                      }}
                      className="mt-4 text-cyan-600 hover:text-cyan-800"
                    >
                      Clear Search
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {(isSearching ? searchResults : books).map((book, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-4 border border-cyan-100"
                      >
                        <div className="flex flex-col h-full">
                          <div className="flex-1">
                            <div className="aspect-w-3 aspect-h-4 mb-4 relative h-48">
                              <Image
                                src={book.thumbnail || BOOK_COVERS[0]}
                                alt={book.name}
                                fill
                                className="rounded-lg object-contain"
                                priority
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              />
                            </div>
                            <h3 className="text-lg font-medium text-cyan-800 mb-2">
                              {book.name.replace(/\.[^/.]+$/, '')}
                            </h3>
                          </div>
                          <button
                            onClick={() => setSelectedBook(book)}
                            className="mt-4 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                          >
                            Read Book
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Only show Recommended Books when not searching */}
              {!isSearching && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-cyan-800">Recommended Books</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {recommendedBooks.map((book, index) => (
                      <div
                        key={`recommended-${index}`}
                        className="bg-gradient-to-br from-cyan-100 to-blue-100 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-4 border-2 border-cyan-300"
                      >
                        <div className="flex flex-col h-full">
                          <div className="flex-1">
                            <div className="aspect-w-3 aspect-h-4 mb-4 relative h-48">
                              <Image
                                src={book.thumbnail || BOOK_COVERS[0]}
                                alt={book.name}
                                fill
                                className="rounded-lg object-contain"
                                priority
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              />
                            </div>
                            <h3 className="text-lg font-medium text-cyan-800 mb-2">
                              {book.name.replace(/\.[^/.]+$/, '')}
                            </h3>
                          </div>
                          <button
                            onClick={() => setSelectedBook(book)}
                            className="mt-4 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                          >
                            Read Book
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
