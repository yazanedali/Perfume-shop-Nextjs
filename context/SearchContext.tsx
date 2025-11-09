"use client";
import { createContext, useState, useContext, ReactNode } from "react";
import { usePathname } from "next/navigation";

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [searchValues, setSearchValues] = useState<{ [key: string]: string }>(
    {}
  );

  const searchQuery = searchValues[pathname] || "";

  const setSearchQuery = (value: string) => {
    setSearchValues((prev) => ({
      ...prev,
      [pathname]: value,
    }));
  };

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}