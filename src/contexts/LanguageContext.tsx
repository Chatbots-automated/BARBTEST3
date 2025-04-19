import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'lt';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    'back.to.apartments': 'Back to all apartments',
    'our.apartments': 'Our Apartments',
    'book.now': 'Book Now',
    'from': 'From',
    'per.night': 'per night',
    'guests': 'guests',
    'check.in': 'Check-in',
    'check.out': 'Check-out',
    'full.name': 'Full Name',
    'email': 'Email',
    'phone': 'Phone Number',
    'country': 'Country',
    'number.of.guests': 'Number of guests',
    'pet.fee': 'Pet fee (10€)',
    'extra.bed': 'Extra bed (15€)',
    'total': 'Total',
    'continue': 'Continue',
    'back': 'Back',
    'reserve': 'Reserve',
    'available': 'Available',
    'booked': 'Booked',
    'selected': 'Selected',
    'arrival': 'Arrival',
    'departure': 'Departure',
    'amenities': 'Amenities',
    'kitchen': 'Kitchen',
    'air.conditioning': 'Air conditioning',
    'tv': 'TV',
    'wifi': 'WiFi',
    'terrace': 'Terrace',
    'forest.view': 'Forest View',
    'lake.view': 'Lake View',
    'contact.us': 'Contact Us',
    'address': 'Address',
    'follow.us': 'Follow Us',
    'all.rights.reserved': 'All rights reserved',
    'booking': 'Booking',
    'guest.details': 'Guest Details',
    'enter.name': 'Enter your full name',
    'enter.email': 'Enter your email',
    'enter.phone': 'Enter phone number',
    'enter.country': 'Enter country',
    'price.per.night': 'Price per night',
    'number.of.nights': 'Number of nights',
    'pet.charge': 'Pet charge',
    'extra.bed.charge': 'Extra bed charge',
    'confirm.booking': 'Confirm Booking',
    'processing': 'Processing...',
    'please.fill': 'Please fill in this field',
    'discount.code': 'Discount code',
    'apply': 'Apply',
    'discount.applied': 'Discount applied',
    'rules.acceptance': 'I have read and agree to the House Rules',
    'view.rules': 'View Rules',
    'back.to.booking': 'Back to booking',
    'house.rules': 'House Rules',
    'booking.summary': 'Booking Summary',
    'apartment': 'Apartment',
    'guest': 'Guest',
    'total.price': 'Total Price',
    'discount': 'Discount',
    'proceed.to.payment': 'Proceed to Payment'
  },
  lt: {
    'back.to.apartments': 'Grįžti į visus apartamentus',
    'our.apartments': 'Mūsų Apartamentai',
    'book.now': 'Rezervuoti',
    'from': 'Nuo',
    'per.night': 'už naktį',
    'guests': 'svečiai',
    'check.in': 'Atvykimas',
    'check.out': 'Išvykimas',
    'full.name': 'Vardas Pavardė',
    'email': 'El. paštas',
    'phone': 'Telefono numeris',
    'country': 'Šalis',
    'number.of.guests': 'Svečių skaičius',
    'pet.fee': 'Augintinio mokestis (10€)',
    'extra.bed': 'Papildoma lova (15€)',
    'total': 'Viso',
    'continue': 'Tęsti',
    'back': 'Grįžti',
    'reserve': 'Rezervuoti',
    'available': 'Laisva',
    'booked': 'Užimta',
    'selected': 'Pasirinkta',
    'arrival': 'Atvykimas',
    'departure': 'Išvykimas',
    'amenities': 'Patogumai',
    'kitchen': 'Virtuvė',
    'air.conditioning': 'Oro kondicionierius',
    'tv': 'Televizorius',
    'wifi': 'WiFi',
    'terrace': 'Terasa',
    'forest.view': 'Miško vaizdas',
    'lake.view': 'Ežero vaizdas',
    'contact.us': 'Susisiekite su mumis',
    'address': 'Adresas',
    'follow.us': 'Sekite mus',
    'all.rights.reserved': 'Visos teisės saugomos',
    'booking': 'Rezervacija',
    'guest.details': 'Svečio informacija',
    'enter.name': 'Įveskite vardą ir pavardę',
    'enter.email': 'Įveskite el. paštą',
    'enter.phone': 'Įveskite telefono numerį',
    'enter.country': 'Įveskite šalį',
    'price.per.night': 'Kaina už naktį',
    'number.of.nights': 'Naktų skaičius',
    'pet.charge': 'Augintinio mokestis',
    'extra.bed.charge': 'Papildomos lovos mokestis',
    'confirm.booking': 'Patvirtinti rezervaciją',
    'processing': 'Apdorojama...',
    'please.fill': 'Prašome užpildyti šį laukelį',
    'discount.code': 'Nuolaidos kodas',
    'apply': 'Pritaikyti',
    'discount.applied': 'Nuolaida pritaikyta',
    'rules.acceptance': 'Susipažinau su Vidaus tvarkos taisyklėmis ir su jomis sutinku',
    'view.rules': 'Peržiūrėti taisykles',
    'back.to.booking': 'Grįžti į rezervaciją',
    'house.rules': 'Vidaus tvarkos taisyklės',
    'booking.summary': 'Užsakymo santrauka',
    'apartment': 'Apartamentai',
    'guest': 'Svečias',
    'total.price': 'Bendra suma',
    'discount': 'Nuolaida',
    'proceed.to.payment': 'Tęsti į apmokėjimą'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('lt');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}