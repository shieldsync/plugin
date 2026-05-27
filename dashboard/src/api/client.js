const BASE_URL = window.shieldSyncData?.apiUrl || '/wp-json/shieldsync/v1'
const NONCE    = window.shieldSyncData?.nonce || ''

const headers = {
  'Content-Type': 'application/json',
  'X-WP-Nonce': NONCE,
}

export const api = {

  async getStats() {
    const res = await fetch(`${BASE_URL}/stats`, { headers })
    return res.json()
  },

  async getLogs() {
    const res = await fetch(`${BASE_URL}/logs`, { headers })
    return res.json()
  },

  async getBlockedIps() {
    const res = await fetch(`${BASE_URL}/blocked-ips`, { headers })
    return res.json()
  },

  async blockIp(ip) {
    const res = await fetch(`${BASE_URL}/block-ip`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ ip })
    })
    return res.json()
  },

  async unblockIp(ip) {
    const res = await fetch(`${BASE_URL}/unblock-ip/${ip}`, {
      method: 'DELETE',
      headers,
    })
    return res.json()
  },
}