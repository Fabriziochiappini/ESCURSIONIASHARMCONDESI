import { useEffect } from "react";

export default function PayPalReturn() {
  useEffect(() => {
    // Close window automatically when PayPal redirects here after approval
    window.close();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Pagamento approvato!
        </h2>
        <p className="text-gray-600">
          Puoi chiudere questa finestra.
        </p>
      </div>
    </div>
  );
}
