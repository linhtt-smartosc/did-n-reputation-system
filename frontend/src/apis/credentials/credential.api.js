import { get, post } from "../api_helper";

export async function getVCByHolder(account) {
    return await get(`/vc/subject/${account}`);
}

export async function issueVC(data) {
    return await post(`/vc`, data);
}

export async function revokeVC(did) {
    return await post(`/vc/${did}`);
}

export async function getVCByIssuer(issuer) {
    return await get(`/vc/issuer/${issuer}`);
}

export async function grantRole(issuer) {
    return await post(`/vc/grant-role`, { issuer });
}


