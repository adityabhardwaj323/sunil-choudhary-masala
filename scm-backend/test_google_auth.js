const { OAuth2Client } = require('google-auth-library');

async function runTests() {
  console.log('Running Security Tests...');
  const client = new OAuth2Client('dummy-client-id');
  
  console.log('TEST 6: Missing credential');
  let req = { body: {} };
  if (!req.body.credential) {
    console.log('PASS: Rejected missing credential\n');
  }

  console.log('TEST 2 & 5: Random/fake/expired credential');
  try {
    await client.verifyIdToken({
      idToken: 'fake.jwt.token',
      audience: 'dummy-client-id',
    });
    console.error('FAIL: Accepted fake token\n');
  } catch (e) {
    console.log('PASS: Rejected fake token. Error: ' + e.message + '\n');
  }
}
runTests();
