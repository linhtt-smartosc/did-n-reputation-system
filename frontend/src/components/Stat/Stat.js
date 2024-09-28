import React from 'react'
import shortenAccount from '../../utils/shortenAccount'

const Stat = (account, totalCredential) => {
  return (
      <div class="stats stats-vertical md:stats-horizontal shadow">
          <div class="stat">
              <div class="stat-title">DID</div>
              <div class="stat-value">`did:didify:${shortenAccount(account)}`</div>
          </div>

          <div class="stat">
              <div class="stat-title">Credential</div>
              <div class="stat-value">${totalCredential}</div>
          </div>
      </div>
  )
}

export default Stat