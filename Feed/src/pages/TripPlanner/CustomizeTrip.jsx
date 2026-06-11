import React, { useState, useEffect } from 'react';
import { CalendarDays, MapPin, DollarSign, Zap, Globe, Search, PlaneTakeoff, 
         Heart, Sparkles, ArrowRight, Loader, Flag, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { tripService } from '../../services/networkService';
import citiesData from '../../data/citiesData';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue
} from '../../components/ui/select';

const tripPreferences = [
  "Adventure", "Art", "Café", "Children Activity", "Historic Landmark",
  "Hotel", "Museum", "Park", "Religious Landmark", "Restaurant",
  "Shop", "Sightseeing", "Sports Activity", "Theater", "Tourist Office", "Water Activity"
];

const styles = ["budget", "moderate", "luxury"];
const paces = ["slow-pace", "moderate", "fast-pace"];

// Fallback data in case API fails - only includes countries that have cities data
const fallbackDestinations = [
  { country: "Egypt", code: "EG", cities: [
    "Cairo", "Luxor", "Aswan", "Alexandria", "Sharm El Sheikh", "Hurghada", "Dahab", "Abydos", "Siwa Oasis", "El Gouna"
  ] },
  { country: "Switzerland", code: "CH", cities: [
    "Bern", "Geneva", "Interlaken", "Lucerne", "Lugano", "Zermatt", "Zurich"
  ] },
  { country: "Greece", code: "GR", cities: [
    "Athens", "Corfu", "Heraklion", "Kavala", "Mykonos", "Rhodes", "Santorini", "Thessaloniki", "Volos"
  ] },
  { country: "Turkey", code: "TR", cities: [
    "Ankara", "Antalya", "Bodrum", "Bursa", "Cappadocia", "Gaziantep", "Istanbul", "Izmir", "Konya", "Trabzon"
  ] },
  { country: "France", code: "FR", cities: ["Paris", "Nice", "Lyon", "Marseille", "Bordeaux"] },
  { country: "Italy", code: "IT", cities: ["Rome", "Milan", "Venice", "Florence", "Naples"] },
  { country: "Japan", code: "JP", cities: ["Tokyo", "Osaka", "Kyoto", "Sapporo", "Hiroshima"] },
  { country: "Brazil", code: "BR", cities: ["Rio de Janeiro", "São Paulo", "Brasília", "Salvador"] },
  { country: "United States", code: "US", cities: ["New York", "Los Angeles", "Chicago", "Miami", "San Francisco"] },
];

// Filter fallback destinations to only include countries that have cities data
const filteredFallbackDestinations = fallbackDestinations.filter(dest => citiesData[dest.code]);

// For the destination country dropdown, filter to only these codes
const DESTINATION_CODES = ["EG", "CH", "GR", "TR"];

// Emoji flag mapping for country codes
const COUNTRY_EMOJIS = {
  EG: "🇪🇬",
  CH: "🇨🇭",
  GR: "🇬🇷",
  TR: "🇹🇷",
  FR: "🇫🇷",
  IT: "🇮🇹",
  JP: "🇯🇵",
  BR: "🇧🇷",
  US: "🇺🇸"
};

const MAIN_DEST_CODES = ["EG", "CH", "GR", "TR"];

// Helper function to get major cities for a country
// Function to get destination cities for specific countries
const getDestinationCitiesByCountry = (countryCode) => {
  const destinationCities = {
    'EG': ['Cairo', 'Alexandria', 'Luxor', 'Aswan', 'Sharm El Sheikh', 'Hurghada', 'Giza', 'Port Said', 'Suez', 'Dahab', 'El Gouna', 'Marsa Alam', 'Abu Simbel', 'Siwa Oasis', 'El Minya', 'Asyut', 'Sohag', 'Qena', 'Beni Suef', 'Fayoum', 'Minya', 'Assiut', 'Sohag', 'Qena', 'Beni Suef', 'Fayoum'],
    'CH': ['Bern', 'Geneva', 'Interlaken', 'Lucerne', 'Lugano', 'Zermatt', 'Zurich'],
    'GR': ['Athens', 'Corfu', 'Heraklion', 'Kavala', 'Mykonos', 'Rhodes', 'Santorini', 'Thessaloniki', 'Volos'],
    'TR': ['Ankara', 'Antalya', 'Bodrum', 'Bursa', 'Cappadocia', 'Gaziantep', 'Istanbul', 'Izmir', 'Konya', 'Trabzon'],
  };
  
  return destinationCities[countryCode.toUpperCase()] || [];
};

const getMajorCitiesByCountry = (countryCode) => {
  // Use comprehensive cities data first
  if (citiesData[countryCode.toUpperCase()]) {
    return citiesData[countryCode.toUpperCase()];
  }
  
  // Fallback to hardcoded data for countries not in our comprehensive list
  const majorCities = {
    'EG': ['Cairo', 'Alexandria', 'Luxor', 'Aswan', 'Sharm El Sheikh', 'Hurghada', 'Giza', 'Port Said', 'Suez', 'Dahab', 'El Gouna', 'Marsa Alam', 'Abu Simbel', 'Siwa Oasis', 'El Minya', 'Asyut', 'Sohag', 'Qena', 'Beni Suef', 'Fayoum', 'Minya', 'Assiut', 'Sohag', 'Qena', 'Beni Suef', 'Fayoum'],
    'CH': ['Zurich', 'Geneva', 'Bern', 'Basel', 'Lausanne', 'Lucerne', 'St. Gallen', 'Winterthur', 'Lugano', 'Biel', 'Thun', 'Köniz', 'La Chaux-de-Fonds', 'Fribourg', 'Schaffhausen', 'Vernier', 'Chur', 'Uster', 'Sion', 'Neuchâtel', 'Zug', 'Yverdon-les-Bains', 'Rapperswil-Jona', 'Schwyz', 'Baden', 'Wil'],
    'GR': ['Athens', 'Thessaloniki', 'Patras', 'Piraeus', 'Larissa', 'Heraklion', 'Peristeri', 'Kallithea', 'Acharnes', 'Kalamaria', 'Nikaia', 'Glyfada', 'Volos', 'Ioannina', 'Kavala', 'Chania', 'Chalcis', 'Lamia', 'Rhodes', 'Serres', 'Drama', 'Katerini', 'Trikala', 'Veroia', 'Kozani', 'Alexandroupoli'],
    'TR': ['Istanbul', 'Ankara', 'Izmir', 'Bursa', 'Antalya', 'Adana', 'Konya', 'Gaziantep', 'Mersin', 'Diyarbakir', 'Samsun', 'Denizli', 'Eskişehir', 'Urfa', 'Malatya', 'Erzurum', 'Van', 'Batman', 'Elazig', 'Sivas', 'Kayseri', 'Tokat', 'Manisa', 'Balikesir', 'Kahramanmaras', 'Aydin'],
    'FR': ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille', 'Rennes', 'Reims', 'Saint-Étienne', 'Toulon', 'Le Havre', 'Grenoble', 'Dijon', 'Angers', 'Nîmes', 'Saint-Denis', 'Villeurbanne', 'Le Mans', 'Aix-en-Provence', 'Brest', 'Nantes', 'Limoges'],
    'IT': ['Rome', 'Milan', 'Naples', 'Turin', 'Palermo', 'Genoa', 'Bologna', 'Florence', 'Bari', 'Catania', 'Venice', 'Verona', 'Messina', 'Padua', 'Trieste', 'Brescia', 'Parma', 'Taranto', 'Prato', 'Modena', 'Reggio Emilia', 'Perugia', 'Livorno', 'Ravenna', 'Foggia', 'Rimini'],
    'JP': ['Tokyo', 'Yokohama', 'Osaka', 'Nagoya', 'Sapporo', 'Kobe', 'Kyoto', 'Fukuoka', 'Kawasaki', 'Saitama', 'Hiroshima', 'Sendai', 'Chiba', 'Kitakyushu', 'Sakai', 'Niigata', 'Hamamatsu', 'Kumamoto', 'Sagamihara', 'Shizuoka', 'Okayama', 'Kagoshima', 'Matsuyama', 'Utsunomiya', 'Matsudo', 'Kanazawa'],
    'BR': ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza', 'Belo Horizonte', 'Manaus', 'Curitiba', 'Recife', 'Porto Alegre', 'Belém', 'Goiânia', 'Guarulhos', 'Campinas', 'Nova Iguaçu', 'São Luís', 'Maceió', 'Teresina', 'Natal', 'Campo Grande', 'João Pessoa', 'Teresina', 'Aracaju', 'Cuiabá', 'Porto Velho', 'Boa Vista'],
    'US': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville', 'Fort Worth', 'Columbus', 'Charlotte', 'San Francisco', 'Indianapolis', 'Seattle', 'Denver', 'Washington', 'Boston', 'El Paso', 'Nashville', 'Detroit', 'Oklahoma City', 'Portland'],
    'CA': ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton', 'Ottawa', 'Winnipeg', 'Quebec City', 'Hamilton', 'Kitchener', 'London', 'Victoria', 'Halifax', 'Windsor', 'Saskatoon', 'Oshawa', 'Barrie', 'St. Catharines', 'Guelph', 'Abbotsford', 'Kingston', 'Kelowna', 'Nanaimo', 'Prince George', 'Whitehorse', 'Yellowknife'],
    'GB': ['London', 'Birmingham', 'Leeds', 'Glasgow', 'Sheffield', 'Bradford', 'Edinburgh', 'Liverpool', 'Manchester', 'Bristol', 'Wakefield', 'Cardiff', 'Coventry', 'Nottingham', 'Leicester', 'Belfast', 'Newcastle', 'Brighton', 'Plymouth', 'Southampton', 'Reading', 'Derby', 'Stoke-on-Trent', 'Wolverhampton', 'Preston', 'Sunderland'],
    'DE': ['Berlin', 'Hamburg', 'Munich', 'Cologne', 'Frankfurt', 'Stuttgart', 'Düsseldorf', 'Dortmund', 'Essen', 'Leipzig', 'Bremen', 'Dresden', 'Hannover', 'Nuremberg', 'Duisburg', 'Bochum', 'Wuppertal', 'Bielefeld', 'Bonn', 'Münster', 'Karlsruhe', 'Mannheim', 'Augsburg', 'Wiesbaden', 'Gelsenkirchen', 'Mönchengladbach'],
    'ES': ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Zaragoza', 'Málaga', 'Murcia', 'Palma', 'Las Palmas', 'Bilbao', 'Alicante', 'Córdoba', 'Valladolid', 'Vigo', 'Gijón', 'L\'Hospitalet', 'A Coruña', 'Vitoria-Gasteiz', 'Granada', 'Oviedo', 'Badalona', 'Cartagena', 'Jerez de la Frontera', 'Sabadell', 'Alcalá de Henares', 'Pamplona'],
    'NL': ['Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht', 'Eindhoven', 'Tilburg', 'Groningen', 'Almere', 'Breda', 'Nijmegen', 'Enschede', 'Haarlem', 'Arnhem', 'Zaanstad', 'Amersfoort', 'Apeldoorn', 'Haarlemmermeer', 'Den Bosch', 'Zwolle', 'Leiden', 'Maastricht', 'Ede', 'Leeuwarden', 'Zoetermeer', 'Dordrecht', 'Emmen'],
    'AU': ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast', 'Newcastle', 'Canberra', 'Sunshine Coast', 'Wollongong', 'Geelong', 'Hobart', 'Townsville', 'Cairns', 'Toowoomba', 'Darwin', 'Ballarat', 'Bendigo', 'Albury-Wodonga', 'Maitland', 'Mackay', 'Rockhampton', 'Bunbury', 'Coffs Harbour', 'Bundaberg', 'Hervey Bay'],
    'IN': ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Surat', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad', 'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Faridabad', 'Meerut'],
    'CN': ['Shanghai', 'Beijing', 'Guangzhou', 'Shenzhen', 'Tianjin', 'Chongqing', 'Chengdu', 'Nanjing', 'Wuhan', 'Xi\'an', 'Hangzhou', 'Dongguan', 'Foshan', 'Shenyang', 'Qingdao', 'Dalian', 'Jinan', 'Zhengzhou', 'Changsha', 'Kunming', 'Fuzhou', 'Shijiazhuang', 'Harbin', 'Nanchang', 'Guiyang', 'Xiamen'],
    'KR': ['Seoul', 'Busan', 'Incheon', 'Daegu', 'Daejeon', 'Gwangju', 'Suwon', 'Ulsan', 'Changwon', 'Seongnam', 'Goyang', 'Bucheon', 'Ansan', 'Jeonju', 'Anyang', 'Pohang', 'Jeju', 'Jeonju', 'Cheongju', 'Jinju', 'Mokpo', 'Yeosu', 'Gunsan', 'Iksan', 'Jeongeup', 'Naju'],
    'MX': ['Mexico City', 'Guadalajara', 'Monterrey', 'Puebla', 'Tijuana', 'Toluca', 'León', 'Juárez', 'Torreón', 'Querétaro', 'San Luis Potosí', 'Mérida', 'Aguascalientes', 'Cuernavaca', 'Chihuahua', 'Saltillo', 'Hermosillo', 'Morelia', 'Culiacán', 'Tampico', 'Acapulco', 'Durango', 'Tlaxcala', 'Campeche', 'Colima', 'Zacatecas'],
    'AR': ['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'La Plata', 'San Miguel de Tucumán', 'Mar del Plata', 'Salta', 'Santa Fe', 'San Juan', 'Resistencia', 'Santiago del Estero', 'Corrientes', 'Posadas', 'Neuquén', 'Formosa', 'La Rioja', 'Catamarca', 'San Luis', 'Tierra del Fuego', 'Chubut', 'Río Negro', 'Chaco', 'Entre Ríos', 'Misiones', 'Jujuy']
  };
  
  return majorCities[countryCode.toUpperCase()] || [];
};

const TripPlannerForm = () => {
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    sourceCountry: "",
    sourceCity: "",
    destinationCountry: "",
    destinationCity: "",
    startDate: "",
    endDate: "",
    days: 0,
    style: "moderate",
    pace: "moderate",
    tripPreferences: []
  });

  // UI states
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("locations");
  
  // API data states
  const [countries, setCountries] = useState([]);
  const [sourceCities, setSourceCities] = useState([]);
  const [destinationCities, setDestinationCities] = useState([]);
  
  // Loading states
  const [loading, setLoading] = useState({
    countries: false,
    sourceCities: false,
    destinationCities: false
  });

  // Fetch countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      setLoading(prev => ({ ...prev, countries: true }));
      try {
        // Using the REST Countries API
        const response = await axios.get('https://restcountries.com/v3.1/all?fields=name,cca2,flags');
        
        // Filter countries to only include those that have cities data
        const availableCountries = response.data
          .filter(country => citiesData[country.cca2])
          .map(country => ({
            name: country.name.common,
            code: country.cca2,
            flag: country.flags.svg
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        
        setCountries(availableCountries);
      } catch (error) {
        console.error("Failed to fetch countries:", error);
        // Fallback to static data if API fails - only include countries with cities data
        const staticCountries = filteredFallbackDestinations
          .map(dest => ({
            name: dest.country,
            code: dest.code,
            flag: null
          }));
        setCountries(staticCountries);
      } finally {
        setLoading(prev => ({ ...prev, countries: false }));
      }
    };

    fetchCountries();
  }, []);

  // Fetch cities when countries are selected
  useEffect(() => {
    const fetchCities = async (countryCode, type) => {
      if (!countryCode) return;
      
      setLoading(prev => ({ 
        ...prev, 
        [type === 'source' ? 'sourceCities' : 'destinationCities']: true 
      }));
      
      try {
        let cityList = [];
        const fallbackCountry = filteredFallbackDestinations.find(dest => dest.code === countryCode.toUpperCase());
        const countryName = fallbackCountry?.country || (countries.find(c => c.code === countryCode)?.name);
        
        if (type === 'source') {
          // Use comprehensive cities data for source cities
          if (countryCode && citiesData[countryCode.toUpperCase()]) {
            cityList = citiesData[countryCode.toUpperCase()];
          } else {
            // Fallback to API if not in our data
            try {
              const citiesResponse = await fetch(`https://api.api-ninjas.com/v1/city?country=${countryCode}&limit=50`, {
                method: 'GET',
                headers: {
                  'X-Api-Key': '', // Free tier - no key needed for limited requests
                  'Content-Type': 'application/json'
                }
              });
              
              if (citiesResponse.ok) {
                const apiCitiesData = await citiesResponse.json();
                if (Array.isArray(apiCitiesData) && apiCitiesData.length > 0) {
                  cityList = apiCitiesData.map(city => city.name);
                }
              }
              
              // If no cities from API, try another alternative
              if (!cityList || cityList.length === 0) {
                // Try using a different approach with country name
                const countryResponse = await fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`);
                if (countryResponse.ok) {
                  const countryData = await countryResponse.json();
                  if (countryData[0] && countryData[0].name) {
                    // Use the original API with country name
                    const originalResponse = await fetch(`https://countriesnow.space/api/v0.1/countries/cities`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ country: countryData[0].name.common })
                    });
                    
                    if (originalResponse.ok) {
                      const originalData = await originalResponse.json();
                      if (originalData && originalData.data && Array.isArray(originalData.data)) {
                        cityList = originalData.data; // Use all cities without limiting
                      }
                    }
                  }
                }
              }
              
              // If still no cities, use our curated list
              if (!cityList || cityList.length === 0) {
                const majorCities = getMajorCitiesByCountry(countryCode);
                if (majorCities.length > 0) {
                  cityList = majorCities; // Use all curated cities
                }
              }
              
            } catch (apiError) {
              console.log('Cities API failed, using curated list...');
              
              // Fallback to our curated list
              const majorCities = getMajorCitiesByCountry(countryCode);
              if (majorCities.length > 0) {
                cityList = majorCities; // Use all curated cities
              }
            }
          }
        } else if (MAIN_DEST_CODES.includes(countryCode.toUpperCase())) {
          // Use specific destination cities for the main destination countries
          cityList = getDestinationCitiesByCountry(countryCode);
        } else if (citiesData[countryCode.toUpperCase()]) {
          // Use comprehensive cities data for destination cities
          cityList = citiesData[countryCode.toUpperCase()];
        }
        
        // Fallback if no cities found
        if (!cityList || cityList.length === 0) {
          cityList = ["Capital City", "Major City 1", "Major City 2", "Tourist City", "Business Hub"];
        }
        
        if (type === 'source') {
          setSourceCities(cityList);
        } else {
          setDestinationCities(cityList);
        }
      } catch (error) {
        console.error(`Failed to fetch ${type} cities:`, error);
        const defaultCities = ["Capital City", "Major City", "Tourist Destination"];
        if (type === 'source') {
          setSourceCities(defaultCities);
        } else {
          setDestinationCities(defaultCities);
        }
      } finally {
        setLoading(prev => ({ 
          ...prev, 
          [type === 'source' ? 'sourceCities' : 'destinationCities']: false 
        }));
      }
    };

    if (formData.sourceCountry) {
      fetchCities(formData.sourceCountry, 'source');
    }
    
    if (formData.destinationCountry) {
      fetchCities(formData.destinationCountry, 'destination');
    }
  }, [formData.sourceCountry, formData.destinationCountry]);

  const calculateDays = (start, end) => {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-calculate days when dates change
      if (field === 'startDate' || field === 'endDate') {
        updated.days = calculateDays(
          field === 'startDate' ? value : prev.startDate,
          field === 'endDate' ? value : prev.endDate
        );
      }
      
      // Clear destination city when country changes
      if (field === 'destinationCountry') {
        updated.destinationCity = "";
      }
      
      // Clear source city when source country changes
      if (field === 'sourceCountry') {
        updated.sourceCity = "";
      }
      
      return updated;
    });
    
    // Clear field-specific errors
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const togglePreference = (preference) => {
    setFormData(prev => ({
      ...prev,
      tripPreferences: prev.tripPreferences.includes(preference)
        ? prev.tripPreferences.filter(p => p !== preference)
        : [...prev.tripPreferences, preference]
    }));
  };

  const validateLocationsTab = () => {
    const newErrors = {};
    
    if (!formData.sourceCountry) newErrors.sourceCountry = "Source country is required";
    if (!formData.sourceCity) newErrors.sourceCity = "Source city is required";
    if (!formData.destinationCountry) newErrors.destinationCountry = "Destination country is required";
    if (!formData.destinationCity) newErrors.destinationCity = "Destination city is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateDatesTab = () => {
    const newErrors = {};
    
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    if (formData.startDate && formData.endDate && new Date(formData.endDate) <= new Date(formData.startDate)) {
      newErrors.endDate = "End date must be after start date";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePreferencesTab = () => {
    const newErrors = {};
    
    if (formData.tripPreferences.length === 0) {
      newErrors.tripPreferences = "Please select at least one preference";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = () => {
    return validateLocationsTab() && validateDatesTab() && validatePreferencesTab();
  };

  const handleTabChange = (nextTab) => {
    // Validate the current tab before allowing navigation
    let canProceed = false;
    
    if (activeTab === "locations" && nextTab === "dates") {
      canProceed = validateLocationsTab();
    } else if (activeTab === "dates" && nextTab === "preferences") {
      canProceed = validateDatesTab();
    } else if (activeTab === "dates" && nextTab === "locations") {
      canProceed = true; // Allow going back
    } else if (activeTab === "preferences" && nextTab === "dates") {
      canProceed = true; // Allow going back
    }
    
    if (canProceed) {
      setActiveTab(nextTab);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Find the country names from the codes
    const sourceCountryData = filteredFallbackDestinations.find(dest => dest.code === formData.sourceCountry.toUpperCase());
    const destinationCountryData = filteredFallbackDestinations.find(dest => dest.code === formData.destinationCountry.toUpperCase());
    
    // Prepare API payload
    const travelData = {
      sourceCountry: sourceCountryData?.country || formData.sourceCountry,
      sourceCity: formData.sourceCity,
      destinationCountry: destinationCountryData?.country || formData.destinationCountry,
      destinationCity: formData.destinationCity,
      startDate: formData.startDate,
      endDate: formData.endDate,
      days: formData.days,
      style: formData.style,
      pace: formData.pace,
      tripPreferences: formData.tripPreferences
    };
    
    try {
      const response = await tripService.getTravelInfo(travelData);
      
      if (response.data.success) {
        // Navigate to trip planner with the response data
        navigate('./result', {
          state: {
            tripDetails: response.data.data.tripDetails,
            tripPlan: response.data.data.tripPlan,
            destination: response.data.data.destination,
            visaRequirements: response.data.data.visaRequirements,
            currencyInfo: response.data.data.currencyInfo,
            electricalInfo: response.data.data.electricalInfo,
            packingList: response.data.data.packingList,
            startDate: formData.startDate,
            endDate: formData.endDate,
            tripStyle: formData.style,
          }
        });
      } else {
        throw new Error('Failed to generate trip plan');
      }
    } catch (error) {
      console.error("Error generating trip:", error);
      alert("Error generating trip. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 mt-16">
      {/* Header */}
      <div className="flex items-center justify-center pt-8 pb-6">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-2xl shadow-lg transform -rotate-6 mr-4">
          <PlaneTakeoff className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
          ALR7LA Trip Planner
        </h1>
      </div>
      
      <div className="text-center mb-6">
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Customize your perfect trip with AI-powered recommendations tailored to your preferences
        </p>
      </div>

      {/* Main form card */}
      <div className="max-w-5xl mx-auto bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-indigo-100/50 overflow-hidden mb-10">
        {/* Tabs navigation */}
        <div className="flex bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
          <button
            type="button"
            onClick={() => handleTabChange("locations")}
            className={`flex-1 py-4 px-4 flex items-center justify-center gap-2 transition-all ${
              activeTab === "locations" 
                ? "bg-white/20 font-medium" 
                : "hover:bg-white/10"
            }`}
          >
            <MapPin className="w-5 h-5" />
            <span>Locations</span>
          </button>
          
          <button
            type="button"
            onClick={() => handleTabChange("dates")}
            className={`flex-1 py-4 px-4 flex items-center justify-center gap-2 transition-all ${
              activeTab === "dates" 
                ? "bg-white/20 font-medium" 
                : "hover:bg-white/10"
            }`}
          >
            <CalendarDays className="w-5 h-5" />
            <span>Dates</span>
          </button>
          
          <button
            type="button"
            onClick={() => handleTabChange("preferences")}
            className={`flex-1 py-4 px-4 flex items-center justify-center gap-2 transition-all ${
              activeTab === "preferences" 
                ? "bg-white/20 font-medium" 
                : "hover:bg-white/10"
            }`}
          >
            <Heart className="w-5 h-5" />
            <span>Preferences</span>
          </button>
        </div>
        
        {/* Form content */}
        <form onSubmit={handleSubmit} className="p-8">
          {/* Locations tab */}
          {activeTab === "locations" && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                  <MapPin className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Where are you traveling?</h2>
              </div>
              
              {/* Source Location */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Flag className="w-4 h-4 mr-2 text-indigo-500" />
                    From Country
                  </label>
                  <div className="relative">
                    {loading.countries ? (
                      <div className="flex items-center justify-center h-11 border rounded-lg border-gray-300 bg-gray-50">
                        <RefreshCw className="h-5 w-5 text-indigo-500 animate-spin" />
                        <span className="ml-2 text-gray-500">Loading countries...</span>
                      </div>
                    ) : (
                      <Select value={formData.sourceCountry} onValueChange={val => handleInputChange('sourceCountry', val)}>
                        <SelectTrigger className="w-full h-11 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white">
                          <SelectValue placeholder="Select source country" />
                        </SelectTrigger>
                        <SelectContent className="bg-white max-h-60 overflow-y-auto">
                          {countries.filter(country => country.name.toLowerCase() !== 'israel').map(country => (
                            <SelectItem key={country.code} value={country.code}>
                              {country.flag && (
                                <img src={country.flag} alt={country.name + ' flag'} style={{ width: 20, display: 'inline', verticalAlign: 'middle', marginRight: 8 }} />
                              )}
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    {errors.sourceCountry && <p className="text-red-500 text-sm mt-1">{errors.sourceCountry}</p>}
                  </div>
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 mr-2 text-indigo-500" />
                    From City
                  </label>
                  <div className="relative">
                    {loading.sourceCities ? (
                      <div className="flex items-center justify-center h-11 border rounded-lg border-gray-300 bg-gray-50">
                        <RefreshCw className="h-5 w-5 text-indigo-500 animate-spin" />
                        <span className="ml-2 text-gray-500">Loading cities...</span>
                      </div>
                    ) : (
                      <Select
                        value={formData.sourceCity}
                        onValueChange={val => handleInputChange('sourceCity', val)}
                        disabled={!formData.sourceCountry}
                      >
                        <SelectTrigger className={`w-full h-11 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white ${!formData.sourceCountry ? 'bg-gray-100 cursor-not-allowed' : ''}`}>
                          <SelectValue placeholder="Select your city" />
                        </SelectTrigger>
                        <SelectContent className="bg-white max-h-60 overflow-y-auto">
                          {sourceCities.map(city => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    {errors.sourceCity && <p className="text-red-500 text-sm mt-1">{errors.sourceCity}</p>}
                  </div>
                </div>
              </div>

              {/* Destination */}
              <div className="grid md:grid-cols-2 gap-6 mt-8">
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Flag className="w-4 h-4 mr-2 text-indigo-500" />
                    Destination Country
                  </label>
                  <div className="relative">
                    {loading.countries ? (
                      <div className="flex items-center justify-center h-11 border rounded-lg border-gray-300 bg-gray-50">
                        <RefreshCw className="h-5 w-5 text-indigo-500 animate-spin" />
                        <span className="ml-2 text-gray-500">Loading countries...</span>
                      </div>
                    ) : (
                      <Select value={formData.destinationCountry} onValueChange={val => handleInputChange('destinationCountry', val)}>
                        <SelectTrigger className="w-full h-11 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white">
                          <SelectValue placeholder="Select destination country" />
                        </SelectTrigger>
                        <SelectContent className="bg-white max-h-60 overflow-y-auto">
                          {countries.filter(country => DESTINATION_CODES.includes(country.code) && citiesData[country.code] && country.name.toLowerCase() !== 'israel').map(country => (
                            <SelectItem key={country.code} value={country.code}>
                              {country.flag && (
                                <img src={country.flag} alt={country.name + ' flag'} style={{ width: 20, display: 'inline', verticalAlign: 'middle', marginRight: 8 }} />
                              )}
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    {errors.destinationCountry && <p className="text-red-500 text-sm mt-1">{errors.destinationCountry}</p>}
                  </div>
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 mr-2 text-indigo-500" />
                    Destination City
                  </label>
                  <div className="relative">
                    {loading.destinationCities ? (
                      <div className="flex items-center justify-center h-11 border rounded-lg border-gray-300 bg-gray-50">
                        <RefreshCw className="h-5 w-5 text-indigo-500 animate-spin" />
                        <span className="ml-2 text-gray-500">Loading cities...</span>
                      </div>
                    ) : (
                      <Select
                        value={formData.destinationCity}
                        onValueChange={val => handleInputChange('destinationCity', val)}
                        disabled={!formData.destinationCountry}
                      >
                        <SelectTrigger className={`w-full h-11 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white ${!formData.destinationCountry ? 'bg-gray-100 cursor-not-allowed' : ''}`}>
                          <SelectValue placeholder="Select destination city" />
                        </SelectTrigger>
                        <SelectContent className="bg-white max-h-60 overflow-y-auto">
                          {destinationCities.map(city => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    {errors.destinationCity && <p className="text-red-500 text-sm mt-1">{errors.destinationCity}</p>}
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={() => handleTabChange("dates")}
                  className="px-5 py-2 bg-indigo-600 text-white rounded-lg flex items-center hover:bg-indigo-700 transition-colors"
                >
                  Next: Select Dates
                  <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Dates tab */}
          {activeTab === "dates" && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                  <CalendarDays className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">When are you traveling?</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <CalendarDays className="w-4 h-4 mr-2 text-indigo-500" />
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors.startDate ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <CalendarDays className="w-4 h-4 mr-2 text-indigo-500" />
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    min={formData.startDate || new Date().toISOString().split('T')[0]}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors.endDate ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
                </div>
              </div>

              <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 flex items-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                  <CalendarDays className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Trip Duration</h3>
                  <p className="text-2xl font-bold text-indigo-600">
                    {formData.days} {formData.days === 1 ? 'day' : 'days'}
                  </p>
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => handleTabChange("locations")}
                  className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg flex items-center hover:bg-gray-300 transition-colors"
                >
                  <ArrowRight className="mr-2 w-4 h-4 transform rotate-180" />
                  Back to Locations
                </button>
                
                <button
                  type="button"
                  onClick={() => handleTabChange("preferences")}
                  className="px-5 py-2 bg-indigo-600 text-white rounded-lg flex items-center hover:bg-indigo-700 transition-colors"
                >
                  Next: Set Preferences
                  <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Preferences tab */}
          {activeTab === "preferences" && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                  <Heart className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">What's your travel style?</h2>
              </div>
              
              {/* Travel Style */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                  <DollarSign className="w-4 h-4 mr-2 text-indigo-500" />
                  Budget Level
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {styles.map(style => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => handleInputChange('style', style)}
                      className={`p-3 rounded-lg transition-all ${
                        formData.style === style
                          ? 'bg-indigo-100 border-2 border-indigo-500 text-indigo-700 font-medium'
                          : 'bg-white border-2 border-gray-200 hover:border-indigo-200 hover:bg-indigo-50'
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        <DollarSign className={`w-6 h-6 ${formData.style === style ? 'text-indigo-600' : 'text-gray-500'}`} />
                        <span className="mt-1 capitalize">{style}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Pace Selection */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                  <Zap className="w-4 h-4 mr-2 text-indigo-500" />
                  Travel Pace
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {paces.map(pace => (
                    <button
                      key={pace}
                      type="button"
                      onClick={() => handleInputChange('pace', pace)}
                      className={`p-3 rounded-lg transition-all ${
                        formData.pace === pace
                          ? 'bg-indigo-100 border-2 border-indigo-500 text-indigo-700 font-medium'
                          : 'bg-white border-2 border-gray-200 hover:border-indigo-200 hover:bg-indigo-50'
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        <Zap className={`w-6 h-6 ${formData.pace === pace ? 'text-indigo-600' : 'text-gray-500'}`} />
                        <span className="mt-1 capitalize">{pace}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Trip Preferences */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                  <Sparkles className="w-4 h-4 mr-2 text-indigo-500" />
                  Trip Preferences (Select at least one)
                </label>
                
                {errors.tripPreferences && (
                  <p className="text-red-500 text-sm mb-2">{errors.tripPreferences}</p>
                )}
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {tripPreferences.map(preference => (
                    <button
                      key={preference}
                      type="button"
                      onClick={() => togglePreference(preference)}
                      className={`p-3 rounded-lg text-left transition-all ${
                        formData.tripPreferences.includes(preference)
                          ? 'bg-indigo-100 border-2 border-indigo-500 text-indigo-700 font-medium'
                          : 'bg-white border-2 border-gray-200 hover:border-indigo-200 hover:bg-indigo-50'
                      }`}
                    >
                      <span>{preference}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => handleTabChange("dates")}
                  className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg flex items-center hover:bg-gray-300 transition-colors"
                >
                  <ArrowRight className="mr-2 w-4 h-4 transform rotate-180" />
                  Back to Dates
                </button>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg flex items-center ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:from-indigo-700 hover:to-purple-700'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="animate-spin mr-2 w-4 h-4" />
                      Generating Trip...
                    </>
                  ) : (
                    <>
                      Generate Trip Plan
                      <Sparkles className="ml-2 w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default TripPlannerForm;