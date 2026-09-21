"use client";

import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils";
import type { TeamMember } from "@/lib/api/our-makers";
import { Button } from "@/components/ui/button";

interface OurMakersSectionProps {
  className?: string;
  title: string;
  description: string;
  teamMembers: TeamMember[];
}

const ITEMS_PER_PAGE = 8;

export function OurMakersSection({ className, title, description, teamMembers }: OurMakersSectionProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(teamMembers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentMembers = teamMembers.slice(startIndex, endIndex);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <section className={cn("border-t border-border/70 bg-[#f7f2e8]/80 py-18 md:py-24", className)}>
      <div className="container-page">
        <div className="max-w-2xl">
          <span className="editorial-eyebrow">The Hands Behind Nyanopan</span>
          <h2 className="mt-3 font-serif text-3xl md:text-4xl text-foreground">{title}</h2>
          <div 
            className="mt-3 text-base leading-relaxed text-muted-foreground [&_span]:inline"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>

        <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-4">
          {currentMembers.map((maker, index) => (
            <figure key={`${maker.name}-${index}`} className="group">
              <div className="relative overflow-hidden rounded-lg border border-border/80 shadow-xs transition-all duration-300 group-hover:border-terracotta/40 group-hover:shadow-md">
                <Image
                  src={maker.image}
                  alt={`${maker.name}, ${maker.role.toLowerCase()}`}
                  width={400}
                  height={533}
                  className="aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-104"
                />
              </div>
              <figcaption className="mt-3.5">
                <p className="font-serif text-base font-medium text-foreground">{maker.name}</p>
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                  {maker.role}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-3">
                  {maker.intro}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-4">
            <Button
              variant="outline"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
