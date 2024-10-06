import { useSelector } from "react-redux";
import { grantRole, issueVC } from "../apis/credentials/credential.api";
import useAlert from "../hooks/useAlert";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import constructMsgAndSign from "../utils/eip-712.util";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slices/users.slice";
import connectWallet from "../utils/connectWallet.util";

const IssueCredential = () => {
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();
    const { setAlert } = useAlert();
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm();
    const selectedType = watch('type');
    const [credentialType, setCredentialType] = useState(null);
    const [additionalAttributes, setAdditionalAttributes] = useState([]);
    const [issuedAt, setIssuedAt] = useState('');
    const [expiry, setExpiry] = useState('');

    useEffect(() => {
        setCredentialType(selectedType);
        setAdditionalAttributes([]);
    }, [selectedType]);



    useEffect(() => {
        if (!user.account) {
            connectWallet(dispatch);
        } else {
            window.ethereum.on('accountsChanged', function (accounts) {
                dispatch(setUser({ account: accounts[0] }));
                localStorage.setItem('user', JSON.stringify({ account: accounts[0] }));
            });
        }

        const now = new Date();
        setIssuedAt(now.toLocaleString());
        setValue('iat', now.toLocaleString());
        const expiryDate = now;
        expiryDate.setFullYear(expiryDate.getFullYear() + parseInt(expiry));
        setValue('exp', expiryDate.toLocaleString());
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [expiry, setValue]);

    const onSubmit = async (data) => {
        let { holder, iat, exp, type, additionalAttributes = [], ...credentialSubject } = data;

        if (type === '3') {
            type = 'License';
            credentialSubject = {
                licenseNumber: credentialSubject.licenseNumber,
                licenseOwner: credentialSubject.licenseOwner
            };
        } else if (type === '1') {
            type = 'UniversityDegree';
            credentialSubject = {
                degree: credentialSubject.degree,
                degreeName: credentialSubject.degreeName,
                student: credentialSubject.student,
                honor: credentialSubject.honor
            };
        } else if (type === '2') {
            type = 'WorkCredential';
            credentialSubject = {
                jobTitle: credentialSubject.jobTitle,
                worker: credentialSubject.worker,
                company: credentialSubject.company,
                workYear: credentialSubject.workYear
            };
        } else {
            type = 'Other';
            credentialSubject = {};
            additionalAttributes.forEach(attribute => {
                credentialSubject[attribute.name] = attribute.value;
            });
        }
        if ((type === 'UniversityDegree' || type === 'WorkCredential' || type === 'License') && additionalAttributes.length > 0) {
            additionalAttributes.forEach(attribute => {
                credentialSubject[attribute.name] = attribute.value;
            });
        }

        const vc = {
            "@context": "https://www.w3.org/2018/credentials/v1",
            type: ["VerifiableCredential", type],
            issuer: `did:didify:${user.account}`,
            holder: `did:didify:${holder}`,
            issuanceDate: iat,
            expirationDate: exp,
            credentialSubject,
            "evidence": "true",
            proof: {
                type: "Ed25519Signature2020",
                created: iat,
                proofPurpose: "assertionMethod",
                verificationMethod: process.env.REACT_APP_VERIFIER_ADDRESS,
                proofValue: ""
            }
        }

        try {
            const sig = await constructMsgAndSign(vc);
            vc.proof.proofValue = sig;
            console.log(vc);
            const data = {
                type,
                issuer: user.account,
                holder,
                credentialSubject,
                proof: sig,
                iat,
                exp
            }
            console.log(data);
            
            const result = await issueVC(data);
            console.log(result);
            
            if (result) {
                setAlert('Credential issued successfully!', 'success');
            }
        } catch (error) {
            console.error(error);
        }
    }

    const onError = (errors, e) => console.error(errors, e);

    const grantRoleForUser = async () => {
        try {
            console.log("Grant role to user");

            const data = await grantRole(user.account);
            if (data) {
                setAlert('Role ISSUER granted successfully', 'success');
            }
        } catch (error) {
            console.error(error);
        }
    }

    const addAttribute = () => {
        setAdditionalAttributes([...additionalAttributes, { id: additionalAttributes.length }]);
    };

    const handleAttributeNameChange = (index, event) => {
        const newAttributes = [...additionalAttributes];
        newAttributes[index].name = event.target.value;
        setAdditionalAttributes(newAttributes);
    };

    const handleExpiryChange = (e) => {
        setExpiry(e.target.value);
    }



    return (
        <div className="m-10">
            <button class="btn btn-primary mb-5" onClick={grantRoleForUser}>Register for issuer role</button>
            <h1 className='text-5xl font-bold'>Issue a credential</h1>
            <div class=" card card-side m-auto bg-base-100 w-96 shadow-xl">
                <form className="card-body" onSubmit={handleSubmit(onSubmit, onError)}>
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text font-bold">Type</span>
                        </label>
                        <select class="select select-bordered w-full" {...register('type', { required: true })}>
                            <option value="1">University degree</option>
                            <option value="2">Work credential</option>
                            <option value="3">License</option>
                            <option value="4">Other</option>
                        </select>
                        <label class="label">
                            <span class="label-text font-bold">Issuer</span>
                        </label>
                        <input type="text" placeholder={user.account} class="input input-bordered" disabled />
                        <label class="label">
                            <span class="label-text font-bold">Holder</span>
                        </label>
                        <input type="text" placeholder="Holder" class="input input-bordered" {...register('holder', { require: true })} />

                        <label class="label">
                            <span class="label-text font-bold">Issued At</span>
                        </label>
                        <input type="text" placeholder={issuedAt} class="input input-bordered" {...register('iat')} disabled />

                        <label class="label">
                            <span class="label-text font-bold">Expiry In</span>
                        </label>
                        <select class="select select-bordered w-full" defaultValue={1} onChange={handleExpiryChange}>
                            <option value="1">1 year</option>
                            <option value="2">2 years</option>
                            <option value="3">3 years</option>
                            <option value="4">4 years</option>
                            <option value="5">5 years</option>
                        </select>

                        <label class="label">
                            <span class="label-text font-bold">Expiry At</span>
                        </label>
                        <input type="text" placeholder={expiry} class="input input-bordered" {...register('exp')} disabled />

                        <label class="label">
                            <span class="label-text font-bold">Credential Subject</span>
                        </label>
                        {credentialType === '1' && (
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Degree</span>
                                </label>
                                <input type="text" placeholder="Degree" className="input input-bordered" {...register('degree', { required: true })} />
                                {errors.degree && <span className="text-red-500">Degree is required</span>}
                                <label className="label">
                                    <span className="label-text">Name of Degree</span>
                                </label>
                                <input type="text" placeholder="Name of the degree" className="input input-bordered" {...register('degreeName', { required: true })} />
                                {errors.degreeName && <span className="text-red-500">Degree Name is required</span>}

                                <label className="label">
                                    <span className="label-text">Student</span>
                                </label>
                                <input type="text" placeholder="Student" className="input input-bordered" {...register('student', { required: true })} />
                                {errors.student && <span className="text-red-500">Student is required</span>}
                                <label className="label">
                                    <span className="label-text">Level of honors</span>
                                </label>
                                <input type="text" placeholder="Level of honors" className="input input-bordered" {...register('honor', { required: true })} />
                                {errors.honor && <span className="text-red-500">Level of honors is required</span>}
                            </div>

                        )}
                        {credentialType === '2' && (
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Job Title</span>
                                </label>
                                <input type="text" placeholder="Job Title" className="input input-bordered" {...register('jobTitle', { required: true })} />
                                {errors.jobTitle && <span className="text-red-500">Job Title is required</span>}

                                <label className="label">
                                    <span className="label-text">Employee Name</span>
                                </label>
                                <input type="text" placeholder="Employee Name" className="input input-bordered" {...register('worker', { required: true })} />
                                {errors.worker && <span className="text-red-500">Employee Name is required</span>}

                                <label className="label">
                                    <span className="label-text">Company</span>
                                </label>
                                <input type="text" placeholder="Company Name" className="input input-bordered" {...register('company', { required: true })} />
                                {errors.company && <span className="text-red-500">Company is required</span>}

                                <label className="label">
                                    <span className="label-text">Years of work</span>
                                </label>
                                <input type="text" placeholder="Years of work" className="input input-bordered" {...register('workYear')} />
                            </div>
                        )}
                        {credentialType === '3' && (
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">License Owner</span>
                                </label>
                                <input type="text" placeholder="License Owner" className="input input-bordered" {...register('licenseOwner', { required: true })} />
                                {errors.licenseNumber && <span className="text-red-500">License Owner is required</span>}

                                <label className="label">
                                    <span className="label-text">License Number</span>
                                </label>
                                <input type="text" placeholder="License Number" className="input input-bordered" {...register('licenseNumber', { required: true })} />
                                {errors.licenseNumber && <span className="text-red-500">License Number is required</span>}
                            </div>
                        )}
                        {additionalAttributes.map((attribute, index) => (
                            <div key={attribute.id} className="form-control">
                                <label className="label">
                                    <span className="label-text">Attribute Name</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Attribute Name"
                                    className="input input-bordered"
                                    value={attribute.name}
                                    {...register(`additionalAttributes[${index}].name`, { required: true })}
                                    onChange={(e) => handleAttributeNameChange(index, e)}
                                />
                                <label className="label">
                                    <span className="label-text">Attribute Value</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder={`Attribute ${index + 1}`}
                                    className="input input-bordered"
                                    {...register(`additionalAttributes[${index}].value`, { required: true })}
                                />

                            </div>
                        ))}
                        <button className="btn mt-3" onClick={addAttribute}>

                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
                                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                            </svg>
                            Add attributes
                        </button>
                        <button type="submit" className="btn btn-primary mt-5">Issue Credential</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default IssueCredential