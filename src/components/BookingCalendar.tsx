import React, { useState } from 'react';
import {
  format,
  addMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isToday,
  isWithinInterval,
  isBefore,
  isPast
} from 'date-fns';
import { lt } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Info, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface BookingCalendarProps {
  bookedDates: Date[];
  checkIn: Date | null;
  checkOut: Date | null;
  onDateSelect: (date: Date) => void;
  onRulesAcceptanceChange?: (accepted: boolean) => void;
}

export function BookingCalendar({
  bookedDates,
  checkIn,
  checkOut,
  onDateSelect,
  onRulesAcceptanceChange
}: BookingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [rulesAccepted, setRulesAccepted] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [showError, setShowError] = useState(false);
  const today = new Date();
  const { language, t } = useLanguage();

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(addMonths(currentMonth, -1));
  };

  const allDays = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  const isDateBooked = (date: Date) => {
    return bookedDates.some(bookedDate => isSameDay(bookedDate, date));
  };

  const isInRange = (date: Date) => {
    if (!checkIn || !checkOut) return false;
    return isWithinInterval(date, { start: checkIn, end: checkOut });
  };

  const weekDays = language === 'en' 
    ? ['M', 'T', 'W', 'T', 'F', 'S', 'S']
    : ['P', 'A', 'T', 'K', 'P', 'Š', 'S'];

  const formatCapitalizedMonth = (date: Date) => {
    const raw = format(date, 'LLLL yyyy', { locale: language === 'lt' ? lt : undefined });
    return raw.charAt(0).toUpperCase() + raw.slice(1);
  };

  const handleRulesAcceptanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRulesAccepted(e.target.checked);
    setShowError(false);
    if (onRulesAcceptanceChange) {
      onRulesAcceptanceChange(e.target.checked);
    }
  };

  const handleDateSelect = (date: Date) => {
    if (!rulesAccepted) {
      setShowError(true);
      return;
    }
    onDateSelect(date);
  };

  if (showRules) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
        <div className="bg-white rounded-2xl p-8 max-w-3xl w-full shadow-2xl relative my-8">
          <button
            onClick={() => setShowRules(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <h2 className="text-2xl font-bold text-gray-900 mb-6">Vidaus Tvarkos Taisyklės</h2>

          <div className="prose prose-sm max-w-none overflow-y-auto max-h-[70vh] pr-4">
            <h3 className="text-xl font-bold mb-4">Įvadas</h3>
            <p className="mb-6">
              Šios taisyklės sukurtos tam, kad mūsų nuomuojami namai, juos supanti gamta ir Jūsų poilsis būtų saugūs, harmoningai sugyventų tarpusavyje. Rezervuodami apsistojimą Girios Horizonte ir atvykdami į mūsų erdves, patvirtinate, kad susipažinote su šiomis taisyklėmis ir joms pritariate. Jei jaučiate, kad šios taisyklės Jums netinka – kviečiame susilaikyti nuo rezervacijos.
            </p>

            <h3 className="text-lg font-bold mb-4">Atvykimo / Išvykimo Laikas</h3>
            <p>Atvykimas nuo: 15:00</p>
            <p className="mb-6">Išvykimas iki: 11:00</p>

            <h3 className="text-lg font-bold mb-4">Mokėjimai ir Atsakomybė</h3>
            <p className="mb-6">Apmokėjus rezervaciją, Jūs patvirtinate, kad sutinkate su visomis mūsų taisyklėmis. Neišbuvus numatyto (rezervuoto) laiko, pinigai negražinami.</p>

            <h3 className="text-lg font-bold mb-4">Rezervacijos Atšaukimas / Perkėlimas</h3>
            <ul className="list-disc pl-5 mb-6">
              <li>Rezervaciją galima atšaukti ar perkelti likus bent 10 dienų iki atvykimo, su 100% pinigų grąžinimu.</li>
              <li>Vėlesnis atšaukimas negalimas dėl jokių priežasčių.</li>
              <li>Kiti žmonės gali atvykti tik iš anksto suderinus.</li>
              <li>Rezervacijos perkėlimas galimas tik vieną kartą.</li>
              <li>Duomenys naudojami tik rezervavimo tikslais (pagal 1997-09-28 duomenų apsaugos sutartį).</li>
            </ul>

            <h3 className="text-lg font-bold mb-4">Augintiniai</h3>
            <ul className="list-disc pl-5 mb-6">
              <li>Priimami tik šunys.</li>
              <li>Mokestis – 10 €.</li>
              <li>Šeimininkai privalo surinkti išmatas ir kompensuoti žalą.</li>
              <li>Turi būti sveiki, neagresyvūs gyvūnai.</li>
              <li>Už laikymą namelyje be leidimo – 100 €/d. bauda.</li>
            </ul>

            <h3 className="text-lg font-bold mb-4">Poilsiautojams Draudžiama</h3>
            <ul className="list-disc pl-5 mb-6">
              <li>Rūkyti visoje teritorijoje (taip pat elektronines cigaretes, kaljanus ir pan.).</li>
              <li>Triukšmauti, garsiai leisti muziką. Ramybės laikas: 22:00–08:00.</li>
              <li>Šiukšlinti ar niokoti inventorių.</li>
              <li>Kviesti papildomus svečius be leidimo.</li>
              <li>Maudytis apsvaigus.</li>
            </ul>

            <h3 className="text-lg font-bold mb-4">Priešgaisrinė Saugos Ir Saugus Elgesys</h3>
            <ul className="list-disc pl-5 mb-6">
              <li>Ugnį galima kurti tik specialiose laužavietėse ir griliuose.</li>
              <li>Žvakės – tik su priežiūra, specialiuose induose.</li>
              <li>Židinį (Gintaro name) galima kūrenti tik su priežiūra, tik malkomis.</li>
              <li>Draudžiami fejerverkai.</li>
              <li>Nenaudoti prietaisų be priežiūros.</li>
            </ul>

            <h3 className="text-lg font-bold mb-4">Poilsiautojų Atsakomybė</h3>
            <ul className="list-disc pl-5 mb-6">
              <li>Už maisto kokybę atsako patys.</li>
              <li>Už žalą, traumas ar gaisrą – atsako pažeidėjas.</li>
              <li>Už pažeistus daiktus atsako materialiai.</li>
              <li>Vaikai – tėvų/globėjų atsakomybė.</li>
              <li>Negalima naudoti kambario pledukų ar pagalvėlių lauke.</li>
              <li>Administracija turi teisę išprašyti nesilaikančius taisyklių – be pinigų grąžinimo.</li>
            </ul>

            <h3 className="text-lg font-bold mb-4">Pirties "Druska" Taisyklės</h3>
            <ul className="list-disc pl-5 mb-6">
              <li>Ateikite/išeikite laiku – kiti svečiai gali turėti rezervaciją.</li>
              <li>Dėvėkite šlepetes.</li>
              <li>Alkoholio vartojimas nerekomenduojamas.</li>
              <li>Muzikos klausyti tik ne ramybės laiku (22:00–08:00).</li>
              <li>Indus būtina išplauti ir padėti į vietą.</li>
              <li>Reikia atsinešti savo tekstilę (rankšluosčiai, šlepetės ir t.t.).</li>
            </ul>

            <h3 className="text-lg font-bold mb-4">Pirtyje Draudžiama</h3>
            <ul className="list-disc pl-5 mb-6">
              <li>Naudoti šveitiklius, aliejus, medų ir pan.</li>
              <li>Šokinėti nuo lieptelio (ežeras seklus).</li>
              <li>Rūkyti ar garinti.</li>
              <li>Triukšmauti.</li>
              <li>Nepalikti netvarkos.</li>
              <li>Išeinant išjungti apšvietimą ir užrakinti pirtį.</li>
            </ul>

            <h3 className="text-lg font-bold mb-4">Baigiamoji Pastaba</h3>
            <p className="mb-6">Už padarytą materialinę žalą atsakoma pagal LR įstatymus, o nuostoliai padengiami prieš išvykstant.</p>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => setShowRules(false)}
              className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-xl font-medium transition-colors"
            >
              Grįžti į rezervaciją
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-full">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-semibold">
          {formatCapitalizedMonth(currentMonth)}
        </h2>
        <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-full">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-600">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: startOfMonth(currentMonth).getDay() }).map((_, index) => (
          <div key={`empty-${index}`} className="h-10" />
        ))}

        {allDays.map(day => {
          const isBooked = isDateBooked(day);
          const isPastDate = isPast(day) && !isSameDay(day, today);
          const isCheckIn = checkIn && isSameDay(day, checkIn);
          const isCheckOut = checkOut && isSameDay(day, checkOut);
          const isInDateRange = isInRange(day);
          const isCurrentDay = isToday(day);
          const isAvailable = !isBooked && !isPastDate;

          let className = `
            h-10 rounded-lg flex items-center justify-center text-sm relative
            ${isPastDate ? 'text-gray-300 cursor-not-allowed' : ''}
            ${isBooked ? 'bg-red-100 text-red-600 cursor-not-allowed' : ''}
            ${isAvailable && !isCheckIn && !isCheckOut ? 'text-green-600 hover:bg-green-50 cursor-pointer' : ''}
            ${isCheckIn ? 'bg-[#807730] text-white hover:bg-[#6a632a]' : ''}
            ${isCheckOut ? 'bg-[#807730] text-white hover:bg-[#6a632a]' : ''}
            ${isInDateRange ? 'bg-green-100' : ''}
            ${isCurrentDay ? 'font-bold' : ''}
          `;

          if (isCheckIn) {
            className += ` after:content-["${t('arrival')}"] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:text-xs after:whitespace-nowrap after:mt-1`;
          }
          if (isCheckOut) {
            className += ` after:content-["${t('departure')}"] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:text-xs after:whitespace-nowrap after:mt-1`;
          }

          return (
            <button
              key={day.toISOString()}
              onClick={() => !isBooked && !isPastDate && handleDateSelect(day)}
              disabled={isBooked || isPastDate}
              className={className}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>

      <div className="mt-8 space-y-4">
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-100 rounded" />
            <span className="text-sm text-gray-600">{t('booked')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 rounded" />
            <span className="text-sm text-gray-600">{t('available')}</span>
          </div>
        </div>

        <div className="flex items-start gap-3 pt-4 border-t border-gray-200">
          <input
            type="checkbox"
            id="rules-acceptance"
            checked={rulesAccepted}
            onChange={handleRulesAcceptanceChange}
            className={`mt-1 w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary ${
              showError ? 'border-red-500' : ''
            }`}
          />
          <div>
            <label htmlFor="rules-acceptance" className={`text-gray-700 font-medium ${
              showError ? 'text-red-500' : ''
            }`}>
              {t('rules.acceptance')}
            </label>
            <button
              type="button"
              onClick={() => setShowRules(true)}
              className="block text-sm text-primary hover:text-primary-dark mt-1 flex items-center gap-1"
            >
              <Info className="w-4 h-4" />
              {t('view.rules')}
            </button>
            {showError && (
              <p className="text-red-500 text-sm mt-1">
                Prašome susipažinti ir sutikti su taisyklėmis prieš tęsiant
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}