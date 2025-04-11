import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const RidePagination = ({ pagination, page }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(page);

  // UPDATE URL WHEN PAGE CHANGES
  useEffect(() => {
    if (currentPage !== page) {
      const params = new URLSearchParams(searchParams);
      params.set("page", currentPage.toString());
      router.push(`?${params.toString()}`);
    }
  }, [currentPage, router, searchParams, page]);

  // HANDLE PAGINATION CLICK
  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum);
  };

  // GENERATE PAGINATION URL
  const getPaginationUrl = (pageNum) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNum.toString());
    return `?${params.toString()}`;
  };

  // IF ONLY ONE PAGE, DON'T RENDER PAGINATION
  if (pagination.pages <= 1) {
    return null;
  }

  // PAGINATION LOGICS
  const paginationItems = [];

  // CALCULATE WHICH PAGE NUMBERS TO SHOW (FIRST, LAST, AND AROUND CURRENT PAGE)
  const visiblePageNumbers = [];

  // ALWAYS SHOW PAGE 1
  visiblePageNumbers.push(1);

  // SHOW PAGES AROUND CURRENT PAGE
  for (
    let i = Math.max(2, page - 1);
    i <= Math.min(pagination.pages - 1, page + 1);
    i++
  ) {
    visiblePageNumbers.push(i);
  }

  // ALWAYS SHOW LAST PAGE IF THERE'S MORE THAN 1 PAGE
  if (pagination.pages > 1) {
    visiblePageNumbers.push(pagination.pages);
  }

  // SORT AND DEDUPLICATE
  const uniquePageNumbers = [...new Set(visiblePageNumbers)].sort(
    (a, b) => a - b
  );

  // CREATE PAGINATION ITEMS WITH ELLIPSES
  let lastPageNumber = 0;
  uniquePageNumbers.forEach((pageNumber) => {
    if (pageNumber - lastPageNumber > 1) {
      // Add ellipsis
      paginationItems.push(
        <PaginationItem key={`ellipsis-${pageNumber}`}>
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    paginationItems.push(
      <PaginationItem key={pageNumber}>
        <PaginationLink
          href={getPaginationUrl(pageNumber)}
          isActive={pageNumber === page}
          onClick={(e) => {
            e.preventDefault();
            handlePageChange(pageNumber);
          }}
        >
          {pageNumber}
        </PaginationLink>
      </PaginationItem>
    );

    lastPageNumber = pageNumber;
  });

  return (
    <Pagination className="mt-10">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={getPaginationUrl(page - 1)}
            onClick={(e) => {
              e.preventDefault();
              if (page > 1) {
                handlePageChange(page - 1);
              }
            }}
            className={page <= 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {paginationItems}

        <PaginationItem>
          <PaginationNext
            href={getPaginationUrl(page + 1)}
            onClick={(e) => {
              e.preventDefault();
              if (page < pagination.pages) {
                handlePageChange(page + 1);
              }
            }}
            className={
              page >= pagination.pages ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default RidePagination;
