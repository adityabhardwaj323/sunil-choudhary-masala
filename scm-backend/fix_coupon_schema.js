const fs = require('fs');
const file = 'models/Coupon.js';
let code = fs.readFileSync(file, 'utf8');

if (!code.includes('isFirstOrderOnly')) {
    code = code.replace(
        /isActive: \{[\s\S]*?\},/m,
        `isActive: {
    type: Boolean,
    default: true
  },
  isFirstOrderOnly: {
    type: Boolean,
    default: false
  },`
    );
    fs.writeFileSync(file, code);
    console.log('Added isFirstOrderOnly to Schema');
} else {
    console.log('isFirstOrderOnly already exists');
}
