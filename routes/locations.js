const express = require('express');
const router = express.Router();
const moment = require('moment-timezone');

// Comprehensive location data - this would ideally come from a proper geo database
const locationData = [
  // Major Asian Cities
  {
    country: " Philippines",
    timezone: "Asia/Manila",
    asciiname: "Manila",
    admin1: " Metro Manila",
    tokens: ["Manila", " Metro Manila", " Philippines", "Maynila"],
    value: "Manila, Metro Manila, Philippines"
  },
  {
    country: " Philippines",
    timezone: "Asia/Manila",
    asciiname: "Quezon City",
    admin1: " Metro Manila", 
    tokens: ["Quezon City", " Metro Manila", " Philippines", "QC"],
    value: "Quezon City, Metro Manila, Philippines"
  },
  {
    country: " Philippines",
    timezone: "Asia/Manila",
    asciiname: "Cebu City",
    admin1: " Cebu",
    tokens: ["Cebu City", " Cebu", " Philippines", "Cebu"],
    value: "Cebu City, Cebu, Philippines"
  },
  {
    country: " Philippines",
    timezone: "Asia/Manila", 
    asciiname: "Davao",
    admin1: " Davao del Sur",
    tokens: ["Davao", " Davao del Sur", " Philippines", "Davao City"],
    value: "Davao, Davao del Sur, Philippines"
  },
  {
    country: " Japan",
    timezone: "Asia/Tokyo",
    asciiname: "Tokyo",
    admin1: " Tokyo",
    tokens: ["Tokyo", " Tokyo", " Japan", "東京"],
    value: "Tokyo, Tokyo, Japan"
  },
  {
    country: " Japan",
    timezone: "Asia/Tokyo",
    asciiname: "Osaka",
    admin1: " Osaka",
    tokens: ["Osaka", " Osaka", " Japan", "大阪"],
    value: "Osaka, Osaka, Japan"
  },
  {
    country: " China",
    timezone: "Asia/Shanghai",
    asciiname: "Shanghai",
    admin1: " Shanghai",
    tokens: ["Shanghai", " Shanghai", " China", "上海"],
    value: "Shanghai, Shanghai, China"
  },
  {
    country: " China",
    timezone: "Asia/Shanghai",
    asciiname: "Beijing",
    admin1: " Beijing",
    tokens: ["Beijing", " Beijing", " China", "北京", "Peking"],
    value: "Beijing, Beijing, China"
  },
  {
    country: " Thailand",
    timezone: "Asia/Bangkok",
    asciiname: "Bangkok",
    admin1: " Bangkok",
    tokens: ["Bangkok", " Bangkok", " Thailand", "กรุงเทพ"],
    value: "Bangkok, Bangkok, Thailand"
  },
  {
    country: " Singapore",
    timezone: "Asia/Singapore",
    asciiname: "Singapore",
    admin1: " Singapore",
    tokens: ["Singapore", " Singapore", " Singapore", "SG"],
    value: "Singapore, Singapore, Singapore"
  },
  {
    country: " Malaysia",
    timezone: "Asia/Kuala_Lumpur",
    asciiname: "Kuala Lumpur",
    admin1: " Federal Territory of Kuala Lumpur",
    tokens: ["Kuala Lumpur", " Federal Territory of Kuala Lumpur", " Malaysia", "KL"],
    value: "Kuala Lumpur, Federal Territory of Kuala Lumpur, Malaysia"
  },
  {
    country: " Indonesia",
    timezone: "Asia/Jakarta",
    asciiname: "Jakarta",
    admin1: " Jakarta",
    tokens: ["Jakarta", " Jakarta", " Indonesia", "DKI Jakarta"],
    value: "Jakarta, Jakarta, Indonesia"
  },
  {
    country: " Vietnam",
    timezone: "Asia/Ho_Chi_Minh",
    asciiname: "Ho Chi Minh City",
    admin1: " Ho Chi Minh",
    tokens: ["Ho Chi Minh City", " Ho Chi Minh", " Vietnam", "Saigon", "HCMC"],
    value: "Ho Chi Minh City, Ho Chi Minh, Vietnam"
  },
  {
    country: " South Korea",
    timezone: "Asia/Seoul",
    asciiname: "Seoul",
    admin1: " Seoul",
    tokens: ["Seoul", " Seoul", " South Korea", "서울"],
    value: "Seoul, Seoul, South Korea"
  },
  {
    country: " India",
    timezone: "Asia/Kolkata",
    asciiname: "Mumbai",
    admin1: " Maharashtra",
    tokens: ["Mumbai", " Maharashtra", " India", "Bombay"],
    value: "Mumbai, Maharashtra, India"
  },
  {
    country: " India",
    timezone: "Asia/Kolkata",
    asciiname: "Delhi",
    admin1: " Delhi",
    tokens: ["Delhi", " Delhi", " India", "New Delhi"],
    value: "Delhi, Delhi, India"
  },
  {
    country: " India",
    timezone: "Asia/Kolkata",
    asciiname: "Bangalore",
    admin1: " Karnataka",
    tokens: ["Bangalore", " Karnataka", " India", "Bengaluru"],
    value: "Bangalore, Karnataka, India"
  },
  
  // Major North American Cities
  {
    country: " United States",
    timezone: "America/New_York",
    asciiname: "New York City",
    admin1: " New York",
    tokens: ["New York City", " New York", " United States", "NYC", "New York"],
    value: "New York City, New York, United States"
  },
  {
    country: " United States",
    timezone: "America/Los_Angeles",
    asciiname: "Los Angeles",
    admin1: " California",
    tokens: ["Los Angeles", " California", " United States", "LA"],
    value: "Los Angeles, California, United States"
  },
  {
    country: " United States",
    timezone: "America/Chicago",
    asciiname: "Chicago",
    admin1: " Illinois",
    tokens: ["Chicago", " Illinois", " United States"],
    value: "Chicago, Illinois, United States"
  },
  {
    country: " United States",
    timezone: "America/Phoenix",
    asciiname: "Phoenix",
    admin1: " Arizona",
    tokens: ["Phoenix", " Arizona", " United States"],
    value: "Phoenix, Arizona, United States"
  },
  {
    country: " United States",
    timezone: "America/Denver",
    asciiname: "Denver",
    admin1: " Colorado",
    tokens: ["Denver", " Colorado", " United States"],
    value: "Denver, Colorado, United States"
  },
  {
    country: " Canada",
    timezone: "America/Toronto",
    asciiname: "Toronto",
    admin1: " Ontario",
    tokens: ["Toronto", " Ontario", " Canada"],
    value: "Toronto, Ontario, Canada"
  },
  {
    country: " Canada",
    timezone: "America/Vancouver",
    asciiname: "Vancouver",
    admin1: " British Columbia",
    tokens: ["Vancouver", " British Columbia", " Canada"],
    value: "Vancouver, British Columbia, Canada"
  },
  {
    country: " Mexico",
    timezone: "America/Mexico_City",
    asciiname: "Mexico City",
    admin1: " Federal District",
    tokens: ["Mexico City", " Federal District", " Mexico", "Ciudad de México"],
    value: "Mexico City, Federal District, Mexico"
  },
  
  // Major European Cities
  {
    country: " United Kingdom",
    timezone: "Europe/London",
    asciiname: "London",
    admin1: " England",
    tokens: ["London", " England", " United Kingdom", "UK"],
    value: "London, England, United Kingdom"
  },
  {
    country: " France",
    timezone: "Europe/Paris",
    asciiname: "Paris",
    admin1: " Île-de-France",
    tokens: ["Paris", " Île-de-France", " France"],
    value: "Paris, Île-de-France, France"
  },
  {
    country: " Germany",
    timezone: "Europe/Berlin",
    asciiname: "Berlin",
    admin1: " Berlin",
    tokens: ["Berlin", " Berlin", " Germany"],
    value: "Berlin, Berlin, Germany"
  },
  {
    country: " Spain",
    timezone: "Europe/Madrid",
    asciiname: "Madrid",
    admin1: " Madrid",
    tokens: ["Madrid", " Madrid", " Spain"],
    value: "Madrid, Madrid, Spain"
  },
  {
    country: " Italy",
    timezone: "Europe/Rome",
    asciiname: "Rome",
    admin1: " Lazio",
    tokens: ["Rome", " Lazio", " Italy", "Roma"],
    value: "Rome, Lazio, Italy"
  },
  {
    country: " Netherlands",
    timezone: "Europe/Amsterdam",
    asciiname: "Amsterdam",
    admin1: " North Holland",
    tokens: ["Amsterdam", " North Holland", " Netherlands"],
    value: "Amsterdam, North Holland, Netherlands"
  },
  
  // Major Australian Cities
  {
    country: " Australia",
    timezone: "Australia/Sydney",
    asciiname: "Sydney",
    admin1: " New South Wales",
    tokens: ["Sydney", " New South Wales", " Australia"],
    value: "Sydney, New South Wales, Australia"
  },
  {
    country: " Australia",
    timezone: "Australia/Melbourne",
    asciiname: "Melbourne",
    admin1: " Victoria",
    tokens: ["Melbourne", " Victoria", " Australia"],
    value: "Melbourne, Victoria, Australia"
  },
  {
    country: " Australia",
    timezone: "Australia/Brisbane",
    asciiname: "Brisbane",
    admin1: " Queensland",
    tokens: ["Brisbane", " Queensland", " Australia"],
    value: "Brisbane, Queensland, Australia"
  },
  
  // Major South American Cities
  {
    country: " Brazil",
    timezone: "America/Sao_Paulo",
    asciiname: "São Paulo",
    admin1: " São Paulo",
    tokens: ["São Paulo", " São Paulo", " Brazil", "Sao Paulo"],
    value: "São Paulo, São Paulo, Brazil"
  },
  {
    country: " Brazil",
    timezone: "America/Sao_Paulo",
    asciiname: "Rio de Janeiro",
    admin1: " Rio de Janeiro",
    tokens: ["Rio de Janeiro", " Rio de Janeiro", " Brazil", "Rio"],
    value: "Rio de Janeiro, Rio de Janeiro, Brazil"
  },
  {
    country: " Argentina",
    timezone: "America/Argentina/Buenos_Aires",
    asciiname: "Buenos Aires",
    admin1: " Buenos Aires",
    tokens: ["Buenos Aires", " Buenos Aires", " Argentina"],
    value: "Buenos Aires, Buenos Aires, Argentina"
  },
  
  // Major African Cities
  {
    country: " South Africa",
    timezone: "Africa/Johannesburg",
    asciiname: "Johannesburg",
    admin1: " Gauteng",
    tokens: ["Johannesburg", " Gauteng", " South Africa"],
    value: "Johannesburg, Gauteng, South Africa"
  },
  {
    country: " South Africa",
    timezone: "Africa/Johannesburg",
    asciiname: "Cape Town",
    admin1: " Western Cape",
    tokens: ["Cape Town", " Western Cape", " South Africa"],
    value: "Cape Town, Western Cape, South Africa"
  },
  {
    country: " Egypt",
    timezone: "Africa/Cairo",
    asciiname: "Cairo",
    admin1: " Cairo",
    tokens: ["Cairo", " Cairo", " Egypt"],
    value: "Cairo, Cairo, Egypt"
  },
  
  // Major Middle Eastern Cities
  {
    country: " United Arab Emirates",
    timezone: "Asia/Dubai",
    asciiname: "Dubai",
    admin1: " Dubai",
    tokens: ["Dubai", " Dubai", " United Arab Emirates", "UAE"],
    value: "Dubai, Dubai, United Arab Emirates"
  },
  {
    country: " Israel",
    timezone: "Asia/Jerusalem",
    asciiname: "Tel Aviv",
    admin1: " Tel Aviv",
    tokens: ["Tel Aviv", " Tel Aviv", " Israel"],
    value: "Tel Aviv, Tel Aviv, Israel"
  }
];

// Advanced search function with fuzzy matching
function searchLocations(query, limit = 20) {
  const searchTerm = query.toLowerCase().trim();
  
  if (!searchTerm || searchTerm.length < 2) {
    return [];
  }
  
  const results = [];
  
  locationData.forEach(location => {
    let score = 0;
    const locationText = `${location.asciiname} ${location.admin1} ${location.country}`.toLowerCase();
    
    // Exact match gets highest score
    if (location.asciiname.toLowerCase() === searchTerm) {
      score = 100;
    }
    // Starts with search term gets high score
    else if (location.asciiname.toLowerCase().startsWith(searchTerm)) {
      score = 90;
    }
    // Contains search term gets medium score
    else if (location.asciiname.toLowerCase().includes(searchTerm)) {
      score = 70;
    }
    // Check tokens for alternative names
    else if (location.tokens.some(token => token.toLowerCase().includes(searchTerm))) {
      score = 60;
    }
    // Check admin region
    else if (location.admin1.toLowerCase().includes(searchTerm)) {
      score = 50;
    }
    // Check country
    else if (location.country.toLowerCase().includes(searchTerm)) {
      score = 40;
    }
    // Fuzzy matching for common misspellings
    else if (calculateSimilarity(location.asciiname.toLowerCase(), searchTerm) > 0.7) {
      score = 30;
    }
    
    if (score > 0) {
      results.push({
        ...location,
        searchScore: score
      });
    }
  });
  
  // Sort by score (highest first) and return limited results
  return results
    .sort((a, b) => b.searchScore - a.searchScore)
    .slice(0, limit)
    .map(result => {
      const { searchScore, ...location } = result;
      return location;
    });
}

// Simple string similarity function (Dice coefficient)
function calculateSimilarity(str1, str2) {
  if (str1 === str2) return 1;
  if (str1.length < 2 || str2.length < 2) return 0;
  
  const bigrams1 = getBigrams(str1);
  const bigrams2 = getBigrams(str2);
  
  const intersection = bigrams1.filter(x => bigrams2.includes(x));
  return (2 * intersection.length) / (bigrams1.length + bigrams2.length);
}

function getBigrams(str) {
  const bigrams = [];
  for (let i = 0; i < str.length - 1; i++) {
    bigrams.push(str.substring(i, i + 2));
  }
  return bigrams;
}

// Timezone/Location lookup endpoint
router.get('/locations', (req, res) => {
  try {
    const query = req.query.query;
    
    if (!query) {
      return res.status(400).json({
        error: 'Missing query parameter',
        message: 'Please provide a query parameter with the city name',
        example: '/api/locations?query=Manila'
      });
    }

    if (query.length < 2) {
      return res.status(400).json({
        error: 'Query too short',
        message: 'Query must be at least 2 characters long'
      });
    }

    // Search locations with advanced matching
    const matchedLocations = searchLocations(query, 20);

    // Add timezone validation and current time
    const validatedResults = matchedLocations.map(location => {
      const isValidTimezone = moment.tz.zone(location.timezone);
      return {
        ...location,
        timezoneValid: !!isValidTimezone,
        currentTime: isValidTimezone ? moment().tz(location.timezone).format() : null
      };
    });

    // If no results found, provide helpful suggestions
    if (validatedResults.length === 0) {
      return res.json({
        results: [],
        suggestions: [
          'Try searching for major cities like: Manila, Tokyo, New York, London',
          'Check spelling of city names',
          'Try searching by country name',
          'Use common alternative names (e.g., "NYC" for New York City)'
        ],
        message: `No locations found for "${query}". Try a different search term.`
      });
    }

    res.json(validatedResults);
    
  } catch (error) {
    console.error('Error in locations endpoint:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to process location query'
    });
  }
});

module.exports = router;