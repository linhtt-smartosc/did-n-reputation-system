import React from 'react'
import shortenAccount from '../../utils/shortenAccount.util'

const Stat = ({ account, totalCredential, reputation }) => {
    return (
        <div className='flex justify-center'>
            <div class="stats stats-vertical mt-5 md:stats-horizontal shadow">
                <div class="stat">
                    <div class="stat-title">DID</div>
                    <div class="stat-value">did:didify:{shortenAccount(account)}</div>
                </div>

                <div class="stat">
                    <div class="stat-title">Credential</div>
                    <div class="stat-value">{totalCredential}</div>
                </div>

                <div class="stat">
                    <div class="stat-title">Reputation</div>
                    <div class="stat-value">{reputation}</div>
                </div>
            </div>
        </div>
    )
}

export default Stat