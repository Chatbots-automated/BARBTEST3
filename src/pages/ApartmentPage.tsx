import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Users, Coffee, Wind, Tv, MapPin, Info } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { format, differenceInDays, eachDayOfInterval, parseISO, isSameDay, isBefore, startOfToday } from 'date-fns';
import { lt } from 'date-fns/locale';
import { Apartment } from '../types';
import { supabase } from '../lib/supabase';

export function ApartmentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [apartment, setApartment] = useState<Apartment | null>(null);
  const [selectedDates, setSelectedDates] = useState<{
    checkIn: Date | null;
    checkOut: Date | null;
  }>({
    checkIn: null,
    checkOut: null
  });
  const [numberOfGuests, setNumberOfGuests] = useState(2);
  const [hasPets, setHasPets] = useState(false);
  const [extraBed, setExtraBed] = useState(false);
  const [email, setEmail] = useState('');
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState('');

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

  useEffect(() => {
    async function fetchBookedDates() {
      if (!apartment) return;

      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('check_in, check_out')
          .eq('apartment_id', apartment.id);

        if (error) throw error;

        const allDates = data.flatMap(booking => {
          const start = parseISO(booking.check_in);
          const end = parseISO(booking.check_out);
          return eachDayOfInterval({ start, end });
        });

        setBookedDates(allDates);
      } catch (err) {
        console.error('Error fetching booked dates:', err);
      }
    }

    fetchBookedDates();
  }, [apartment]);

  const getDayClassName = (date: Date) => {
    const today = startOfToday();
    if (isBefore(date, today)) {
      return 'text-gray-300 cursor-not-allowed';
    }
    if (isDateBooked(date)) {
      return 'text-red-400 line-through cursor-not-allowed';
    }
    return '';
  };

  const isDateBooked = (date: Date) => {
    return bookedDates.some(bookedDate => isSameDay(date, bookedDate));
  };

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setSelectedDates({
      checkIn: start,
      checkOut: end
    });
  };

  const calculateTotalPrice = () => {
    if (!selectedDates.checkIn || !selectedDates.checkOut || !apartment) return 0;
    
    const nights = differenceInDays(selectedDates.checkOut, selectedDates.checkIn);
    let total = nights * apartment.price_per_night;
    
    if (hasPets) total += 10;
    if (extraBed) total += 15;
    
    return total;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

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

            <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-md space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Pasirinkite datas</h3>
                <DatePicker
                  selected={selectedDates.checkIn}
                  onChange={handleDateChange}
                  startDate={selectedDates.checkIn}
                  endDate={selectedDates.checkOut}
                  selectsRange
                  inline
                  monthsShown={1}
                  locale={lt}
                  minDate={new Date()}
                  dayClassName={getDayClassName}
                  excludeDates={bookedDates}
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Svečių skaičius</h3>
                <div className="flex gap-4">
                  {[1, 2, 3, 4].map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setNumberOfGuests(num)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center border ${
                        numberOfGuests === num
                          ? 'bg-[#807730] text-white border-[#807730]'
                          : 'border-gray-300 text-gray-700 hover:border-[#807730]'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={hasPets}
                    onChange={(e) => setHasPets(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-[#807730] focus:ring-[#807730]"
                  />
                  <span className="text-gray-700">Augintinio mokestis (10€)</span>
                </label>

                {apartment.id === 'pikulas' && (
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={extraBed}
                      onChange={(e) => setExtraBed(e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 text-[#807730] focus:ring-[#807730]"
                    />
                    <span className="text-gray-700">Papildoma lova (15€)</span>
                  </label>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  El. pašto adresas
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#807730] focus:border-[#807730]"
                  placeholder="jusu@pastas.lt"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nuolaidos kodas
                </label>
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#807730] focus:border-[#807730]"
                  placeholder="Įveskite kodą"
                />
              </div>

              <div className="pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-600">Bendra suma</span>
                  <span className="text-2xl font-bold">€{calculateTotalPrice()}</span>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#807730] text-white py-4 rounded-xl font-medium hover:bg-[#6a6428] transition-colors"
                >
                  Rezervuoti
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}