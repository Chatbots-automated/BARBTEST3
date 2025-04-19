import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export function SuccessPage() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F2EA] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Dėkojame!
        </h1>
        <p className="text-gray-600 mb-8">
          Jūsų rezervacija patvirtinta. Detalią informaciją išsiuntėme Jums el.paštu. Pasitikrinkite ir spam skiltį.
        </p>
        <button
          onClick={() => navigate('/')}
          className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-xl font-medium transition-colors"
        >
          Grįžti į pradžią
        </button>
      </div>
    </div>
  );
}