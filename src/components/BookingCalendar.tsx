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

          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('house.rules')}</h2>

          <div className="prose prose-sm max-w-none overflow-y-auto max-h-[70vh] pr-4">
            <h3 className="text-xl font-bold mb-4">{t('rules.title')}</h3>

            <p className="mb-6">{t('rules.intro')}</p>

            <div className="mb-6">
              <p className="font-semibold">{t('check.in.time')}</p>
              <p className="font-semibold">{t('check.out.time')}</p>
            </div>

            <p className="mb-6">{t('payment.note')}</p>

            <h3 className="text-lg font-bold mb-4">{t('cancellation.title')}</h3>
            <p className="mb-6">{t('cancellation.rules')}</p>

            <h3 className="text-lg font-bold mb-4">{t('pets.title')}</h3>
            <p className="mb-6">{t('pets.rules')}</p>

            <h3 className="text-lg font-bold mb-4">{t('prohibited.title')}</h3>
            <ul className="list-disc pl-5 mb-6">
              {language === 'en' && t('prohibited.rules').map((rule: string, index: number) => (
                <li key={index}>{rule}</li>
              ))}
              {language === 'lt' && (
                <>
                  <li>Rūkyti Girios Horizonto teritorijoje griežtai draudžiama. Negalimas ir elektroninių cigarečių, "woopų" ir panašaus tipo rūkymo priemonių, kaljanų naudojimas apartamentų, namelių bei namo ir pirties viduje.</li>
                  <li>Draudžiama triukšmauti, garsiai klausytis muzikos. Girios Horizonto teritorija skirta tik ramiam poilsiui, tad labai prašome gerbti visų privatumą ir ramybę. Ramybės bei tylos laikas nuo 22:00 - 08:00.</li>
                  <li>Šiukšlinti ar kitaip niokoti teritoriją ar namelių bei pirties vidaus inventorių.</li>
                  <li>Pasikviesti papildomų draugų, žmonių nei nakvynei, nei trumpam pabuvimui - griežtai draudžiama.</li>
                  <li>Nesimaudykite apsvaigę nuo alkoholio ar kitų psichiką veikiančių medžiagų.</li>
                </>
              )}
            </ul>

            <h3 className="text-lg font-bold mb-4">{t('fire.safety.title')}</h3>
            <ul className="list-disc pl-5 mb-6">
              {language === 'en' && t('fire.safety.rules').map((rule: string, index: number) => (
                <li key={index}>{rule}</li>
              ))}
              {language === 'lt' && (
                <>
                  <li>Kadangi Girios Horizontas yra įsikūręs miškingoje teritorijoje, tai bet kokios ugnies kūrenimas lauke, Girios Horizonto teritorijoje negalimas ir draudžiamas iškyrūs tam padarytas specialias laužavietes ir griliaus vietas.</li>
                  <li>Žvakės lauke gali būti degamos tik su priežiūra ir specialiuose induose. Be priežiūros uždegtų žvakių žibintuose palikti negalima.</li>
                  <li>Patalpose žvakes galima deginti tik tam skirtose žvakidėse, žvakių be priežiūros palikti negalima.</li>
                  <li>Gintaro namo viduje esantį židinį galima kūrenti, bet tik su priežiūra ir GRIEŽTAI draudžiama palikti židinį su degančią ar rusenančia liepsna. Galima kūrenti tik malkas jokių kitų atliekų negalima dėti į židinį. Laikytis saugaus atstumo nuo židinio.</li>
                  <li>Visoje Girios Horizonto teritorijoje draudžiama naudoti fejerverkus.</li>
                  <li>Naudotis elektros prietaisais, laikantis saugumo reikalavimų.</li>
                  <li>Nepalikti be priežiūros įjungtų elektros prietaisų.</li>
                </>
              )}
            </ul>

            <h3 className="text-lg font-bold mb-4">{t('guest.responsibility.title')}</h3>
            <ul className="list-disc pl-5 mb-6">
              {language === 'en' && t('guest.responsibility.rules').map((rule: string, index: number) => (
                <li key={index}>{rule}</li>
              ))}
              {language === 'lt' && (
                <>
                  <li>Už atsivežto maisto kokybę ir šviežumą, atsako patys poilsiautojai.</li>
                  <li>Poilsiautojui susižalojus pačiam arba sužalojus savo turtą dėl savo kaltės, pažeidžiant saugaus elgesio, priešgaisrines ir vidaus tvarkos taisykles, paslaugos teikėjas už tai neatsako.</li>
                  <li>Už nelaimingus atsitikimus, galinčius įvykti Girios Horizonto teritorijoje ar už jos ribų (apartamentų, namo ar namelio viduje, terasoje, visoje teritorijoje, maudantis ežere, dviračių žygyje ir t.t.) yra atsakingi patys poilsiautojai.</li>
                  <li>Už nelaimingus atsitikimus, įvykusius dėl alkoholio, atsako pats poilsiautojas.</li>
                  <li>Poilsiautojai visiškai materialiai atsako už sugadintą ar sunaikintą nameliuose ir Girios Horizonto teritorijoje esantį kilnojamąjį ir nekilnojamąjį turtą, bei materialines vertybes (už padarytą materialinę žalą poilsiautojas atsako LR įstatymų nustatyta tvarka).</li>
                  <li>Dėl poilsiautojų neatsargumo kilus gaisrui, kuris sugadino namelius ar aplinkines teritorijas, už visus dėl to atsiradusius nuostolius atsako poilsiautojai.</li>
                  <li>Aparatamentuose, nameliuose ir name, ir jų teritorijoje esantys daiktai yra sodybos nuosavybė, todėl poilsiautojas (-iai) neturi teisės juos pasiimti išvykdamas iš sodybos.</li>
                  <li>Jei pastebite kokius gedimus ar pažeidimus, praneškite nedelsdami. Už sugadintus prietaisus, ilgalaikį ir trumpalaikį turtą taikoma bauda, kurią įvardija Girios Horizonto administracija.</li>
                  <li>Atvykus su vaikais, rūpintis jų saugumu. Už jų priežiūrą teritorijoje atsakomybę prisiima tėvai/globėjai, su kuriais jis atvyko.</li>
                  <li>Iškylaujant lauke nenaudoti kambaryje esančių pledukų (nebent apsijuosti), rakšluosčių, antklodžių ar pagalvėlių.</li>
                  <li>Girios Horizonto administratoriai turi teisę išprašyti iš teritorijos tuos lankytojus, kurie nesilaiko vidaus taisyklių, savo elgesiu ir veiksmais daro žalą teritorijos infrastruktūrai. Tokiu atveju rezervacijos mokestis negrąžinamas.</li>
                </>
              )}
            </ul>

            <h3 className="text-lg font-bold mb-4">{t('sauna.rules.title')}</h3>
            <ul className="list-disc pl-5 mb-6">
              {language === 'en' && t('sauna.rules').map((rule: string, index: number) => (
                <li key={index}>{rule}</li>
              ))}
              {language === 'lt' && (
                <>
                  <li>Į pirtį prašome ateiti ir išeiti numatytu ir jums paskirtu laiku, - kadangi prieš jus ar po jūsų, pirtyje gali lankytis ir kiti svečiai.</li>
                  <li>Pirties zonoje rekomenduojame turėti ir avėti šlepetes, atkreipkite dėmesį, grindys gali būti slidžios.</li>
                  <li>Rekomenduojama alkoholio nevartoti pirties procedūrų metu.</li>
                  <li>Muzikos galima klausytis tik ne ramybės ir tylos laiku (nuo 22:00-08:00)</li>
                  <li>Panaudotus Arbatos puodelius, vyno taures ar kitus indus privaloma išsiplauti ir padėti į vietą.</li>
                  <li>Pirties reikiamą tekstilę, svečiai įsipareigoja turėti savo asmeninę (rankšluosčiai, chalatai, šlepetės ir pan).</li>
                </>
              )}
            </ul>

            <h3 className="text-lg font-bold mb-4">{t('sauna.prohibited.title')}</h3>
            <ul className="list-disc pl-5 mb-6">
              {language === 'en' && t('sauna.prohibited.rules').map((rule: string, index: number) => (
                <li key={index}>{rule}</li>
              ))}
              {language === 'lt' && (
                <>
                  <li>Pirtyje naudoti savo šveitiklius, aliejus, mesų ar kitas priemones.</li>
                  <li>Šokinėti nuo lieptelio į ežerą. Ežeras seklus ir yra dumblo.</li>
                  <li>Pirties patalpose bei visoje teritorijoje rūkyti(garinti).</li>
                  <li>Triukšmauti.</li>
                  <li>Pirties lankytojai pilnai atsakingi už savo sveikatą ir saugumą.</li>
                  <li>švykstant, paliekame pirties patalpas tvarkingas.</li>
                  <li>Išeinant iš pirties, išjungti visur apšvietimą.</li>
                  <li>Išeinant iš pirties, užrakinti pirties pastato duris, raktą palikti dėžutėje, kur jį ir radote, dėžutę užrakinti.</li>
                </>
              )}
            </ul>

            <p className="mb-6">{t('liability.note')}</p>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => setShowRules(false)}
              className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-xl font-medium transition-colors"
            >
              {t('back.to.booking')}
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