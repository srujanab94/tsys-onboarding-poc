const TSYSService = require('../services/tsysService');

class MerchantController {
  constructor() {
    this.tsysService = new TSYSService();
    this.merchants = new Map(); // In-memory storage for POC
  }

  async onboardMerchant(req, res) {
    try {
      const merchantData = req.body;
      console.log('Received merchant onboarding request:', merchantData);
      
      // Validate required fields
      const validation = this.validateMerchantData(merchantData);
      if (!validation.isValid) {
        return res.status(400).json({ 
          success: false,
          error: 'Validation failed',
          details: validation.errors 
        });
      }

      // Process TSYS onboarding
      const result = await this.processOnboarding(merchantData);
      
      // Store merchant data for status tracking
      this.merchants.set(result.merchantId, {
        ...merchantData,
        ...result,
        createdAt: new Date().toISOString(),
        status: 'processing'
      });

      res.json({
        success: true,
        merchantId: result.merchantId,
        status: 'submitted',
        message: 'Merchant onboarding submitted to TSYS successfully'
      });
    } catch (error) {
      console.error('Onboarding error:', error);
      res.status(500).json({ 
        success: false,
        error: 'Onboarding failed',
        message: error.message 
      });
    }
  }

  async getStatus(req, res) {
    try {
      const { id } = req.params;
      const merchant = this.merchants.get(id);
      
      if (!merchant) {
        return res.status(404).json({ 
          success: false,
          error: 'Merchant not found' 
        });
      }

      res.json({
        success: true,
        merchant: {
          id: id,
          businessName: merchant.businessName,
          status: merchant.status,
          createdAt: merchant.createdAt
        }
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        error: 'Failed to retrieve status' 
      });
    }
  }

  async processOnboarding(merchantData) {
    // For POC, we'll just do AddMerchant
    // In production, you'd do the full sequence:
    // AddMerchant -> AddOwner -> AddBankAccount -> AddContact -> BuildProfile
    
    const result = await this.tsysService.addMerchant(merchantData);
    
    return {
      merchantId: result.merchantId,
      jobId: result.jobId,
      steps: ['merchant_added'],
      nextSteps: ['Add Owner', 'Add Bank Account', 'Add Terminal']
    };
  }

  validateMerchantData(data) {
    const errors = [];
    
    if (!data.businessName) errors.push('Business name is required');
    if (!data.taxId) errors.push('Tax ID is required');
    if (!data.mcc) errors.push('MCC code is required');
    if (!data.address?.street) errors.push('Street address is required');
    if (!data.address?.city) errors.push('City is required');
    if (!data.address?.state) errors.push('State is required');
    if (!data.address?.zip) errors.push('ZIP code is required');
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

module.exports = new MerchantController();
