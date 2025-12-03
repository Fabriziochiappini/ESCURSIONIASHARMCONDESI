import { useEffect } from "react";

declare global {
  interface Window {
    FB: any;
    fbAsyncInit: () => void;
  }
}

export function FacebookReviews() {
  useEffect(() => {
    if (window.FB) {
      window.FB.XFBML.parse();
    } else {
      window.fbAsyncInit = function() {
        window.FB.init({
          xfbml: true,
          version: 'v18.0'
        });
      };

      const script = document.createElement('script');
      script.src = 'https://connect.facebook.net/it_IT/sdk.js';
      script.async = true;
      script.defer = true;
      script.crossOrigin = 'anonymous';
      document.body.appendChild(script);
    }
  }, []);

  return (
    <section className="py-20 bg-gradient-to-br from-white via-[#A8CFEB]/5 to-white relative overflow-hidden">
      <div className="absolute top-10 left-10 w-72 h-72 bg-[#1877F2]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-[#C9A961] via-[#D4AF37] to-[#C9A961] bg-clip-text text-transparent tracking-[0.15em] uppercase drop-shadow-lg font-eagle-lake">
            Dicono di Noi
          </h2>
          <div className="w-48 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mb-6"></div>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto font-light">
            Le recensioni dei nostri clienti su Facebook
          </p>
        </div>

        <div className="flex justify-center">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 max-w-full overflow-hidden">
            <div 
              className="fb-page" 
              data-href="https://www.facebook.com/siviaggiacondesi/"
              data-tabs="reviews"
              data-width="500"
              data-height="600"
              data-small-header="false"
              data-adapt-container-width="true"
              data-hide-cover="false"
              data-show-facepile="true"
            >
              <blockquote 
                cite="https://www.facebook.com/siviaggiacondesi/" 
                className="fb-xfbml-parse-ignore"
              >
                <a href="https://www.facebook.com/siviaggiacondesi/">Si Viaggia con Desi</a>
              </blockquote>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <a 
            href="https://www.facebook.com/siviaggiacondesi/reviews"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#1877F2] hover:bg-[#166FE5] text-white px-6 py-3 rounded-full font-medium transition-all shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Vedi tutte le recensioni
          </a>
        </div>
      </div>
    </section>
  );
}
