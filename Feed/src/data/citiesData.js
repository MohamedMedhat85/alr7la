// Static city data for use in the Trip Planner 'from cities' dropdown
// Countries A-Z with 10-15 major cities each

const citiesData = {
  // A
  AF: ['Kabul', 'Kandahar', 'Herat', 'Mazar-i-Sharif', 'Jalalabad', 'Kunduz', 'Ghazni', 'Balkh', 'Baghlan', 'Taloqan', 'Puli Khumri', 'Charikar', 'Sheberghan', 'Sar-e Pol', 'Lashkar Gah'],
  AL: ['Tirana', 'Durrës', 'Vlorë', 'Shkodër', 'Fier', 'Elbasan', 'Korçë', 'Berat', 'Lushnjë', 'Kavajë', 'Pogradec', 'Laç', 'Krujë', 'Lezhë', 'Kukës'],
  DZ: ['Algiers', 'Oran', 'Constantine', 'Annaba', 'Blida', 'Batna', 'Djelfa', 'Sétif', 'Sidi Bel Abbès', 'Biskra', 'Tébessa', 'Tiaret', 'Béjaïa', 'Tlemcen', 'Ouargla'],
  AD: ['Andorra la Vella', 'Escaldes-Engordany', 'Encamp', 'Sant Julià de Lòria', 'La Massana', 'Canillo', 'Ordino'],
  AO: ['Luanda', 'N\'dalatando', 'Huambo', 'Lobito', 'Benguela', 'Kuito', 'Lubango', 'Malanje', 'Namibe', 'Soyo', 'Cabinda', 'Uíge', 'Saurimo', 'Sumbe', 'Caxito'],
  AG: ['St. John\'s', 'All Saints', 'Liberta', 'Potters Village', 'Bolans', 'Swetes', 'Seaview Farm', 'Piggotts', 'Parham', 'Carlisle', 'Codrington'],
  AR: ['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'La Plata', 'San Miguel de Tucumán', 'Mar del Plata', 'Salta', 'Santa Fe', 'San Juan', 'Resistencia', 'Santiago del Estero', 'Corrientes', 'Posadas', 'Neuquén'],
  AM: ['Yerevan', 'Gyumri', 'Vanadzor', 'Vagharshapat', 'Hrazdan', 'Abovyan', 'Kapan', 'Armavir', 'Gavar', 'Artashat', 'Ijevan', 'Goris', 'Charentsavan', 'Masis', 'Ashtarak'],
  AU: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast', 'Newcastle', 'Canberra', 'Sunshine Coast', 'Wollongong', 'Geelong', 'Hobart', 'Townsville', 'Cairns', 'Toowoomba'],
  AT: ['Vienna', 'Graz', 'Linz', 'Salzburg', 'Innsbruck', 'Klagenfurt', 'Villach', 'Wels', 'Sankt Pölten', 'Dornbirn', 'Wiener Neustadt', 'Steyr', 'Feldkirch', 'Bregenz', 'Leonding'],
  AZ: ['Baku', 'Ganja', 'Sumqayit', 'Mingachevir', 'Lankaran', 'Shirvan', 'Nakhchivan', 'Shaki', 'Yevlakh', 'Khachmaz', 'Barda', 'Bilasuvar', 'Quba', 'Qusar', 'Zaqatala'],
  
  // B
  BS: ['Nassau', 'Freeport', 'West End', 'Cooper\'s Town', 'Marsh Harbour', 'Freetown', 'High Rock', 'Andros Town', 'Clarence Town', 'Dunmore Town', 'Arthur\'s Town'],
  BH: ['Manama', 'Riffa', 'Muharraq', 'Hamad Town', 'Aali', 'Isa Town', 'Sitra', 'Budaiya', 'Jidhafs', 'Al-Malikiyah', 'Madinat Hamad', 'Madinat Isa', 'Al-Muharraq', 'Zallaq', 'Tubli'],
  BD: ['Dhaka', 'Chittagong', 'Khulna', 'Rajshahi', 'Comilla', 'Rangpur', 'Mymensingh', 'Barisal', 'Narayanganj', 'Sylhet', 'Tongi', 'Gazipur', 'Narsingdi', 'Brahmanbaria', 'Dinajpur'],
  BB: ['Bridgetown', 'Speightstown', 'Oistins', 'Bathsheba', 'Holetown', 'Crab Hill', 'Greenland', 'The Crane', 'Blackmans', 'Bulkeley', 'Hillaby'],
  BY: ['Minsk', 'Gomel', 'Mogilev', 'Vitebsk', 'Hrodna', 'Brest', 'Babruysk', 'Baranovichi', 'Barysaw', 'Pinsk', 'Orsha', 'Mazyr', 'Salihorsk', 'Lida', 'Novopolotsk'],
  BE: ['Brussels', 'Antwerp', 'Ghent', 'Charleroi', 'Liège', 'Bruges', 'Namur', 'Leuven', 'Mons', 'Aalst', 'Mechelen', 'La Louvière', 'Kortrijk', 'Hasselt', 'Sint-Niklaas'],
  BZ: ['Belmopan', 'Belize City', 'San Ignacio', 'Orange Walk', 'San Pedro', 'Corozal', 'Dangriga', 'Punta Gorda', 'Benque Viejo', 'Ladyville', 'Hattieville'],
  BJ: ['Cotonou', 'Porto-Novo', 'Parakou', 'Djougou', 'Bohicon', 'Kandi', 'Abomey', 'Natitingou', 'Ouidah', 'Lokossa', 'Dogbo', 'Savé', 'Kérou', 'Malanville', 'Pobè'],
  BT: ['Thimphu', 'Phuntsholing', 'Punakha', 'Samdrup Jongkhar', 'Gelephu', 'Wangdue Phodrang', 'Trongsa', 'Paro', 'Jakar', 'Tsirang', 'Mongar', 'Trashigang', 'Pemagatshel', 'Nganglam', 'Sarpang'],
  BO: ['Santa Cruz de la Sierra', 'El Alto', 'La Paz', 'Cochabamba', 'Oruro', 'Sucre', 'Tarija', 'Potosí', 'Sacaba', 'Montero', 'Quillacollo', 'Trinidad', 'Yacuiba', 'Riberalta', 'Tiquipaya'],
  BA: ['Sarajevo', 'Banja Luka', 'Tuzla', 'Zenica', 'Mostar', 'Bijeljina', 'Prijedor', 'Brčko', 'Doboj', 'Cazin', 'Zvornik', 'Bihać', 'Trebinje', 'Gradačac', 'Derventa'],
  BW: ['Gaborone', 'Francistown', 'Molepolole', 'Selebi-Phikwe', 'Maun', 'Serowe', 'Kanye', 'Mahalapye', 'Mogoditshane', 'Lobatse', 'Palapye', 'Ramotswa', 'Thamaga', 'Mosopa', 'Letlhakane'],
  
  // C
  CA: ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton', 'Ottawa', 'Winnipeg', 'Quebec City', 'Hamilton', 'Kitchener', 'London', 'Victoria', 'Halifax', 'Windsor', 'Saskatoon'],
  CF: ['Bangui', 'Bimbo', 'Berbérati', 'Carnot', 'Bambari', 'Bouar', 'Bossangoa', 'Bria', 'Bangassou', 'Nola', 'Kaga-Bandoro', 'Sibut', 'Mbaïki', 'Bozoum', 'Paoua'],
  TD: ['N\'Djamena', 'Moundou', 'Sarh', 'Abéché', 'Kélo', 'Koumra', 'Pala', 'Am Timan', 'Bongor', 'Mongo', 'Doba', 'Ati', 'Lai', 'Oum Hadjer', 'Bitkine'],
  CL: ['Santiago', 'Valparaíso', 'Concepción', 'La Serena', 'Antofagasta', 'Temuco', 'Viña del Mar', 'Talca', 'Arica', 'Iquique', 'Rancagua', 'Puerto Montt', 'Coquimbo', 'Los Ángeles', 'Calama'],
  CN: ['Shanghai', 'Beijing', 'Guangzhou', 'Shenzhen', 'Chengdu', 'Tianjin', 'Xi\'an', 'Chongqing', 'Nanjing', 'Wuhan', 'Hangzhou', 'Dongguan', 'Foshan', 'Suzhou', 'Kunming'],
  CO: ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Cúcuta', 'Bucaramanga', 'Pereira', 'Santa Marta', 'Ibagué', 'Pasto', 'Manizales', 'Neiva', 'Villavicencio', 'Armenia'],
  KM: ['Moroni', 'Mutsamudu', 'Fomboni', 'Domoni', 'Tsimbeo', 'Mitsamiouli', 'Ouani', 'Mirontsi', 'Trou-du-Prophète', 'Iconi', 'Nioumachoua', 'Moya', 'Sima', 'Miringoni', 'Bandar-es-Salam'],
  CG: ['Brazzaville', 'Pointe-Noire', 'Dolisie', 'Nkayi', 'Impfondo', 'Ouésso', 'Gamboma', 'Mossendjo', 'Kinkala', 'Loandjili', 'Makoua', 'Sibiti', 'Djambala', 'Ewo', 'Kelle'],
  CD: ['Kinshasa', 'Lubumbashi', 'Mbuji-Mayi', 'Kananga', 'Kisangani', 'Bukavu', 'Tshikapa', 'Kolwezi', 'Likasi', 'Goma', 'Kikwit', 'Uvira', 'Bunia', 'Butembo', 'Kalemie'],
  CR: ['San José', 'Limón', 'Alajuela', 'Heredia', 'Cartago', 'Puntarenas', 'Liberia', 'Guanacaste', 'San Carlos', 'Tilarán', 'Guápiles', 'Siquirres', 'Turrialba', 'San Isidro', 'Quepos'],
  HR: ['Zagreb', 'Split', 'Rijeka', 'Osijek', 'Zadar', 'Slavonski Brod', 'Pula', 'Sesvete', 'Karlovac', 'Varaždin', 'Šibenik', 'Sisak', 'Vinkovci', 'Velika Gorica', 'Vukovar'],
  CU: ['Havana', 'Santiago de Cuba', 'Camagüey', 'Holguín', 'Santa Clara', 'Guantánamo', 'Bayamo', 'Cienfuegos', 'Pinar del Río', 'Las Tunas', 'Matanzas', 'Ciego de Ávila', 'Sancti Spíritus', 'Cienfuegos', 'Mariel'],
  CY: ['Nicosia', 'Limassol', 'Larnaca', 'Paphos', 'Famagusta', 'Kyrenia', 'Aradippou', 'Lakatamia', 'Strovolos', 'Latsia', 'Dali', 'Aglandjia', 'Engomi', 'Mesa Geitonia', 'Agios Athanasios'],
  CZ: ['Prague', 'Brno', 'Ostrava', 'Plzen', 'Liberec', 'Olomouc', 'Ústí nad Labem', 'České Budějovice', 'Hradec Králové', 'Pardubice', 'Zlín', 'Havířov', 'Kladno', 'Most', 'Opava'],
  CI: ['Abidjan', 'Bouaké', 'Daloa', 'Yamoussoukro', 'San-Pédro', 'Divo', 'Korhogo', 'Anyama', 'Abengourou', 'Man', 'Gagnoa', 'Soubré', 'Agboville', 'Dabou', 'Grand-Bassam'],
  
  // D
  DK: ['Copenhagen', 'Aarhus', 'Odense', 'Aalborg', 'Esbjerg', 'Randers', 'Kolding', 'Horsens', 'Vejle', 'Roskilde', 'Herning', 'Silkeborg', 'Næstved', 'Fredericia', 'Viborg'],
  DJ: ['Djibouti', 'Ali Sabieh', 'Tadjourah', 'Obock', 'Dikhil', 'Arta', 'Balho', 'Randa', 'Loyada', 'Holhol', 'Dorra', 'Goubétto', 'Goubetto', 'Wéa', 'As Eyla'],
  DM: ['Roseau', 'Portsmouth', 'Marigot', 'Berekua', 'Grand Bay', 'La Plaine', 'Wesley', 'Saint Joseph', 'Castle Bruce', 'Calibishie', 'Coulibistrie'],
  
  // E
  DO: ['Santo Domingo', 'Santiago', 'Santo Domingo Este', 'Santo Domingo Norte', 'Santo Domingo Oeste', 'San Pedro de Macorís', 'La Romana', 'San Francisco de Macorís', 'San Cristóbal', 'Puerto Plata', 'Concepción de La Vega', 'San Juan de la Maguana', 'Bonao', 'Bajos de Haina', 'Baní'],
  EC: ['Guayaquil', 'Quito', 'Cuenca', 'Santo Domingo', 'Machala', 'Durán', 'Manta', 'Portoviejo', 'Loja', 'Ambato', 'Esmeraldas', 'Quevedo', 'Riobamba', 'Milagro', 'Ibarra'],
  EG: ['Cairo', 'Alexandria', 'Giza', 'Shubra El Kheima', 'Port Said', 'Suez', 'Luxor', 'Mansoura', 'El-Mahalla El-Kubra', 'Aswan', 'Asyut', 'Zagazig', 'Ismailia', 'Faiyum', 'Sohag'],
  SV: ['San Salvador', 'Santa Ana', 'San Miguel', 'Mejicanos', 'Soyapango', 'San Martín', 'Apopa', 'Delgado', 'Ahuachapán', 'Ilopango', 'Tonacatepeque', 'Usulután', 'San Marcos', 'Cuscatancingo', 'Cojutepeque'],
  GQ: ['Malabo', 'Bata', 'Ebebiyin', 'Aconibe', 'Añisoc', 'Luba', 'Evinayong', 'Mongomo', 'Mengomeyén', 'Micomeseng', 'Rebola', 'Bitica', 'Machinda', 'Riaba', 'San Antonio de Palé'],
  ER: ['Asmara', 'Keren', 'Massawa', 'Assab', 'Mendefera', 'Barentu', 'Adi Keyh', 'Edd', 'Dekemhare', 'Akre', 'Adi Quala', 'Senafe', 'Villaggio', 'Teseney', 'Nakfa'],
  EE: ['Tallinn', 'Tartu', 'Narva', 'Pärnu', 'Kohtla-Järve', 'Viljandi', 'Rakvere', 'Maardu', 'Kuressaare', 'Sillamäe', 'Valga', 'Võru', 'Jõhvi', 'Haapsalu', 'Keila'],
  SZ: ['Mbabane', 'Manzini', 'Big Bend', 'Malkerns', 'Mhlume', 'Hluti', 'Simunye', 'Piggs Peak', 'Siteki', 'Nhlangano', 'Bulembu', 'Lobamba', 'Ezulwini', 'Mankayane', 'Hlatikulu'],
  ET: ['Addis Ababa', 'Dire Dawa', 'Mekelle', 'Gondar', 'Adama', 'Jimma', 'Bahir Dar', 'Dessie', 'Hawassa', 'Jijiga', 'Shashamane', 'Bishoftu', 'Arba Minch', 'Hosaena', 'Harar'],
  
  // F
  FJ: ['Suva', 'Lautoka', 'Nadi', 'Labasa', 'Ba', 'Levuka', 'Sigatoka', 'Tavua', 'Korovou', 'Rakiraki', 'Vatukoula', 'Navua', 'Tavua', 'Korolevu', 'Savusavu'],
  FI: ['Helsinki', 'Espoo', 'Tampere', 'Vantaa', 'Oulu', 'Turku', 'Jyväskylä', 'Lahti', 'Kuopio', 'Pori', 'Kouvola', 'Joensuu', 'Lappeenranta', 'Hämeenlinna', 'Vaasa'],
  FR: ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille', 'Rennes', 'Reims', 'Saint-Étienne', 'Toulon', 'Le Havre'],
  
  // G
  GA: ['Libreville', 'Port-Gentil', 'Franceville', 'Oyem', 'Moanda', 'Mouila', 'Lambarene', 'Tchibanga', 'Koulamoutou', 'Makokou', 'Bitam', 'Tsogni', 'Gamba', 'Makoua', 'Ntoum'],
  GL: ['Nuuk', 'Sisimiut', 'Ilulissat', 'Qaqortoq', 'Aasiaat', 'Maniitsoq', 'Tasiilaq', 'Uummannaq', 'Paamiut', 'Narsaq', 'Nanortalik', 'Qasigiannguit', 'Kangaatsiaq', 'Upernavik', 'Ittoqqortoormiit'],
  GM: ['Banjul', 'Serekunda', 'Brikama', 'Bakau', 'Farafenni', 'Lamin', 'Sukuta', 'Basse Santa Su', 'Gunjur', 'Brufut', 'Yundum', 'Bakau', 'Serekunda', 'Banjul', 'Brikama'],
  GE: ['Tbilisi', 'Batumi', 'Kutaisi', 'Rustavi', 'Gori', 'Zugdidi', 'Poti', 'Khashuri', 'Samtredia', 'Senaki', 'Zestaponi', 'Marneuli', 'Telavi', 'Akhaltsikhe', 'Ozurgeti'],
  DE: ['Berlin', 'Hamburg', 'Munich', 'Cologne', 'Frankfurt', 'Stuttgart', 'Düsseldorf', 'Dortmund', 'Essen', 'Leipzig', 'Bremen', 'Dresden', 'Hannover', 'Nuremberg', 'Duisburg'],
  GH: ['Accra', 'Kumasi', 'Tamale', 'Sekondi-Takoradi', 'Ashaiman', 'Sunyani', 'Cape Coast', 'Obuasi', 'Teshie', 'Tema', 'Madina', 'Koforidua', 'Wa', 'Ho', 'Techiman'],
  GR: ['Athens', 'Corfu', 'Heraklion', 'Kavala', 'Mykonos', 'Rhodes', 'Santorini', 'Thessaloniki', 'Volos'],
  GD: ['St. George\'s', 'Gouyave', 'Grenville', 'Victoria', 'Hillsborough', 'Sauteurs', 'Woburn', 'St. David\'s', 'Carriacou', 'Petit Martinique', 'L\'Anse aux Épines'],
  GT: ['Guatemala City', 'Mixco', 'Villa Nueva', 'Petapa', 'San Juan Sacatepéquez', 'Quetzaltenango', 'Villa Canales', 'Escuintla', 'Chinautla', 'Chimaltenango', 'Chichicastenango', 'Antigua Guatemala', 'Cobán', 'Huehuetenango', 'Puerto Barrios'],
  GN: ['Conakry', 'Nzérékoré', 'Kankan', 'Kindia', 'Kissidougou', 'Gueckedou', 'Boké', 'Mamou', 'Faranah', 'Labé', 'Siguiri', 'Kouroussa', 'Tougué', 'Pita', 'Dalaba'],
  GW: ['Bissau', 'Bafatá', 'Gabú', 'Bissorã', 'Bolama', 'Cacheu', 'Bubaque', 'Catió', 'Mansôa', 'Buba', 'Quebo', 'Fulacunda', 'Sambuia', 'Bambadinca', 'Bissau'],
  GY: ['Georgetown', 'Linden', 'New Amsterdam', 'Anna Regina', 'Bartica', 'Skeldon', 'Rosignol', 'Mahaica', 'Parika', 'Vreed-en-Hoop', 'Corriverton', 'Lethem', 'Mabaruma', 'Mahdia', 'Port Kaituma'],
  
  // H
  HT: ['Port-au-Prince', 'Carrefour', 'Delmas', 'Pétion-Ville', 'Port-de-Paix', 'Gonaïves', 'Saint-Marc', 'Cap-Haïtien', 'Petit-Goâve', 'Léogâne', 'Les Cayes', 'Jérémie', 'Hinche', 'Fort-Liberté', 'Trou-du-Nord'],
  HN: ['Tegucigalpa', 'San Pedro Sula', 'Choloma', 'La Ceiba', 'El Progreso', 'Choluteca', 'Comayagua', 'Puerto Cortés', 'La Lima', 'Danlí', 'Siguatepeque', 'Juticalpa', 'Villanueva', 'Tela', 'Santa Rosa de Copán'],
  HU: ['Budapest', 'Debrecen', 'Szeged', 'Miskolc', 'Pécs', 'Győr', 'Nyíregyháza', 'Kecskemét', 'Székesfehérvár', 'Szombathely', 'Szolnok', 'Tatabánya', 'Kaposvár', 'Veszprém', 'Békéscsaba'],
  
  // I
  IS: ['Reykjavík', 'Kópavogur', 'Hafnarfjörður', 'Akureyri', 'Reykjanesbær', 'Garðabær', 'Mosfellsbær', 'Árborg', 'Akranes', 'Fjarðabyggð', 'Seltjarnarnes', 'Vestmannaeyjar', 'Sauðárkrókur', 'Hveragerði', 'Húsavík'],
  IN: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane'],
  ID: ['Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Semarang', 'Palembang', 'Tangerang', 'Makassar', 'Depok', 'Batam', 'Pekanbaru', 'Bogor', 'Bandar Lampung', 'Malang', 'Denpasar'],
  IR: ['Tehran', 'Mashhad', 'Isfahan', 'Tabriz', 'Shiraz', 'Kerman', 'Yazd', 'Qom', 'Kermanshah', 'Urmia', 'Rasht', 'Ardabil', 'Bojnord', 'Yasuj', 'Bushehr'],
  IQ: ['Baghdad', 'Basra', 'Mosul', 'Erbil', 'Sulaymaniyah', 'Najaf', 'Karbala', 'Kirkuk', 'Duhok', 'Al-Hillah', 'Al-Nasiriyah', 'Al-Amara', 'Al-Diwaniyah', 'Al-Kut', 'Al-Ramadi'],
  IE: ['Dublin', 'Cork', 'Limerick', 'Galway', 'Waterford', 'Drogheda', 'Dundalk', 'Swords', 'Bray', 'Navan', 'Ennis', 'Kilkenny', 'Tralee', 'Carlow', 'Newbridge'],
  IL: ['Jerusalem', 'Tel Aviv', 'Haifa', 'Rishon LeZion', 'Petah Tikva', 'Ashdod', 'Netanya', 'Beer Sheva', 'Holon', 'Bnei Brak', 'Ramat Gan', 'Rehovot', 'Bat Yam', 'Herzliya', 'Kfar Saba'],
  IT: ['Rome', 'Milan', 'Naples', 'Turin', 'Palermo', 'Genoa', 'Bologna', 'Florence', 'Bari', 'Catania', 'Venice', 'Verona', 'Messina', 'Padua', 'Trieste'],
  
  // J
  JM: ['Kingston', 'Portmore', 'Montego Bay', 'Spanish Town', 'May Pen', 'Ocho Rios', 'Old Harbour', 'Linstead', 'Mandeville', 'Savanna-la-Mar', 'Oracabessa', 'Black River', 'Port Antonio', 'Lucea', 'Falmouth'],
  JP: ['Tokyo', 'Yokohama', 'Osaka', 'Nagoya', 'Sapporo', 'Kobe', 'Kyoto', 'Fukuoka', 'Kawasaki', 'Saitama', 'Hiroshima', 'Sendai', 'Chiba', 'Kitakyushu', 'Sakai'],
  
  // K
  KZ: ['Almaty', 'Nur-Sultan', 'Shymkent', 'Aktobe', 'Karaganda', 'Taraz', 'Pavlodar', 'Oskemen', 'Semey', 'Atyrau', 'Kyzylorda', 'Kokshetau', 'Taldykorgan', 'Petropavl', 'Kostanay'],
  KE: ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Malindi', 'Kitale', 'Kakamega', 'Nyeri', 'Kericho', 'Embu', 'Machakos', 'Narok', 'Kisii'],
  KI: ['Tarawa', 'Betio', 'Bikenibeu', 'Teaoraereke', 'Eita', 'Bairiki', 'Buariki', 'Temwaiku', 'Makin', 'Butaritari', 'Aranuka', 'Nonouti', 'Tabiteuea', 'Onotoa', 'Beru'],
  KP: ['Pyongyang', 'Hamhung', 'Chongjin', 'Nampo', 'Sinuiju', 'Wonsan', 'Sariwon', 'Haeju', 'Kanggye', 'Sunchon', 'Songrim', 'Hyesan', 'Kaesong', 'Kimchaek', 'Sariwon'],
  KR: ['Seoul', 'Busan', 'Incheon', 'Daegu', 'Daejeon', 'Gwangju', 'Suwon', 'Ulsan', 'Changwon', 'Seongnam', 'Goyang', 'Bucheon', 'Ansan', 'Jeonju', 'Anyang'],
  KW: ['Kuwait City', 'Al Ahmadi', 'Hawalli', 'As Salimiyah', 'Sabah as Salim', 'Jahra', 'Al Farwaniyah', 'Al Fahahil', 'Al Fintas', 'Abu Halifa', 'Salmiya', 'Salwa', 'Al-Mangaf', 'Al-Wafra', 'Al-Jahra'],
  KG: ['Bishkek', 'Osh', 'Jalal-Abad', 'Karakol', 'Tokmok', 'Uzgen', 'Balykchy', 'Naryn', 'Talas', 'Bazar-Korgon', 'Tash-Kumyr', 'Kara-Suu', 'Kant', 'Kara-Balta', 'Sokuluk'],
  
  // L
  LA: ['Vientiane', 'Pakse', 'Savannakhet', 'Luang Prabang', 'Thakhek', 'Xam Neua', 'Vang Vieng', 'Phonsavan', 'Luang Namtha', 'Pakxan', 'Xayaboury', 'Salavan', 'Attapeu', 'Champasak', 'Bokeo'],
  LV: ['Riga', 'Daugavpils', 'Liepāja', 'Jelgava', 'Jūrmala', 'Ventspils', 'Rēzekne', 'Valmiera', 'Jēkabpils', 'Ogre', 'Tukums', 'Cēsis', 'Salaspils', 'Kuldīga', 'Olaine'],
  LB: ['Beirut', 'Tripoli', 'Sidon', 'Tyre', 'Nabatieh', 'Jounieh', 'Zahle', 'Baalbek', 'Byblos', 'Batroun', 'Jbeil', 'Aley', 'Baabda', 'Keserwan', 'Jezzine'],
  LS: ['Maseru', 'Teyateyaneng', 'Mafeteng', 'Hlotse', 'Mohale\'s Hoek', 'Maputsoe', 'Qacha\'s Nek', 'Quthing', 'Butha-Buthe', 'Thaba-Tseka', 'Leribe', 'Berea', 'Mokhotlong', 'Thaba-Tseka', 'Qacha\'s Nek'],
  LR: ['Monrovia', 'Gbarnga', 'Kakata', 'Bensonville', 'Harper', 'Voinjama', 'Buchanan', 'Zwedru', 'New Yekepa', 'Greenville', 'River Cess', 'Robertsport', 'Sanniquellie', 'Tubmanburg', 'Barclayville'],
  LY: ['Tripoli', 'Benghazi', 'Misrata', 'Tarhuna', 'Al Bayda', 'Al Khums', 'Zawiya', 'Ajdabiya', 'Tobruk', 'Sabha', 'Derna', 'Tajura', 'Al Marj', 'Ghat', 'Ubari'],
  
  // M
  MG: ['Antananarivo', 'Toamasina', 'Antsirabe', 'Fianarantsoa', 'Mahajanga', 'Toliara', 'Antsiranana', 'Antalaha', 'Ambalavao', 'Ambovombe', 'Ambanja', 'Manakara', 'Tsiroanomandidy', 'Maroantsetra', 'Sambava'],
  MW: ['Lilongwe', 'Blantyre', 'Mzuzu', 'Zomba', 'Kasungu', 'Mangochi', 'Karonga', 'Salima', 'Nkhotakota', 'Liwonde', 'Nsanje', 'Rumphi', 'Mzimba', 'Balaka', 'Dedza'],
  MY: ['Kuala Lumpur', 'George Town', 'Ipoh', 'Shah Alam', 'Petaling Jaya', 'Johor Bahru', 'Malacca City', 'Alor Setar', 'Miri', 'Tawau', 'Sandakan', 'Kuching', 'Kota Kinabalu', 'Kuantan', 'Kuala Terengganu'],
  MV: ['Male', 'Addu City', 'Fuvahmulah', 'Kulhudhuffushi', 'Thinadhoo', 'Naifaru', 'Hinnavaru', 'Dhidhdhoo', 'Mahibadhoo', 'Veymandoo', 'Felidhoo', 'Foakaidhoo', 'Maradhoo', 'Hithadhoo', 'Gan'],
  ML: ['Bamako', 'Sikasso', 'Mopti', 'Koutiala', 'Ségou', 'Kayes', 'Sikasso', 'Koulikoro', 'Kati', 'Gao', 'Timbuktu', 'Kidal', 'Bourem', 'Goundam', 'Diré'],
  MT: ['Valletta', 'Birkirkara', 'Mosta', 'Qormi', 'Żabbar', 'Sliema', 'Żebbuġ', 'San Ġwann', 'Hamrun', 'Naxxar', 'Żejtun', 'Rabat', 'Żurrieq', 'Attard', 'Pembroke'],
  MH: ['Majuro', 'Ebeye', 'Arno', 'Jaluit', 'Wotje', 'Aur', 'Maloelap', 'Ailinglaplap', 'Likiep', 'Namorik', 'Ebon', 'Ujae', 'Lae', 'Lib', 'Wotho'],
  MR: ['Nouakchott', 'Nouadhibou', 'Kiffa', 'Kaédi', 'Rosso', 'Zouérat', 'Atar', 'Néma', 'Kankossa', 'Sélibaby', 'Aleg', 'Tidjikja', 'Boutilimit', 'Akjoujt', 'Tevragh Zeina'],
  MU: ['Port Louis', 'Beau Bassin-Rose Hill', 'Vacoas-Phoenix', 'Curepipe', 'Quatre Bornes', 'Triolet', 'Goodlands', 'Grand Baie', 'Plaine Magnien', 'Bambous', 'Le Hochet', 'Terre Rouge', 'Grande Rivière Noire', 'Rivière du Rempart', 'Flacq'],
  MX: ['Mexico City', 'Guadalajara', 'Monterrey', 'Puebla', 'Tijuana', 'Toluca', 'León', 'Juárez', 'Torreón', 'Querétaro', 'San Luis Potosí', 'Mérida', 'Aguascalientes', 'Cuernavaca', 'Chihuahua'],
  FM: ['Palikir', 'Weno', 'Kolonia', 'Colonia', 'Tofol', 'Lelu', 'Madolenihmw', 'Sokehs', 'Kitti', 'Nett', 'U', 'Nukuoro', 'Kapingamarangi', 'Pingelap', 'Mokil'],
  MD: ['Chișinău', 'Tiraspol', 'Bălți', 'Bender', 'Rîbnița', 'Cahul', 'Ungheni', 'Soroca', 'Orhei', 'Dubăsari', 'Comrat', 'Edineț', 'Căușeni', 'Ceadîr-Lunga', 'Strășeni'],
  MC: ['Monaco', 'Monte Carlo', 'La Condamine', 'Fontvieille', 'La Rousse', 'Larvotto', 'Saint Michel', 'La Colle', 'Les Révoires', 'Moneghetti', 'La Gare', 'Jardin Exotique', 'Les Moneghetti', 'Ravin de Sainte-Dévote', 'Vallon de la Rousse'],
  MN: ['Ulaanbaatar', 'Erdenet', 'Darkhan', 'Choibalsan', 'Mörön', 'Nalaikh', 'Bayankhongor', 'Ölgii', 'Khovd', 'Ulaangom', 'Altai', 'Sükhbaatar', 'Bayan-Ölgii', 'Govi-Altai', 'Zavkhan'],
  ME: ['Podgorica', 'Nikšić', 'Pljevlja', 'Bijelo Polje', 'Cetinje', 'Bar', 'Herceg Novi', 'Berane', 'Budva', 'Ulcinj', 'Tivat', 'Rožaje', 'Kotor', 'Danilovgrad', 'Mojkovac'],
  MA: ['Casablanca', 'Rabat', 'Fez', 'Marrakech', 'Agadir', 'Tangier', 'Meknes', 'Oujda', 'Kénitra', 'Tetouan', 'Safi', 'El Jadida', 'Béni Mellal', 'Taza', 'Larache'],
  MZ: ['Maputo', 'Matola', 'Beira', 'Nampula', 'Chimoio', 'Nacala', 'Quelimane', 'Tete', 'Xai-Xai', 'Gurue', 'Maxixe', 'Lichinga', 'Pemba', 'Angoche', 'Montepuez'],
  
  // N
  NA: ['Windhoek', 'Walvis Bay', 'Oshakati', 'Rundu', 'Katima Mulilo', 'Otjiwarongo', 'Keetmanshoop', 'Mariental', 'Gobabis', 'Swakopmund', 'Grootfontein', 'Okahandja', 'Lüderitz', 'Rehoboth', 'Otavi'],
  NR: ['Yaren', 'Anabar', 'Anetan', 'Boe', 'Buada', 'Denigomodu', 'Ijuw', 'Meneng', 'Nibok', 'Uaboe', 'Yaren', 'Anabar', 'Anetan', 'Boe', 'Buada'],
  NP: ['Kathmandu', 'Pokhara', 'Lalitpur', 'Bharatpur', 'Biratnagar', 'Birgunj', 'Dharan', 'Butwal', 'Dhangadhi', 'Hetauda', 'Nepalgunj', 'Itahari', 'Triyuga', 'Nepalgunj', 'Gulariya'],
  NL: ['Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht', 'Eindhoven', 'Tilburg', 'Groningen', 'Almere', 'Breda', 'Nijmegen', 'Enschede', 'Haarlem', 'Arnhem', 'Zaanstad', 'Amersfoort'],
  NZ: ['Auckland', 'Wellington', 'Christchurch', 'Hamilton', 'Tauranga', 'Napier-Hastings', 'Dunedin', 'Palmerston North', 'Nelson', 'Rotorua', 'New Plymouth', 'Whangarei', 'Invercargill', 'Whanganui', 'Gisborne'],
  NI: ['Managua', 'León', 'Masaya', 'Chinandega', 'Matagalpa', 'Estelí', 'Granada', 'Jinotega', 'Bluefields', 'Tipitapa', 'Chichigalpa', 'Juigalpa', 'El Viejo', 'Diriamba', 'Ocotal'],
  NE: ['Niamey', 'Zinder', 'Maradi', 'Agadez', 'Arlit', 'Tahoua', 'Dosso', 'Birni-N\'Konni', 'Tessaoua', 'Gaya', 'Dogondoutchi', 'Diffa', 'Ayorou', 'Madaoua', 'Illéla'],
  NG: ['Lagos', 'Kano', 'Ibadan', 'Kaduna', 'Port Harcourt', 'Benin City', 'Maiduguri', 'Zaria', 'Aba', 'Jos', 'Ilorin', 'Oyo', 'Enugu', 'Abeokuta', 'Sokoto'],
  NO: ['Oslo', 'Bergen', 'Trondheim', 'Stavanger', 'Drammen', 'Fredrikstad', 'Kristiansand', 'Sandnes', 'Tromsø', 'Sarpsborg', 'Skien', 'Ålesund', 'Tønsberg', 'Moss', 'Haugesund'],
  
  // O
  OM: ['Muscat', 'Salalah', 'Sohar', 'Nizwa', 'Sur', 'Ibri', 'Saham', 'Barka', 'Rustaq', 'Al Buraimi', 'Thumrait', 'Duqm', 'Mahout', 'Shinas', 'Al Khaburah'],
  
  // P
  PK: ['Karachi', 'Lahore', 'Faisalabad', 'Rawalpindi', 'Gujranwala', 'Peshawar', 'Multan', 'Hyderabad', 'Islamabad', 'Quetta', 'Bahawalpur', 'Sargodha', 'Sialkot', 'Sukkur', 'Larkana'],
  PW: ['Ngerulmud', 'Koror', 'Melekeok', 'Ngaraard', 'Ngarchelong', 'Ngardmau', 'Ngaremlengui', 'Ngatpang', 'Ngchesar', 'Ngiwal', 'Peleliu', 'Angaur', 'Kayangel', 'Hatohobei', 'Sonsorol'],
  PA: ['Panama City', 'San Miguelito', 'Juan Díaz', 'David', 'Arraiján', 'Colón', 'Santiago', 'La Chorrera', 'Chitré', 'Penonomé', 'Changuinola', 'Las Tablas', 'Chepo', 'Chame', 'Portobelo'],
  PG: ['Port Moresby', 'Lae', 'Mount Hagen', 'Madang', 'Goroka', 'Kokopo', 'Mendi', 'Kimbe', 'Bulolo', 'Rabaul', 'Kavieng', 'Arawa', 'Popondetta', 'Kundiawa', 'Wewak'],
  PY: ['Asunción', 'Ciudad del Este', 'San Lorenzo', 'Luque', 'Capiatá', 'Lambaré', 'Fernando de la Mora', 'Limpio', 'Ñemby', 'Encarnación', 'Pedro Juan Caballero', 'Coronel Oviedo', 'Itauguá', 'Mariano Roque Alonso', 'Concepción'],
  PE: ['Lima', 'Arequipa', 'Trujillo', 'Chiclayo', 'Piura', 'Iquitos', 'Cusco', 'Chimbote', 'Huancayo', 'Tacna', 'Ica', 'Juliaca', 'Cajamarca', 'Pucallpa', 'Sullana'],
  PH: ['Quezon City', 'Manila', 'Davao City', 'Caloocan', 'Cebu City', 'Zamboanga City', 'Antipolo', 'Pasig', 'Taguig', 'Valenzuela', 'Dasmariñas', 'Parañaque', 'Bacoor', 'General Santos', 'Makati'],
  PL: ['Warsaw', 'Kraków', 'Łódź', 'Wrocław', 'Poznań', 'Gdańsk', 'Szczecin', 'Bydgoszcz', 'Lublin', 'Katowice', 'Białystok', 'Gdynia', 'Częstochowa', 'Radom', 'Sosnowiec'],
  PT: ['Lisbon', 'Porto', 'Vila Nova de Gaia', 'Amadora', 'Braga', 'Funchal', 'Coimbra', 'Setúbal', 'Almada', 'Agualva-Cacém', 'Vila Franca de Xira', 'Maia', 'Leiria', 'Matosinhos', 'Gondomar'],
  
  // Q
  QA: ['Doha', 'Al Wakrah', 'Al Khor', 'Al Rayyan', 'Umm Salal', 'Al Daayen', 'Al Shamal', 'Al Gharafa', 'Al Waab', 'Abu Hamour', 'Ain Khaled', 'Al Aziziya', 'Al Hilal', 'Al Mamoura', 'Al Sadd'],
  
  // R
  RO: ['Bucharest', 'Cluj-Napoca', 'Timișoara', 'Iași', 'Craiova', 'Constanța', 'Galați', 'Ploiești', 'Brașov', 'Brăila', 'Oradea', 'Bacău', 'Pitești', 'Arad', 'Sibiu'],
  RU: ['Moscow', 'Saint Petersburg', 'Novosibirsk', 'Yekaterinburg', 'Kazan', 'Nizhny Novgorod', 'Chelyabinsk', 'Samara', 'Omsk', 'Rostov-on-Don', 'Ufa', 'Krasnoyarsk', 'Perm', 'Voronezh', 'Volgograd'],
  RW: ['Kigali', 'Butare', 'Gitarama', 'Ruhengeri', 'Gisenyi', 'Byumba', 'Cyangugu', 'Kibuye', 'Kibungo', 'Nyanza', 'Ruhango', 'Gikongoro', 'Kibungo', 'Karongi', 'Musanze'],
  
  // S
  SA: ['Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Dammam', 'Taif', 'Tabuk', 'Buraidah', 'Khamis Mushait', 'Hail', 'Najran', 'Jizan', 'Abha', 'Yanbu', 'Al-Kharj'],
  SB: ['Honiara', 'Auki', 'Gizo', 'Kirakira', 'Tulagi', 'Buala', 'Lata', 'Taro', 'Tigoa', 'Gatokae', 'Noro', 'Munda', 'Kundu', 'Ringgi', 'Taro'],
  SC: ['Victoria', 'Anse Boileau', 'Anse Royale', 'Baie Lazare', 'Baie Sainte Anne', 'Beau Vallon', 'Bel Air', 'Bel Ombre', 'Cascade', 'Glacis', 'Grand Anse', 'La Digue', 'La Rivière Anglaise', 'Mont Buxton', 'Mont Fleuri'],
  SL: ['Freetown', 'Bo', 'Kenema', 'Makeni', 'Koidu', 'Port Loko', 'Lunsar', 'Kailahun', 'Magburaka', 'Kabala', 'Kambia', 'Bonthe', 'Pujehun', 'Kono', 'Tonkolili'],
  SG: ['Singapore', 'Jurong West', 'Woodlands', 'Tampines', 'Sengkang', 'Hougang', 'Yishun', 'Choa Chu Kang', 'Bukit Merah', 'Bukit Batok', 'Ang Mo Kio', 'Bedok', 'Pasir Ris', 'Clementi', 'Bukit Panjang'],
  SK: ['Bratislava', 'Košice', 'Prešov', 'Žilina', 'Nitra', 'Banská Bystrica', 'Trnava', 'Trenčín', 'Martin', 'Poprad', 'Prievidza', 'Zvolen', 'Považská Bystrica', 'Michalovce', 'Spišská Nová Ves'],
  SI: ['Ljubljana', 'Maribor', 'Celje', 'Kranj', 'Velenje', 'Koper', 'Novo Mesto', 'Ptuj', 'Trbovlje', 'Kamnik', 'Jesenice', 'Nova Gorica', 'Domžale', 'Škofja Loka', 'Murska Sobota'],
  SO: ['Mogadishu', 'Hargeisa', 'Bosaso', 'Kismayo', 'Berbera', 'Marka', 'Jamaame', 'Baidoa', 'Burao', 'Afgooye', 'Beledweyne', 'Galkayo', 'Laascaanood', 'Qardho', 'Eyl'],
  ZA: ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria', 'Port Elizabeth', 'Bloemfontein', 'East London', 'Nelspruit', 'Kimberley', 'Polokwane', 'Rustenburg', 'Welkom', 'Pietermaritzburg', 'Benoni', 'Tembisa'],
  ES: ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Zaragoza', 'Málaga', 'Murcia', 'Palma', 'Las Palmas', 'Bilbao', 'Alicante', 'Córdoba', 'Valladolid', 'Vigo', 'Gijón'],
  LK: ['Colombo', 'Dehiwala-Mount Lavinia', 'Moratuwa', 'Jaffna', 'Negombo', 'Kandy', 'Sri Jayawardenepura Kotte', 'Kalmunai', 'Galle', 'Trincomalee', 'Batticaloa', 'Matara', 'Ratnapura', 'Badulla', 'Kurunegala'],
  SD: ['Khartoum', 'Omdurman', 'Port Sudan', 'Kassala', 'El Obeid', 'Nyala', 'Wad Madani', 'El Fasher', 'Kosti', 'Gedaref', 'Sennar', 'El Geneina', 'Rabak', 'Singa', 'Dongola'],
  SR: ['Paramaribo', 'Lelydorp', 'Brokopondo', 'Nieuw Nickerie', 'Moengo', 'Nieuw Amsterdam', 'Mariënburg', 'Wageningen', 'Albina', 'Groningen', 'Onverwacht', 'Brownsweg', 'Totness', 'Nieuw Aurora', 'Apoera'],
  SE: ['Stockholm', 'Gothenburg', 'Malmö', 'Uppsala', 'Västerås', 'Örebro', 'Linköping', 'Helsingborg', 'Jönköping', 'Norrköping', 'Lund', 'Umeå', 'Gävle', 'Borås', 'Eskilstuna'],
  CH: ['Bern', 'Geneva', 'Interlaken', 'Lucerne', 'Lugano', 'Zermatt', 'Zurich'],
  SY: ['Damascus', 'Aleppo', 'Homs', 'Hama', 'Latakia', 'Deir ez-Zor', 'Raqqa', 'Al-Hasakah', 'Qamishli', 'Tartus', 'Idlib', 'Daraa', 'Al-Suwayda', 'Al-Qunaytirah', 'Al-Raqqah'],
  
  // T
  TW: ['Taipei', 'New Taipei', 'Kaohsiung', 'Taichung', 'Tainan', 'Taoyuan', 'Hsinchu', 'Keelung', 'Chiayi', 'Changhua', 'Pingtung', 'Yilan', 'Hualien', 'Taitung', 'Kinmen'],
  TJ: ['Dushanbe', 'Khujand', 'Kulob', 'Qurghonteppa', 'Istaravshan', 'Vahdat', 'Tursunzoda', 'Konibodom', 'Isfara', 'Panjakent', 'Bokhtar', 'Vose', 'Yovon', 'Jilikul', 'Danghara'],
  TZ: ['Dar es Salaam', 'Mwanza', 'Arusha', 'Dodoma', 'Mbeya', 'Morogoro', 'Tanga', 'Kigoma', 'Musoma', 'Iringa', 'Songea', 'Tabora', 'Sumbawanga', 'Bukoba', 'Singida'],
  TH: ['Bangkok', 'Chiang Mai', 'Nakhon Ratchasima', 'Khon Kaen', 'Udon Thani', 'Hat Yai', 'Nakhon Si Thammarat', 'Ubon Ratchathani', 'Chonburi', 'Nakhon Sawan', 'Chiang Rai', 'Surat Thani', 'Nakhon Pathom', 'Phitsanulok', 'Songkhla'],
  TL: ['Dili', 'Baucau', 'Maliana', 'Liquiçá', 'Ermera', 'Aileu', 'Ainaro', 'Manufahi', 'Cova Lima', 'Bobonaro', 'Oecusse', 'Lautém', 'Viqueque', 'Manatuto', 'Liquiçá'],
  TG: ['Lomé', 'Sokodé', 'Kara', 'Kpalimé', 'Atakpamé', 'Bassar', 'Tsévié', 'Aného', 'Sansanné-Mango', 'Dapaong', 'Tchamba', 'Niamtougou', 'Bafilo', 'Notsé', 'Badou'],
  TO: ['Nuku\'alofa', 'Neiafu', 'Haveluloto', 'Vaini', 'Pangai', 'Ohonua', 'Hihifo', 'Kolovai', 'Nukunuku', 'Tatakamotonga', 'Ha\'ateiho', 'Puke', 'Fua\'amotu', 'Pea', 'Kolonga'],
  TT: ['Port of Spain', 'San Fernando', 'Arima', 'Point Fortin', 'Scarborough', 'Sangre Grande', 'Tunapuna', 'Couva', 'Chaguaramas', 'Diego Martin', 'San Juan', 'Laventille', 'Carenage', 'St. Joseph', 'St. Augustine'],
  TN: ['Tunis', 'Sfax', 'Sousse', 'Ettadhamen', 'Kairouan', 'Gabès', 'Bizerte', 'Ariana', 'Gafsa', 'Monastir', 'La Marsa', 'Béja', 'Jendouba', 'Zaghouan', 'Le Kef'],
  TR: ['Ankara', 'Antalya', 'Bodrum', 'Bursa', 'Cappadocia', 'Gaziantep', 'Istanbul', 'Izmir', 'Konya', 'Trabzon'],
  TM: ['Ashgabat', 'Türkmenabat', 'Daşoguz', 'Mary', 'Balkanabat', 'Bayramaly', 'Türkmenbaşy', 'Tejen', 'Abadan', 'Kaakhka', 'Gyzylarbat', 'Bereket', 'Gumdag', 'Serdar', 'Hazar'],
  
  // U
  UG: ['Kampala', 'Gulu', 'Lira', 'Mbarara', 'Jinja', 'Bwizibwera', 'Mbale', 'Mukono', 'Kasese', 'Arua', 'Masaka', 'Moroto', 'Entebbe', 'Tororo', 'Soroti'],
  UA: ['Kyiv', 'Kharkiv', 'Odesa', 'Dnipro', 'Donetsk', 'Zaporizhzhia', 'Lviv', 'Kryvyi Rih', 'Mykolaiv', 'Mariupol', 'Luhansk', 'Vinnytsia', 'Makiivka', 'Sevastopol', 'Simferopol'],
  AE: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Al Ain', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain', 'Al Dhaid', 'Dibba Al-Fujairah', 'Khor Fakkan', 'Kalba', 'Jebel Ali', 'Al Hamriyah', 'Al Madam'],
  GB: ['London', 'Birmingham', 'Leeds', 'Glasgow', 'Sheffield', 'Bradford', 'Edinburgh', 'Liverpool', 'Manchester', 'Bristol', 'Wakefield', 'Cardiff', 'Coventry', 'Nottingham', 'Leicester'],
  US: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville', 'Fort Worth', 'Columbus', 'Charlotte'],
  UY: ['Montevideo', 'Salto', 'Ciudad de la Costa', 'Paysandú', 'Las Piedras', 'Rivera', 'Maldonado', 'Tacuarembó', 'Melo', 'Mercedes', 'Artigas', 'Minas', 'San José de Mayo', 'Durazno', 'Treinta y Tres'],
  UZ: ['Tashkent', 'Namangan', 'Samarkand', 'Andijan', 'Nukus', 'Bukhara', 'Qarshi', 'Kokand', 'Fergana', 'Jizzakh', 'Urgench', 'Termez', 'Navoiy', 'Angren', 'Chirchiq'],
  
  // V
  VU: ['Port Vila', 'Luganville', 'Norsup', 'Sola', 'Lakatoro', 'Isangel', 'Longana', 'Loltong', 'Saratamata', 'Port Olry', 'Lakatoro', 'Norsup', 'Sola', 'Luganville', 'Port Vila'],
  VA: ['Vatican City'],
  VE: ['Caracas', 'Maracaibo', 'Valencia', 'Barquisimeto', 'Maracay', 'Petare', 'Ciudad Guayana', 'Maturín', 'Barcelona', 'Puerto La Cruz', 'Turmero', 'Barinas', 'Mérida', 'Cabimas', 'Coro'],
  VN: ['Ho Chi Minh City', 'Hanoi', 'Da Nang', 'Hai Phong', 'Can Tho', 'Bien Hoa', 'Hue', 'Nha Trang', 'Buon Ma Thuot', 'Vung Tau', 'Qui Nhon', 'Rach Gia', 'Long Xuyen', 'Thai Nguyen', 'Cam Ranh'],
  
  // Y
  YE: ['Sana\'a', 'Aden', 'Taiz', 'Al Hudaydah', 'Ibb', 'Dhamar', 'Al Mukalla', 'Sayyan', 'Zabid', 'Sa\'dah', 'Bajil', 'Hajjah', 'Dhala', 'Ataq', 'Lahij'],
  
  // Z
  ZM: ['Lusaka', 'Kitwe', 'Ndola', 'Kabwe', 'Chingola', 'Mufulira', 'Luanshya', 'Livingstone', 'Kasama', 'Chipata', 'Mazabuka', 'Kafue', 'Mongu', 'Choma', 'Mansa'],
  ZW: ['Harare', 'Bulawayo', 'Chitungwiza', 'Mutare', 'Epworth', 'Gweru', 'Kwekwe', 'Kadoma', 'Masvingo', 'Chinhoyi', 'Marondera', 'Ruwa', 'Chegutu', 'Zvishavane', 'Bindura'],
};

export default citiesData; 