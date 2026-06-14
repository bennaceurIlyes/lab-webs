import { supabase, hasSupabase } from './supabase';

// Monolingual fields matching Section 7, but initialized with multilingual data 
// so the UI can dynamically translate them based on the active language.
const SEED_DATA = {
  lab: {
    id: '00000000-0000-0000-0000-000000000001',
    name: 'Laboratory for the Development of Renewable Energies and their Applications in Saharan Areas (LDREAS)',
    description: 'LDREAS research laboratory at Béchar University is dedicated to developing efficient renewable energy conversion and storage platforms designed specifically for Saharan desert environments.',
    logo_url: null,
    director: 'Prof. Abdelkader NOURI',
    address: 'Faculty of Exact Sciences, TAHRI Mohammed University, BP 417, Béchar, Algeria',
    phone: '+213 49 23 89 74 / 84 / 86',
    fax: '+213 49 23 89 86 / 94'
  },
  teams: [
    {
      id: 'team_solar_concentrated',
      name: 'Thermal Systems & Concentrated Solar',
      acronym: 'TER',
      description: 'Research team focused on applied thermodynamics, concentrated solar power receivers, solar desalination, and thermal storage.',
      team_leader_id: 'member_leader_1'
    },
    {
      id: 'team_photovoltaic_storage',
      name: 'Photovoltaic Systems & Energy Storage',
      acronym: 'PVES',
      description: 'Researching solar cell physics, advanced battery energy storage, anti-soiling, and smart controller design for hybrid micro-grids.',
      team_leader_id: 'member_leader_2'
    },
    {
      id: 'team_wind_dynamics',
      name: 'Wind Energy & Saharan Applications',
      acronym: 'WEAS',
      description: 'Assessing high/low altitude wind potential, aerodynamics simulation in sandstorm conditions, and blade performance in dry hot climates.',
      team_leader_id: 'member_leader_3'
    }
  ],
  members: [
    {
      id: 'member_director',
      email: 'a.nouri@univ-bechar.dz',
      password_hash: '$2b$10$abcdefghijklmnopqrstuv',
      full_name: 'Prof. Abdelkader NOURI',
      role: 'lab_leader',
      grade: 'Prof.',
      degree: 'Ph.D',
      specialty: 'Solar Thermal Systems',
      photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
      bio: 'Laboratory Director. 20+ years of expertise in thermal solar receiver simulation and high-temperature fluid dynamics modeling.',
      joined_at: '2007-06-15T00:00:00Z',
      team_id: 'team_solar_concentrated',
      orcid: '0000-0002-1823-4456',
      google_scholar_url: 'https://scholar.google.com/citations?user=anouri_mock',
      research_gate_url: 'https://www.researchgate.net/profile/Abdelkader_Nouri_mock',
      h_index: 34,
      citations_count: 4210,
      publications_count: 58,
      research_topics: ['Solar Thermal', 'CSP', 'Fluid Dynamics']
    },
    {
      id: 'member_leader_1',
      email: 'm.kadi@univ-bechar.dz',
      password_hash: '$2b$10$abcdefghijklmnopqrstuv',
      full_name: 'Dr. Mohamed KADI',
      role: 'team_leader',
      grade: 'MCA',
      degree: 'Ph.D',
      specialty: 'Concentrated Solar Power',
      photo_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80',
      bio: 'Team Leader of Thermal Systems. Focusing on CSP mirror degradation models and thermal fluid efficiency under desert environments.',
      joined_at: '2012-09-10T00:00:00Z',
      team_id: 'team_solar_concentrated',
      orcid: '0000-0003-8842-1011',
      google_scholar_url: 'https://scholar.google.com/citations?user=mkadi_mock',
      research_gate_url: 'https://www.researchgate.net/profile/Mohamed_Kadi_mock',
      h_index: 22,
      citations_count: 1840,
      publications_count: 26,
      research_topics: ['CSP Mirrors', 'Thermal Fluids', 'Saharan Heat']
    },
    {
      id: 'member_leader_2',
      email: 'f.zaidi@univ-bechar.dz',
      password_hash: '$2b$10$abcdefghijklmnopqrstuv',
      full_name: 'Dr. Fatima ZAIDI',
      role: 'team_leader',
      grade: 'MCA',
      degree: 'Ph.D',
      specialty: 'Photovoltaic Physics',
      photo_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
      bio: 'Team Leader of PV Systems. Expert in thin-film coatings, nano-structuring, and anti-soiling technologies for Saharan solar installations.',
      joined_at: '2014-04-18T00:00:00Z',
      team_id: 'team_photovoltaic_storage',
      orcid: '0000-0001-9988-1234',
      google_scholar_url: 'https://scholar.google.com/citations?user=fzaidi_mock',
      research_gate_url: 'https://www.researchgate.net/profile/Fatima_Zaidi_mock',
      h_index: 18,
      citations_count: 1120,
      publications_count: 19,
      research_topics: ['PV Anti-Soiling', 'Thin-Film Physics', 'Solar Clean Tech']
    },
    {
      id: 'member_leader_3',
      email: 'y.bensaad@univ-bechar.dz',
      password_hash: '$2b$10$abcdefghijklmnopqrstuv',
      full_name: 'Dr. Youcef BENSAAD',
      role: 'team_leader',
      grade: 'MCB',
      degree: 'Ph.D',
      specialty: 'Saharan Wind Dynamics',
      photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
      bio: 'Team Leader of Wind Energy. Working on aerodynamic simulation profiles and wind turbines designed for low-speed Saharan plateau winds.',
      joined_at: '2016-02-05T00:00:00Z',
      team_id: 'team_wind_dynamics',
      orcid: '0000-0002-3344-5566',
      google_scholar_url: 'https://scholar.google.com/citations?user=ybensaad_mock',
      research_gate_url: 'https://www.researchgate.net/profile/Youcef_Bensaad_mock',
      h_index: 12,
      citations_count: 640,
      publications_count: 14,
      research_topics: ['Aerodynamics', 'Wind Turbines', 'Sandstorm Simulations']
    },
    {
      id: 'member_researcher_1',
      email: 'a.boudjemila@univ-bechar.dz',
      password_hash: '$2b$10$abcdefghijklmnopqrstuv',
      full_name: 'Dr. Amel BOUDJEMILA',
      role: 'member',
      grade: 'MAA',
      degree: 'Ph.D',
      specialty: 'Thermal Storage Materials',
      photo_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&auto=format&fit=crop&q=80',
      bio: 'Research member in Thermal Systems. Investigating phase-change materials (PCM) and molten salts for high capacity night thermal storage.',
      joined_at: '2018-09-01T00:00:00Z',
      team_id: 'team_solar_concentrated',
      orcid: '0000-0002-1122-3344',
      google_scholar_url: 'https://scholar.google.com/citations?user=aboudjemila_mock',
      research_gate_url: 'https://www.researchgate.net/profile/Amel_Boudjemila_mock',
      h_index: 9,
      citations_count: 310,
      publications_count: 11,
      research_topics: ['PCM Materials', 'Molten Salt Storage', 'Night Thermal Recovery']
    },
    {
      id: 'member_researcher_2',
      email: 'k.slimani@univ-bechar.dz',
      password_hash: '$2b$10$abcdefghijklmnopqrstuv',
      full_name: 'Dr. Karim SLIMANI',
      role: 'member',
      grade: 'MAB',
      degree: 'Ph.D',
      specialty: 'Hybrid Smart Grids',
      photo_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80',
      bio: 'Research member in PV Systems. Optimizing energy dispatch algorithms and control loops for off-grid hybrid PV-wind-battery installations.',
      joined_at: '2020-01-10T00:00:00Z',
      team_id: 'team_photovoltaic_storage',
      orcid: '0000-0003-5566-7788',
      google_scholar_url: 'https://scholar.google.com/citations?user=kslimani_mock',
      research_gate_url: 'https://www.researchgate.net/profile/Karim_Slimani_mock',
      h_index: 7,
      citations_count: 195,
      publications_count: 8,
      research_topics: ['Smart Grids', 'Energy Dispatch', 'Off-grid Systems']
    }
  ],
  projects: [
    {
      id: 'project_1',
      team_id: 'team_solar_concentrated',
      name: 'Desert CSP Receiver Prototype',
      description: 'Developing high-temperature receivers resistant to severe Saharan dust storms.',
      started_at: '2025-01-15',
      expected_end_date: '2027-12-31',
      state: 'ongoing',
      photo_url: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'project_2',
      team_id: 'team_photovoltaic_storage',
      name: 'Anti-Soiling PV Coatings',
      description: 'Testing hydrophobic and anti-static coatings on silicon panels in Béchar.',
      started_at: '2024-06-01',
      expected_end_date: '2026-11-30',
      state: 'ongoing',
      photo_url: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'project_3',
      team_id: 'team_wind_dynamics',
      name: 'Low-Speed Desert Wind Turbines',
      description: 'Designing turbine blades optimized for the slow but steady wind currents of the Saharan plateaus.',
      started_at: '2025-05-10',
      expected_end_date: '2028-05-10',
      state: 'planned',
      photo_url: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=600&auto=format&fit=crop&q=80'
    }
  ],
  news: [
    {
      id: 'news_1',
      title: 'LDREAS Inaugurates Saharan Solar Testing Platform in Béchar',
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
      content: 'LDREAS will host the 4th international workshop on Saharan Energy transition in October 2026. Experts will present papers on molten salt storage capacity, solar-powered water desalination, and low-speed turbine physics.',
      description: 'LDREAS invites physicists and energy experts globally to Béchar for our solar-wind integration symposium.',
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
      primary_author_id: 'member_leader_1',
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
    { article_id: 'art_1', member_id: 'member_director' },
    { article_id: 'art_2', member_id: 'member_leader_2' },
    { article_id: 'art_3', member_id: 'member_director' }
  ]
};

// Multilingual translations map for DB-driven text fields.
// In a real Supabase production app, we would translate columns or use metadata JSON.
// For the showcase, we translate strings dynamically in the dbService layer based on active lang!
const LOCALIZED_DICTS = {
  ar: {
    // Lab
    '00000000-0000-0000-0000-000000000001_name': 'مخبر تطوير الطاقات المتجددة وتطبيقاتها في المناطق الصحراوية',
    '00000000-0000-0000-0000-000000000001_description': 'تأسس مخبر LDREAS بجامعة بشار ليكون صرحاً علمياً لبحث وتقييم إمكانيات الطاقات المتجددة وتطبيقاتها في البيئة الصحراوية بالجزائر، والعمل على ملاءمة التكنولوجيا مع الظروف المناخية القاسية.',
    '00000000-0000-0000-0000-000000000001_director': 'أ.د. عبد القادر نوري',
    '00000000-0000-0000-0000-000000000001_address': 'كلية العلوم الدقيقة، جامعة طاهري محمد، ص.ب 417، بشار، الجزائر',
    // Teams
    'team_solar_concentrated_name': 'الأنظمة الحرارية والطاقة الشمسية المركزة',
    'team_solar_concentrated_description': 'فرقة بحثية متخصصة في الديناميكا الحرارية التطبيقية، اللواقط الشمسية المركزة (CSP)، ومواد تخزين الطاقة الحرارية وتحلية المياه.',
    'team_photovoltaic_storage_name': 'الأنظمة الكهرومائية وأنظمة التخزين',
    'team_photovoltaic_storage_description': 'أبحاث حول فيزياء الخلايا الشمسية، الشبكات الذكية المصغرة، وأنظمة الحماية من الغبار والرمال في البيئات الجافة.',
    'team_wind_dynamics_name': 'طاقة الرياح وتطبيقاتها الصحراوية',
    'team_wind_dynamics_description': 'تقييم ودراسة الإمكانات الهوائية في الهضاب الصحراوية وتطوير توربينات ريحية ملائمة لسرعات الرياح والعواصف الترابية.',
    // Members
    'member_director_bio': 'مدير المخبر. يمتلك خبرة تفوق 20 عاماً في نمذجة وتطوير اللواقط الشمسية الحرارية والتحليل الهيدروديناميكي للموائع تحت درجات حرارة مرتفعة.',
    'member_leader_1_bio': 'رئيس فرقة الأنظمة الحرارية. يركز في أبحاثه على مقاومة المواد المستخدمة في اللواقط المركزة للزوابع الرملية وتأثيرها على انعكاس المرايا.',
    'member_leader_2_bio': 'رئيسة فرقة الألواح الكهروضوئية. متخصصة في تطوير طبقات رقيقة طاردة للأتربة والرمال لرفع كفاءة الألواح الشمسية.',
    'member_leader_3_bio': 'رئيس فرقة طاقة الرياح. يقوم بدراسة توزيع سرعات الرياح في الجنوب الغربي الجزائري وتصميم عنفات تلائم الرياح المنخفضة.',
    'member_researcher_1_bio': 'عضو باحث بفرقة الأنظمة الحرارية، مهتمة بدراسة الأملاح الذائبة والمواد ذات الطور المتغير لتخزين الحرارة ليلاً.',
    'member_researcher_2_bio': 'عضو باحث بفرقة الألواح الكهروضوئية. أبحاثه تتركز على أنظمة التحكم الذكي للشبكات المعزولة التي تدمج الطاقة الشمسية والرياح والبطاريات.',
    // Projects
    'project_1_name': 'نموذج لاقط شمس مركّز صحراوي مقاوم للرمال',
    'project_1_description': 'تصميم نموذج أولي للاقط شمس حراري مركّز يستعمل السوائل الحرارية ومغلف بطبقات خاصة تحميه من حت الرمال الطائرة.',
    'project_2_name': 'تقييم طلاءات النانو الطاردة للغبار للألواح الشمسية بشار',
    'project_2_description': 'اختبار كفاءة عدة أنواع من طلاءات النانو المضادة للكهرباء الساكنة لتقليل تراكم الغبار على الألواح وتجنب خسائر الكفاءة.',
    'project_3_name': 'عنفات رياح ذات سرعة بدء منخفضة للمناطق الصحراوية',
    'project_3_description': 'تصميم شفرات ريحية ديناميكية تبدأ في الدوران عند سرعة رياح تبلغ 1.5 م/ث، ومزودة بأنظمة حماية مغلقة ضد تسرب الرمال.',
    // News
    'news_1_title': 'مخبر LDREAS يدشن المحطة التجريبية للطاقة الشمسية الصحراوية',
    'news_1_description': 'أشرف السيد رئيس جامعة بشار على التدشين الرسمي للمحطة التجريبية لمتابعة الإشعاع الشمسي والظروف البيئية بمقر الكلية.',
    'news_1_content': 'ستمكن هذه المحطة التجريبية من جمع بيانات عالية الدقة حول الإشعاع الشمسي الكلي والمشتت وحالة الطقس كسرعة الرياح ودرجة الرطوبة والحرارة، وذلك لمقارنة واختبار نماذج الألواح الكهروضوئية والحرارية تحت درجات الحرارة المرتفعة بالساورة.',
    'news_2_title': 'الندوة الدولية الرابعة حول الطاقات المتجددة في الصحراء',
    'news_2_description': 'ينظم مخبر LDREAS الندوة الدولية الرابعة حول الانتقال الطاقوي في المناطق الصحراوية أكتوبر المقبل بمشاركة دولية.',
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
    '00000000-0000-0000-0000-000000000001_name': 'Laboratoire de Développement des Energies Renouvelables et leurs Applications dans les Zones Sahariennes',
    '00000000-0000-0000-0000-000000000001_description': 'Le laboratoire LDREAS de l\'Université de Béchar est dédié au développement de systèmes efficaces de conversion et de stockage des énergies renouvelables adaptés aux conditions climatiques sahariennes.',
    '00000000-0000-0000-0000-000000000001_director': 'Prof. Abdelkader NOURI',
    '00000000-0000-0000-0000-000000000001_address': 'Faculté des Sciences Exactes, Université TAHRI Mohammed, BP 417, Béchar, Algérie',
    // Teams
    'team_solar_concentrated_name': 'Systèmes Thermiques et Solaire Concentré',
    'team_solar_concentrated_description': 'Équipe de recherche axée sur la thermodynamique appliquée, le solaire thermique à concentration (CSP), le dessalement solaire et le stockage thermique.',
    'team_photovoltaic_storage_name': 'Systèmes Photovoltaïques et Systèmes de Stockage',
    'team_photovoltaic_storage_description': 'Recherches sur la physique des cellules PV, les micro-réseaux intelligents et la dégradation sous l\'action des poussières sahariennes.',
    'team_wind_dynamics_name': 'Énergie Éolienne et Applications Sahariennes',
    'team_wind_dynamics_description': 'Évaluation du gisement éolien saharien et modélisation de turbines adaptées aux vents faibles et fortes rafales sableuses.',
    // Members
    'member_director_bio': 'Directeur du labo. Plus de 20 ans d\'expérience dans la modélisation des capteurs solaires thermiques et l\'analyse hydrodynamique en climat aride.',
    'member_leader_1_bio': 'Chef de l\'équipe Systèmes Thermiques. Ses travaux portent sur la durabilité des miroirs de concentrateurs solaires face aux tempêtes de sable.',
    'member_leader_2_bio': 'Chef de l\'équipe Photovoltaïque. Spécialisée dans les revêtements hydrophobes et antistatiques empêchant la fixation des poussières.',
    'member_leader_3_bio': 'Chef de l\'équipe Éolienne. Modélisation et évaluation du potentiel éolien à basse altitude dans le sud-ouest de l\'Algérie.',
    'member_researcher_1_bio': 'Chercheuse au sein de l\'équipe thermique, elle étudie les sels fondus et les matériaux à changement de phase pour le stockage nocturne.',
    'member_researcher_2_bio': 'Chercheur en micro-réseaux. Spécialiste du contrôle intelligent pour les systèmes hybrides solaires-éoliens hors réseau.',
    // Projects
    'project_1_name': 'Prototype de Récepteur CSP Désertique et Résistant',
    'project_1_description': 'Conception d\'un récepteur CSP expérimental doté d\'une enveloppe en verre résistant à l\'abrasion du sable.',
    'project_2_name': 'Évaluation de Revêtements Nano Anti-Poussière sur Panneaux PV',
    'project_2_description': 'Mise en place de tests comparatifs de revêtements hydrophobes sur des modules PV exposés au climat aride de Béchar.',
    'project_3_name': 'Éoliennes à Basse Vitesse de Démarrage pour Zones Semi-Désertiques',
    'project_3_description': 'Conception aérodynamique de pales optimisées pour démarrer par vents légers (1.5 m/s) tout en protégeant le rotor des poussières.',
    // News
    'news_1_title': 'Le LDREAS Inaugure la Plateforme Solaire Saharienne de Béchar',
    'news_1_description': 'Le Recteur de l\'Université a inauguré la nouvelle station de mesure solaire haute fidélité.',
    'news_1_content': 'Cette station collectera des données de haute résolution sur le rayonnement solaire (direct, diffus, global) et les variables environnementales afin d\'optimiser la durabilité des installations photovoltaïques.',
    'news_2_title': '4ème Atelier International sur les Énergies Renouvelables en Zones Sahariennes',
    'news_2_description': 'Le LDREAS organise la 4e édition de son atelier international sur le stockage et le dessalement solaire.',
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
  const data = localStorage.getItem('ldreas_showcase_db');
  if (!data) {
    localStorage.setItem('ldreas_showcase_db', JSON.stringify(SEED_DATA));
    return SEED_DATA;
  }
  return JSON.parse(data);
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
    
    return unique.map(a => ({
      ...a,
      name: translateObj(a, a.id, 'name', lang),
      description: translateObj(a, a.id, 'description', lang)
    }));
  }
};
