const axios = require('axios');

class TSYSService {
  constructor() {
    this.baseURL = process.env.TSYS_API_URL || 'https://certapi.tsys.com/expressxml';
    this.credentials = {
      clientId: process.env.TSYS_CLIENT_ID,
      userId: process.env.TSYS_USER_ID,
      password: process.env.TSYS_PASSWORD,
      bank: process.env.TSYS_BANK_ID,
      bin: process.env.TSYS_BIN_ID
    };
  }

  generateJobXML(command, data) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<job>
  <header>
    <clientId>${this.credentials.clientId}</clientId>
    <userId>${this.credentials.userId}</userId>
    <password>${this.credentials.password}</password>
    <bank>${this.credentials.bank}</bank>
    <bin>${this.credentials.bin}</bin>
  </header>
  <request>
    <command>${command}</command>
    <data><![CDATA[${data}]]></data>
  </request>
</job>`;
  }

  buildMerchantXML(merchantData) {
    return `<Request>
  <MerchantInfo>
    <BusinessName>${merchantData.businessName}</BusinessName>
    <DBA>${merchantData.dbaName || merchantData.businessName}</DBA>
    <MCC>${merchantData.mcc}</MCC>
    <TaxId>${merchantData.taxId}</TaxId>
  </MerchantInfo>
  <Address>
    <Street>${merchantData.address.street}</Street>
    <City>${merchantData.address.city}</City>
    <State>${merchantData.address.state}</State>
    <Zip>${merchantData.address.zip}</Zip>
  </Address>
  <Contact>
    <Phone>${merchantData.phone || ''}</Phone>
    <Email>${merchantData.email || ''}</Email>
  </Contact>
</Request>`;
  }

  async addMerchant(merchantData) {
    const requestData = this.buildMerchantXML(merchantData);
    const jobXML = this.generateJobXML('AddMerchant', requestData);
    
    console.log('Generated TSYS XML for AddMerchant:', jobXML);
    
    // For POC - simulate API call
    // In production, uncomment the actual HTTP request:
    /*
    try {
      const response = await axios.post(this.baseURL, jobXML, {
        headers: {
          'Content-Type': 'application/xml',
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(`TSYS API Error: ${error.message}`);
    }
    */
    
    // Mock response for POC
    return {
      success: true,
      merchantId: `MOCK_${Date.now()}`,
      jobId: `JOB_${Date.now()}`,
      status: 'pending'
    };
  }
}

module.exports = TSYSService;
