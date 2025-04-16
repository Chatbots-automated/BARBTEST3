import React, { useState, useEffect } from 'react';
import { ApartmentCard } from '../components/ApartmentCard';
import { BookingForm } from '../components/BookingForm';
import { Apartment } from '../types';
import { supabase } from '../lib/supabase';

export function HomePage() {
  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(null);
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    async function fetchApartments() {
      try {
        const { data, error } = await supabase
          .from('apartments')
          .select('id, name, description, price_per_night, image_url');

        if (error) throw error;
        setApartments(data);
      } catch (err) {
        console.error('Error fetching apartments:', err);
        setError('Nepavyko užkrauti apartamentų');
      } finally {
        setIsLoading(false);
      }
    }

    fetchApartments();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-[#F5F2EA] flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Klaida</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F2EA]">
      {/* Hero Section */}
      <section className="pt-32 px-4 pb-16 bg-gradient-to-b from-[#F5F2EA] to-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Atraskite ramybę Girios Horizonte
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Prabangūs apartamentai ir nameliai, apsupti žalios gamtos, 
            sukurti jūsų tobulam poilsiui Trakų apylinkėse.
          </p>
        </div>
      </section>

      {/* Apartments Section */}
      <section className="px-4 pb-24">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Mūsų Apartamentai
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {isLoading ? (
              [...Array(4)].map((_, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-xl overflow-hidden animate-pulse">
                  <div className="h-64 bg-gray-200" />
                  <div className="p-8 space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-12 bg-gray-200 rounded" />
                  </div>
                </div>
              ))
            ) : (
              apartments.map((apartment) => (
                <ApartmentCard
                  key={apartment.id}
                  apartment={apartment}
                  onSelect={setSelectedApartment}
                />
              ))
            )}
          </div>
        </div>
      </section>

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

      {selectedApartment && (
        <BookingForm
          apartment={selectedApartment}
          onClose={() => setSelectedApartment(null)}
        />
      )}
    </div>
  );
}