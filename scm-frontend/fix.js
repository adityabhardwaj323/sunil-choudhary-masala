const fs = require('fs');

function fixFile(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Replace import
  content = content.replace(
    "import { useGoogleLogin } from '@react-oauth/google';", 
    "import { GoogleLogin } from '@react-oauth/google';"
  );

  // Replace loginWithGoogle declaration and body
  content = content.replace(
    /const loginWithGoogle = useGoogleLogin\(\{\s*onSuccess: async \(tokenResponse\) => \{[\s\S]*?onError: \(\) => \{\s*setError\('Google Login was cancelled or failed.'\);\s*\}\s*\}\);/,
    const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setLoading(true);
      setError('');
      
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          credential: credentialResponse.credential,
        }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Google Login failed');
      }

      localStorage.setItem('scm_user', JSON.stringify(data));
      router.push(redirectPath);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An error occurred during Google Login');
    } finally {
      setLoading(false);
    }
  };
  );

  // Replace button
  content = content.replace(
    /<button\s+type="button"\s+onClick=\{\(\) => loginWithGoogle\(\)\}[\s\S]*?<\/button>/,
    <div className="flex justify-center w-full">
        <GoogleLogin 
          onSuccess={handleGoogleSuccess}
          onError={() => setError('Google Login was cancelled or failed.')}
          useOneTap
          theme="outline"
          shape="rectangular"
          size="large"
          text="continue_with"
          width="100%"
        />
      </div>
  );

  fs.writeFileSync(file, content, 'utf8');
  console.log('Fixed', file);
}

fixFile('D:/sunil-choudhary-masala/scm-frontend/app/(customer)/login/page.tsx');
fixFile('D:/sunil-choudhary-masala/scm-frontend/app/(customer)/register/page.tsx');
