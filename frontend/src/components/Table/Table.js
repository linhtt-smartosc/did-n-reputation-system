import usePagination from "../../hooks/usePagination";

// data structure: {id, credentialId, subjectReference, issuerDID, type, createdDate, expiryDate}
const Table = ({data, totalItems}) => {
    const {
        currentPage,
        pageSize,
        totalPage,
        currentTableData,
        setPageSize,
        handleOnChangePage,
    } = usePagination(data, totalItems);

    return (
        <>
            <div className="overflow-x-auto m-auto">
                <table className="table table-zebra">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Credential ID</th>
                            <th>Subject Reference</th>
                            <th>Issuer DID</th>
                            <th>Type</th>
                            <th>Created Date</th>
                            <th>Expiry Date</th>
                            <th>Revoke</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            currentTableData.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{item.credentialId}</td>
                                        <td>{item.subjectReference}</td>
                                        <td>{item.issuerDID}</td>
                                        <td>{item.type}</td>
                                        <td>{item.createdDate}</td>
                                        <td>{item.expiryDate}</td>
                                        <td>
                                            <input type="checkbox" />
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
            <div class="join">
                <span class="join-item">Items per page: </span>
                <select class="join-item select-bordered" defaultValue={5} onChange={e => setPageSize(e.target.value)}>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                </select>
                <span class="join-item">${(currentPage - 1) * pageSize} - ${currentPage * pageSize} of ${totalItems}</span>
                <button class="join-item btn" onClick={handleOnChangePage(0)} disabled={currentPage === 1}>«</button>
                <button class="join-item btn" onClick={handleOnChangePage(1)} disabled={currentPage === totalPage}>»</button>
            </div>
        </>
    )
}

export default Table