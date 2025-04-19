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
    'proceed.to.payment': 'Proceed to Payment',
    'rules.title': 'Rules that protect peace and community',
    'rules.intro': 'These rules are created to ensure that our rental homes, the surrounding nature, and your vacation are safe and harmoniously coexist. By making a reservation at Girios Horizontas and arriving at our spaces, you confirm that you have read and agree to these rules. If you feel these rules don\'t suit you – we invite you to refrain from making a reservation.',
    'check.in.time': 'Check-in time from 15:00',
    'check.out.time': 'Check-out time until 11:00',
    'payment.note': 'By paying for the reservation, you confirm that you agree to all our rules. No refunds for early departure.',
    'cancellation.title': 'RESERVATION CANCELLATION/TRANSFER',
    'cancellation.rules': 'Reservations can be cancelled or transferred no later than 10 days before arrival date. 100% refund is possible. Later cancellations are not possible for any reason – changed plans, illness, or other circumstances. Other people may arrive during your reservation time, but this must be notified in advance. These people must also be familiar with our terms and conditions. When transferring a date, if that date\'s amount is lower – the difference is not refunded, if that date\'s amount is higher, additional payment is required. Reservation transfer is possible only once.',
    'pets.title': 'PETS',
    'pets.rules': 'We accept your pets. ONLY DOGS ARE ACCEPTED. A 10 EUR additional fee applies for pets. Pet owners must collect their pet\'s waste. Pet owners are responsible for any damage caused by their pets. Only healthy, non-aggressive pets with stable temperament are accepted. Guests arriving with pets are responsible for Girios Horizontas\' living animals and commit to following these rules and fully compensating for any damage caused by the pet to Girios Horizontas, the territory, and/or third parties. Keeping a pet in the house without prior arrangement - 100 EUR/day fine applies.',
    'prohibited.title': 'GUESTS ARE PROHIBITED FROM',
    'prohibited.rules': [
      'Smoking in Girios Horizontas territory is strictly prohibited. Electronic cigarettes, vapes, hookahs are not allowed inside apartments, houses, and sauna.',
      'Making noise, listening to loud music. Girios Horizontas territory is for quiet rest only, please respect everyone\'s privacy and peace. Quiet hours are from 22:00 - 08:00.',
      'Littering or damaging the territory or interior inventory of houses and sauna.',
      'Inviting additional friends or people for overnight stays or short visits is strictly prohibited.',
      'Do not swim while under the influence of alcohol or other mind-altering substances.'
    ],
    'fire.safety.title': 'FIRE SAFETY AND SAFE BEHAVIOR RULES',
    'fire.safety.rules': [
      'As Girios Horizontas is located in a forested area, any fire lighting outdoors in Girios Horizontas territory is prohibited except in designated fire pits and grill areas.',
      'Candles outdoors may only be lit with supervision and in special containers. Unattended lit candles in lanterns are not allowed.',
      'Indoors, candles may only be lit in designated candleholders, and candles must not be left unattended.',
      'The fireplace in Gintaras house can be used but only with supervision and it is STRICTLY forbidden to leave the fireplace with burning or smoldering flame. Only firewood can be burned, no other waste can be put in the fireplace. Maintain safe distance from the fireplace.',
      'Fireworks are prohibited throughout Girios Horizontas territory.',
      'Use electrical appliances following safety requirements.',
      'Do not leave electrical appliances unattended when turned on.'
    ],
    'guest.responsibility.title': 'GUEST RESPONSIBILITY',
    'guest.responsibility.rules': [
      'Guests are responsible for the quality and freshness of their brought food.',
      'The service provider is not responsible for guest injuries or property damage caused by their own fault, violating safety, fire prevention, and internal rules.',
      'Guests are responsible for any accidents that may occur in Girios Horizontas territory or beyond (inside apartments, house or cottage, terrace, entire territory, swimming in the lake, cycling, etc.).',
      'Guests are responsible for accidents occurring due to alcohol.',
      'Guests are fully materially responsible for damaged or destroyed movable and immovable property and material values in the cottages and Girios Horizontas territory (guests are liable for material damage according to LR laws).',
      'For fires caused by guest negligence that damaged cottages or surrounding areas, guests are responsible for all resulting losses.',
      'Items in apartments, cottages, house, and their territory are property of the homestead, so guest(s) have no right to take them when leaving.',
      'If you notice any malfunctions or violations, report them immediately. Fines apply for damaged devices, long-term and short-term property, as determined by Girios Horizontas administration.',
      'When arriving with children, ensure their safety. Parents/guardians who arrived with them are responsible for their supervision in the territory.',
      'When picnicking outside, do not use room blankets (except for wrapping), towels, duvets, or pillows.',
      'Girios Horizontas administrators have the right to expel visitors who do not follow internal rules, whose behavior and actions damage the territory\'s infrastructure. In such case, the reservation fee is not refunded.'
    ],
    'sauna.rules.title': 'SAUNA DRUSKA RULES',
    'sauna.rules': [
      'Please come to and leave the sauna at your designated time - as other guests may use the sauna before or after you.',
      'We recommend having and wearing slippers in the sauna area, note that floors may be slippery.',
      'Alcohol consumption is not recommended during sauna procedures.',
      'Music can be played only during non-quiet hours (from 22:00-08:00)',
      'Used tea cups, wine glasses, or other dishes must be washed and put back in place.',
      'Guests commit to having their own personal sauna textiles (towels, robes, slippers, etc.).'
    ],
    'sauna.prohibited.title': 'IN SAUNA DRUSKA IT IS PROHIBITED',
    'sauna.prohibited.rules': [
      'To use your own scrubs, oils, masks, or other products in the sauna.',
      'To jump from the pier into the lake. The lake is shallow and has mud.',
      'To smoke(vape) in sauna premises and throughout the territory.',
      'To make noise.',
      'Sauna visitors are fully responsible for their health and safety.',
      'When leaving, we leave the sauna premises tidy.',
      'When leaving the sauna, turn off all lighting.',
      'When leaving the sauna, lock the sauna building doors, leave the key in the box where you found it, lock the box.'
    ],
    'liability.note': 'Visitors are liable for material damage according to the laws of the Republic of Lithuania. Damages to owners are compensated before departure.'
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