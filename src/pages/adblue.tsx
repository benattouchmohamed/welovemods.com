import { useEffect } from 'react';

export default function AdBlueAuto() {
  useEffect(() => {
    // Define the global variable first
    (window as any).zByLg_plm_YxcjRc = { it: 4301277, key: '6f654' };

    // Load the external script dynamically
    const script = document.createElement('script');
    script.src = 'https://duw03nk63ml3f.cloudfront.net/697bf20.js';
    script.async = true;

    // When the script is loaded, call _Ul automatically
    script.onload = () => {
      if (typeof (window as any)._Ul === 'function') {
        (window as any)._Ul();
      } else {
        console.warn('_Ul function not found after script loaded');
      }
    };

    document.body.appendChild(script);

    // Clean up the script when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div>
   
    </div>
  );
}
