"use client";
import { useSearch } from "@/context/SearchContext";

import { useTranslations } from "next-intl";
import React from "react";
import { FiSearch } from "react-icons/fi";

const SearchBar = () => {
  const t = useTranslations("AppBar");
  const { searchQuery, setSearchQuery } = useSearch();

  return (
    <div>
      <div className="relative w-full">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          placeholder={t("searchPlaceholder")}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-full border border-border bg-transparent py-2 pl-10 pr-4 focus:ring-2 focus:ring-primary focus:outline-none transition-all"
        />
      </div>
    </div>
  );
};

export default SearchBar;
