export type MiniGameType =
  | 'MULTI_CHOICE'
  | 'DRAG_DROP'
  | 'STIRRING'
  | 'TIMING_TAP'
  | 'SEQUENCING';

export interface IngredientChoice {
  id: string;
  name: string;
  amount: string;
  isCorrect: boolean;
  iconType: 'flour' | 'coconut' | 'sugar' | 'egg' | 'spice' | 'liquid' | 'leaf' | 'butter' | 'fruit' | 'meat';
}

export interface DragItem {
  id: string;
  label: string;
  sublabel: string;
  isRequired: boolean;
  color: string;
  iconType: 'flour' | 'coconut' | 'sugar' | 'egg' | 'spice' | 'liquid' | 'leaf' | 'butter' | 'fruit' | 'meat';
}

export interface SequenceStepItem {
  id: string;
  text: string;
  correctOrder: number; // 1-indexed
}

export interface CookingStage {
  id: string;
  title: string;
  type: MiniGameType;
  instruction: string;
  chefTip: string;
  vesselType: 'bowl' | 'pan' | 'steamer' | 'oven' | 'pot' | 'leaf_wrap' | 'cup';
  // For MULTI_CHOICE (Ketepatan Bahan - part of 60 pts)
  choices?: IngredientChoice[];
  requiredSelectCount?: number;
  // For DRAG_DROP (Ketepatan Bahan - part of 60 pts)
  dragItems?: DragItem[];
  targetContainerLabel?: string;
  // For STIRRING (Presisi Mini-Game - part of 25 pts)
  targetRotations?: number;
  idealSpeedLabel?: string;
  batterColorStart?: string;
  batterColorEnd?: string;
  // For TIMING_TAP (Presisi Mini-Game - part of 25 pts)
  timingActionLabel?: string;
  greenZoneStart?: number; // 0-100
  greenZoneEnd?: number;   // 0-100
  cursorSpeed?: number;    // speed multiplier
  cookingVisualType?: 'roti_jala' | 'steamer_timpan' | 'griddle_rangi' | 'griddle_bandros' | 'oven_baytat' | 'pot_jongkong';
  // For SEQUENCING (Ketepatan Urutan - part of 60 pts)
  sequenceItems?: SequenceStepItem[];
}

export interface CakeRecipe {
  id: string;
  name: string;
  region: string;
  yieldText: string;
  difficulty: 'Mudah' | 'Sedang' | 'Mahir';
  timeLimitSeconds: number;
  shortDesc: string;
  accentColor: string;
  bgTint: string;
  ingredientGroups: {
    groupTitle: string;
    items: string[];
  }[];
  procedureSummary: string[];
  successIndicator: string;
  practicalTip: string;
  referenceDocImage: string;
  stages: CookingStage[];
}

export const CAKES_DATA: CakeRecipe[] = [
  {
    id: 'roti-jala',
    name: 'Roti Jala & Kuah Kari Ayam',
    region: 'Aceh & Sumatera Utara',
    yieldText: '±12–15 lembar roti jala & 1 mangkuk kari',
    difficulty: 'Sedang',
    timeLimitSeconds: 150,
    shortDesc: 'Roti tipis berbentuk jaring lentur berwarna kuning kunyit yang disajikan hangat bersama kuah kari ayam kaya rempah Nusantara.',
    accentColor: '#D97706',
    bgTint: '#FEF3C7',
    referenceDocImage: '/assets/aistudio/WhatsApp_Image_2026-11-19_at_23.20.34__2__fb328f54.jpeg',
    ingredientGroups: [
      {
        groupTitle: 'Bahan Roti Jala (Bahan 1 & 2)',
        items: [
          '250 gr tepung terigu protein sedang',
          '2 sdt tepung tapioka',
          '3/4 sdt garam & 1/2 sdt kunyit bubuk',
          '400 ml santan (65 ml santan instan + air)',
          '1 butir telur & 1 sdm minyak goreng'
        ]
      },
      {
        groupTitle: 'Bahan Kuah Kari Ayam',
        items: [
          'Daging ayam potong & 750 ml santan encer',
          'Bumbu halus: 6 bawang merah, 4 cabai merah, 4 kemiri, 3 cm jahe, 2 cm lengkuas, 3-4 cm kunyit',
          'Rempah halus: 1 sdm ketumbar, 1 sdt merica, 1/4 sdt jintan, 1/2 sdt adas, 1,5 sdt garam',
          'Rempah aromatik: 2 cm kayu manis, 1/4 bunga lawang, 3 kapulaga, 1 serai, daun salam, daun kunyit, daun jeruk'
        ]
      }
    ],
    procedureSummary: [
      'Campurkan Bahan 1 (terigu, tapioka, garam, kunyit bubuk) dan aduk rata.',
      'Masukkan Bahan 2 berurutan: telur, 1/4 bagian santan, dan minyak. Tambahkan sisa santan sedikit demi sedikit sambil diaduk dari tengah lalu saring.',
      'Masukkan adonan ke botol saus berujung satu atau cetakan roti jala, cetak membentuk jaring di pan anti lengket.',
      'Setelah mengering, angkat, lipat, dan gulung rapi.',
      'Tumis bumbu halus & rempah aromatik kari hingga harum, masukkan ayam dan santan bertahap hingga matang mengental.'
    ],
    successIndicator: 'Roti membentuk jaring halus, lentur, tidak gosong atau mudah patah; kari gurih, bumbu matang, ayam matang menyeluruh.',
    practicalTip: 'Saring adonan agar corong tidak tersumbat. Jangan membuat jaring terlalu tebal. Setelah santan masuk, hindari didihan keras agar kuah tidak pecah.',
    stages: [
      {
        id: 'rj-1',
        title: 'Tahap 1: Pilih Takaran Bahan Kering Roti Jala',
        type: 'MULTI_CHOICE',
        instruction: 'Pilih 4 bahan kering (Bahan 1) yang tepat sesuai resep Roti Jala!',
        chefTip: 'Ingat! Roti Jala menggunakan tepung terigu protein sedang, sedikit tapioka untuk kelenturan, garam, dan kunyit bubuk.',
        vesselType: 'bowl',
        requiredSelectCount: 4,
        choices: [
          { id: 'c1', name: 'Tepung Terigu Protein Sedang', amount: '250 gr', isCorrect: true, iconType: 'flour' },
          { id: 'c2', name: 'Tepung Tapioka', amount: '2 sdt', isCorrect: true, iconType: 'flour' },
          { id: 'c3', name: 'Kunyit Bubuk', amount: '1/2 sdt', isCorrect: true, iconType: 'spice' },
          { id: 'c4', name: 'Garam Halus', amount: '3/4 sdt', isCorrect: true, iconType: 'spice' },
          { id: 'c5', name: 'Baking Soda', amount: '2 sdt', isCorrect: false, iconType: 'spice' },
          { id: 'c6', name: 'Kelapa Parut Muda', amount: '300 gr', isCorrect: false, iconType: 'coconut' }
        ]
      },
      {
        id: 'rj-2',
        title: 'Tahap 2: Masukkan Bahan Cair & Rempah Kari',
        type: 'DRAG_DROP',
        instruction: 'Seret (Drag & Drop) atau ketuk bahan cair Roti Jala & rempah utama Kari ke dalam wadah!',
        chefTip: 'Campurkan telur, santan 400 ml, minyak, serta rempah kari seperti bunga lawang, kapulaga, dan serai.',
        vesselType: 'bowl',
        targetContainerLabel: 'Mangkuk Adonan & Rempah',
        dragItems: [
          { id: 'd1', label: 'Telur Ayam', sublabel: '1 butir', isRequired: true, color: '#F59E0B', iconType: 'egg' },
          { id: 'd2', label: 'Santan Cair', sublabel: '400 ml', isRequired: true, color: '#FEFCE8', iconType: 'liquid' },
          { id: 'd3', label: 'Minyak Sayur', sublabel: '1 sdm', isRequired: true, color: '#FDE047', iconType: 'liquid' },
          { id: 'd4', label: 'Kapulaga, Serai & Kayu Manis', sublabel: 'Rempah Kari', isRequired: true, color: '#B45309', iconType: 'spice' },
          { id: 'd5', label: 'Selai Nanas', sublabel: '400 gr (Bukan bahan)', isRequired: false, color: '#EAB308', iconType: 'fruit' }
        ]
      },
      {
        id: 'rj-3',
        title: 'Tahap 3: Aduk Adonan Roti Jala dari Tengah',
        type: 'STIRRING',
        instruction: 'Putar pengocok (whisk) secara melingkar dengan kecepatan stabil agar santan menyatu dan tidak bergerindil!',
        chefTip: 'Tambahkan santan sedikit demi sedikit sambil terus diaduk dari bagian tengah lalu saring adonan.',
        vesselType: 'bowl',
        targetRotations: 10,
        idealSpeedLabel: 'Sedang & Stabil',
        batterColorStart: '#FEF9C3',
        batterColorEnd: '#FACC15'
      },
      {
        id: 'rj-4',
        title: 'Tahap 4: Cetak Jaring di Pan Anti Lengket',
        type: 'TIMING_TAP',
        instruction: 'Tekan tombol "ANGKAT & GULUNG" tepat saat indikator berada di Zona Hijau agar jaring matang lentur & tidak gosong!',
        chefTip: 'Roti jala cukup dimasak hingga permukaan mengering (tidak perlu dibalik terlalu lama agar tetap lentur saat digulung).',
        vesselType: 'pan',
        timingActionLabel: 'ANGKAT & LIPAT ROTI JALA!',
        greenZoneStart: 58,
        greenZoneEnd: 80,
        cursorSpeed: 1.35,
        cookingVisualType: 'roti_jala'
      },
      {
        id: 'rj-5',
        title: 'Tahap 5: Urutkan Prosedur Memasak Kuah Kari Ayam',
        type: 'SEQUENCING',
        instruction: 'Susun urutan langkah memasak Kuah Kari Ayam yang benar dari awal hingga disajikan!',
        chefTip: 'Tumis bumbu halus dulu, baru masukkan rempah daun, ayam, santan pertama, lalu sisa santan dengan api kecil.',
        vesselType: 'pot',
        sequenceItems: [
          { id: 's1', text: 'Tumis bumbu halus hingga harum dan matang, lalu masukkan rempah daun & kayu manis.', correctOrder: 1 },
          { id: 's2', text: 'Masukkan potongan ayam, masak dan aduk-aduk hingga berubah warna.', correctOrder: 2 },
          { id: 's3', text: 'Tuang 250 ml santan, garam, dan 1 sdt gula. Masak hingga air menyusut dan berminyak.', correctOrder: 3 },
          { id: 's4', text: 'Masukkan sisa santan, kecilkan api, masak hingga sedikit mengental lalu hidangkan bersama Roti Jala.', correctOrder: 4 }
        ]
      }
    ]
  },
  {
    id: 'timpan-aceh',
    name: 'Timpan Aceh Isi Srikaya',
    region: 'Aceh & Sumatera Utara',
    yieldText: '±15–18 bungkus daun pisang',
    difficulty: 'Mahir',
    timeLimitSeconds: 160,
    shortDesc: 'Kue basah tradisional kebanggaan Aceh berbahan puree labu kuning dan tepung ketan dengan isian selai srikaya pandan beraroma jintan.',
    accentColor: '#15803D',
    bgTint: '#DCFCE7',
    referenceDocImage: '/assets/aistudio/WhatsApp_Image_2026-11-19_at_23.20.33__3__da33c32d.jpeg',
    ingredientGroups: [
      {
        groupTitle: 'Bahan Kulit Timpan (Bahan A & B)',
        items: [
          '300 gr Labu Kuning & 60 gr Gula pasir',
          '300 ml Santan',
          '300 gr Tepung Ketan putih'
        ]
      },
      {
        groupTitle: 'Bahan Isian Srikaya & Daun Olesan',
        items: [
          '250 ml (1 cup) Telur & 250 gr (3/4 cup) Gula',
          '5 helai Daun Pandan (dijadikan jus) & Vanili cair',
          '190 ml Santan Kental, 1 sdm Tepung Beras, 1/2 sdt Garam',
          'Sejumput Jintan halus (khas Srikaya Aceh)',
          'Daun pisang muda & Minyak Olesan (500 ml minyak goreng + 3 sdm mentega dipanaskan)'
        ]
      }
    ],
    procedureSummary: [
      'Masak Bahan A (labu kuning, gula, santan) hingga labu lunak. Dinginkan hangat kuku lalu blender jadi puree halus.',
      'Campurkan puree labu dengan Tepung Ketan bertahap, uleni hingga kalis dan lembut.',
      'Mixer telur dan gula hingga mengembang, masukkan santan kental, garam, jus pandan, tepung beras, vanili, dan sejumput jintan. Masak perlahan hingga kental.',
      'Olesi daun pisang muda dengan campuran minyak goreng + mentega cair. Pipihkan adonan kulit dengan piring makan, beri isian srikaya, gulung lonjong seperti lontong.',
      'Bungkus dan kukus selama 30 menit. Setelah dingin, rapikan lipatan daun dan bersihkan minyak berlebih.'
    ],
    successIndicator: 'Bentuk memanjang dan rapi; kulit lembut, tidak pecah; isian kental dan tidak berair; aroma pandan, tekstur lembut dan kenyal, tampilan mengkilap tapi tidak terlalu berminyak.',
    practicalTip: 'Tepung ketan dimasukkan bertahap karena kadar air puree labu berbeda. Jangan membuat isian terlalu cair dan jangan menumpuk timpan panas dalam wadah tertutup.',
    stages: [
      {
        id: 'ta-1',
        title: 'Tahap 1: Seleksi Bahan Kulit & Isian Srikaya Aceh',
        type: 'MULTI_CHOICE',
        instruction: 'Pilih 4 bahan autentik untuk membuat Kulit Timpan Labu dan Isian Srikaya Aceh!',
        chefTip: 'Ciri khas Timpan Aceh adalah kulit dari labu kuning + tepung ketan, serta isian srikaya pandan dengan sejumput jintan.',
        vesselType: 'bowl',
        requiredSelectCount: 4,
        choices: [
          { id: 'c1', name: 'Labu Kuning (Puree)', amount: '300 gr', isCorrect: true, iconType: 'fruit' },
          { id: 'c2', name: 'Tepung Ketan', amount: '300 gr', isCorrect: true, iconType: 'flour' },
          { id: 'c3', name: 'Telur & Jus Daun Pandan', amount: '250 ml + 5 helai', isCorrect: true, iconType: 'egg' },
          { id: 'c4', name: 'Sejumput Jintan & Santan Kental', amount: '190 ml', isCorrect: true, iconType: 'spice' },
          { id: 'c5', name: 'Keju Cheddar Parut', amount: '150 gr', isCorrect: false, iconType: 'butter' },
          { id: 'c6', name: 'Tepung Sagu Tani', amount: '250 gr', isCorrect: false, iconType: 'flour' }
        ]
      },
      {
        id: 'ta-2',
        title: 'Tahap 2: Racik Adonan Srikaya & Minyak Olesan',
        type: 'DRAG_DROP',
        instruction: 'Masukkan bahan-bahan Isian Srikaya ke dalam panci masak untuk dikentalkan!',
        chefTip: 'Srikaya dimasak perlahan dari campuran telur, gula, santan kental, jus pandan, tepung beras, dan sejumput jintan.',
        vesselType: 'pot',
        targetContainerLabel: 'Panci Selai Srikaya',
        dragItems: [
          { id: 'd1', label: 'Telur & Gula Pasir', sublabel: '250 ml + 250 gr', isRequired: true, color: '#FBBF24', iconType: 'egg' },
          { id: 'd2', label: 'Endapan Jus Pandan', sublabel: '5 helai daun', isRequired: true, color: '#22C55E', iconType: 'leaf' },
          { id: 'd3', label: 'Santan Kental & Tepung Beras', sublabel: '190 ml + 1 sdm', isRequired: true, color: '#FEFCE8', iconType: 'liquid' },
          { id: 'd4', label: 'Bubuk Jintan Halus', sublabel: 'Sejumput', isRequired: true, color: '#92400E', iconType: 'spice' },
          { id: 'd5', label: 'Cabai Merah Halus', sublabel: '4 buah (Bukan bahan)', isRequired: false, color: '#DC2626', iconType: 'spice' }
        ]
      },
      {
        id: 'ta-3',
        title: 'Tahap 3: Uleni Puree Labu & Tepung Ketan',
        type: 'STIRRING',
        instruction: 'Aduk dan uleni campuran puree labu kuning hangat kuku dengan tepung ketan hingga kalis dan lembut!',
        chefTip: 'Masukkan tepung ketan secara bertahap sambil terus diaduk memutar hingga tekstur adonan kalis.',
        vesselType: 'bowl',
        targetRotations: 11,
        idealSpeedLabel: 'Mantap & Merata',
        batterColorStart: '#FDE047',
        batterColorEnd: '#F59E0B'
      },
      {
        id: 'ta-4',
        title: 'Tahap 4: Pembungkusan Daun Pisang & Pengukusan',
        type: 'SEQUENCING',
        instruction: 'Urutkan langkah membentuk dan membungkus Timpan Aceh menggunakan daun pisang muda!',
        chefTip: 'Daun pisang wajib diolesi campuran minyak + mentega agar kulit timpan mengkilap dan tidak lengket.',
        vesselType: 'leaf_wrap',
        sequenceItems: [
          { id: 's1', text: 'Potong daun pisang muda persegi panjang lalu olesi permukaannya dengan minyak olesan (minyak + mentega).', correctOrder: 1 },
          { id: 's2', text: 'Letakkan bulatan adonan kulit di tengah daun, pipihkan rata dengan piring makan lalu beri isian srikaya.', correctOrder: 2 },
          { id: 's3', text: 'Tutup adonan kulit dengan menggulung sisi daun ke depan, kunci sisi kiri-kanan membentuk lonjong seperti lontong.', correctOrder: 3 },
          { id: 's4', text: 'Kukus selama 30 menit hingga matang, dinginkan, rapikan lipatan daun, dan lap minyak berlebih dengan tisu.', correctOrder: 4 }
        ]
      },
      {
        id: 'ta-5',
        title: 'Tahap 5: Kukus Timpan Selama 30 Menit Tepat',
        type: 'TIMING_TAP',
        instruction: 'Koreksi waktu pengukusan! Tekan "ANGKAT DARI KUKUSAN" tepat di Zona Hijau agar kulit kenyal & tidak pecah!',
        chefTip: 'Mengukus terlalu lama membuat bungkus mengkerut ekstrem dan kulit pecah; kurang waktu membuat ketan mentah.',
        vesselType: 'steamer',
        timingActionLabel: 'ANGKAT TIMPAN DARI KUKUSAN!',
        greenZoneStart: 62,
        greenZoneEnd: 82,
        cursorSpeed: 1.4,
        cookingVisualType: 'steamer_timpan'
      }
    ]
  },
  {
    id: 'kue-rangi',
    name: 'Kue Rangi Saus Gula Merah',
    region: 'Jawa Barat & DKI Jakarta',
    yieldText: '±15–20 kue kecil',
    difficulty: 'Mudah',
    timeLimitSeconds: 135,
    shortDesc: 'Kue tradisional khas Betawi berbahan kelapa parut agak muda dan tepung sagu/tapioka yang dipanggang di cetakan khusus, disiram saus gula merah kental.',
    accentColor: '#92400E',
    bgTint: '#FEF3C7',
    referenceDocImage: '/assets/aistudio/WhatsApp_Image_2026-11-19_at_23.20.32_a609b029.jpeg',
    ingredientGroups: [
      {
        groupTitle: 'Bahan Adonan Rangi',
        items: [
          'Tepung sagu / tapioka 150 g',
          'Kelapa parut agak muda 300 g',
          'Gula pasir 70 gr',
          'Garam 1/2 sdt & Vanili bubuk 1/4 sdt'
        ]
      },
      {
        groupTitle: 'Bahan Saus Gula Merah',
        items: [
          'Gula merah 100 g & Air 150 ml',
          'Daun pandan 1 lembar',
          'Maizena 1 sdt (dilarutkan dalam 1 sdm air)'
        ]
      }
    ],
    procedureSummary: [
      'Siapkan kelapa parut agak muda di dalam wadah.',
      'Campurkan garam, gula pasir, dan vanili bubuk ke dalam wadah kelapa, aduk hingga tercampur rata.',
      'Tambahkan tepung sagu/tapioka, aduk kembali hingga merata dan adonan berbulir lembap (tidak berbutir kasar).',
      'Panaskan cetakan rangi dan oles tipis minyak. Masukkan adonan, tekan ringan, tutup dan panggang hingga bawah kecokelatan.',
      'Rebus gula merah, air, dan daun pandan hingga larut. Kentalkan dengan larutan maizena hingga mengilap lalu oleskan di atas kue rangi hangat.'
    ],
    successIndicator: 'Kue beraroma kelapa, bagian luar sedikit garing, bagian dalam matang; saus halus, mengilap, dan tidak menggumpal.',
    practicalTip: 'Jangan membasahi adonan berlebihan. Cetakan harus panas sebelum diisi. Kue rangi berbeda dari bandros: rangi berbasis sagu/tapioka tanpa santan cair.',
    stages: [
      {
        id: 'kr-1',
        title: 'Tahap 1: Pilih Bahan Utama Adonan Kue Rangi',
        type: 'MULTI_CHOICE',
        instruction: 'Pilih 4 bahan adonan Kue Rangi yang akurat (hati-hati jangan tertukar dengan Bandros)!',
        chefTip: 'Ingat! Kue Rangi menggunakan tepung sagu/tapioka 150 g dan kelapa parut 300 g tanpa tambahan santan cair.',
        vesselType: 'bowl',
        requiredSelectCount: 4,
        choices: [
          { id: 'c1', name: 'Tepung Sagu / Tapioka', amount: '150 g', isCorrect: true, iconType: 'flour' },
          { id: 'c2', name: 'Kelapa Parut Agak Muda', amount: '300 g', isCorrect: true, iconType: 'coconut' },
          { id: 'c3', name: 'Gula Pasir', amount: '70 gr', isCorrect: true, iconType: 'sugar' },
          { id: 'c4', name: 'Garam & Vanili Bubuk', amount: '1/2 sdt & 1/4 sdt', isCorrect: true, iconType: 'spice' },
          { id: 'c5', name: 'Santan Encer', amount: '600 ml', isCorrect: false, iconType: 'liquid' },
          { id: 'c6', name: 'Kuning Telur', amount: '4 butir', isCorrect: false, iconType: 'egg' }
        ]
      },
      {
        id: 'kr-2',
        title: 'Tahap 2: Aduk Kelapa Parut & Tepung Sagu',
        type: 'STIRRING',
        instruction: 'Aduk campuran kelapa parut, gula, garam, vanili, dan tepung sagu secara merata hingga tidak berbutir!',
        chefTip: 'Jangan menambahkan air ke adonan rangi agar teksturnya tetap renyah beraroma kelapa.',
        vesselType: 'bowl',
        targetRotations: 9,
        idealSpeedLabel: 'Ringan & Merata',
        batterColorStart: '#FFFFFF',
        batterColorEnd: '#FDE68A'
      },
      {
        id: 'kr-3',
        title: 'Tahap 3: Panggang Kue Rangi di Cetakan Panas',
        type: 'TIMING_TAP',
        instruction: 'Panggang dalam cetakan tertutup! Tekan "ANGKAT KUE RANGI" tepat di Zona Hijau saat bagian bawah kecokelatan!',
        chefTip: 'Masukkan adonan saat cetakan sudah panas, tekan ringan, lalu tutup hingga bawahnya garing kecokelatan.',
        vesselType: 'pan',
        timingActionLabel: 'ANGKAT KUE RANGI!',
        greenZoneStart: 55,
        greenZoneEnd: 78,
        cursorSpeed: 1.3,
        cookingVisualType: 'griddle_rangi'
      },
      {
        id: 'kr-4',
        title: 'Tahap 4: Masukkan Bahan Saus Gula Merah',
        type: 'DRAG_DROP',
        instruction: 'Seret semua bahan pembuat Saus Gula Merah Kental ke dalam panci rebusan!',
        chefTip: 'Saus gula merah Kue Rangi dikentalkan menggunakan larutan 1 sdt maizena dalam 1 sdm air.',
        vesselType: 'pot',
        targetContainerLabel: 'Panci Saus Gula Merah',
        dragItems: [
          { id: 'd1', label: 'Gula Merah Sisir', sublabel: '100 g', isRequired: true, color: '#78350F', iconType: 'sugar' },
          { id: 'd2', label: 'Air Bersih', sublabel: '150 ml', isRequired: true, color: '#E0F2FE', iconType: 'liquid' },
          { id: 'd3', label: 'Daun Pandan', sublabel: '1 lembar', isRequired: true, color: '#16A34A', iconType: 'leaf' },
          { id: 'd4', label: 'Larutan Maizena', sublabel: '1 sdt + 1 sdm air', isRequired: true, color: '#FEF9C3', iconType: 'flour' },
          { id: 'd5', label: 'Susu Kental Manis', sublabel: 'Bukan bahan saus rangi', isRequired: false, color: '#FEF08A', iconType: 'liquid' }
        ]
      },
      {
        id: 'kr-5',
        title: 'Tahap 5: Urutkan Prosedur Pembuatan Kue Rangi',
        type: 'SEQUENCING',
        instruction: 'Susun langkah pembuatan Kue Rangi & Saus Gula Merah sesuai modul praktik!',
        chefTip: 'Campur kelapa dengan gula/garam/vanili dulu sebelum tepung tapioka masuk.',
        vesselType: 'pan',
        sequenceItems: [
          { id: 's1', text: 'Siapkan kelapa parut di wadah, campurkan garam, gula pasir, dan vanili bubuk hingga rata.', correctOrder: 1 },
          { id: 's2', text: 'Tambahkan tepung sagu/tapioka, aduk kembali hingga merata dan adonan tidak berbutir.', correctOrder: 2 },
          { id: 's3', text: 'Panaskan cetakan beroles tipis minyak, masukkan adonan, tekan ringan, tutup dan panggang hingga kecokelatan.', correctOrder: 3 },
          { id: 's4', text: 'Rebus gula merah, air, dan pandan, kentalkan dengan larutan maizena hingga mengilap lalu sajikan di atas kue hangat.', correctOrder: 4 }
        ]
      }
    ]
  },
  {
    id: 'bandros-keju',
    name: 'Bandros Topping Keju',
    region: 'Jawa Barat (Priangan)',
    yieldText: '±12–16 buah kecil',
    difficulty: 'Mudah',
    timeLimitSeconds: 140,
    shortDesc: 'Kue tradisional khas Sunda berbahan tepung beras, kelapa parut muda, dan santan encer yang dimasak dalam cetakan cekung beroles margarin dengan taburan keju.',
    accentColor: '#D97706',
    bgTint: '#FEF9C3',
    referenceDocImage: '/assets/aistudio/WhatsApp_Image_2026-11-19_at_23.20.33_76f1e2a0.jpeg',
    ingredientGroups: [
      {
        groupTitle: 'Bahan Adonan Bandros',
        items: [
          '200 gr tepung beras & 2 sdm tepung terigu',
          '1 sdt garam',
          '300 gr kelapa parut (muda)',
          '600 ml santan encer',
          'Margarin secukupnya untuk olesan cetakan'
        ]
      },
      {
        groupTitle: 'Bahan Topping',
        items: [
          'Keju parut 150 gr',
          'Susu kental manis secukupnya'
        ]
      }
    ],
    procedureSummary: [
      'Campurkan bahan kering (200 gr tepung beras, 2 sdm tepung terigu, 1 sdt garam) ke dalam satu wadah, aduk rata.',
      'Masukkan 300 gr kelapa parut muda ke bahan kering, aduk hingga tercampur.',
      'Tambahkan 600 ml santan encer sedikit demi sedikit sambil terus diaduk.',
      'Panaskan cetakan bandros, olesi dengan margarin, lalu tuang adonan hingga hampir penuh.',
      'Tutup cetakan dan masak dengan api kecil. Saat setengah matang, taburkan topping keju parut, tutup kembali hingga matang kecokelatan.'
    ],
    successIndicator: 'Permukaan bawah kecokelatan, bagian dalam lembut dan gurih, tidak mentah di tengah; topping menyatu dan tidak berair.',
    practicalTip: 'Masak dengan api kecil agar bagian dalam matang sempurna sebelum bagian luar terlalu gelap. Bandros berbasis tepung beras & santan cair (berbeda dengan kue rangi).',
    stages: [
      {
        id: 'bk-1',
        title: 'Tahap 1: Pilih Komposisi Bahan Bandros Priangan',
        type: 'MULTI_CHOICE',
        instruction: 'Pilih 4 bahan utama adonan Bandros sesuai resep modul pengolahan!',
        chefTip: 'Bandros menggunakan kombinasi 200 gr tepung beras, 2 sdm tepung terigu, kelapa parut muda, dan 600 ml santan encer.',
        vesselType: 'bowl',
        requiredSelectCount: 4,
        choices: [
          { id: 'c1', name: 'Tepung Beras & Tepung Terigu', amount: '200 gr + 2 sdm', isCorrect: true, iconType: 'flour' },
          { id: 'c2', name: 'Kelapa Parut Muda', amount: '300 gr', isCorrect: true, iconType: 'coconut' },
          { id: 'c3', name: 'Santan Encer', amount: '600 ml', isCorrect: true, iconType: 'liquid' },
          { id: 'c4', name: 'Garam & Margarin Cetakan', amount: '1 sdt + olesan', isCorrect: true, iconType: 'butter' },
          { id: 'c5', name: 'Pasta Pandan Hijau', amount: '2 sdm', isCorrect: false, iconType: 'leaf' },
          { id: 'c6', name: 'Labu Kuning Kukus', amount: '300 gr', isCorrect: false, iconType: 'fruit' }
        ]
      },
      {
        id: 'bk-2',
        title: 'Tahap 2: Campur Bahan Kering, Kelapa & Santan',
        type: 'DRAG_DROP',
        instruction: 'Masukkan bahan adonan Bandros ke dalam mangkuk adonan untuk dicampur!',
        chefTip: 'Campurkan bahan kering lebih dulu, disusul kelapa parut muda, lalu tuangkan santan encer.',
        vesselType: 'bowl',
        targetContainerLabel: 'Mangkuk Adonan Bandros',
        dragItems: [
          { id: 'd1', label: 'Tepung Beras & Terigu', sublabel: '200 gr + 2 sdm', isRequired: true, color: '#F8FAFC', iconType: 'flour' },
          { id: 'd2', label: 'Garam Halus', sublabel: '1 sdt', isRequired: true, color: '#E2E8F0', iconType: 'spice' },
          { id: 'd3', label: 'Kelapa Parut Muda', sublabel: '300 gr', isRequired: true, color: '#FEF9C3', iconType: 'coconut' },
          { id: 'd4', label: 'Santan Encer', sublabel: '600 ml', isRequired: true, color: '#FFFBEB', iconType: 'liquid' },
          { id: 'd5', label: 'Bumbu Kari Ayam', sublabel: 'Bukan bahan bandros', isRequired: false, color: '#D97706', iconType: 'spice' }
        ]
      },
      {
        id: 'bk-3',
        title: 'Tahap 3: Aduk Adonan Santan & Tepung Beras',
        type: 'STIRRING',
        instruction: 'Aduk adonan Bandros sambil menuang santan encer hingga seluruh kelapa dan tepung menyatu!',
        chefTip: 'Pastikan tidak ada gumpalan tepung beras di dasar wadah sebelum dituang ke cetakan.',
        vesselType: 'bowl',
        targetRotations: 10,
        idealSpeedLabel: 'Stabil & Merata',
        batterColorStart: '#FEFCE8',
        batterColorEnd: '#FEF08A'
      },
      {
        id: 'bk-4',
        title: 'Tahap 4: Panggang Api Kecil & Beri Topping Keju',
        type: 'TIMING_TAP',
        instruction: 'Masak dengan api kecil! Tekan "TABUR KEJU & ANGKAT" tepat di Zona Hijau agar bagian tengah lembut & luarnya renyah!',
        chefTip: 'Saat setengah matang taburkan keju parut 150 gr, tutup kembali hingga kulit bawah kecokelatan.',
        vesselType: 'pan',
        timingActionLabel: 'TABUR KEJU & ANGKAT BANDROS!',
        greenZoneStart: 60,
        greenZoneEnd: 82,
        cursorSpeed: 1.35,
        cookingVisualType: 'griddle_bandros'
      },
      {
        id: 'bk-5',
        title: 'Tahap 5: Urutkan Langkah Pembuatan Bandros Keju',
        type: 'SEQUENCING',
        instruction: 'Susun urutan prosedur kerja membuat Bandros Topping Keju yang benar!',
        chefTip: 'Perhatikan urutan pencampuran: bahan kering -> kelapa parut -> santan encer -> cetakan beroles margarin.',
        vesselType: 'pan',
        sequenceItems: [
          { id: 's1', text: 'Campurkan bahan kering (tepung beras, terigu, garam) lalu masukkan kelapa parut muda, aduk rata.', correctOrder: 1 },
          { id: 's2', text: 'Tambahkan 600 ml santan encer sambil terus diaduk hingga adonan cair merata.', correctOrder: 2 },
          { id: 's3', text: 'Panaskan cetakan, olesi margarin, tuang adonan hampir penuh dan tutup dengan api kecil.', correctOrder: 3 },
          { id: 's4', text: 'Saat setengah matang tambahkan topping keju parut, tutup kembali hingga matang lalu angkat dengan spatula kecil.', correctOrder: 4 }
        ]
      }
    ]
  },
  {
    id: 'baytat-bengkulu',
    name: 'Baytat Bengkulu',
    region: 'Bengkulu & Sumatera Bagian Selatan',
    yieldText: '1 loyang 20×20 cm (±16 potong)',
    difficulty: 'Mahir',
    timeLimitSeconds: 165,
    shortDesc: 'Kue tart tradisional bangsawan Bengkulu berselimut selai nanas kayu manis dengan hiasan anyaman pita adonan bersantan yang dipanggang keemasan.',
    accentColor: '#B45309',
    bgTint: '#FEF3C7',
    referenceDocImage: '/assets/aistudio/WhatsApp_Image_2026-11-19_at_23.20.33__1__469fbe9a.jpeg',
    ingredientGroups: [
      {
        groupTitle: 'Bahan Dough Baytat',
        items: [
          '1 kg Tepung Terigu & 300 gr Gula Pasir',
          '500 ml Santan Kental (400 ml santan instan + 100 ml air)',
          '250 g Margarin & 4 butir Kuning Telur',
          '2 sdt Baking Soda, 1 sdt Garam, 1 sdt Vanili Bubuk'
        ]
      },
      {
        groupTitle: 'Bahan Selai Nanas & Olesan',
        items: [
          '1 buah nanas matang (400 gr) dihaluskan tanpa air',
          '100 gr gula pasir, 2 cm kayu manis, 2 lembar daun pandan, sedikit garam',
          'Olesan: 1 kuning telur + 1 sdm minyak + 1 tetes perisa pisang'
        ]
      }
    ],
    procedureSummary: [
      'Masak nanas halus tanpa air bersama garam, kayu manis, dan daun pandan hingga air menyusut. Tambahkan gula, masak hingga kuning kecokelatan & kental.',
      'Kocok kuning telur dan gula dengan whisker sampai putih. Masukkan margarin, garam, baking soda, dan vanili, kocok sampai kaku.',
      'Tambahkan santan kental sambil diaduk, lalu masukkan tepung terigu dengan spatula hingga bertekstur kaku lembut seperti kue kering. Diamkan 40–60 menit.',
      'Tekan 2/3 adonan di loyang beralas kertas roti, tusuk-tusuk dengan garpu, ratakan selai nanas, dan tutup dengan hiasan pita/anyaman dari sisa adonan.',
      'Panggang suhu 160°C selama 30 menit, keluarkan dan oles kuning telur, lalu panggang lagi 160°C selama 20–30 menit hingga matang keemasan.'
    ],
    successIndicator: 'Permukaan keemasan, bentuk kokoh, tekstur empuk-remah, selai nanas tersebar rata dan tidak terlalu basah.',
    practicalTip: 'Jika adonan terlalu lembek, dinginkan 15 menit. Jangan menambah tepung berlebihan karena membuat kue keras. Tusuk dasar adonan dengan garpu agar tidak menggelembung.',
    stages: [
      {
        id: 'bb-1',
        title: 'Tahap 1: Pilih Bahan Dough & Selai Nanas Baytat',
        type: 'MULTI_CHOICE',
        instruction: 'Pilih 4 kelompok bahan yang tepat untuk membuat Kue Baytat Bengkulu!',
        chefTip: 'Dough Baytat memakai santan kental, kuning telur, margarin, dan baking soda; olesannya diberi 1 tetes perisa pisang!',
        vesselType: 'bowl',
        requiredSelectCount: 4,
        choices: [
          { id: 'c1', name: 'Tepung Terigu, Gula & Santan Kental', amount: '1 kg + 300 gr + 500 ml', isCorrect: true, iconType: 'flour' },
          { id: 'c2', name: 'Margarin, 4 Kuning Telur & Baking Soda', amount: '250 g + 4 btr + 2 sdt', isCorrect: true, iconType: 'egg' },
          { id: 'c3', name: 'Nanas Halus, Kayu Manis & Pandan', amount: '400 gr + rempah', isCorrect: true, iconType: 'fruit' },
          { id: 'c4', name: 'Olesan Kuning Telur + Perisa Pisang', amount: '1 btr + 1 tetes', isCorrect: true, iconType: 'liquid' },
          { id: 'c5', name: 'Tepung Ketan & Labu Kuning', amount: '300 gr', isCorrect: false, iconType: 'flour' },
          { id: 'c6', name: 'Ayam Potong & Bunga Lawang', amount: '500 gr', isCorrect: false, iconType: 'meat' }
        ]
      },
      {
        id: 'bb-2',
        title: 'Tahap 2: Masak Selai Nanas Rempah Kayu Manis',
        type: 'DRAG_DROP',
        instruction: 'Masukkan bahan-bahan pembuat Selai Nanas Baytat ke dalam panci anti lengket!',
        chefTip: 'Nanas dihaluskan dengan chopper tanpa tambahan air, dimasak bersama kayu manis & pandan hingga menyusut baru diberi gula.',
        vesselType: 'pot',
        targetContainerLabel: 'Panci Selai Nanas',
        dragItems: [
          { id: 'd1', label: 'Nanas Matang Halus', sublabel: '400 gr (Tanpa air)', isRequired: true, color: '#FACC15', iconType: 'fruit' },
          { id: 'd2', label: 'Kayu Manis & Daun Pandan', sublabel: '2 cm + 2 lembar', isRequired: true, color: '#92400E', iconType: 'spice' },
          { id: 'd3', label: 'Gula Pasir & Sedikit Garam', sublabel: '100 gr', isRequired: true, color: '#FEF9C3', iconType: 'sugar' },
          { id: 'd4', label: 'Santan Encer 750 ml', sublabel: 'Bukan untuk selai nanas', isRequired: false, color: '#F8FAFC', iconType: 'liquid' }
        ]
      },
      {
        id: 'bb-3',
        title: 'Tahap 3: Kocok Telur, Gula, Margarin & Baking Soda',
        type: 'STIRRING',
        instruction: 'Putar whisker untuk mengocok kuning telur dan gula hingga putih, lalu satukan margarin, baking soda, santan, dan terigu!',
        chefTip: 'Aduk tepung terigu menggunakan spatula hingga tekstur dough kaku dan lembut seperti adonan kue kering.',
        vesselType: 'bowl',
        targetRotations: 12,
        idealSpeedLabel: 'Cepat & Kaku',
        batterColorStart: '#FEF08A',
        batterColorEnd: '#F59E0B'
      },
      {
        id: 'bb-4',
        title: 'Tahap 4: Urutkan Pembentukan & Pemanggangan Bertahap',
        type: 'SEQUENCING',
        instruction: 'Susun langkah pembentukan adonan Baytat di loyang hingga pemanggangan dua tahap!',
        chefTip: 'Adonan wajib didiamkan 40–60 menit, ditusuk garpu, dan dipanggang 2 tahap dengan olesan kuning telur di tengah.',
        vesselType: 'oven',
        sequenceItems: [
          { id: 's1', text: 'Diamkan adonan dough yang sudah kalis selama 40 menit s.d. 1 jam dalam wadah tertutup.', correctOrder: 1 },
          { id: 's2', text: 'Tekan 2/3 adonan sebagai dasar di loyang beralas kertas roti, lalu tusuk-tusuk permukaannya dengan garpu.', correctOrder: 2 },
          { id: 's3', text: 'Ratakan selai nanas di atasnya, lalu tutup dengan sisa adonan yang dibentuk pita/anyaman keranjang.', correctOrder: 3 },
          { id: 's4', text: 'Panggang 160°C selama 30 menit, keluarkan untuk dioles kuning telur, lalu panggang lagi 20–30 menit hingga keemasan.', correctOrder: 4 }
        ]
      },
      {
        id: 'bb-5',
        title: 'Tahap 5: Panggang Suhu 160°C Hingga Keemasan',
        type: 'TIMING_TAP',
        instruction: 'Pantau suhu oven 160°C! Tekan "KELUARKAN LOYANG BAYTAT" tepat di Zona Hijau saat permukaan kuning keemasan!',
        chefTip: 'Keluarkan loyang tepat waktu agar tekstur Baytat empuk-remah dan selai nanas tidak gosong.',
        vesselType: 'oven',
        timingActionLabel: 'KELUARKAN BAYTAT DARI OVEN!',
        greenZoneStart: 64,
        greenZoneEnd: 83,
        cursorSpeed: 1.45,
        cookingVisualType: 'oven_baytat'
      }
    ]
  },
  {
    id: 'kue-jongkong',
    name: 'Kue Jongkong Lapis Gula Merah',
    region: 'Bangka Belitung & Sumatera',
    yieldText: '±10 cup kecil',
    difficulty: 'Sedang',
    timeLimitSeconds: 150,
    shortDesc: 'Puding bubur sumsum tradisional tiga lapis dalam cup: lapisan hijau pandan yang lembut silky, lapisan putih santan gurih, dan saus gula aren murni.',
    accentColor: '#047857',
    bgTint: '#D1FAE5',
    referenceDocImage: '/assets/aistudio/WhatsApp_Image_2026-11-19_at_23.20.33__2__32d51cd7.jpeg',
    ingredientGroups: [
      {
        groupTitle: 'Saus Gula Merah & Lapisan Hijau Pandan',
        items: [
          'Saus Gula Merah: 250 g gula aren iris, 80 g air, sedikit garam (rebus & saring)',
          'Lapisan Hijau: 75 g tepung beras, 15 g tepung tapioka, 35 g gula, 1/4 sdt vanili',
          'Cairan Hijau: 600 g air, 200 g santan kental, 1 sdt pasta pandan, 1 lembar daun pandan'
        ]
      },
      {
        groupTitle: 'Lapisan Putih Santan Gurih',
        items: [
          '80 g tepung beras & 30 g tepung tapioka',
          '20 g gula, 1 sdt garam, 1/4 sdt vanili bubuk',
          '200 g santan & 550 g air'
        ]
      }
    ],
    procedureSummary: [
      'Masak Lapisan Hijau: campur air, santan kental, gula, vanili, tepung beras, dan tapioka di panci hingga tak bergerindil. Tambahkan pasta & daun pandan, masak api sedang sambil diaduk hingga kental silky dan meletup-letup. Tuang 1/3 cup.',
      'Masak Lapisan Putih: campur air, santan, gula, garam, tepung beras, dan tapioka hingga rata. Masak api sedang sambil terus diaduk hingga mengental. Tuang di atas lapisan hijau.',
      'Masak Saus Gula Merah: rebus irisan gula aren, air, dan sedikit garam hingga mendidih, saring dan dinginkan.',
      'Simpan cup Jongkong di chiller dan sajikan dingin bersama saus gula merah.'
    ],
    successIndicator: 'Lapisan terlihat jelas dan tegas, tekstur lembut silky dan tidak berair, rasa santan gurih seimbang dengan manisnya saus gula merah.',
    practicalTip: 'Saring adonan sebelum dimasak. Jangan menuang lapisan kedua saat lapisan pertama masih terlalu cair agar tidak bercampur.',
    stages: [
      {
        id: 'kj-1',
        title: 'Tahap 1: Pilih Bahan Tiga Lapisan Kue Jongkong',
        type: 'MULTI_CHOICE',
        instruction: 'Pilih 4 bahan utama pembentuk 3 lapisan Kue Jongkong Lapis Gula Merah!',
        chefTip: 'Kue Jongkong memadukan tepung beras + sedikit tapioka agar teksturnya lembut silky, ditambah pasta pandan, santan, dan gula aren.',
        vesselType: 'bowl',
        requiredSelectCount: 4,
        choices: [
          { id: 'c1', name: 'Tepung Beras & Tepung Tapioka', amount: '75g/80g + 15g/30g', isCorrect: true, iconType: 'flour' },
          { id: 'c2', name: 'Santan Kental & Air', amount: '200 g + 600 g', isCorrect: true, iconType: 'liquid' },
          { id: 'c3', name: 'Pasta Pandan & Daun Pandan', amount: '1 sdt + 1 lembar', isCorrect: true, iconType: 'leaf' },
          { id: 'c4', name: 'Gula Aren Iris', amount: '250 g', isCorrect: true, iconType: 'sugar' },
          { id: 'c5', name: 'Kelapa Parut Kasar', amount: '300 g', isCorrect: false, iconType: 'coconut' },
          { id: 'c6', name: 'Selai Nanas Kayu Manis', amount: '400 g', isCorrect: false, iconType: 'fruit' }
        ]
      },
      {
        id: 'kj-2',
        title: 'Tahap 2: Racik Adonan Lapisan Hijau Pandan di Panci',
        type: 'DRAG_DROP',
        instruction: 'Masukkan bahan Lapisan Hijau Pandan ke dalam panci sebelum menyalakan api!',
        chefTip: 'Aduk semua tepung dan cairan dalam keadaan dingin terlebih dahulu supaya tidak bergerindil saat dipanaskan.',
        vesselType: 'pot',
        targetContainerLabel: 'Panci Lapisan Pandan',
        dragItems: [
          { id: 'd1', label: 'Tepung Beras & Tapioka', sublabel: '75 g + 15 g', isRequired: true, color: '#F8FAFC', iconType: 'flour' },
          { id: 'd2', label: 'Santan Kental & Air', sublabel: '200 g + 600 g', isRequired: true, color: '#FEFCE8', iconType: 'liquid' },
          { id: 'd3', label: 'Gula Pasir & Vanili', sublabel: '35 g + 1/4 sdt', isRequired: true, color: '#FEF9C3', iconType: 'sugar' },
          { id: 'd4', label: 'Pasta & Daun Pandan', sublabel: '1 sdt + 1 lembar', isRequired: true, color: '#10B981', iconType: 'leaf' },
          { id: 'd5', label: 'Kunyit Bubuk Kari', sublabel: 'Bukan bahan jongkong', isRequired: false, color: '#D97706', iconType: 'spice' }
        ]
      },
      {
        id: 'kj-3',
        title: 'Tahap 3: Aduk Adonan di Atas Api Sedang Hingga Silky',
        type: 'STIRRING',
        instruction: 'Aduk terus adonan di atas api sedang hingga mengental, bertekstur silky, dan meletup-letup!',
        chefTip: 'Jangan berhenti mengaduk agar bagian dasar panci tidak gosong atau menggumpal.',
        vesselType: 'pot',
        targetRotations: 11,
        idealSpeedLabel: 'Konstan & Halus',
        batterColorStart: '#A7F3D0',
        batterColorEnd: '#10B981'
      },
      {
        id: 'kj-4',
        title: 'Tahap 4: Matikan Api Saat Adonan Meletup & Tuang ke Cup',
        type: 'TIMING_TAP',
        instruction: 'Perhatikan letupan bubur jongkong! Tekan "MATIKAN API & TUANG CUP" tepat di Zona Hijau!',
        chefTip: 'Matikan api segera ketika adonan sudah meletup-letup dan mengental silky, lalu isi 1/3 bagian cup.',
        vesselType: 'cup',
        timingActionLabel: 'MATIKAN API & CETAK KE CUP!',
        greenZoneStart: 58,
        greenZoneEnd: 80,
        cursorSpeed: 1.35,
        cookingVisualType: 'pot_jongkong'
      },
      {
        id: 'kj-5',
        title: 'Tahap 5: Urutkan Penyusunan 3 Lapisan Kue Jongkong',
        type: 'SEQUENCING',
        instruction: 'Susun urutan pembuatan dan pelapisan Kue Jongkong Lapis Gula Merah di dalam cup!',
        chefTip: 'Pastikan lapisan pertama sudah cukup kokoh sebelum menuang lapisan kedua di atasnya.',
        vesselType: 'cup',
        sequenceItems: [
          { id: 's1', text: 'Masak adonan hijau pandan dengan api sedang sambil terus diaduk hingga mengental silky & meletup, cetak 1/3 cup.', correctOrder: 1 },
          { id: 's2', text: 'Masak adonan lapisan putih (tepung beras, tapioka, santan, garam, gula) sambil diaduk hingga mengental.', correctOrder: 2 },
          { id: 's3', text: 'Tuangkan adonan putih perlahan ke atas lapisan hijau yang sudah set, lalu simpan di dalam chiller.', correctOrder: 3 },
          { id: 's4', text: 'Rebus irisan gula aren dengan air dan sedikit garam hingga mendidih, saring, dinginkan, dan tuang saat disajikan.', correctOrder: 4 }
        ]
      }
    ]
  }
];
