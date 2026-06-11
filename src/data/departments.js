/* Mock department/team data for the LMNP lab site */
export const departments = [
  {
    id: 'PHANO',
    name: "Physique à l'Échelle Nanométrique",
    desc: 'Magnétisme, mécanique des nano-objets, matière quantique',
    icon: 'atom',
    teams: [
      { id: 'phano-1', name: 'Magnétisme et Spintronique' },
      { id: 'phano-2', name: 'Mécanique des Nano-Objets' },
      { id: 'phano-3', name: 'Matière Quantique Topologique' },
      { id: 'phano-4', name: 'Théorie et Simulation Multi-Échelle' },
    ],
  },
  {
    id: 'MATER',
    name: 'Structure et Chimie des Matériaux',
    desc: 'Thermochimie, microstructures, réactivité aux interfaces',
    icon: 'crystal',
    teams: [
      { id: 'mater-1', name: 'Thermochimie et Calorimetrie' },
      { id: 'mater-2', name: 'Microstructures et Contraintes' },
      { id: 'mater-3', name: 'Réactivité des Interfaces' },
      { id: 'mater-4', name: 'Cristallographie Avancée' },
      { id: 'mater-5', name: 'Matériaux Fonctionnels' },
    ],
  },
  {
    id: 'EMONA',
    name: 'Nanostructures Fonctionnelles',
    desc: 'Nanotechnologies, dispositifs quantiques, énergie',
    icon: 'circuit',
    teams: [
      { id: 'emona-1', name: 'Nanotechnologies et Capteurs' },
      { id: 'emona-2', name: 'Dispositifs Quantiques' },
      { id: 'emona-3', name: 'Énergie et Photonique' },
      { id: 'emona-4', name: 'Nanofabrication et Caractérisation' },
    ],
  },
  {
    id: 'ACSE',
    name: 'Analyse et Conception Systèmes Électroniques',
    desc: 'Circuits intégrés, mémoires, objets communicants',
    icon: 'chip',
    teams: [
      { id: 'acse-1', name: 'Circuits Intégrés Analogiques' },
      { id: 'acse-2', name: 'Mémoires et Stockage' },
      { id: 'acse-3', name: 'Objets Communicants et IoT' },
      { id: 'acse-4', name: 'Conception Numérique Avancée' },
      { id: 'acse-5', name: 'Systèmes Embarqués Intelligents' },
    ],
  },
  {
    id: 'DETECT',
    name: 'Détection, Rayonnements et Fiabilité',
    desc: 'Photovoltaïque, microcapteurs, traitement du signal',
    icon: 'photon',
    teams: [
      { id: 'detect-1', name: 'Photovoltaïque et Énergie' },
      { id: 'detect-2', name: 'Microcapteurs et MEMS' },
      { id: 'detect-3', name: 'Traitement du Signal' },
      { id: 'detect-4', name: 'Fiabilité et Radiation' },
    ],
  },
];
