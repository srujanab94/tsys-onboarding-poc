import React from 'react';
import MerchantOnboardingForm from './components/MerchantOnboardingForm';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>TSYS Merchant Onboarding</h1>
        <p>Automated onboarding system for payment processing</p>
      </header>
      <main>
        <MerchantOnboardingForm />
      </main>
    </div>
  );
}

export default App;
