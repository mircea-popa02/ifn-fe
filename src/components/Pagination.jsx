import React from "react";
import { ActionButton } from "@adobe/react-spectrum";
import "./Pagination.css";

const Pagination = ({ page, totalPages, onPageChange }) => {
  const handlePrev = () => {
    if (page > 1) {
      onPageChange(page - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      onPageChange(page + 1);
    }
  };

  return (
    <div className="pagination">
      <ActionButton onPress={handlePrev} isDisabled={page <= 1}>
        Previous
      </ActionButton>
      <span>
        Page {page} of {totalPages}
      </span>
      <ActionButton onPress={handleNext} isDisabled={page >= totalPages}>
        Next
      </ActionButton>
    </div>
  );
};

export default Pagination;
