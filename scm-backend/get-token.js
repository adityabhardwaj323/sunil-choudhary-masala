const jwt = require('jsonwebtoken');
const token = jwt.sign({ id: 'dummyid123' }, 'scm_super_secret_key_change_this_in_production', { expiresIn: '1h' });
console.log('TOKEN:', token);
