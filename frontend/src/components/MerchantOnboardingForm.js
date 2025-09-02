import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import './MerchantOnboardingForm.css';

function MerchantOnboardingForm() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const onSubmit = async (data) => {
    setSubmitting(true);
    setResult(null);
    
    try {
      console.log('Submitting merchant data:', data);
      const response = await axios.post('/api/merchants/onboard', data);
      setResult(response.data);
      if (response.data.success) {
        reset(); // Clear form on success
      }
    } catch (error) {
      console.error('Submission error:', error);
      setResult({ 
        success: false,
        error: error.response?.data?.error || 'Submission failed',
        details: error.response?.data?.details || []
      });
    }
    setSubmitting(false);
  };

  const mccCodes = [
    { value: '5812', label: '5812 - Eating Places, Restaurants' },
    { value: '5411', label: '5411 - Grocery Stores, Supermarkets' },
    { value: '5541', label: '5541 - Service Stations' },
    { value: '5311', label: '5311 - Department Stores' },
    { value: '7372', label: '7372 - Computer Programming, Data Processing' }
  ];

  return (
    <div className="form-container">
      <div className="form-card">
        <h2>Merchant Information</h2>
        
        {result && (
          <div className={`alert ${result.success ? 'alert-success' : 'alert-error'}`}>
            {result.success ? (
              <div>
                <strong>Success!</strong> Merchant submitted to TSYS
                <br />
                <small>Merchant ID: {result.merchantId}</small>
              </div>
            ) : (
              <div>
                <strong>Error:</strong> {result.error}
                {result.details && result.details.length > 0 && (
                  <ul>
                    {result.details.map((detail, index) => (
                      <li key={index}>{detail}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="onboarding-form">
          <div className="form-section">
            <h3>Business Information</h3>
            
            <div className="form-group">
              <label>Business Name *</label>
              <input
                {...register('businessName', { required: 'Business name is required' })}
                placeholder="Enter legal business name"
              />
              {errors.businessName && <span className="error">{errors.businessName.message}</span>}
            </div>

            <div className="form-group">
              <label>DBA Name</label>
              <input
                {...register('dbaName')}
                placeholder="Doing business as (if different)"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Tax ID (EIN) *</label>
                <input
                  {...register('taxId', { required: 'Tax ID is required' })}
                  placeholder="XX-XXXXXXX"
                />
                {errors.taxId && <span className="error">{errors.taxId.message}</span>}
              </div>

              <div className="form-group">
                <label>MCC Code *</label>
                <select {...register('mcc', { required: 'MCC is required' })}>
                  <option value="">Select MCC</option>
                  {mccCodes.map(code => (
                    <option key={code.value} value={code.value}>
                      {code.label}
                    </option>
                  ))}
                </select>
                {errors.mcc && <span className="error">{errors.mcc.message}</span>}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Business Address</h3>
            
            <div className="form-group">
              <label>Street Address *</label>
              <input
                {...register('address.street', { required: 'Street address is required' })}
                placeholder="123 Main Street"
              />
              {errors.address?.street && <span className="error">{errors.address.street.message}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City *</label>
                <input
                  {...register('address.city', { required: 'City is required' })}
                  placeholder="City"
                />
                {errors.address?.city && <span className="error">{errors.address.city.message}</span>}
              </div>

              <div className="form-group">
                <label>State *</label>
                <input
                  {...register('address.state', { required: 'State is required' })}
                  placeholder="CA"
                  maxLength="2"
                />
                {errors.address?.state && <span className="error">{errors.address.state.message}</span>}
              </div>

              <div className="form-group">
                <label>ZIP Code *</label>
                <input
                  {...register('address.zip', { required: 'ZIP code is required' })}
                  placeholder="90210"
                />
                {errors.address?.zip && <span className="error">{errors.address.zip.message}</span>}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Contact Information</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  {...register('phone')}
                  placeholder="(555) 123-4567"
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  {...register('email')}
                  placeholder="contact@business.com"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={`submit-button ${submitting ? 'loading' : ''}`}
          >
            {submitting ? 'Submitting to TSYS...' : 'Submit to TSYS'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default MerchantOnboardingForm;
