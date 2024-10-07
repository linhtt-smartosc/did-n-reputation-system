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


