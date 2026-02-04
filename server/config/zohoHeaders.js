let accessToken = process.env.ZOHO_ACCESS_TOKEN

exports.setAccessToken = (token) => {
  accessToken = token
}

exports.getZohoHeaders = () => ({
  Authorization: `Zoho-oauthtoken ${accessToken}`,
  "X-com-zoho-inventory-organizationid": process.env.ZOHO_ORG_ID
})
