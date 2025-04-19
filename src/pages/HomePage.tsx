import React, { useState, useEffect } from 'react';
import { ApartmentCard } from '../components/ApartmentCard';
import { BookingForm } from '../components/BookingForm';
import { Apartment } from '../types';
import { supabase } from '../lib/supabase';
import { Facebook, Instagram } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function HomePage() {
  const { t } = useLanguage();
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
      <section className="pt-32 px-4 pb-24">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            {t('our.apartments')}
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

      <footer className="bg-[#3D4B3F] text-[#E3D5C9] py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-light mb-6">{t('contact.us')}</h2>
              <div className="space-y-2">
                <p>{t('address')}: Kudrionių Girios k. 12, Trakai</p>
                <p>+37061580004</p>
                <p>info@girioshorizontas.lt</p>
              </div>
            </div>

            <div>
              <h2 className="text-4xl font-light mb-6">{t('follow.us')}</h2>
              <div className="flex gap-4">
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#E3D5C9] hover:text-white transition-colors"
                >
                  <Facebook className="w-8 h-8" />
                </a>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#E3D5C9] hover:text-white transition-colors"
                >
                  <Instagram className="w-8 h-8" />
                </a>
              </div>
            </div>

            <div className="pt-8 border-t border-[#E3D5C9]/20">
              <p className="text-sm">© 2025 Girios Horizontas - {t('all.rights.reserved')}</p>
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