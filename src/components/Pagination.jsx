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
      <span>
        Pagina {page} din {totalPages}
      </span>
      <div className="controls">
        <ActionButton onPress={handlePrev} isDisabled={page <= 1}>
          Inapoi
        </ActionButton>
        <ActionButton onPress={handleNext} isDisabled={page >= totalPages}>
          Inainte
        </ActionButton>
      </div>
    </div>
  );
};

export default Pagination;
