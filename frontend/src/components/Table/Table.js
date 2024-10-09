import React, { useRef, useState } from 'react';
import usePagination from "../../hooks/usePagination";
import shortenAccount from '../../utils/shortenAccount.util';
import { vcRegistryContract, verifierRegistryContract } from '../../config/contract.config';
import { keccak256, toUtf8Bytes } from 'ethers';
import useAlert from '../../hooks/useAlert';
import { retrieveVC, revokeVC, createPresentation, updateRequestedVC } from '../../apis/credentials/credential.api';
import { BiDetail } from "react-icons/bi";
import { FaRegTrashCan } from "react-icons/fa6";
import { MdOutlineCoPresent } from "react-icons/md";
import { GoVerified } from "react-icons/go";
import { FiSend } from "react-icons/fi";
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import constructMsgAndSign from '../../utils/eip-712.util';

const Table = ({ data, totalItems, type }) => {
    const {
        currentPage,
        pageSize,
        totalPage,
        currentTableData,
        setPageSize,
        handleOnChangePage,
    } = usePagination(data, totalItems);

    const { setAlert } = useAlert();
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const detailModal = useRef(null);
    const [vc, setVC] = useState({});
    const [vcId, setVCId] = useState('');
    const [showPresentModal, setShowPresentModal] = useState(false);
    const presentModal = useRef(null);
    const { register, handleSubmit } = useForm();
    const user = useSelector(state => state.user);

    const handleRevoke = async (id, issuer) => {
        const hash = keccak256(toUtf8Bytes(id));
        const revokeTx = await vcRegistryContract.revokeCredentialEOA(hash, issuer);
        const receipt = await revokeTx.wait();
        await revokeVC(id);

        if (receipt.logs[0].args[0] === hash) {
            setAlert("Credential revoked successfully!", "success");
        }
    }

    const handleDetail = async (id) => {
        setVCId(id);
        setShowDetailModal(true);
        setLoading(true);
        try {
            const res = await retrieveVC(id);
            setVC(res.data);

            if (detailModal.current) {
                detailModal.current.showModal();
            }
        } catch (error) {
            console.error("Error retrieving VC:", error);
        } finally {
            setLoading(false);
        }
    }

    const closeModal = () => {
        if (showDetailModal) {
            setShowDetailModal(false);
            if (detailModal.current) {
                detailModal.current.close();
            }
        } else {
            setShowPresentModal(false);
            if (presentModal.current) {
                presentModal.current.close();
            }
        }


    }


    const handleVerify = async (vcInput) => {
        const res = await retrieveVC(vcInput._id);
        const vc = res.data;
        const issuer = vc.issuer.replace('did:didify:', '');
        const holder = vc.holder.replace('did:didify:', '');
        const credentialSubject = vc.credentialSubject.credentialSubject;

        const credentialSubjectHex = keccak256(toUtf8Bytes(JSON.stringify(vc.credentialSubject.credentialSubject)));

        const iat = new Date(vc.issuanceDate);
        const exp = new Date(vc.expirationDate);

        const validTo = Math.floor(exp.getTime() / 1000);
        const validFrom = Math.floor(iat.getTime() / 100);
        const issuerSig = vc.proof.proof;

        
        const sampleData = {
            issuer: vc.issuer,
            holder: vc.holder,
            issuanceDate: iat,
            expirationDate: exp,
            credentialSubject,
        }
        let holderSig;
        try {
            holderSig = await constructMsgAndSign(sampleData);
        } catch (error) {
            console.log("Error", error);
        }

        const isIssuer = await verifierRegistryContract.verifyCredential([issuer, holder, credentialSubjectHex, validFrom, validTo], issuerSig, holderSig);
        const isExist = await verifierRegistryContract.exist(keccak256(toUtf8Bytes(vcInput._id)), issuer);
        const isValid = await verifierRegistryContract.validate(keccak256(toUtf8Bytes(vcInput._id)), issuer);

        if (isIssuer[0] === true && isIssuer[1] && isExist === true && isValid === true) {
            setAlert("Credential verified successfully!", "success");
            await updateRequestedVC(vcInput._id, 'valid');
        } else {
            setAlert("Credential verification failed!", "error");
            await updateRequestedVC(vcInput._id, 'invalid');
        }
    }

    const handleRequest = async (id) => {
        setVCId(id);
        try {
            await updateRequestedVC(id, 'requested');
        } catch (error) {
            console.error("Error requesting VC:", error);
        }
    }

    const handlePresentation = async (id) => {
        setVCId(id);
        setShowPresentModal(true);
        if (presentModal.current) {
            presentModal.current.showModal();
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

    const handleSendPresentation = async (data) => {
        const { verifier } = data;

        try {
            await createPresentation(user.account, verifier, vcId);
            closeModal();
            setAlert("Presentation sent successfully!", "success");
        } catch (error) {
            console.error("Error sending presentation:", error);
        }
    
    }

    return (
        <>
            <div className="m-8">
                <table className="table">
                    <thead>
                        <tr>
                            {
                                (type === 'request' || type === 'verify') ? (
                                    <>
                                        <th>ID</th>
                                        <th>Holder</th>
                                        <th>Issuer</th>
                                        <th>Status</th>
                                    </>
                                ) : (
                                    <>
                                        <th>ID</th>
                                        <th>Subject</th>
                                        <th>Issuer</th>
                                        <th>Type</th>
                                        <th>Issuance Date</th>
                                        <th>Expiry Date</th>
                                        <th>Status</th>
                                        <th>Detail</th>
                                    </>
                                )
                            }
                            {type === 'request' ? (
                                <th>Verify</th>
                            ) : type === 'verify' ? (
                                <th>Request</th>
                            ) : (
                                <>
                                    <th>Present</th>
                                    <th>Revoke</th>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {
                            currentTableData.map((item, index) => (
                                <tr key={index}>

                                    {
                                        (type === 'request' || type === 'verify') ? (
                                            <>
                                                <td>{shortenAccount(item._id._id)}</td>
                                                <td>{shortenAccount(item.holder)}</td>
                                                <td>{shortenAccount(item._id.issuer)}</td>
                                                <td>{item.status}</td>
                                            </>
                                        ) : (
                                            <>
                                                <td>{shortenAccount(item._id)}</td>
                                                <td>{shortenAccount(item.subject)}</td>
                                                <td>{shortenAccount(item.issuer)}</td>
                                                <td>{item.type}</td>
                                                <td>{item.iat}</td>
                                                <td>{item.exp}</td>
                                                <td>{item.status ? 'Active' : 'Inactive'}</td>
                                                <td>
                                                    <button className="btn" onClick={() => handleDetail(item._id)}>
                                                        <BiDetail />
                                                    </button>
                                                </td>
                                            </>
                                        )
                                    }
                                    {
                                        type === 'request' ? (
                                            <td>
                                                <button className="btn" disabled={item.status !== 'requested'} onClick={() => handleVerify(item._id)}>
                                                    <GoVerified />
                                                </button>
                                            </td>
                                        ) : type === 'verify' ? (
                                            <td>
                                                    <button className="btn" disabled={item.status !== 'presented'} onClick={() => handleRequest(item._id._id)}>
                                                    <FiSend />
                                                </button>
                                            </td>
                                        ) : (
                                            <>
                                                <td>
                                                    <button className="btn" onClick={() => handlePresentation(item._id)}>
                                                        <MdOutlineCoPresent />
                                                    </button>
                                                </td>
                                                <td>
                                                    <button className="btn" onClick={() => handleRevoke(item._id, item.issuer)}>
                                                        <FaRegTrashCan />
                                                    </button>
                                                </td>
                                            </>

                                        )
                                    }
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
                showDetailModal && (
                    <dialog ref={detailModal} className="modal">
                        <div className="modal-box">
                            <form method="dialog">
                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={() => closeModal()}>✕</button>
                            </form>
                            <h3 className="text-lg font-bold">Credential Details</h3>
                            {loading ? (
                                <div className="py-4">
                                    <span class="loading loading-spinner loading-lg"></span>
                                </div>
                            ) : (
                                <div className="py-4">
                                    <p>
                                        <strong>Credential ID:</strong> {vc._id}<br />
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
                                <button className="btn btn-primary" onClick={() => handleVerify(vcId)}>Verify</button>
                            </div>
                        </div>
                    </dialog>
                )
            }
            {
                showPresentModal && (
                    <dialog ref={presentModal} className="modal">
                        <div className="modal-box">
                            <form method="dialog" >
                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={() => closeModal()}>✕</button>
                            </form >
                            <form onSubmit={handleSubmit(handleSendPresentation)}>
                                <h1 className="text-lg font-bold">Send a Presentation</h1>
                                <div class="label">
                                    <span class="label-text font-bold">Credential ID</span>
                                </div>
                                <input type="text" placeholder={vcId} className="input input-bordered w-full max-w-xs" disabled/>

                                <div class="label">
                                    <span class="label-text font-bold">Verifier</span>
                                </div>
                                <input type="text" placeholder="Verifier ID" class="input input-bordered w-full max-w-xs" {...register('verifier', { require: true })} />
                                <div className="flex justify-end">
                                    <button type='submit' className="btn btn-primary">Send</button>
                                </div>
                            </form>
                        </div>
                    </dialog>
                )
            }
        </>
    );
};

export default Table;