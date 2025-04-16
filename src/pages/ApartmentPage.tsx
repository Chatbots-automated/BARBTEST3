import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Calendar, Wifi, Coffee, Wind, Tv, MapPin, Users } from 'lucide-react';
import { BookingForm } from '../components/BookingForm';
import { Apartment } from '../types';
import { supabase } from '../lib/supabase';

export function ApartmentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [apartment, setApartment] = useState<Apartment | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(location.state?.showBookingForm || false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    async function fetchApartment() {
      try {
        const { data, error } = await supabase
          .from('apartments')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        if (!data) throw new Error('Apartamentas nerastas');
        
        setApartment(data);
      } catch (err) {
        console.error('Error fetching apartment:', err);
        setError('Nepavyko užkrauti apartamento informacijos');
      } finally {
        setIsLoading(false);
      }
    }

    fetchApartment();
  }, [id]);

  if (isLoading) {
    return (
      <div className="pt-24 min-h-screen bg-[#F5F2EA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-96 bg-gray-200 rounded-2xl" />
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !apartment) {
    return (
      <div className="pt-24 min-h-screen bg-[#F5F2EA] flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Klaida</h2>
          <p className="text-gray-600">{error || 'Apartamentas nerastas'}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-6 px-6 py-2 bg-[#807730] text-white rounded hover:bg-[#6a6428] transition-colors"
          >
            Grįžti į pradžią
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F2EA]">
      <div className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Grįžti į visus apartamentus
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <img
              src={apartment.image_url || '/placeholder.jpg'}
              alt={apartment.name}
              className="w-full h-[600px] object-cover rounded-2xl shadow-lg"
            />

            <div className="bg-white rounded-xl p-6 shadow-md">
              <h2 className="text-2xl font-semibold mb-6">Patogumai</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center text-gray-600">
                  <Coffee className="w-5 h-5 mr-3" />
                  <span>Virtuvė</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Wind className="w-5 h-5 mr-3" />
                  <span>Oro kondicionierius</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Tv className="w-5 h-5 mr-3" />
                  <span>Televizorius</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Wifi className="w-5 h-5 mr-3" />
                  <span>Bevielis internetas</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="w-5 h-5 mr-3" />
                  <span>2-4 asmenys</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{apartment.name}</h1>
              <div className="flex items-center text-gray-600 mb-6">
                <MapPin className="w-5 h-5 mr-2" />
                <span>Kudronių Girios K. 12, Trakai</span>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed">{apartment.description}</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-3xl font-bold text-gray-900">€{apartment.price_per_night}</span>
                  <span className="text-gray-600 ml-2">/ naktis</span>
                </div>
                <button
                  onClick={() => setShowBookingForm(true)}
                  className="px-8 py-3 bg-[#807730] text-white rounded-lg hover:bg-[#6a6428] transition-colors flex items-center gap-2"
                >
                  <Calendar className="w-5 h-5" />
                  Rezervuoti
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-[#1f3325] text-[#E5DFD3] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-medium mb-4">Susisiekite su mumis</h2>
              <div className="space-y-2 text-lg">
                <p>Adresas: Kudronių Girios K. 12, Trakai</p>
                <p>+37061580004</p>
                <p>info@girioshorizontas.lt</p>
              </div>
            </div>
            
            <div>
              <h2 className="text-3xl font-medium mb-4">Sekite mus</h2>
              <div className="flex gap-4">
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-[#E5DFD3] p-3 rounded-full hover:bg-white transition-colors"
                >
                  <img 
                    src="https://i.imgur.com/CSUHLiZ.png" 
                    alt="Facebook" 
                    className="w-6 h-6"
                  />
                </a>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-[#E5DFD3] p-3 rounded-full hover:bg-white transition-colors"
                >
                  <img 
                    src="https://i.imgur.com/lTHtTh9.png" 
                    alt="Instagram" 
                    className="w-6 h-6"
                  />
                </a>
              </div>
            </div>

            <div className="pt-8 border-t border-[#E5DFD3]/20 text-center">
              <p>© {new Date().getFullYear()} Girios Horizontas - All rights reserved</p>
            </div>
          </div>
        </div>
      </footer>

      {showBookingForm && (
        <BookingForm
          apartment={apartment}
          onClose={() => setShowBookingForm(false)}
        />
      )}
    </div>
  );
}