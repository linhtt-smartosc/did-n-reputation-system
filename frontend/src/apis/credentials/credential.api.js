import { get, patch, post } from "../api_helper";

export async function getVCByHolder(account) {
    return await get(`/vc/subject/${account}`);
}

export async function issueVC(data) {
    return await post(`/vc`, data);
}

export async function revokeVC(id) {
    return await patch(`/vc/${id}`);
}

export async function getVCByIssuer(issuer) {
    return await get(`/vc/issuer/${issuer}`);
}

export async function grantRole(issuer) {
    return await post(`/vc/grant-role`, { issuer });
}

export async function retrieveVC(id) {
    return await get(`/vc/${id}`);
}

export async function createPresentation(holder, verifier, id) {
    return await post(`/vc/requestVC`, { holder, verifier, id });
}

export async function getRequestedVCByHolder(holder) {
    return await get(`/vc/requestVC/holder/${holder}`);
}

export async function getRequestedVCByVerifier(verifier) {
    return await get(`/vc/requestVC/verifier/${verifier}`);
}

export async function updateRequestedVC(id, status) {
    return await patch(`/vc/requestVC/${id}`, {status});
}


