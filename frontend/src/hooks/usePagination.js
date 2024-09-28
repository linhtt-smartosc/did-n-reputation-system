import { useMemo, useState } from 'react';

const usePagination = (data, totalItems) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    const handleOnChangePage = (direction) => {
        if (direction === 1) {
            setCurrentPage(currentPage + 1);
        } else {
            setCurrentPage(currentPage - 1);
        }
    };

    const totalPage = useMemo(() => Math.ceil(totalItems / pageSize), [totalItems, pageSize]);

    const currentTableData = useMemo(() => {
        const startItemIndex = (currentPage - 1) * pageSize;
        return data.slice(startItemIndex, startItemIndex + pageSize);
    }, [currentPage, pageSize, data]);

    return {
        currentPage,
        pageSize,
        totalPage,
        currentTableData,
        setPageSize,
        handleOnChangePage,
    };
};

export default usePagination;