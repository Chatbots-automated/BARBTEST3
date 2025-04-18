import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Users, MapPin, Info, Phone } from 'lucide-react';
import { BookingCalendar } from '../components/BookingCalendar';
import { Apartment } from '../types';
import { supabase } from '../lib/supabase';
import { format, differenceInDays, eachDayOfInterval, parseISO, isSameDay, subDays, isAfter } from 'date-fns';

export function ApartmentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [apartment, setApartment] = useState<Apartment | null>(null);
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [numberOfGuests, setNumberOfGuests] = useState(2);
  const [hasPets, setHasPets] = useState(false);
  const [extraBed, setExtraBed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [fullNameError, setFullNameError] = useState(false);
  const [phoneNumberError, setPhoneNumberError] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount_percent: number } | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const getApartmentBaseName = (fullName: string): string => {
    const nameMap: { [key: string]: string } = {
      'Senovinis medinis namas "Gintaras"': 'gintaras',
      'Dvivietis apartamentas "Pikulas"': 'pikulas',
      'Šeimyninis apartamentas "Māra"': 'mara',
      'Namelis dviems "Medeinė"': 'medeine'
    };
    return nameMap[fullName] || fullName.toLowerCase();
  };

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

        const { data: bookings } = await supabase
          .from('bookings')
          .select('check_in, check_out')
          .eq('apartment_name', getApartmentBaseName(data.name));

        const allDates: Date[] = [];
        bookings?.forEach(booking => {
          const start = parseISO(booking.check_in);
          const end = parseISO(booking.check_out);
          const daysInRange = eachDayOfInterval({ start, end: subDays(end, 1) });
          allDates.push(...daysInRange);
        });

        setBookedDates(allDates);
      } catch (err) {
        console.error('Error fetching apartment:', err);
        setError('Nepavyko užkrauti apartamento informacijos');
      } finally {
        setIsLoading(false);
      }
    }

    fetchApartment();
  }, [id]);

  const handleDateSelect = (date: Date) => {
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(date);
      setCheckOut(null);
    } else {
      if (isAfter(date, checkIn)) {
        const datesInRange = eachDayOfInterval({ start: checkIn, end: date });
        const hasBookedDates = datesInRange.some(d => bookedDates.some(bd => isSameDay(bd, d)));
        
        if (!hasBookedDates) {
          setCheckOut(date);
        } else {
          setError('Pasirinktas intervalas turi užimtų datų');
        }
      } else {
        setCheckIn(date);
        setCheckOut(null);
      }
    }
  };

  const validateInputs = () => {
    let isValid = true;
    
    if (!email.trim()) {
      setEmailError(true);
      isValid = false;
    } else {
      setEmailError(false);
    }
    
    if (!fullName.trim()) {
      setFullNameError(true);
      isValid = false;
    } else {
      setFullNameError(false);
    }

    if (!phoneNumber.trim()) {
      setPhoneNumberError(true);
      isValid = false;
    } else {
      setPhoneNumberError(false);
    }
    
    return isValid;
  };

  const handleBooking = async () => {
    if (!validateInputs()) {
      return;
    }

    if (!checkIn || !checkOut || !apartment) return;

    const totalPrice = calculateTotalPrice();
    const params = new URLSearchParams({
      mode: 'payment',
      success_url: `${window.location.origin}/success`,
      cancel_url: `${window.location.origin}/fail`,
      customer_email: email,
      'line_items[0][price_data][currency]': 'eur',
      'line_items[0][price_data][product_data][name]': apartment.name,
      'line_items[0][price_data][unit_amount]': Math.round(totalPrice * 100).toString(),
      'line_items[0][quantity]': '1',
      'metadata[apartmentId]': apartment.id,
      'metadata[apartmentName]': getApartmentBaseName(apartment.name),
      'metadata[checkIn]': format(checkIn, 'yyyy-MM-dd'),
      'metadata[checkOut]': format(checkOut, 'yyyy-MM-dd'),
      'metadata[email]': email,
      'metadata[fullName]': fullName,
      'metadata[phoneNumber]': phoneNumber,
      'metadata[numberOfGuests]': numberOfGuests.toString(),
      'metadata[hasPets]': hasPets ? 'true' : 'false',
      'metadata[extraBed]': extraBed ? 'true' : 'false',
      'metadata[price]': totalPrice.toString(),
    });

    try {
      const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer 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`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params,
      });

      const session = await response.json();
      window.location.href = session.url;
    } catch (err) {
      console.error('Error creating checkout session:', err);
      setError('Nepavyko sukurti užsakymo');
    }
  };

  const calculateTotalPrice = () => {
    if (!checkIn || !checkOut || !apartment) return 0;

    const numberOfNights = differenceInDays(checkOut, checkIn);
    let total = numberOfNights * apartment.price_per_night;

    if (hasPets) {
      total += 10;
    }

    if (apartment.id === 'pikulas' && extraBed) {
      total += 15;
    }

    return total;
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
            className="mt-6 px-6 py-2 bg-[#807730] text-white rounded hover:bg-[#6a632a] transition-colors"
          >
            Grįžti į pradžią
          </button>
        </div>
      </div>
    );
  }

  const totalPrice = calculateTotalPrice();

  return (
    <div className="pt-24 min-h-screen bg-[#F5F2EA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Grįžti į visus apartamentus
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <img
              src={apartment.image_url || '/placeholder.jpg'}
              alt={apartment.name}
              className="w-full h-[600px] object-cover rounded-2xl shadow-lg"
            />
          </div>

          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{apartment.name}</h1>
              <div className="flex items-center text-gray-600 mb-6">
                <MapPin className="w-5 h-5 mr-2" />
                <span>Trakai, Lietuva</span>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed">{apartment.description}</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-gray-600 text-sm">Nuo </span>
                  <span className="text-3xl font-bold text-gray-900">€{apartment.price_per_night}</span>
                  <span className="text-gray-600 ml-2">/ naktis</span>
                </div>
              </div>

              <BookingCalendar
                bookedDates={bookedDates}
                checkIn={checkIn}
                checkOut={checkOut}
                onDateSelect={handleDateSelect}
                numberOfGuests={numberOfGuests}
                onGuestsChange={setNumberOfGuests}
              />

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vardas Pavardė
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      setFullNameError(false);
                    }}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
                      fullNameError ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Įveskite vardą ir pavardę"
                  />
                  {fullNameError && (
                    <p className="text-red-500 text-sm mt-1">Prašome užpildyti šį laukelį</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    El. paštas
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError(false);
                    }}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
                      emailError ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="El paštas"
                  />
                  {emailError && (
                    <p className="text-red-500 text-sm mt-1">Prašome užpildyti šį laukelį</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefono numeris
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => {
                        setPhoneNumber(e.target.value);
                        setPhoneNumberError(false);
                      }}
                      className={`w-full pl-12 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
                        phoneNumberError ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Telefono numeris"
                    />
                  </div>
                  {phoneNumberError && (
                    <p className="text-red-500 text-sm mt-1">Prašome užpildyti šį laukelį</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Svečių skaičius
                  </label>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="number"
                      min="1"
                      max="12"
                      value={numberOfGuests}
                      onChange={(e) => setNumberOfGuests(parseInt(e.target.value))}
                      className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="Įveskite svečių skaičių"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={hasPets}
                      onChange={(e) => setHasPets(e.target.checked)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span>Augintinis (+10€)</span>
                  </label>

                  {apartment.id === 'pikulas' && (
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={extraBed}
                        onChange={(e) => setExtraBed(e.target.checked)}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span>Papildoma lova (+15€)</span>
                    </label>
                  )}
                </div>

                {checkIn && checkOut && (
                  <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nuo </span>
                      <span>€{apartment.price_per_night}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Naktų skaičius</span>
                      <span>{differenceInDays(checkOut, checkIn)}</span>
                    </div>
                    {hasPets && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Augintinio mokestis</span>
                        <span>€10</span>
                      </div>
                    )}
                    {apartment.id === 'pikulas' && extraBed && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Papildoma lova</span>
                        <span>€15</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold pt-2 border-t border-gray-200">
                      <span>Viso</span>
                      <span>€{totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleBooking}
                  disabled={!checkIn || !checkOut || !email || !fullName || !phoneNumber}
                  className="w-full bg-[#807730] hover:bg-[#6a632a] text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  Rezervuoti
                </button>

                {error && (
                  <p className="text-red-600 text-sm">{error}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}