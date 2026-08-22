const fs = require('fs');

function updateFile(file) {
  let code = fs.readFileSync(file, 'utf8');
  
  const regex = /const handleLocationSelect = \(lat: number, lng: number, addressDetails\?: any\) => \{[\s\S]*?setFormData\(prev => \(\{[\s\S]*?\}\)\);\n\s*\};/m;

  const replacement = `const handleLocationSelect = (lat: number, lng: number, addressDetails?: any) => {
    if (!addressDetails) return;
    
    // In checkout, we need to switch to 'new' form
    if (typeof setSelectedAddressId === 'function') {
      setSelectedAddressId('new');
    }

    setFormData(prev => ({
      ...prev,
      lat,
      lng,
      addressLine1: addressDetails.addressLine1 || '',
      addressLine2: addressDetails.addressLine2 || '',
      city: addressDetails.city || '',
      state: addressDetails.state || '',
      pincode: addressDetails.pincode || ''
    }));
  };`;

  code = code.replace(regex, replacement);
  fs.writeFileSync(file, code);
}

updateFile('app/(customer)/checkout/page.tsx');
updateFile('app/(customer)/account/address/page.tsx');

console.log('Updated handleLocationSelect in checkout and account/address');
