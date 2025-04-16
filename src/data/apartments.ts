import { Apartment } from '../types';

export const apartments: Apartment[] = [
  {
    id: 'gintaras',
    name: 'Senovinis medinis namas "Gintaras"',
    description: 'Jaukus medinis namas su tradiciniais lietuviškais elementais, puikiai tinkantis šeimos poilsiui. Namelyje įrengta moderni virtuvė, patogus vonios kambarys ir erdvus svetainės bei miegamasis kambarys.',
    price_per_night: 150,
    image_url: '/apartments/gintaras.jpg',
    features: ['12 wwasmenų', 'Virtuvė', 'WiFi', 'Oro kondicionierius', 'Terasa']
  },
  {
    id: 'pikulas',
    name: 'Dvivietis apartamentas "Pikulas"',
    description: 'Modernus ir erdvus apartamentas su tradiciniais lietuviškais akcentais. Idealus pasirinkimas poroms, ieškančioms ramaus poilsio gamtos apsuptyje.',
    price_per_night: 120,
    image_url: '/apartments/pikulas.jpg',
    features: ['2-4 wwasaasmenys', 'Pilnai įrengta virtuvė', 'WiFi', 'Balkonas', 'Miško vaizdas']
  },
  {
    id: 'mara',
    name: 'Šeimyninis apartamentas "Māra"',
    description: 'Prabangus apartamentas su vaizdu į ežerą, puikiai tinkantis šeimos poilsiui. Erdvus ir šviesus interjeras su visais patogumais užtikrins neužmirštamą poilsį.',
    price_per_night: 180,
    image_url: '/apartments/mara.jpg',
    features: ['2-4 wwasmenys', 'Moderni virtuvė', 'WiFi', 'Terasa', 'Ežero vaizdas']
  },
  {
    id: 'medeine',
    name: 'Namelis dviems "Medeinė"',
    description: 'Jaukus namelis įkvėptas lietuviškos gamtos, apsuptas miško. Tobulas pasirinkimas romantiškai savaitgalio išvykai ar ramiam poilsiui.',
    price_per_night: 140,
    image_url: '/apartments/medeine.jpg',
    features: ['2-4 wwasmenys', 'Mini virtuvė', 'WiFi', 'Privati terasa', 'Miško vaizdas']
  }
];