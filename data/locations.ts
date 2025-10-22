export interface Governorate {
  name: string;
  delegations: string[];
}

export const tunisianGovernorates: Governorate[] = [
  { name: 'Ariana', delegations: ['Ariana Ville', 'Ettadhamen', 'Kalaat el-Andalous', 'Mnihla', 'Raoued', 'Sidi Thabet', 'Soukra'] },
  { name: 'Béja', delegations: ['Béja Nord', 'Béja Sud', 'Amdoun', 'Goubellat', 'Medjez el-Bab', 'Nefza', 'Téboursouk', 'Testour', 'Thibar'] },
  { name: 'Ben Arous', delegations: ['Ben Arous', 'Bou Mhel el-Bassatine', 'El Mourouj', 'Ezzahra', 'Fouchana', 'Hammam Lif', 'Hammam Chott', 'Mégrine', 'Mohamedia', 'Mornag', 'Nouvelle Médina', 'Radès'] },
  { name: 'Bizerte', delegations: ['Bizerte Nord', 'Bizerte Sud', 'Djoumime', 'El Alia', 'Ghar El Melh', 'Ghezala', 'Mateur', 'Menzel Bourguiba', 'Menzel Jemil', 'Ras Jebel', 'Sejnane', 'Tinja', 'Utique', 'Zarzouna'] },
  { name: 'Gabès', delegations: ['Gabès Médina', 'Gabès Ouest', 'Gabès Sud', 'Ghannouch', 'El Hamma', 'Matmata', 'Mareth', 'Menzel El Habib', 'Métouia', 'Nouvelle Matmata'] },
  { name: 'Gafsa', delegations: ['Gafsa Nord', 'Gafsa Sud', 'Belkhir', 'El Guettar', 'El Ksar', 'Mdhilla', 'Métlaoui', 'Moularès', 'Redeyef', 'Sened', 'Sidi Aïch'] },
  { name: 'Jendouba', delegations: ['Jendouba', 'Jendouba Nord', 'Aïn Draham', 'Balta-Bou Aouane', 'Bou Salem', 'Fernana', 'Ghardimaou', 'Oued Meliz', 'Tabarka'] },
  { name: 'Kairouan', delegations: ['Kairouan Nord', 'Kairouan Sud', 'Alaâ', 'Bou Hajla', 'Chebika', 'Echrarda', 'Haffouz', 'Hajeb El Ayoun', 'Menzelet Bou Zelfa', 'Nasrallah', 'Oueslatia', 'Sbikha'] },
  { name: 'Kasserine', delegations: ['Kasserine Nord', 'Kasserine Sud', 'Ezzouhour', 'El Ayoun', 'Fériana', 'Foussana', 'Haïdra', 'Hassi El Ferid', 'Jedelienne', 'Majel Bel Abbès', 'Sbeïtla', 'Sbiba', 'Thala'] },
  { name: 'Kébili', delegations: ['Kébili Nord', 'Kébili Sud', 'Douz Nord', 'Douz Sud', 'El Faouar', 'Souk Lahad'] },
  { name: 'Le Kef', delegations: ['Kef Est', 'Kef Ouest', 'Dahmani', 'El Ksour', 'Jérissa', 'Kalaat es Senam', 'Kalaat Khasba', 'Nebeur', 'Sakiet Sidi Youssef', 'Sers', 'Tajerouine'] },
  { name: 'Mahdia', delegations: ['Mahdia', 'Bou Merdes', 'Chebba', 'Chorbane', 'El Djem', 'Essouassi', 'Hebira', 'Ksour Essef', 'Melloulèche', 'Ouled Chamekh', 'Sidi Alouane'] },
  { name: 'Manouba', delegations: ['Manouba', 'Den Den', 'Douar Hicher', 'El Batan', 'Jedaida', 'Mornaguia', 'Oued Ellil', 'Tebourba'] },
  { name: 'Médenine', delegations: ['Médenine Nord', 'Médenine Sud', 'Ben Gardane', 'Beni Khedache', 'Djerba - Ajim', 'Djerba - Houmt Souk', 'Djerba - Midoun', 'Sidi Makhlouf', 'Zarzis'] },
  { name: 'Monastir', delegations: ['Monastir', 'Amiret El Fhoul', 'Bekalta', 'Beni Hassen', 'Jemmal', 'Ksar Hellal', 'Ksibet el-Médiouni', 'Moknine', 'Ouerdanine', 'Sahline Moôtmar', 'Sayada-Lamta-Bou Hajar', 'Téboulba', 'Zéramdine'] },
  { name: 'Nabeul', delegations: ['Nabeul', 'Béni Khalled', 'Béni Khiar', 'Bou Argoub', 'Dar Chaâbane El Fehri', 'El Haouaria', 'El Mida', 'Grombalia', 'Hammam Ghezèze', 'Hammamet', 'Kélibia', 'Korba', 'Menzel Bouzelfa', 'Menzel Temime', 'Soliman', 'Takelsa'] },
  { name: 'Sfax', delegations: ['Sfax Ville', 'Sfax Ouest', 'Sfax Sud', 'Sakiet Ezzit', 'Sakiet Eddaïer', 'Tina', 'Agareb', 'Bir Ali Ben Khalifa', 'El Amra', 'El Hencha', 'Graïba', 'Jebiniana', 'Kerkennah', 'Mahares', 'Menzel Chaker', 'Skhira'] },
  { name: 'Sidi Bouzid', delegations: ['Sidi Bouzid Est', 'Sidi Bouzid Ouest', 'Bir El Hafey', 'Cebbala Ouled Asker', 'Jilma', 'Meknassy', 'Menzel Bouzaiane', 'Mezzouna', 'Ouled Haffouz', 'Regueb', 'Sidi Ali Ben Aoun', 'Souk Jedid'] },
  { name: 'Siliana', delegations: ['Siliana Nord', 'Siliana Sud', 'Bargou', 'Bou Arada', 'El Aroussa', 'Gaâfour', 'Kesra', 'Makthar', 'Rohia', 'Sidi Bou Rouis'] },
  { name: 'Sousse', delegations: ['Sousse Jawhara', 'Sousse Médina', 'Sousse Riadh', 'Sousse Sidi Abdelhamid', 'Akouda', 'Bouficha', 'Enfidha', 'Hammam Sousse', 'Hergla', 'Kalaa El Kebira', 'Kalaa Seghira', 'Kondar', 'Msaken', 'Sidi Bou Ali', 'Sidi El Hani'] },
  { name: 'Tataouine', delegations: ['Tataouine Nord', 'Tataouine Sud', 'Bir Lahmar', 'Dehiba', 'Ghomrassen', 'Remada', 'Smâr'] },
  { name: 'Tozeur', delegations: ['Tozeur', 'Degache', 'Hazoua', 'Nefta', 'Tameghza'] },
  { name: 'Tunis', delegations: ['Bab El Bhar', 'Bab Souika', 'Carthage', 'Cité El Khadra', 'Djebel Jelloud', 'El Kabaria', 'El Menzah', 'El Omrane', 'El Omrane Supérieur', 'El Ouardia', 'Ettahrir', 'Ezzouhour', 'Hraïria', 'La Goulette', 'La Marsa', 'Le Bardo', 'Le Kram', 'Médina', 'Sidi El Béchir', 'Sidi Hassine', 'Séjoumi'] },
  { name: 'Zaghouan', delegations: ['Zaghouan', 'Bir Mcherga', 'El Fahs', 'Nadhour', 'Saouaf', 'Zriba'] }
];


export const countries: string[] = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
    "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
    "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo, Democratic Republic of the", "Congo, Republic of the", "Costa Rica", "Cote d'Ivoire", "Croatia", "Cuba", "Cyprus", "Czech Republic",
    "Denmark", "Djibouti", "Dominica", "Dominican Republic",
    "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia",
    "Fiji", "Finland", "France",
    "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
    "Haiti", "Honduras", "Hungary",
    "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy",
    "Jamaica", "Japan", "Jordan",
    "Kazakhstan", "Kenya", "Kiribati", "Kosovo", "Kuwait", "Kyrgyzstan",
    "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
    "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
    "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway",
    "Oman",
    "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
    "Qatar",
    "Romania", "Russia", "Rwanda",
    "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
    "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
    "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan",
    "Vanuatu", "Vatican City", "Venezuela", "Vietnam",
    "Yemen",
    "Zambia", "Zimbabwe"
];
