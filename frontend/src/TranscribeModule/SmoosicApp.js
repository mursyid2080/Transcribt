import React, { useEffect, useRef } from 'react';

const SmoosicApp = ({ config }) => {
  const smoosicContainerRef = useRef(null);

  // Load Smoosic and jQuery scripts dynamically
  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = () => resolve(script);
      script.onerror = () => reject(new Error(`Script load error: ${src}`));
      document.body.appendChild(script);
    });
  };

  // Initialize the Smoosic app after the component is mounted
  useEffect(() => {
    const initSmoosic = async () => {
      try {
        // Load jQuery
        await loadScript('https://code.jquery.com/jquery-3.3.1.slim.js');

        // Load Smoosic
        await loadScript(`../../public/smoosic/build/smoosic.js`);
        console.log('Smoosic URL:', `${process.env.PUBLIC_URL}/smoosic/build/smoosic.js`);


        // Initialize Smoosic only after scripts are loaded and Smo is available
        if (window.Smo) {
          // Create the DOM components where the menus/buttons go
          window.Smo.SuiDom.createUiDom(smoosicContainerRef.current);

          // Start the application with the passed config
          window.Smo.SuiApplication.configure(config);
        } else {
          console.error('Smo is not defined');
        }
      } catch (error) {
        console.error('Error loading scripts or initializing Smoosic:', error);
      }
    };

    initSmoosic();

    // Cleanup when the component is unmounted
    return () => {
      if (window.Smo) {
        // Call a cleanup function if Smoosic provides one
        if (typeof window.Smo.SuiApplication.cleanup === 'function') {
          window.Smo.SuiApplication.cleanup();
        }
      }
    };
  }, [config]); // Rerun the effect if the config changes

  return <div ref={smoosicContainerRef} />; // No initial rendering
};

export default SmoosicApp;
