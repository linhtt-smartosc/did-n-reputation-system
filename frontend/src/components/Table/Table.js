import React, { useRef, useState } from 'react';
import usePagination from "../../hooks/usePagination";
import shortenAccount from '../../utils/shortenAccount.util';
import { vcRegistryContract, verifierRegistryContract } from '../../config/contract.config';
import { keccak256, toUtf8Bytes } from 'ethers';
import useAlert from '../../hooks/useAlert';
import { retrieveVC, revokeVC } from '../../apis/credentials/credential.api';

const Table = ({ data, totalItems }) => {
    const {
        currentPage,
        pageSize,
        totalPage,
        currentTableData,
        setPageSize,
        handleOnChangePage,
    } = usePagination(data, totalItems);

    const { setAlert } = useAlert();
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const dialogRef = useRef(null);
    const [vc, setVC] = useState({});

    const handleRevoke = async (id, issuer) => {
        const hash = keccak256(toUtf8Bytes(id));
        const revokeTx = await vcRegistryContract.revokeCredentialEOA(hash, issuer);
        const receipt = await revokeTx.wait();
        console.log("Receipt", receipt.logs[0].args);
        const status = await revokeVC(id);
        console.log("Status", status);

        if (receipt.logs[0].args[0] === hash) {
            setAlert("Credential revoked successfully!", "success");
        }
    }

    const handleDetail = async (id) => {
        console.log("Detail", id);
        setLoading(true);
        try {
            const res = await retrieveVC(id);
            console.log("Res", res.data);
            setVC(res.data);
            setShowModal(true);
            if (dialogRef.current) {
                dialogRef.current.showModal();
            }
        } catch (error) {
            console.error("Error retrieving VC:", error);
        } finally {
            setLoading(false);
        }
    }

    const closeModal = () => {
        setShowModal(false);
        if (dialogRef.current) {
            dialogRef.current.close();
        }
    }

    const handleVerify = async () => {
        const issuer = vc.issuer.replace('did:didify:', '');
        const holder = vc.holder.replace('did:didify:', '');

        const credentialSubjectHex = keccak256(toUtf8Bytes(JSON.stringify(vc.credentialSubject.credentialSubject)));
        const iat = new Date(vc.issuanceDate);
        const exp = new Date(vc.expirationDate);
        
        const validTo = Math.floor(exp.getTime() / 1000);
        const validFrom = Math.floor(iat.getTime() / 1000);
        const sig = vc.proof.proof;
        const verify = await verifierRegistryContract.verifyCredential([issuer, holder, credentialSubjectHex, validFrom, validTo], sig);
        console.log("Verify", verify);
        if (verify[2] === true) {
            closeModal();
            setAlert("Credential verified successfully!", "success");
        } else {
            closeModal();
            setAlert("Credential verification failed!", "error");
        }
    }

    const renderObject = (obj) => {
        return Object.entries(obj).map(([key, value]) => {
            if (typeof value === 'object' && value !== null) {
                return (
                    <div key={key} style={{ marginLeft: '20px' }}>
                        <strong>{key}:</strong>
                        {renderObject(value)}
                    </div>
                );
            }
            return (
                <p key={key}>
                    <strong>{key}:</strong> {value.toString()}
                </p>
            );
        });
    };

    return (
        <>
            <div className="m-8">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Credential ID</th>
                            <th>Subject</th>
                            <th>Issuer DID</th>
                            <th>Type</th>
                            <th>Created Date</th>
                            <th>Expiry Date</th>
                            <th>Status</th>
                            <th>Details</th>
                            <th>Revoke</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            currentTableData.map((item, index) => (
                                <tr key={index}>
                                    <td>{shortenAccount(item._id)}</td>
                                    <td>{shortenAccount(item.subject)}</td>
                                    <td>{shortenAccount(item.issuer)}</td>
                                    <td>{item.type}</td>
                                    <td>{item.iat}</td>
                                    <td>{item.exp}</td>
                                    <td>{item.status ? 'Active' : 'Inactive'}</td>
                                    <td>
                                        <button className="btn" onClick={() => handleDetail(item._id)}>
                                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                                                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                                <g id="SVGRepo_iconCarrier">
                                                    <path d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                                </g>
                                            </svg>
                                        </button>
                                    </td>
                                    <td>
                                        <button className="btn" onClick={() => handleRevoke(item._id, item.issuer)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="16" height="16" viewBox="0 0 24 24">
                                                <path d="M 4.9902344 3.9902344 A 1.0001 1.0001 0 0 0 4.2929688 5.7070312 L 10.585938 12 L 4.2929688 18.292969 A 1.0001 1.0001 0 1 0 5.7070312 19.707031 L 12 13.414062 L 18.292969 19.707031 A 1.0001 1.0001 0 1 0 19.707031 18.292969 L 13.414062 12 L 19.707031 5.7070312 A 1.0001 1.0001 0 0 0 18.980469 3.9902344 A 1.0001 1.0001 0 0 0 18.292969 4.2929688 L 12 10.585938 L 5.7070312 4.2929688 A 1.0001 1.0001 0 0 0 4.9902344 3.9902344 z"></path>
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
            <div className="m-10 flex justify-end items-center">
                <span className="mx-2">Items per page: </span>
                <select className="select mx-2" defaultValue={5} onChange={e => setPageSize(Number(e.target.value))}>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                </select>
                <span className="mx-4">{(currentPage - 1) * pageSize} - {currentPage * pageSize} of {totalItems}</span>
                <div className='btn-group '>
                    <button className="btn btn-primary mr-2" onClick={() => handleOnChangePage(-1)} disabled={currentPage === 1}>Previous</button>
                    <button className="btn btn-primary" onClick={() => handleOnChangePage(1)} disabled={currentPage === totalPage}>Next</button>
                </div>
            </div>
            {
                showModal && (
                    <dialog ref={dialogRef} className="modal">
                        <div className="modal-box">
                            <form method="dialog">
                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={closeModal}>✕</button>
                            </form>
                            <h3 className="text-lg font-bold">Credential Details</h3>
                            {loading ? (
                                <p className="py-4">Loading...</p>
                            ) : (
                                <div className="py-4">
                                    <p>
                                        <strong>Credential ID:</strong> {vc.id}<br />
                                        <strong>Subject:</strong> {vc.holder}<br />
                                        <strong>Issuer:</strong> {vc.issuer}<br />
                                        <strong>Type:</strong> {vc.type}<br />
                                        <strong>Created Date:</strong> {vc.issuanceDate}<br />
                                        <strong>Expiry Date:</strong> {vc.expirationDate}<br />
                                    </p>
                                    {vc.credentialSubject && (
                                        <div>
                                            <h4 className="text-md font-bold">Credential Subject</h4>
                                            <div class="divider -m-1"></div>
                                            {renderObject(vc.credentialSubject)}
                                        </div>
                                    )}
                                </div>
                            )}
                            <div className="flex justify-end">
                                <button className="btn btn-primary" onClick={handleVerify}>Verify</button>
                            </div>
                        </div>
                    </dialog>
                )
            }
        </>
    );
};

export default Table;