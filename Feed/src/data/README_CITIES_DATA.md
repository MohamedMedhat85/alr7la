# Cities Data Documentation

## Overview
This file contains comprehensive city data for countries A-Z (alphabetically) to be used in the Trip Planner's "from city" dropdown. Each country has 10-15 major cities listed.

## Data Structure
The `citiesData` object uses ISO 2-letter country codes as keys and arrays of city names as values:

```javascript
const citiesData = {
  'AF': ['Kabul', 'Kandahar', 'Herat', ...], // Afghanistan
  'AL': ['Tirana', 'Durrës', 'Vlorë', ...], // Albania
  // ... more countries
};
```

## Countries Covered (A-Z)
- **A**: Afghanistan, Albania, Algeria, Andorra, Angola, Antigua and Barbuda, Argentina, Armenia, Australia, Austria, Azerbaijan
- **B**: Bahamas, Bahrain, Bangladesh, Barbados, Belarus, Belgium, Belize, Benin, Bhutan, Bolivia, Bosnia and Herzegovina, Botswana, Brazil
- **C**: Canada, Central African Republic, Chad, Chile, China, Colombia, Comoros, Congo (Brazzaville), Congo (Kinshasa), Costa Rica, Croatia, Cuba, Cyprus, Czech Republic, Côte d'Ivoire
- **D**: Denmark, Djibouti, Dominica
- **E**: Dominican Republic, Ecuador, Egypt, El Salvador, Equatorial Guinea, Eritrea, Estonia, Eswatini, Ethiopia
- **F**: Fiji, Finland, France
- **G**: Gabon, Greenland, Gambia, Georgia, Germany, Ghana, Greece, Grenada, Guatemala, Guinea, Guinea-Bissau, Guyana
- **H**: Haiti, Honduras, Hungary
- **I**: Iceland, India, Indonesia, Iran, Iraq, Ireland, Israel, Italy
- **J**: Jamaica, Japan
- **K**: Kazakhstan, Kenya, Kiribati, North Korea, South Korea, Kuwait, Kyrgyzstan
- **L**: Laos, Latvia, Lebanon, Lesotho, Liberia, Libya
- **M**: Madagascar, Malawi, Malaysia, Maldives, Mali, Malta, Marshall Islands, Mauritania, Mauritius, Mexico, Micronesia, Moldova, Monaco, Mongolia, Montenegro, Morocco, Mozambique
- **N**: Namibia, Nauru, Nepal, Netherlands, New Zealand, Nicaragua, Niger, Nigeria, Norway
- **O**: Oman
- **P**: Pakistan, Palau, Panama, Papua New Guinea, Paraguay, Peru, Philippines, Poland, Portugal
- **Q**: Qatar
- **R**: Romania, Russia, Rwanda
- **S**: Saudi Arabia, Solomon Islands, Seychelles, Sierra Leone, Singapore, Slovakia, Slovenia, Somalia, South Africa, Spain, Sri Lanka, Sudan, Suriname, Sweden, Switzerland, Syria
- **T**: Taiwan, Tajikistan, Tanzania, Thailand, Timor-Leste, Togo, Tonga, Trinidad and Tobago, Tunisia, Turkey, Turkmenistan
- **U**: Uganda, Ukraine, United Arab Emirates, United Kingdom, United States, Uruguay, Uzbekistan
- **V**: Vanuatu, Vatican City, Venezuela, Vietnam
- **Y**: Yemen
- **Z**: Zambia, Zimbabwe

## Usage in Trip Planner
The cities data is imported and used in `CustomizeTrip.jsx`:

1. **Source Cities**: When a user selects a source country, the dropdown is populated with cities from this data
2. **Destination Cities**: For countries not in the main destination list, this data provides fallback cities
3. **Fallback**: If a country is not in this data, the system falls back to API calls or hardcoded data

## Data Sources
- Real city names from official sources
- Major cities and capitals prioritized
- Tourist destinations included where relevant
- Population-based selection for larger countries

## Maintenance
To add more countries or update city lists:
1. Add new country codes and city arrays to the `citiesData` object
2. Ensure country codes follow ISO 3166-1 alpha-2 standard
3. Keep city names consistent and properly spelled
4. Maintain 10-15 cities per country for optimal dropdown performance

## Integration
The data is automatically used by the trip planner component when:
- A user selects a source country
- The country code exists in the citiesData object
- The dropdown needs to be populated with city options

## Country Filtering
The trip planner now automatically filters the country dropdowns to only show countries that have cities data available:
- **Source Country Dropdown**: Only shows countries that exist in the citiesData object
- **Destination Country Dropdown**: Only shows countries that exist in the citiesData object AND are in the DESTINATION_CODES list
- **Fallback**: If a country is not in our data, it won't appear in the dropdown

This ensures users can only select countries that have proper city data, providing a consistent and reliable experience. 