import { supabase, hasSupabase } from './supabase';

// Monolingual fields matching Section 7, but initialized with multilingual data 
// so the UI can dynamically translate them based on the active language.
const SEED_DATA = {
  lab: {
    id: '00000000-0000-0000-0000-000000000001',
    name: 'Laboratoire de Développement des Energies Renouvelables et Leurs Applications dans les Zones Sahariennes (LDERAS)',
    description: 'La mission du laboratoire LDERAS est orientée vers les études expérimentales et théoriques des propriétés physiques des matériaux et dispositifs pour les énergies renouvelables.',
    logo_url: null,
    director: 'Pr. NOURI Abdelkader',
    email: 'nouri.abdelkader@univ-bechar.dz',
    cv_url: 'http://www.univ-bechar.dz/sm/pdf/CV-nouri.pdf',
    address: 'Faculté des Sciences Exactes, Université TAHRI Mohammed, BP 417, Béchar, Algérie',
    phone: '+213 49 23 89 74 / 84 / 86',
    fax: '+213 49 23 89 86 / 94',
    creation_date: '10 Février 2020',
    creation_decree: 'Arrêté de création N° 05'
  },
  teams: [
    {
      id: 'team_msi',
      name: 'Matériaux surfaces et interfaces',
      acronym: 'MSI',
      description: 'Cette équipe s\'intéresse à la préparation, à la caractérisation et à l\'optimisation des propriétés physiques des matériaux et de leurs interfaces pour des applications photovoltaïques.',
      team_leader_id: 'member_director'
    },
    {
      id: 'team_mos',
      name: 'Modélisation et Simulation',
      acronym: 'MoS',
      description: 'Spécialisée dans la simulation et l\'étude par les méthodes de calcul ab-Initio des propriétés physiques des matériaux pour les énergies propres.',
      team_leader_id: 'member_ghezali'
    },
    {
      id: 'team_cs',
      name: 'Cellules solaires',
      acronym: 'CS',
      description: 'Dédiée à l\'amélioration des performances des composants optoélectroniques, la conductivité, le rendement quantique et l\'optimisation des cellules solaires à couches minces.',
      team_leader_id: 'member_khachab'
    },
    {
      id: 'team_sen',
      name: 'Système Energétique',
      acronym: 'SEn',
      description: 'Concentrée sur le dimensionnement, le contrôle, l\'optimisation et l\'étude de la dégradation des composants et des systèmes photovoltaïques sous contraintes sahariennes.',
      team_leader_id: 'member_dennai'
    }
  ],
  members: [
    {
      id: 'member_director',
      email: 'nouri.abdelkader@univ-bechar.dz',
      password_hash: '$2b$10$abcdefghijklmnopqrstuv',
      full_name: 'Pr. NOURI Abdelkader',
      role: 'lab_leader',
      grade: 'Professeur',
      degree: 'Doctorat',
      specialty: 'Physique des Matériaux & Solaire',
      photo_url: null,
      bio: 'Directeur du laboratoire LDERAS et chef d\'équipe MSI. Plus de 20 ans d\'expérience dans l\'analyse des capteurs et propriétés physiques des matériaux photovoltaïques.',
      joined_at: '2020-02-10T00:00:00Z',
      team_id: 'team_msi',
      cv_url: 'http://www.univ-bechar.dz/sm/pdf/CV-nouri.pdf',
      orcid: '0000-0002-1823-4456',
      google_scholar_url: 'https://scholar.google.com/citations?user=anouri_mock',
      research_gate_url: 'https://www.researchgate.net/profile/Abdelkader_Nouri_mock',
      h_index: 34,
      citations_count: 4210,
      publications_count: 58,
      research_topics: ['Solar Thermal', 'Photovoltaic Materials', 'Thin Films', 'Surfaces & Interfaces']
    },
    {
      id: 'member_ghezali',
      email: 'ghezali.mohammed@univ-bechar.dz',
      password_hash: '$2b$10$abcdefghijklmnopqrstuv',
      full_name: 'Pr. GHEZALI Mohammed',
      role: 'team_leader',
      grade: 'Professeur',
      degree: 'Doctorat',
      specialty: 'Modélisation et Simulation Physique',
      photo_url: null,
      bio: 'Chef d\'équipe Modélisation et Simulation (MoS). Expert en méthodes ab-Initio et calculs théoriques des propriétés physiques pour le stockage d\'énergie.',
      joined_at: '2020-02-10T00:00:00Z',
      team_id: 'team_mos',
      orcid: '0000-0003-8842-1011',
      google_scholar_url: 'https://scholar.google.com/citations?user=mghezali_mock',
      research_gate_url: 'https://www.researchgate.net/profile/Mohammed_Ghezali_mock',
      h_index: 22,
      citations_count: 1840,
      publications_count: 26,
      research_topics: ['ab-Initio Simulation', 'Materials Modeling', 'Renewable Energy']
    },
    {
      id: 'member_khachab',
      email: 'khachab.hamid@univ-bechar.dz',
      password_hash: '$2b$10$abcdefghijklmnopqrstuv',
      full_name: 'Pr. KHACHAB Hamid',
      role: 'team_leader',
      grade: 'Professeur',
      degree: 'Doctorat',
      specialty: 'Physique des Cellules Solaires',
      photo_url: null,
      bio: 'Chef d\'équipe Cellules solaires (CS). Spécialisé dans les performances des composants optoélectroniques, les jonctions et les configurations multi-spectrales.',
      joined_at: '2020-02-10T00:00:00Z',
      team_id: 'team_cs',
      orcid: '0000-0001-9988-1234',
      google_scholar_url: 'https://scholar.google.com/citations?user=hkhachab_mock',
      research_gate_url: 'https://www.researchgate.net/profile/Hamid_Khachab_mock',
      h_index: 18,
      citations_count: 1120,
      publications_count: 19,
      research_topics: ['Solar Cells', 'Optoelectronics', 'Thin Films', 'Chalcopyrites']
    },
    {
      id: 'member_dennai',
      email: 'dennai.benmoussa@univ-bechar.dz',
      password_hash: '$2b$10$abcdefghijklmnopqrstuv',
      full_name: 'Pr. DENNAI Benmoussa',
      role: 'team_leader',
      grade: 'Professeur',
      degree: 'Doctorat',
      specialty: 'Génie Énergétique & PV',
      photo_url: null,
      bio: 'Chef d\'équipe Système Energétique (SEn). Travaille sur le dimensionnement, le contrôle des systèmes PV, et la dégradation vis-à-vis des conditions sahariennes.',
      joined_at: '2020-02-10T00:00:00Z',
      team_id: 'team_sen',
      orcid: '0000-0002-3344-5566',
      google_scholar_url: 'https://scholar.google.com/citations?user=bdennai_mock',
      research_gate_url: 'https://www.researchgate.net/profile/Benmoussa_Dennai_mock',
      h_index: 12,
      citations_count: 640,
      publications_count: 14,
      research_topics: ['Energy Systems', 'PV Degradation', 'Optimization', 'Control Loops']
    },
    {
      id: 'member_researcher_1',
      email: 'a.boudjemila@univ-bechar.dz',
      password_hash: '$2b$10$abcdefghijklmnopqrstuv',
      full_name: 'Dr. Amel BOUDJEMILA',
      role: 'member',
      grade: 'Maitre de Conférences',
      degree: 'Doctorat',
      specialty: 'Dépôts et Couches Minces',
      photo_url: null,
      bio: 'Chercheuse au sein de l\'équipe MSI. Spécialisée dans les méthodes expérimentales de dépôt par Spin Coating et Spray Pyrolyse pour cellules minces.',
      joined_at: '2020-09-01T00:00:00Z',
      team_id: 'team_msi',
      orcid: '0000-0002-1122-3344',
      google_scholar_url: 'https://scholar.google.com/citations?user=aboudjemila_mock',
      research_gate_url: 'https://www.researchgate.net/profile/Amel_Boudjemila_mock',
      h_index: 9,
      citations_count: 310,
      publications_count: 11,
      research_topics: ['Spin Coating', 'Spray Pyrolysis', 'Thin-Film Fabrication']
    },
    {
      id: 'member_researcher_2',
      email: 'k.slimani@univ-bechar.dz',
      password_hash: '$2b$10$abcdefghijklmnopqrstuv',
      full_name: 'Dr. Karim SLIMANI',
      role: 'member',
      grade: 'Maitre Assistant',
      degree: 'Doctorat',
      specialty: 'Optimisation Énergétique',
      photo_url: null,
      bio: 'Chercheur en génie des systèmes. Développe des algorithmes de contrôle intelligent pour optimiser les installations photovoltaïques isolées.',
      joined_at: '2021-01-10T00:00:00Z',
      team_id: 'team_sen',
      orcid: '0000-0003-5566-7788',
      google_scholar_url: 'https://scholar.google.com/citations?user=kslimani_mock',
      research_gate_url: 'https://www.researchgate.net/profile/Karim_Slimani_mock',
      h_index: 7,
      citations_count: 195,
      publications_count: 8,
      research_topics: ['Smart Control', 'PV Optimization', 'Saharan Micro-grids']
    }
  ],
  projects: [
    {
      id: 'project_1',
      team_id: 'team_msi',
      name: 'Thin Film Solar Cell Fabrication',
      description: 'Realization of standard and multi-spectral thin-film solar cells using Spin Coating and Spray Pyrolysis chemical routes.',
      started_at: '2025-01-15',
      expected_end_date: '2027-12-31',
      state: 'ongoing',
      photo_url: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=600&auto=format&fit=crop&q=80',
      member_ids: ['member_director', 'member_researcher_1']
    },
    {
      id: 'project_2',
      team_id: 'team_mos',
      name: 'Ab-Initio Simulation of Materials',
      description: 'Theoretical investigations and electronic properties calculations of materials for energy storage and PV cells using DFT models.',
      started_at: '2024-06-01',
      expected_end_date: '2026-11-30',
      state: 'ongoing',
      photo_url: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&auto=format&fit=crop&q=80',
      member_ids: ['member_ghezali']
    },
    {
      id: 'project_3',
      team_id: 'team_sen',
      name: 'PV System Sizing & Optimization',
      description: 'Optimization of control algorithms and analysis of dust and high temperature degradation profiles on Saharan solar panels.',
      started_at: '2025-05-10',
      expected_end_date: '2028-05-10',
      state: 'planned',
      photo_url: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=600&auto=format&fit=crop&q=80',
      member_ids: ['member_dennai', 'member_researcher_2']
    }
  ],
  news: [
    {
      id: 'news_1',
      title: 'LDERAS Inaugurates Saharan Solar Testing Platform in Béchar',
      content: 'This experimental solar tracking station will gather continuous, high-fidelity solar radiation and environmental datasets (GHI, DNI, humidity) to evaluate photovoltaic thermal stress under extreme desert conditions.',
      description: 'The Rector of Béchar University officially launched the high-resolution meteorological solar station.',
      photo_url: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800&auto=format&fit=crop&q=80',
      published_at: '2026-05-10T10:00:00Z',
      author_id: 'member_director',
      category: 'breakthrough',
      view_count: 540
    },
    {
      id: 'news_2',
      title: '4th International Workshop on Renewable Energies in Saharan Regions',
      content: 'LDERAS will host the 4th international workshop on Saharan Energy transition in October 2026. Experts will present papers on molten salt storage capacity, solar-powered water desalination, and low-speed turbine physics.',
      description: 'LDERAS invites physicists and energy experts globally to Béchar for our solar-wind integration symposium.',
      photo_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
      published_at: '2026-06-01T08:30:00Z',
      author_id: 'member_director',
      category: 'event',
      view_count: 320
    }
  ],
  articles: [
    {
      id: 'art_1',
      name: 'Evaluation of Dust Layer Impact on Concentrated Solar Collectors in Saharan Climates',
      journal_link: 'https://sciencedirect.com/example-csp',
      pdf_link: '#',
      description: 'This paper establishes mathematical degradation equations for parabolic CSP mirror reflectors subject to ambient sand and dust storms in North Africa.',
      published_at: '2025-03-14T00:00:00Z',
      primary_author_id: 'member_director',
      doi: '10.1016/j.solmat.2025.03.114',
      citations_count: 142,
      downloads_count: 531,
      altmetric_score: 18,
      article_type: 'journal',
      keywords: ['CSP', 'Saharan Dust', 'Mirror Degradation'],
      journal_name: 'Solar Energy Materials and Solar Cells',
      volume: '280',
      issue: '4',
      pages: '102-114',
      issn: '0927-0248',
      funding_source: 'National Research Grant (DGRSDT)'
    },
    {
      id: 'art_2',
      name: 'Optimal Sizing of Hybrid Solar-Wind Power Systems with Battery Storage for Saharan Micro-grids',
      journal_link: 'https://ieee.org/example-hybrid',
      pdf_link: '#',
      description: 'Developing heuristic control loops to balance solar/wind supply profiles with lithium storage capacity under Bechar rural load metrics.',
      published_at: '2025-11-20T00:00:00Z',
      primary_author_id: 'member_researcher_2',
      doi: '10.1109/TSTE.2025.3214569',
      citations_count: 98,
      downloads_count: 312,
      altmetric_score: 8,
      article_type: 'conference',
      keywords: ['Hybrid Systems', 'Smart Grids', 'Micro-grids', 'Sahara'],
      journal_name: 'IEEE Transactions on Sustainable Energy',
      volume: '16',
      issue: '2',
      pages: '245-254',
      issn: '1949-3029',
      funding_source: 'Algerian-Tunisian Bilateral Project'
    },
    {
      id: 'art_3',
      name: 'Phase Change Materials for High-Temperature Thermal Storage in Desert Climates',
      journal_link: 'https://springer.com/example-pcm',
      pdf_link: '#',
      description: 'Analyzing thermal conductivity and phase change enthalpies of salt hydrates for high temp heat retention systems.',
      published_at: '2026-02-05T00:00:00Z',
      primary_author_id: 'member_researcher_1',
      doi: '10.1007/s10973-026-11843-z',
      citations_count: 14,
      downloads_count: 85,
      altmetric_score: 4,
      article_type: 'journal',
      keywords: ['PCM', 'Thermal Storage', 'Molten Salts', 'Desert CSP'],
      journal_name: 'Journal of Thermal Analysis and Calorimetry',
      volume: '147',
      issue: '1',
      pages: '45-56',
      issn: '1388-6150',
      funding_source: 'University of Bechar PRFU Grant'
    }
  ],
  article_co_authors: [
    { article_id: 'art_1', member_id: 'member_researcher_1' },
    { article_id: 'art_2', member_id: 'member_dennai' },
    { article_id: 'art_3', member_id: 'member_director' }
  ]
};

// Multilingual translations map for DB-driven text fields.
const LOCALIZED_DICTS = {
  ar: {
    // Lab
    '00000000-0000-0000-0000-000000000001_name': 'مخبر تطوير الطاقات المتجددة وتطبيقاتها في المناطق الصحراوية (LDERAS)',
    '00000000-0000-0000-0000-000000000001_description': 'تتوجه مهمة مخبر LDERAS نحو الدراسات التجريبية والنظرية للخصائص الفيزيائية للمواد والأجهزة الخاصة بالطاقات المتجددة.',
    '00000000-0000-0000-0000-000000000001_director': 'أ.د. عبد القادر نوري',
    '00000000-0000-0000-0000-000000000001_address': 'كلية العلوم الدقيقة، جامعة طاهري محمد، ص.ب 417، بشار، الجزائر',
    // Teams
    'team_msi_name': 'فيزياء المواد، الأسطح والواجهات',
    'team_msi_description': 'فرقة بحثية تهتم بتحضير ودراسة الخصائص الفيزيائية والكيميائية للمواد والواجهات المستعملة في الخلايا الشمسية وطرق الطلاء الكيميائي.',
    'team_mos_name': 'النمذجة والمحاكاة',
    'team_mos_description': 'تهتم الفرقة بالمحاكاة والدراسة عن طريق طرق المبادئ الأولى (ab-Initio) للخصائص الفيزيائية للمواد من أجل تطبيقات الطاقات المتجددة.',
    'team_cs_name': 'الخلايا الشمسية',
    'team_cs_description': 'فرقة بحثية تهتم بتحسين أداء المكونات الكهرومغناطيسية الضوئية ودراسة الخلايا الشمسية ذات الطبقات الرقيقة (السيليكون، المركبات الثنائية والثلاثية).',
    'team_sen_name': 'أنظمة الطاقة',
    'team_sen_description': 'تهتم الفرقة بدراسة تدهور الأنظمة الشمسية، ومراقبتها وتحسينها، والتحكم بالأجهزة وتأثير المناخ الصحراوي والعوامل الجوية.',
    // Members
    'member_director_bio': 'مدير المخبر ورئيس فرقة MSI. يمتلك خبرة تفوق 20 عاماً في دراسة ونمذجة الخصائص الفيزيائية للمواد الضوئية وتطبيقاتها.',
    'member_ghezali_bio': 'رئيس فرقة النمذجة والمحاكاة (MoS). خبير في حسابات المبادئ الأولى والدراسات النظرية لخصائص المواد الكهروضوئية.',
    'member_khachab_bio': 'رئيس فرقة الخلايا الشمسية (CS). متخصص في تحسين مردود الخلايا الشمسية والوصلات وتطوير مركبات التشالكوبيريت.',
    'member_dennai_bio': 'رئيس فرقة أنظمة الطاقة (SEn). متخصص في نمذجة ومراقبة أداء الأنظمة الكهروضوئية وتأثرها بالظروف البيئية الصحراوية.',
    'member_researcher_1_bio': 'عضو باحث بفرقة MSI. مهتمة بتحضير الخلايا الشمسية ذات الطبقات الرقيقة باستعمال طرق الطلاء الدوار والرش الكيميائي الحراري.',
    'member_researcher_2_bio': 'عضو باحث بفرقة SEn. أبحاثه تتركز على أنظمة التحكم الذكي وتطوير خوارزميات تحسين مردود الشبكات المعزولة.',
    // Projects
    'project_1_name': 'تصنيع الخلايا الشمسية ذات الطبقات الرقيقة',
    'project_1_description': 'إعداد وتصنيع خلايا شمسية ذات طبقات رقيقة قياسية ومتعددة الأطياف بالاعتماد على طريقتي الطلاء الدوار والرش الكيميائي الحراري.',
    'project_2_name': 'محاكاة المواد باستخدام حسابات المبادئ الأولى',
    'project_2_description': 'دراسة المحاكاة للخصائص الفيزيائية والإلكترونية للمواد المستعملة في الطاقات المتجددة باستخدام نموذج نظرية الكثافة الوظيفية (DFT).',
    'project_3_name': 'تحسين وحساب حجم الأنظمة الكهروضوئية',
    'project_3_description': 'تطوير خوارزميات تحكم ومحاكاة تدهور المكونات الكهروضوئية بفعل العوامل الجوية والحرارة العالية والغبار في بشار.',
    // News
    'news_1_title': 'مخبر LDERAS يدشن المحطة التجريبية للطاقة الشمسية الصحراوية',
    'news_1_description': 'أشرف السيد رئيس جامعة بشار على التدشين الرسمي للمحطة التجريبية لمتابعة الإشعاع الشمسي والظروف البيئية بمقر الكلية.',
    'news_1_content': 'ستمكن هذه المحطة التجريبية من جمع بيانات عالية الدقة حول الإشعاع الشمسي الكلي والمشتت وحالة الطقس كسرعة الرياح ودرجة الرطوبة والحرارة، وذلك لمقارنة واختبار نماذج الألواح الكهروضوئية والحرارية تحت درجات الحرارة المرتفعة بالساورة.',
    'news_2_title': 'الندوة الدولية الرابعة حول الطاقات المتجددة في الصحراء',
    'news_2_description': 'ينظم مخبر LDERAS الندوة الدولية الرابعة حول الانتقال الطاقوي في المناطق الصحراوية أكتوبر المقبل بمشاركة دولية.',
    'news_2_content': 'ستشهد الفعالية مشاركة خبراء وباحثين من عدة دول لمناقشة أحدث تقنيات تحلية المياه باستخدام الطاقة الشمسية، التخزين الحراري الذكي، ومحاكاة حقول الرياح في الهضاب الصحراوية. الورشة فرصة لطلبة الدكتوراه لعرض نتائج أبحاثهم.',
    // Articles
    'art_1_name': 'تقييم تأثير تراكم الغبار على اللواقط الشمسية المركزة في المناخات الصحراوية',
    'art_1_description': 'تحدد هذه الدراسة معادلات تدهور الانعكاس للمرايا المكافئة في محطات CSP المعرضة للرمال والغبار في شمال أفريقيا.',
    'art_2_name': 'تحديد الحجم الأمثل لأنظمة الطاقة الهجينة شمس-رياح مع تخزين البطاريات للشبكات الصغيرة الصحراوية',
    'art_2_description': 'تطوير خوارزميات تحكم توازن بين إنتاج طاقة الرياح والشمس مع قدرات بطاريات الليثيوم لتلبية متطلبات الحمل في بشار.',
    'art_3_name': 'المواد ذات التغير الطوري لتخزين الحرارة العالية في المناخات الصحراوية',
    'art_3_description': 'تحليل الموصلية الحرارية والمواد الكيميائية للأملاح الذائبة لتحسين الاحتفاظ بالحرارة نهاراً وتفريغها ليلاً.'
  },
  fr: {
    // Lab
    '00000000-0000-0000-0000-000000000001_name': 'Laboratoire de Développement des Energies Renouvelables et Leurs Applications dans les Zones Sahariennes (LDERAS)',
    '00000000-0000-0000-0000-000000000001_description': 'La mission du laboratoire LDERAS est orientée vers les études expérimentales et théoriques des propriétés physiques des matériaux et dispositifs pour les énergies renouvelables.',
    '00000000-0000-0000-0000-000000000001_director': 'Pr. NOURI Abdelkader',
    '00000000-0000-0000-0000-000000000001_address': 'Faculté des Sciences Exactes, Université TAHRI Mohammed, BP 417, Béchar, Algérie',
    // Teams
    'team_msi_name': 'Matériaux surfaces et interfaces',
    'team_msi_description': 'Équipe axée sur la préparation, la caractérisation et l\'optimisation des propriétés physiques et chimiques des matériaux et de leurs interfaces pour cellules solaires.',
    'team_mos_name': 'Modélisation et Simulation',
    'team_mos_description': 'Équipe dédiée à la simulation et à l\'étude par les méthodes de calcul ab-Initio des propriétés physiques des matériaux pour les énergies propres.',
    'team_cs_name': 'Cellules solaires',
    'team_cs_description': 'Dédiée à l\'amélioration des performances des composants optoélectroniques, la conductivité, le rendement quantique et les configurations multi-spectrales.',
    'team_sen_name': 'Système Energétique',
    'team_sen_description': 'Concentrée sur le dimensionnement, le contrôle, l\'optimisation et l\'étude de la dégradation des composants et systèmes PV sous conditions sahariennes.',
    // Members
    'member_director_bio': 'Directeur du laboratoire LDERAS et chef de l\'équipe MSI. Plus de 20 ans d\'expérience dans l\'analyse des capteurs et propriétés physiques des matériaux photovoltaïques.',
    'member_ghezali_bio': 'Chef de l\'équipe Modélisation et Simulation (MoS). Expert en calculs ab-Initio et études théoriques des semi-conducteurs.',
    'member_khachab_bio': 'Chef de l\'équipe Cellules solaires (CS). Travaille sur l\'optimisation du rendement énergétique et la qualité des interfaces des cellules.',
    'member_dennai_bio': 'Chef de l\'équipe Système Energétique (SEn). Recherche orientée vers l\'étude du comportement et de la dégradation des installations solaires en milieu désertique.',
    'member_researcher_1_bio': 'Chercheuse au sein de l\'équipe MSI. Spécialisée dans les dépôts par Spin Coating et Spray Pyrolyse de couches minces standard et multispectrales.',
    'member_researcher_2_bio': 'Chercheur en génie des systèmes. Développe des algorithmes de contrôle intelligent pour optimiser les installations photovoltaïques isolées.',
    // Projects
    'project_1_name': 'Réalisation de Cellules Solaires en Couches Minces',
    'project_1_description': 'Préparation et réalisation de cellules photovoltaïques en couches minces par les méthodes sol-gel, spin coating et spray pyrolyse.',
    'project_2_name': 'Simulation Ab-Initio des Propriétés Physiques des Matériaux',
    'project_2_description': 'Calculs quantiques et modélisation ab-initio des propriétés structurales et électroniques de nouveaux matériaux pour énergies vertes.',
    'project_3_name': 'Dimensionnement et Optimisation de Systèmes PV',
    'project_3_description': 'Développement d\'algorithmes de régulation et analyse de la durabilité des modules solaires face aux tempêtes et températures extrêmes.',
    // News
    'news_1_title': 'Le LDERAS Inaugure la Plateforme Solaire Saharienne de Béchar',
    'news_1_description': 'Le Recteur de l\'Université a inauguré la nouvelle station de mesure solaire haute fidélité.',
    'news_1_content': 'Cette station collectera des données de haute résolution sur le rayonnement solaire (direct, diffus, global) et les variables environnementales afin d\'optimiser la durabilité des installations photovoltaïques.',
    'news_2_title': '4ème Atelier International sur les Énergies Renouvelables en Zones Sahariennes',
    'news_2_description': 'Le LDERAS organise la 4e édition de son atelier international sur le stockage et le dessalement solaire.',
    'news_2_content': 'Cet atelier rassemblera des experts internationaux pour débattre des solutions d\'intégration photovoltaïque, de stockage thermique par sels fondus et de dessalement d\'eau saumâtre.',
    // Articles
    'art_1_name': 'Évaluation de l\'Impact du Dépôt de Poussière sur les Collecteurs Solaires Concentrés en Climat Saharien',
    'art_1_description': 'Cette étude établit des modèles de dégradation de la réflectance pour les miroirs paraboliques CSP sous tempêtes de poussière.',
    'art_2_name': 'Dimensionnement Optimal de Systèmes Hybrides Solaire-Éolien avec Stockage par Batterie pour Micro-Réseaux Sahariens',
    'art_2_description': 'Développement d\'algorithmes d\'optimisation évaluant le couplage photovoltaïque/éolien et le cyclage des batteries de stockage.',
    'art_3_name': 'Matériaux à Changement de Phase pour Stockage Thermique Haute Température en Climat Désertique',
    'art_3_description': 'Analyse des profils de conductivité et fusion solide/liquide de mélanges de sels pour la rétention nocturne de chaleur.'
  }
};

// LocalDB initialization helper
function getLocalDB() {
  const existing = localStorage.getItem('lderas_showcase_db');
  if (existing) {
    try {
      return JSON.parse(existing);
    } catch (e) {
      // ignore and fall back to seed
    }
  }
  localStorage.setItem('lderas_showcase_db', JSON.stringify(SEED_DATA));
  return SEED_DATA;
}

function saveLocalDB(db) {
  localStorage.setItem('lderas_showcase_db', JSON.stringify(db));
}

// Translate record fields helper
function translateObj(obj, id, fieldBase, lang) {
  if (!obj) return '';
  if (lang === 'en') return obj[fieldBase] || '';
  const key = `${id}_${fieldBase}`;
  const dict = LOCALIZED_DICTS[lang];
  return (dict && dict[key]) || obj[fieldBase] || '';
}

// ----------------------------------------------------------------------------
// EXPORTED READ-ONLY DATABASE API
// ----------------------------------------------------------------------------
export const dbService = {
  // --- LAB INFO ---
  getLabInfo: async (lang = 'en') => {
    if (hasSupabase) {
      try {
        const { data, error } = await supabase.from('research_lab').select('*').single();
        if (!error && data) return data;
      } catch (err) { console.error('Supabase fetch failed, using fallback mock', err); }
    }
    const db = getLocalDB();
    const lab = db.lab;
    return {
      ...lab,
      name: translateObj(lab, lab.id, 'name', lang),
      description: translateObj(lab, lab.id, 'description', lang),
      director: translateObj(lab, lab.id, 'director', lang),
      address: translateObj(lab, lab.id, 'address', lang)
    };
  },

  // --- TEAMS ---
  getTeams: async (lang = 'en') => {
    if (hasSupabase) {
      try {
        const { data, error } = await supabase.from('teams').select('*').order('acronym');
        if (!error && data) return data;
      } catch (err) { console.error('Supabase fetch failed, using fallback mock', err); }
    }
    const db = getLocalDB();
    return db.teams.map(t => ({
      ...t,
      name: translateObj(t, t.id, 'name', lang),
      description: translateObj(t, t.id, 'description', lang)
    }));
  },

  getTeamById: async (id, lang = 'en') => {
    if (hasSupabase) {
      try {
        const { data, error } = await supabase.from('teams').select('*').eq('id', id).single();
        if (!error && data) return data;
      } catch (err) { console.error('Supabase fetch failed, using fallback mock', err); }
    }
    const db = getLocalDB();
    const t = db.teams.find(team => team.id === id);
    if (!t) return null;
    return {
      ...t,
      name: translateObj(t, t.id, 'name', lang),
      description: translateObj(t, t.id, 'description', lang)
    };
  },

  // --- MEMBERS ---
  getMembers: async (lang = 'en') => {
    if (hasSupabase) {
      try {
        const { data, error } = await supabase.from('members').select('*').order('full_name');
        if (!error && data) return data;
      } catch (err) { console.error('Supabase fetch failed, using fallback mock', err); }
    }
    const db = getLocalDB();
    return db.members.map(m => ({
      ...m,
      bio: translateObj(m, m.id, 'bio', lang)
    }));
  },

  getMemberById: async (id, lang = 'en') => {
    if (hasSupabase) {
      try {
        const { data, error } = await supabase.from('members').select('*').eq('id', id).single();
        if (!error && data) return data;
      } catch (err) { console.error('Supabase fetch failed, using fallback mock', err); }
    }
    const db = getLocalDB();
    const m = db.members.find(member => member.id === id);
    if (!m) return null;
    return {
      ...m,
      bio: translateObj(m, m.id, 'bio', lang)
    };
  },

  getMembersByTeam: async (teamId, lang = 'en') => {
    const db = getLocalDB();
    const list = db.members.filter(m => m.team_id === teamId);
    return list.map(m => ({
      ...m,
      bio: translateObj(m, m.id, 'bio', lang)
    }));
  },

  // --- PROJECTS ---
  getProjects: async (lang = 'en') => {
    if (hasSupabase) {
      try {
        const { data, error } = await supabase.from('projects').select('*').order('started_at');
        if (!error && data) return data;
      } catch (err) { console.error('Supabase fetch failed, using fallback mock', err); }
    }
    const db = getLocalDB();
    return db.projects.map(p => ({
      ...p,
      name: translateObj(p, p.id, 'name', lang),
      description: translateObj(p, p.id, 'description', lang)
    }));
  },

  getProjectsByTeam: async (teamId, lang = 'en') => {
    const db = getLocalDB();
    const list = db.projects.filter(p => p.team_id === teamId);
    return list.map(p => ({
      ...p,
      name: translateObj(p, p.id, 'name', lang),
      description: translateObj(p, p.id, 'description', lang)
    }));
  },

  getProjectById: async (id, lang = 'en') => {
    if (hasSupabase) {
      try {
        const { data, error } = await supabase.from('projects').select('*').eq('id', id).single();
        if (!error && data) return data;
      } catch (err) { console.error('Supabase fetch failed, using fallback mock', err); }
    }
    const db = getLocalDB();
    const p = db.projects.find(item => item.id === id);
    if (!p) return null;
    return {
      ...p,
      name: translateObj(p, p.id, 'name', lang),
      description: translateObj(p, p.id, 'description', lang)
    };
  },

  // --- NEWS ---
  getNews: async (lang = 'en') => {
    if (hasSupabase) {
      try {
        const { data, error } = await supabase.from('news').select('*').order('published_at', { ascending: false });
        if (!error && data) return data;
      } catch (err) { console.error('Supabase fetch failed, using fallback mock', err); }
    }
    const db = getLocalDB();
    return [...db.news].sort((a, b) => new Date(b.published_at) - new Date(a.published_at)).map(n => ({
      ...n,
      title: translateObj(n, n.id, 'title', lang),
      description: translateObj(n, n.id, 'description', lang),
      content: translateObj(n, n.id, 'content', lang)
    }));
  },

  getNewsById: async (id, lang = 'en') => {
    if (hasSupabase) {
      try {
        const { data, error } = await supabase.from('news').select('*').eq('id', id).single();
        if (!error && data) return data;
      } catch (err) { console.error('Supabase fetch failed, using fallback mock', err); }
    }
    const db = getLocalDB();
    const n = db.news.find(item => item.id === id);
    if (!n) return null;
    return {
      ...n,
      title: translateObj(n, n.id, 'title', lang),
      description: translateObj(n, n.id, 'description', lang),
      content: translateObj(n, n.id, 'content', lang)
    };
  },

  // --- ARTICLES / PUBLICATIONS ---
  getArticles: async (lang = 'en') => {
    if (hasSupabase) {
      try {
        const { data, error } = await supabase.from('articles').select('*').order('published_at', { ascending: false });
        if (!error && data) return data;
      } catch (err) { console.error('Supabase fetch failed, using fallback mock', err); }
    }
    const db = getLocalDB();
    return [...db.articles].sort((a, b) => new Date(b.published_at) - new Date(a.published_at)).map(a => {
      const coIds = db.article_co_authors.filter(ca => ca.article_id === a.id).map(ca => ca.member_id);
      const coAuths = db.members.filter(m => coIds.includes(m.id)).map(m => m.full_name);
      return {
        ...a,
        name: translateObj(a, a.id, 'name', lang),
        description: translateObj(a, a.id, 'description', lang),
        coAuthors: coAuths
      };
    });
  },

  getArticleById: async (id, lang = 'en') => {
    if (hasSupabase) {
      try {
        const { data, error } = await supabase.from('articles').select('*').eq('id', id).single();
        if (!error && data) return data;
      } catch (err) { console.error('Supabase fetch failed, using fallback mock', err); }
    }
    const db = getLocalDB();
    const a = db.articles.find(item => item.id === id);
    if (!a) return null;
    return {
      ...a,
      name: translateObj(a, a.id, 'name', lang),
      description: translateObj(a, a.id, 'description', lang)
    };
  },

  getArticleCoAuthors: async (articleId, lang = 'en') => {
    const db = getLocalDB();
    const coAuthorIds = db.article_co_authors
      .filter(ca => ca.article_id === articleId)
      .map(ca => ca.member_id);
    const coAuthors = db.members.filter(m => coAuthorIds.includes(m.id));
    return coAuthors.map(m => ({
      ...m,
      bio: translateObj(m, m.id, 'bio', lang)
    }));
  },

  getArticlesByMember: async (memberId, lang = 'en') => {
    const db = getLocalDB();
    // Fetch articles where member is either primary author or co-author
    const primary = db.articles.filter(a => a.primary_author_id === memberId);

    const coAuthoredIds = db.article_co_authors
      .filter(ca => ca.member_id === memberId)
      .map(ca => ca.article_id);
    const coAuthored = db.articles.filter(a => coAuthoredIds.includes(a.id));

    // Union
    const combined = [...primary, ...coAuthored];
    // De-duplicate
    const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());

    return unique.map(a => {
      const coIds = db.article_co_authors.filter(ca => ca.article_id === a.id).map(ca => ca.member_id);
      const coAuths = db.members.filter(m => coIds.includes(m.id)).map(m => m.full_name);
      return {
        ...a,
        name: translateObj(a, a.id, 'name', lang),
        description: translateObj(a, a.id, 'description', lang),
        coAuthors: coAuths
      };
    });
  },

  // --- MUTATIONS / WRITE SERVICE ---
  
  // Member profile update
  updateMemberProfile: async (memberId, fields) => {
    const db = getLocalDB();
    const idx = db.members.findIndex(m => m.id === memberId);
    if (idx !== -1) {
      db.members[idx] = { ...db.members[idx], ...fields };
      saveLocalDB(db);
      return db.members[idx];
    }
    throw new Error('Member not found');
  },

  // Add Article (Member)
  addArticle: async (article) => {
    const db = getLocalDB();
    const newArt = {
      id: `art_${Date.now()}`,
      name: article.name,
      description: article.description || '',
      published_at: new Date().toISOString(),
      primary_author_id: article.primary_author_id,
      journal_name: article.journal_name || '',
      journal_link: article.journal_link || '#',
      pdf_link: article.pdf_link || '#',
      doi: article.doi || '',
    };
    db.articles.push(newArt);

    // Save co-authors mapping
    if (article.coAuthorIds && Array.isArray(article.coAuthorIds)) {
      article.coAuthorIds.forEach(coId => {
        db.article_co_authors.push({
          article_id: newArt.id,
          member_id: coId
        });
      });
    }

    saveLocalDB(db);
    return newArt;
  },

  // Delete Article (Member)
  deleteArticle: async (articleId) => {
    const db = getLocalDB();
    db.articles = db.articles.filter(a => a.id !== articleId);
    db.article_co_authors = db.article_co_authors.filter(ca => ca.article_id !== articleId);
    saveLocalDB(db);
    return true;
  },

  // Update Article (Member / Lab Manager)
  updateArticle: async (articleId, article) => {
    const db = getLocalDB();
    const idx = db.articles.findIndex(a => a.id === articleId);
    if (idx !== -1) {
      db.articles[idx] = {
        ...db.articles[idx],
        name: article.name,
        description: article.description || '',
        journal_name: article.journal_name || '',
        journal_link: article.journal_link || '#',
        pdf_link: article.pdf_link || '#',
        doi: article.doi || '',
      };
      
      // Update co-authors mapping
      db.article_co_authors = db.article_co_authors.filter(ca => ca.article_id !== articleId);
      if (article.coAuthorIds && Array.isArray(article.coAuthorIds)) {
        article.coAuthorIds.forEach(coId => {
          db.article_co_authors.push({
            article_id: articleId,
            member_id: coId
          });
        });
      }
      
      saveLocalDB(db);
      return db.articles[idx];
    }
    throw new Error('Article not found');
  },


  // Create Team (Team Leader / Lab Manager)
  createTeam: async (team) => {
    const db = getLocalDB();
    const newTeam = {
      id: `team_${Date.now()}`,
      name: team.name,
      acronym: team.acronym,
      description: team.description || '',
      team_leader_id: team.team_leader_id || null,
    };
    db.teams.push(newTeam);
    saveLocalDB(db);
    return newTeam;
  },

  // Delete Team (Lab Manager)
  deleteTeam: async (teamId) => {
    const db = getLocalDB();
    db.teams = db.teams.filter(t => t.id !== teamId);
    // dissociate members of this team
    db.members = db.members.map(m => m.team_id === teamId ? { ...m, team_id: null } : m);
    // dissociate projects of this team
    db.projects = db.projects.filter(p => p.team_id !== teamId);
    saveLocalDB(db);
    return true;
  },

  // Add Member to Team (Team Leader)
  addMemberToTeam: async (memberId, teamId) => {
    const db = getLocalDB();
    const idx = db.members.findIndex(m => m.id === memberId);
    if (idx !== -1) {
      db.members[idx].team_id = teamId;
      saveLocalDB(db);
      return db.members[idx];
    }
    throw new Error('Member not found');
  },

  // Remove Member from Team (Team Leader)
  removeMemberFromTeam: async (memberId) => {
    const db = getLocalDB();
    const idx = db.members.findIndex(m => m.id === memberId);
    if (idx !== -1) {
      db.members[idx].team_id = null;
      saveLocalDB(db);
      return db.members[idx];
    }
    throw new Error('Member not found');
  },

  // Add Project (Team Leader)
  addProject: async (project) => {
    const db = getLocalDB();
    const newProj = {
      id: `project_${Date.now()}`,
      team_id: project.team_id,
      name: project.name,
      description: project.description || '',
      started_at: project.started_at || new Date().toISOString().split('T')[0],
      expected_end_date: project.expected_end_date || null,
      state: project.state || 'ongoing',
      photo_url: project.photo_url || null,
      member_ids: project.member_ids || [],
    };
    db.projects.push(newProj);
    saveLocalDB(db);
    return newProj;
  },

  // Delete Project (Team Leader)
  deleteProject: async (projectId) => {
    const db = getLocalDB();
    db.projects = db.projects.filter(p => p.id !== projectId);
    saveLocalDB(db);
    return true;
  },

  // Assign Team Leader (Lab Manager)
  assignTeamLeader: async (teamId, leaderId) => {
    const db = getLocalDB();
    const idx = db.teams.findIndex(t => t.id === teamId);
    if (idx !== -1) {
      db.teams[idx].team_leader_id = leaderId;
      // elevate member role to team_leader if it was standard member
      const memIdx = db.members.findIndex(m => m.id === leaderId);
      if (memIdx !== -1 && db.members[memIdx].role === 'member') {
        db.members[memIdx].role = 'team_leader';
      }
      saveLocalDB(db);
      return db.teams[idx];
    }
    throw new Error('Team not found');
  },

  // Add Member to Lab System (Lab Manager)
  addMemberToLab: async (member) => {
    const db = getLocalDB();
    const newMember = {
      id: `member_${Date.now()}`,
      email: member.email,
      full_name: member.full_name,
      role: member.role || 'member',
      grade: member.grade || 'Dr.',
      degree: member.degree || 'Ph.D',
      specialty: member.specialty || '',
      bio: member.bio || '',
      joined_at: new Date().toISOString(),
      team_id: member.team_id || null,
      orcid: member.orcid || '',
      google_scholar_url: member.google_scholar_url || '',
      research_gate_url: member.research_gate_url || '',
      h_index: 0,
      citations_count: 0,
      publications_count: 0,
      research_topics: member.research_topics || [],
    };
    db.members.push(newMember);
    saveLocalDB(db);
    return newMember;
  },

  // Remove Member from Lab System (Lab Manager)
  removeMemberFromLab: async (memberId) => {
    const db = getLocalDB();
    db.members = db.members.filter(m => m.id !== memberId);
    // remove leader associations
    db.teams = db.teams.map(t => t.team_leader_id === memberId ? { ...t, team_leader_id: null } : t);
    // remove co-author associations
    db.article_co_authors = db.article_co_authors.filter(ca => ca.member_id !== memberId);
    saveLocalDB(db);
    return true;
  },

  // Add News (Lab Manager)
  addNews: async (newsItem) => {
    const db = getLocalDB();
    const newNews = {
      id: `news_${Date.now()}`,
      title: newsItem.title,
      description: newsItem.description || '',
      content: newsItem.content || '',
      published_at: new Date().toISOString(),
      photo_url: newsItem.photo_url || null,
    };
    db.news.push(newNews);
    saveLocalDB(db);
    return newNews;
  },

  // Delete News (Lab Manager)
  deleteNews: async (newsId) => {
    const db = getLocalDB();
    db.news = db.news.filter(n => n.id !== newsId);
    saveLocalDB(db);
    return true;
  }
};
