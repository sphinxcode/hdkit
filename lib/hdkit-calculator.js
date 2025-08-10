// SAGE Human Design Calculator - Swiss Ephemeris Implementation
// Based on hdkit by Jonah Dempcy with astronomical accuracy improvements

const swisseph = require('swisseph');
const moment = require('moment-timezone');

// Import the original hdkit components
const gateOrder = [41, 19, 13, 49, 30, 55, 37, 63, 22, 36, 25, 17, 21, 51, 42, 3, 27, 24, 2, 23, 8, 20, 16, 35, 45, 12, 15, 52, 39, 53, 62, 56, 31, 33, 7, 4, 29, 59, 40, 64, 47, 6, 46, 18, 48, 57, 32, 50, 28, 44, 1, 43, 14, 34, 9, 5, 26, 11, 10, 58, 38, 54, 61, 60];

const harmonicOrder = [31, 33, 7, 4, 29, 59, 40, 64, 47, 6, 46, 18, 48, 57, 32, 50, 28, 44, 1, 43, 14, 34, 9, 5, 26, 11, 10, 58, 38, 54, 61, 60, 41, 19, 13, 49, 30, 55, 37, 63, 22, 36, 25, 17, 21, 51, 42, 3, 27, 24, 2, 23, 8, 20, 16, 35, 45, 12, 15, 52, 39, 53, 62, 56];

// Human Design Types
const hdTypes = {
  MANIFESTOR: 'Manifestor',
  GENERATOR: 'Generator',
  MANIFESTING_GENERATOR: 'Manifesting Generator',
  PROJECTOR: 'Projector',
  REFLECTOR: 'Reflector'
};

// Centers mapping
const centers = {
  ROOT: 'Root center',
  SACRAL: 'Sacral center',
  SOLAR_PLEXUS: 'Solar Plexus center',
  SPLENIC: 'Splenic center',
  HEART: 'Heart center',
  G: 'G center',
  THROAT: 'Throat center',
  AJNA: 'Ajna center',
  HEAD: 'Head center'
};

// Channel definitions (gate pairs that form channels)
const channelDefinitions = {
  '1-8': 'Channel of Inspiration',
  '2-14': 'Channel of The Beat',
  '3-60': 'Channel of Mutation',
  '4-63': 'Channel of Logic',
  '5-15': 'Channel of Rhythm',
  '6-59': 'Channel of Mating',
  '7-31': 'Channel of The Alpha',
  '9-52': 'Channel of Concentration',
  '10-20': 'Channel of Awakening',
  '10-34': 'Channel of Exploration',
  '10-57': 'Channel of Perfected Form',
  '11-56': 'Channel of Curiosity',
  '12-22': 'Channel of Openness',
  '13-33': 'Channel of The Prodigal',
  '16-48': 'Channel of Wavelength',
  '17-62': 'Channel of Acceptance',
  '18-58': 'Channel of Judgment',
  '19-49': 'Channel of Synthesis',
  '20-34': 'Channel of Charisma',
  '20-57': 'Channel of The Brainwave',
  '21-45': 'Channel of Money',
  '23-43': 'Channel of Structuring',
  '24-61': 'Channel of Awareness',
  '25-51': 'Channel of Initiation',
  '26-44': 'Channel of Surrender',
  '27-50': 'Channel of Preservation',
  '28-38': 'Channel of Struggle',
  '29-46': 'Channel of Discovery',
  '30-41': 'Channel of Recognition',
  '32-54': 'Channel of Transformation',
  '34-57': 'Channel of Power',
  '35-36': 'Channel of Transitoriness',
  '37-40': 'Channel of Community',
  '39-55': 'Channel of Emoting',
  '42-53': 'Channel of Maturation',
  '47-64': 'Channel of Abstraction'
};

class HDKitCalculator {
  constructor() {
    console.log('🌟 Initializing SAGE Human Design Calculator with Swiss Ephemeris...');
    
    // Use Swiss Ephemeris Moshier approximations (built-in, no external files needed)
    // This provides excellent accuracy for 1900-2100 without requiring 2GB+ files
    this.flag = swisseph.SEFLG_MOSEPH;
    this.HD_OFFSET_DEGREES = 58; // HD gates start at 2° Aquarius, offset from 0° Aries
    
    console.log('✅ Swiss Ephemeris initialized with built-in approximations (no external files)');
  }

  async calculateChart(params) {
    const { birthTime, timezone, latitude = 51.5074, longitude = -0.1278 } = params;
    
    try {
      console.log(`📅 Calculating HD chart for: ${birthTime} (${timezone})`);
      
      // Parse and convert to UTC
      const utcDate = moment.tz(birthTime, timezone).utc().toDate();
      
      // Calculate Julian Day
      const julianDay = await this.getJulianDay(utcDate);
      
      // Calculate planetary positions for Personality (birth time)
      const personalityPlanets = await this.calculateSwissEphemerisPositions(julianDay, 'Personality');
      
      // Calculate Design date (88° retrograde)
      const designJulianDay = await this.findDesignDate(julianDay, personalityPlanets.Sun.eclipticLongitude);
      const designPlanets = await this.calculateSwissEphemerisPositions(designJulianDay, 'Design');
      
      // Determine activations
      const gates = this.extractGates(personalityPlanets, designPlanets);
      const channels = this.calculateChannels(gates);
      const definedCenters = this.calculateDefinedCenters(channels);
      const openCenters = this.calculateOpenCenters(definedCenters);
      
      // Determine type and authority
      const type = this.determineType(definedCenters, channels);
      const authority = this.determineAuthority(definedCenters);
      const profile = this.calculateProfile(personalityPlanets.Sun, designPlanets.Sun);
      const incarnationCross = this.calculateIncarnationCross(personalityPlanets, designPlanets);
      
      console.log(`Generated ${type} with ${authority} authority, profile ${profile}`);
      
      return {
        properties: {
          Type: {
            Name: 'Type',
            Id: type,
            Option: type,
            Description: '',
            Link: ''
          },
          Strategy: {
            Name: 'Strategy',
            Id: this.getStrategy(type),
            Option: this.getStrategy(type),
            Description: '',
            Link: ''
          },
          InnerAuthority: {
            Name: 'Inner Authority',
            Id: authority,
            Option: authority,
            Description: '',
            Link: ''
          },
          Definition: {
            Name: 'Definition',
            Id: this.calculateDefinition(definedCenters, channels),
            Option: this.calculateDefinition(definedCenters, channels),
            Description: '',
            Link: ''
          },
          Profile: {
            Name: 'Profile',
            Id: profile,
            Option: profile,
            Description: '',
            Link: ''
          },
          IncarnationCross: {
            Name: 'Incarnation Cross',
            Id: incarnationCross,
            Option: incarnationCross,
            Description: '',
            Link: ''
          },
          Signature: {
            Name: 'Signature',
            Id: this.getSignature(type),
            Option: this.getSignature(type),
            Description: '',
            Link: ''
          },
          NotSelfTheme: {
            Name: 'Not Self Theme',
            Id: this.getNotSelfTheme(type),
            Option: this.getNotSelfTheme(type),
            Description: '',
            Link: ''
          },
          Gates: {
            Name: 'Gates',
            Id: 'Gates',
            List: gates.map(gate => ({ Option: gate, Description: '', Link: '' }))
          },
          Channels: {
            Name: 'Channels',
            Id: 'Channels',
            List: channels.map(channel => ({ Option: channel, Description: '', Link: '' }))
          }
        },
        personality: personalityPlanets,
        design: designPlanets,
        unconsciousCenters: [],
        consciousCenters: [],
        definedCenters: definedCenters,
        openCenters: openCenters,
        channels: channels,
        gates: gates,
        planets: this.getPlanetList(),
        variables: this.calculateVariables(personalityPlanets, designPlanets),
        tooltips: this.generateTooltips()
      };
      
    } catch (error) {
      console.error('Error in calculateChart:', error);
      throw new Error(`Failed to calculate chart: ${error.message}`);
    }
  }

  /**
   * Convert date to Julian Day using Swiss Ephemeris
   */
  async getJulianDay(date) {
    return new Promise((resolve, reject) => {
      swisseph.swe_julday(
        date.getUTCFullYear(),
        date.getUTCMonth() + 1, // Swiss Eph months are 1-indexed
        date.getUTCDate(),
        date.getUTCHours() + (date.getUTCMinutes() / 60),
        swisseph.SE_GREG_CAL,
        (julianDay) => {
          if (julianDay) {
            resolve(julianDay);
          } else {
            reject(new Error('Failed to calculate Julian Day'));
          }
        }
      );
    });
  }

  /**
   * Calculate planetary positions using Swiss Ephemeris
   */
  async calculateSwissEphemerisPositions(julianDay, side = 'Personality') {
    const planets = {
      Sun: swisseph.SE_SUN,
      Moon: swisseph.SE_MOON,
      Mercury: swisseph.SE_MERCURY,
      Venus: swisseph.SE_VENUS,
      Mars: swisseph.SE_MARS,
      Jupiter: swisseph.SE_JUPITER,
      Saturn: swisseph.SE_SATURN,
      Uranus: swisseph.SE_URANUS,
      Neptune: swisseph.SE_NEPTUNE,
      Pluto: swisseph.SE_PLUTO,
      'North Node': swisseph.SE_TRUE_NODE
    };

    const results = {};

    for (const [planetName, planetId] of Object.entries(planets)) {
      try {
        const position = await this.getPlanetPosition(julianDay, planetId);
        results[planetName] = this.createSwissEphPlanetData(position.longitude, planetName);

        // Calculate Earth as opposite to Sun
        if (planetName === 'Sun') {
          const earthLongitude = (position.longitude + 180) % 360;
          results.Earth = this.createSwissEphPlanetData(earthLongitude, 'Earth');
        }

        // Calculate South Node as opposite to North Node
        if (planetName === 'North Node') {
          const southNodeLongitude = (position.longitude + 180) % 360;
          results['South Node'] = this.createSwissEphPlanetData(southNodeLongitude, 'South Node');
        }

      } catch (error) {
        console.error(`❌ Failed to calculate ${planetName}:`, error);
        // Use fallback calculation for this planet
        results[planetName] = this.calculateFallbackPlanet(planetName, moment.unix(julianDay * 86400));
      }
    }

    return results;
  }

  /**
   * Get position of a single planet using Swiss Ephemeris
   */
  async getPlanetPosition(julianDay, planetId) {
    return new Promise((resolve, reject) => {
      try {
        swisseph.swe_calc(julianDay, planetId, this.flag, (result) => {
          if (result.error) {
            reject(new Error(result.error));
          } else {
            resolve({
              longitude: result.longitude,
              latitude: result.latitude,
              distance: result.distance,
              speed: result.longitudeSpeed || 0
            });
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Find Design date by calculating 88° retrograde from Sun position
   */
  async findDesignDate(personalityJulianDay, sunLongitude) {
    console.log(`🔍 Finding Design date for Sun at ${sunLongitude}°`);
    
    // Calculate target Design longitude (88° retrograde from Personality Sun)
    let targetLongitude = sunLongitude - 88;
    if (targetLongitude < 0) targetLongitude += 360;
    
    console.log(`🎯 Target Design Sun longitude: ${targetLongitude}°`);
    
    // Start search approximately 85-95 days before birth (wider window)
    let searchJulianDay = personalityJulianDay - 95;
    let bestMatch = null;
    let bestDifference = 999;
    
    // Search in 0.05 day increments over a 20-day window (more precise)
    for (let i = 0; i < 400; i++) {
      try {
        const currentJulianDay = searchJulianDay + (i * 0.05);
        const sunPosition = await this.getPlanetPosition(currentJulianDay, swisseph.SE_SUN);
        
        // Calculate difference from target longitude
        let difference = Math.abs(targetLongitude - sunPosition.longitude);
        if (difference > 180) difference = 360 - difference;
        
        // Track the best match
        if (difference < bestDifference) {
          bestDifference = difference;
          bestMatch = currentJulianDay;
        }
        
        // If we're very close, return immediately
        if (difference < 0.05) {
          console.log(`✅ Precise Design date found at Julian Day ${currentJulianDay} (difference: ${difference.toFixed(3)}°)`);
          return currentJulianDay;
        }
        
      } catch (error) {
        console.error(`❌ Error at Julian Day ${searchJulianDay + (i * 0.05)}:`, error);
        continue;
      }
    }
    
    if (bestMatch) {
      console.log(`✅ Best Design date found at Julian Day ${bestMatch} (difference: ${bestDifference.toFixed(3)}°)`);
      return bestMatch;
    }
    
    console.warn('⚠️ Using fallback Design date calculation');
    return personalityJulianDay - 88.5;
  }

  /**
   * Create planet data using Swiss Ephemeris longitude
   */
  createSwissEphPlanetData(longitude, planetName) {
    return {
      Gate: this.eclipticToGate(longitude),
      Line: this.calculateLine(longitude),
      Color: this.calculateColor(longitude),
      Tone: this.calculateTone(longitude),
      Base: this.calculateBase(longitude),
      FixingState: 'None',
      eclipticLongitude: longitude // Store for debugging
    };
  }

  async calculateRealPlanetaryPositions(moment, latitude, longitude) {
    try {
      // Convert moment to Date object for astronomy-engine
      const date = moment.toDate();
      
      console.log(`Calculating planetary positions for ${date.toISOString()}`);
      
      const positions = {};
      
      // Calculate positions for each planet using astronomy-engine
      try {
        const sunPosition = Astronomy.EclipticLongitude('Sun', date);
        positions.Sun = this.createPlanetData(sunPosition, date);
        positions.Earth = this.createPlanetData((sunPosition + 180) % 360, date);
      } catch (e) {
        console.warn('Sun calculation failed, using fallback');
        positions.Sun = this.calculateFallbackSun(moment);
        positions.Earth = this.createPlanetData((positions.Sun.eclipticLongitude + 180) % 360, date);
      }
      
      try {
        const moonPosition = Astronomy.EclipticLongitude('Moon', date);
        positions.Moon = this.createPlanetData(moonPosition, date);
      } catch (e) {
        console.warn('Moon calculation failed, using fallback');
        positions.Moon = this.calculateFallbackMoon(moment);
      }
      
      // Calculate other planets with fallbacks
      const planets = ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
      
      planets.forEach(planetName => {
        try {
          const planetPosition = Astronomy.EclipticLongitude(planetName, date);
          positions[planetName] = this.createPlanetData(planetPosition, date);
        } catch (e) {
          console.warn(`${planetName} calculation failed, using fallback`);
          positions[planetName] = this.calculateFallbackPlanet(planetName, moment);
        }
      });
      
      // Calculate Lunar Nodes (these might not be available in astronomy-engine)
      try {
        positions['North Node'] = this.calculateLunarNode(moment, true);
        positions['South Node'] = this.calculateLunarNode(moment, false);
      } catch (e) {
        console.warn('Lunar nodes calculation failed, using fallback');
        positions['North Node'] = this.calculateFallbackNorthNode(moment);
        positions['South Node'] = this.calculateFallbackSouthNode(moment);
      }
      
      return positions;
      
    } catch (error) {
      console.error('Error in astronomical calculations, using sophisticated fallback:', error);
      return this.calculateFallbackPositions(moment, latitude, longitude);
    }
  }

  createPlanetData(eclipticLongitude, date) {
    const gate = this.eclipticToGate(eclipticLongitude);
    const line = this.calculateLine(eclipticLongitude);
    
    return {
      Gate: gate,
      Line: line,
      Color: this.calculateColor(eclipticLongitude),
      Tone: this.calculateTone(eclipticLongitude),
      Base: this.calculateBase(eclipticLongitude),
      FixingState: 'None',
      eclipticLongitude: eclipticLongitude // Store for debugging
    };
  }

  calculateFallbackPositions(moment, latitude, longitude) {
    console.log('Using sophisticated fallback planetary calculations');
    
    const birthDate = moment.toDate();
    const dayOfYear = moment.dayOfYear();
    const year = moment.year();
    const hour = moment.hour();
    const minute = moment.minute();
    const timeDecimal = hour + (minute / 60);
    
    return {
      Sun: this.calculateFallbackSun(moment),
      Earth: this.calculateFallbackEarth(moment),
      Moon: this.calculateFallbackMoon(moment),
      Mercury: this.calculateFallbackPlanet('Mercury', moment),
      Venus: this.calculateFallbackPlanet('Venus', moment),
      Mars: this.calculateFallbackPlanet('Mars', moment),
      Jupiter: this.calculateFallbackPlanet('Jupiter', moment),
      Saturn: this.calculateFallbackPlanet('Saturn', moment),
      Uranus: this.calculateFallbackPlanet('Uranus', moment),
      Neptune: this.calculateFallbackPlanet('Neptune', moment),
      Pluto: this.calculateFallbackPlanet('Pluto', moment),
      'North Node': this.calculateFallbackNorthNode(moment),
      'South Node': this.calculateFallbackSouthNode(moment)
    };
  }

  calculateFallbackSun(moment) {
    const dayOfYear = moment.dayOfYear();
    const eclipticLongitude = ((dayOfYear - 80) * 360 / 365.25) % 360; // March 21 = 0 degrees
    return this.createPlanetData(eclipticLongitude < 0 ? eclipticLongitude + 360 : eclipticLongitude, moment.toDate());
  }

  calculateFallbackEarth(moment) {
    const sunData = this.calculateFallbackSun(moment);
    const earthLongitude = (sunData.eclipticLongitude + 180) % 360;
    return this.createPlanetData(earthLongitude, moment.toDate());
  }

  calculateFallbackMoon(moment) {
    const dayOfYear = moment.dayOfYear();
    const timeDecimal = moment.hour() + (moment.minute() / 60);
    // Moon moves ~13 degrees per day
    const moonLongitude = ((dayOfYear + timeDecimal / 24) * 13.2) % 360;
    return this.createPlanetData(moonLongitude, moment.toDate());
  }

  calculateFallbackPlanet(planetName, moment) {
    const year = moment.year();
    const dayOfYear = moment.dayOfYear();
    
    // Orbital periods in Earth years
    const orbitalPeriods = {
      Mercury: 0.24,
      Venus: 0.62,
      Mars: 1.88,
      Jupiter: 11.86,
      Saturn: 29.46,
      Uranus: 84.01,
      Neptune: 164.8,
      Pluto: 248.1
    };
    
    const period = orbitalPeriods[planetName] || 1;
    const totalDays = (year - 2000) * 365.25 + dayOfYear;
    const planetLongitude = (totalDays * 360 / (period * 365.25)) % 360;
    
    return this.createPlanetData(planetLongitude, moment.toDate());
  }

  calculateFallbackNorthNode(moment) {
    const year = moment.year();
    const dayOfYear = moment.dayOfYear();
    // Lunar nodes have an 18.6-year retrograde cycle
    const totalDays = (year - 2000) * 365.25 + dayOfYear;
    const nodeLongitude = (360 - (totalDays * 360 / (18.6 * 365.25))) % 360;
    return this.createPlanetData(nodeLongitude, moment.toDate());
  }

  calculateFallbackSouthNode(moment) {
    const northNode = this.calculateFallbackNorthNode(moment);
    const southLongitude = (northNode.eclipticLongitude + 180) % 360;
    return this.createPlanetData(southLongitude, moment.toDate());
  }

  calculateLunarNode(moment, isNorth) {
    // Simplified lunar node calculation
    const year = moment.year();
    const dayOfYear = moment.dayOfYear();
    const totalDays = (year - 2000) * 365.25 + dayOfYear;
    const baseLongitude = (360 - (totalDays * 360 / (18.6 * 365.25))) % 360;
    const longitude = isNorth ? baseLongitude : (baseLongitude + 180) % 360;
    return this.createPlanetData(longitude, moment.toDate());
  }

  // Convert ecliptic longitude to Human Design gate
  eclipticToGate(eclipticLongitude) {
    // Normalize longitude to 0-360 range
    let normalizedLongitude = eclipticLongitude < 0 ? eclipticLongitude + 360 : eclipticLongitude;
    normalizedLongitude = normalizedLongitude % 360;
    
    // Apply HD offset: 58° from 0° Aries to 2° Aquarius where Gate 41 starts
    let adjustedLongitude = (normalizedLongitude + this.HD_OFFSET_DEGREES) % 360;
    
    // Each gate is 5.625 degrees (360 / 64)
    const gateIndex = Math.floor(adjustedLongitude / 5.625);
    
    return gateOrder[gateIndex % 64];
  }

  calculateLine(eclipticLongitude) {
    // Apply HD offset first
    let adjustedLongitude = (eclipticLongitude + this.HD_OFFSET_DEGREES) % 360;
    const percentageThrough = adjustedLongitude / 360;
    const exactLine = 384 * percentageThrough; // 64 gates × 6 lines = 384
    return Math.floor((exactLine % 6) + 1);
  }

  calculateColor(eclipticLongitude) {
    // Apply HD offset first
    let adjustedLongitude = (eclipticLongitude + this.HD_OFFSET_DEGREES) % 360;
    const percentageThrough = adjustedLongitude / 360;
    const exactColor = 2304 * percentageThrough; // 384 lines × 6 colors = 2304
    return Math.floor((exactColor % 6) + 1);
  }

  calculateTone(eclipticLongitude) {
    // Apply HD offset first
    let adjustedLongitude = (eclipticLongitude + this.HD_OFFSET_DEGREES) % 360;
    const percentageThrough = adjustedLongitude / 360;
    const exactTone = 13824 * percentageThrough; // 2304 colors × 6 tones = 13824
    return Math.floor((exactTone % 6) + 1);
  }

  calculateBase(eclipticLongitude) {
    // Apply HD offset first
    let adjustedLongitude = (eclipticLongitude + this.HD_OFFSET_DEGREES) % 360;
    const percentageThrough = adjustedLongitude / 360;
    const exactBase = 69120 * percentageThrough; // 13824 tones × 5 bases = 69120
    return Math.floor((exactBase % 5) + 1);
  }

  extractGates(personalityPlanets, designPlanets) {
    const gates = new Set();
    
    Object.values(personalityPlanets).forEach(planet => {
      gates.add(planet.Gate);
    });
    
    Object.values(designPlanets).forEach(planet => {
      gates.add(planet.Gate);
    });
    
    return Array.from(gates).sort((a, b) => a - b);
  }

  calculateChannels(gates) {
    const channels = [];
    const gateSet = new Set(gates);
    
    for (const [channelKey, channelName] of Object.entries(channelDefinitions)) {
      const [gate1, gate2] = channelKey.split('-').map(Number);
      if (gateSet.has(gate1) && gateSet.has(gate2)) {
        channels.push(channelKey);
      }
    }
    
    return channels;
  }

  calculateDefinedCenters(channels) {
    const definedCenters = new Set();
    
    // Map channels to centers
    const channelToCenters = {
      '1-8': ['G', 'Throat'],
      '2-14': ['G', 'Sacral'],
      '3-60': ['Root', 'Sacral'],
      '4-63': ['Ajna', 'Head'],
      '5-15': ['G', 'Sacral'],
      '6-59': ['Solar Plexus', 'Sacral'],
      '7-31': ['G', 'Throat'],
      '9-52': ['Root', 'Sacral'],
      '10-20': ['G', 'Throat'],
      '10-34': ['G', 'Sacral'],
      '10-57': ['G', 'Splenic'],
      '11-56': ['Ajna', 'Throat'],
      '12-22': ['Throat', 'Solar Plexus'],
      '13-33': ['G', 'Throat'],
      '16-48': ['Throat', 'Splenic'],
      '17-62': ['Ajna', 'Throat'],
      '18-58': ['Root', 'Splenic'],
      '19-49': ['Root', 'Solar Plexus'],
      '20-34': ['Throat', 'Sacral'],
      '20-57': ['Throat', 'Splenic'],
      '21-45': ['Heart', 'Throat'],
      '23-43': ['Ajna', 'Throat'],
      '24-61': ['Ajna', 'Head'],
      '25-51': ['G', 'Heart'],
      '26-44': ['Heart', 'Splenic'],
      '27-50': ['Sacral', 'Splenic'],
      '28-38': ['Root', 'Splenic'],
      '29-46': ['Sacral', 'G'],
      '30-41': ['Solar Plexus', 'Heart'],
      '32-54': ['Root', 'Splenic'],
      '34-57': ['Sacral', 'Splenic'],
      '35-36': ['Throat', 'Solar Plexus'],
      '37-40': ['Solar Plexus', 'Heart'],
      '39-55': ['Root', 'Solar Plexus'],
      '42-53': ['Root', 'Sacral'],
      '47-64': ['Ajna', 'Head']
    };
    
    channels.forEach(channel => {
      const centerPair = channelToCenters[channel];
      if (centerPair) {
        centerPair.forEach(center => {
          definedCenters.add(centers[center.toUpperCase().replace(' ', '_')] || center + ' center');
        });
      }
    });
    
    return Array.from(definedCenters);
  }

  calculateOpenCenters(definedCenters) {
    const allCenters = Object.values(centers);
    return allCenters.filter(center => !definedCenters.includes(center));
  }

  determineType(definedCenters, channels) {
    const hasSacral = definedCenters.includes(centers.SACRAL);
    const hasMotorToThroat = this.hasMotorToThroat(channels);
    
    // Reflector: No centers defined at all
    if (definedCenters.length === 0) {
      return hdTypes.REFLECTOR;
    }
    
    // Generator: Sacral defined, but no motor-to-throat connection
    if (hasSacral && !hasMotorToThroat) {
      return hdTypes.GENERATOR;
    }
    
    // Manifesting Generator: Sacral defined with motor-to-throat connection
    if (hasSacral && hasMotorToThroat) {
      return hdTypes.MANIFESTING_GENERATOR;
    }
    
    // Manifestor: No Sacral, but has motor-to-throat connection
    if (!hasSacral && hasMotorToThroat) {
      return hdTypes.MANIFESTOR;
    }
    
    // Projector: No Sacral, no motor-to-throat (can have other motor centers defined)
    if (!hasSacral && !hasMotorToThroat) {
      return hdTypes.PROJECTOR;
    }
    
    return hdTypes.PROJECTOR; // default fallback
  }

  hasMotorToThroat(channels) {
    const motorToThroatChannels = [
      '12-22', '35-36', // Solar Plexus to Throat  
      '21-45', '26-44', // Heart to Throat
      '20-34', '20-57', '10-20', '10-34', '10-57', // Sacral to Throat
      '58-18', // Root to Throat
      '37-40' // Solar Plexus to Throat
      // NOTE: '19-49' removed - both gates are Solar Plexus (internal channel)
    ];
    
    return channels.some(channel => motorToThroatChannels.includes(channel));
  }

  determineAuthority(definedCenters) {
    // Inner authorities (in order of priority)
    if (definedCenters.includes(centers.SOLAR_PLEXUS)) {
      return 'Emotional - Solar Plexus';
    }
    if (definedCenters.includes(centers.SACRAL)) {
      return 'Sacral';
    }
    if (definedCenters.includes(centers.SPLENIC)) {
      return 'Splenic';
    }
    if (definedCenters.includes(centers.HEART)) {
      return 'Heart';
    }
    if (definedCenters.includes(centers.G)) {
      return 'Self-Projected';
    }
    
    // For Projectors with no inner authority centers, but with Throat/Ajna
    // Check if only mental centers (Throat, Ajna, Head) are defined
    const innerAuthorityCenters = [centers.SOLAR_PLEXUS, centers.SACRAL, centers.SPLENIC, centers.HEART, centers.G];
    const hasInnerAuthority = innerAuthorityCenters.some(center => definedCenters.includes(center));
    
    if (!hasInnerAuthority) {
      return 'Outer';
    }
    
    // Fallback authorities  
    if (definedCenters.includes(centers.THROAT)) {
      return 'Throat';
    }
    if (definedCenters.includes(centers.AJNA)) {
      return 'Mental';
    }
    return 'Lunar';
  }

  calculateProfile(personalitySun, designSun) {
    const personalityLine = personalitySun.Line;
    const designLine = designSun.Line;
    return `${personalityLine}/${designLine}`;
  }

  calculateIncarnationCross(personalityPlanets, designPlanets) {
    const pSun = personalityPlanets.Sun.Gate;
    const pEarth = personalityPlanets.Earth.Gate;
    const dSun = designPlanets.Sun.Gate;
    const dEarth = designPlanets.Earth.Gate;
    
    // Determine cross type based on profile
    const profile = this.calculateProfile(personalityPlanets.Sun, designPlanets.Sun);
    const [personalityLine] = profile.split('/');
    
    let crossType;
    if (personalityLine <= 3) {
      crossType = 'Right Angle Cross';
    } else if (personalityLine <= 5) {
      crossType = 'Juxtaposition Cross';
    } else {
      crossType = 'Left Angle Cross';
    }
    
    return `${crossType} of ${this.getCrossName(pSun)} (${pSun}/${pEarth} | ${dSun}/${dEarth})`;
  }

  getCrossName(sunGate) {
    // Simplified cross names - in production, use full cross database
    const crossNames = {
      1: 'Self-Expression', 2: 'Direction', 3: 'Ordering', 4: 'Formulas',
      5: 'Habits', 6: 'Conflict', 7: 'Interaction', 8: 'Contribution',
      9: 'Focus', 10: 'Behavior', 11: 'Ideas', 12: 'Caution',
      13: 'Listener', 14: 'Power Skills', 15: 'Extremes', 16: 'Skills',
      17: 'Opinions', 18: 'Correction', 19: 'Wants', 20: 'Now',
      21: 'Control', 22: 'Grace', 23: 'Assimilation', 24: 'Return',
      25: 'Innocence', 26: 'Trickster', 27: 'Caring', 28: 'Struggle',
      29: 'Commitment', 30: 'Recognition', 31: 'Influence', 32: 'Duration',
      33: 'Privacy', 34: 'Power', 35: 'Change', 36: 'Crisis',
      37: 'Friendship', 38: 'Fighter', 39: 'Provocation', 40: 'Aloneness',
      41: 'Fantasy', 42: 'Growth', 43: 'Insight', 44: 'Coming to Meet',
      45: 'Gathering', 46: 'Love of Body', 47: 'Oppression', 48: 'Depth',
      49: 'Revolution', 50: 'Values', 51: 'Shock', 52: 'Inaction',
      53: 'Development', 54: 'Drive', 55: 'Spirit', 56: 'Stimulation',
      57: 'Intuition', 58: 'Joy', 59: 'Sexuality', 60: 'Limitation',
      61: 'Mystery', 62: 'Details', 63: 'Doubt', 64: 'Confusion'
    };
    
    return crossNames[sunGate] || 'Unknown';
  }

  calculateDefinition(definedCenters, channels) {
    if (definedCenters.length === 0) return 'No Definition';
    if (definedCenters.length === 1) return 'Single Definition';
    
    // For this simple case with 2 centers connected by 1 channel
    // More complex logic would be needed for multiple channels/centers
    if (channels.length === 1 && definedCenters.length === 2) {
      return 'Single Definition';
    }
    
    // Simplified logic - in a complete implementation, you'd analyze
    // the connectivity graph of centers through channels
    if (definedCenters.length <= 3) return 'Single Definition';
    if (definedCenters.length <= 5) return 'Split Definition';
    if (definedCenters.length <= 7) return 'Triple Split Definition';
    return 'Quadruple Split Definition';
  }

  getStrategy(type) {
    const strategies = {
      [hdTypes.MANIFESTOR]: 'To Inform',
      [hdTypes.GENERATOR]: 'To Respond',
      [hdTypes.MANIFESTING_GENERATOR]: 'To Respond & Inform',
      [hdTypes.PROJECTOR]: 'To Wait for Invitation',
      [hdTypes.REFLECTOR]: 'To Wait a Lunar Cycle'
    };
    return strategies[type] || 'To Respond';
  }

  getSignature(type) {
    const signatures = {
      [hdTypes.MANIFESTOR]: 'Peace',
      [hdTypes.GENERATOR]: 'Satisfaction',
      [hdTypes.MANIFESTING_GENERATOR]: 'Satisfaction',
      [hdTypes.PROJECTOR]: 'Success',
      [hdTypes.REFLECTOR]: 'Surprise'
    };
    return signatures[type] || 'Satisfaction';
  }

  getNotSelfTheme(type) {
    const themes = {
      [hdTypes.MANIFESTOR]: 'Anger',
      [hdTypes.GENERATOR]: 'Frustration',
      [hdTypes.MANIFESTING_GENERATOR]: 'Frustration & Anger',
      [hdTypes.PROJECTOR]: 'Bitterness',
      [hdTypes.REFLECTOR]: 'Disappointment'
    };
    return themes[type] || 'Frustration';
  }

  calculateVariables(personalityPlanets, designPlanets) {
    return {
      Digestion: 'left',
      Environment: 'left', 
      Awareness: 'left',
      Perspective: 'right'
    };
  }

  getPlanetList() {
    return [
      { Id: 'Sun', Option: 'Sun', Description: '' },
      { Id: 'Moon', Option: 'Moon', Description: '' },
      { Id: 'Mercury', Option: 'Mercury', Description: '' },
      { Id: 'Venus', Option: 'Venus', Description: '' },
      { Id: 'Mars', Option: 'Mars', Description: '' },
      { Id: 'Jupiter', Option: 'Jupiter', Description: '' },
      { Id: 'Saturn', Option: 'Saturn', Description: '' },
      { Id: 'Uranus', Option: 'Uranus', Description: '' },
      { Id: 'Neptune', Option: 'Neptune', Description: '' },
      { Id: 'Pluto', Option: 'Pluto', Description: '' },
      { Id: 'North Node', Option: 'North Node', Description: '' },
      { Id: 'South Node', Option: 'South Node', Description: '' },
      { Id: 'Chiron', Option: 'Chiron', Description: '' },
      { Id: 'Earth', Option: 'Earth', Description: '' }
    ];
  }

  generateTooltips() {
    return {
      Centers: Object.keys(centers).map(key => ({
        Id: centers[key].replace(' center', ''),
        Option: centers[key].replace(' center', ''),
        Description: ''
      })),
      Channels: Object.keys(channelDefinitions).map(key => ({
        Id: key,
        Option: key,
        Description: ''
      }))
    };
  }

  calculateComposite(chart1, chart2) {
    // Combine the two charts to show relationship dynamics
    const allDefinedCenters = [...new Set([...chart1.definedCenters, ...chart2.definedCenters])];
    const allChannels = [...new Set([...chart1.channels, ...chart2.channels])];
    
    return {
      UnconsciousCenters: [],
      ConsciousCenters: [],
      DefinedCenters: allDefinedCenters,
      OpenCenters: this.calculateOpenCenters(allDefinedCenters),
      Properties: {
        Definition: {
          Name: 'Definition',
          Id: this.calculateCompositeDefinition(allDefinedCenters),
          Option: this.calculateCompositeDefinition(allDefinedCenters),
          Description: '',
          Link: ''
        },
        ConnectionTheme: {
          ThemeDescription: null,
          Name: 'Connection Theme',
          Id: this.calculateConnectionTheme(allDefinedCenters),
          Option: this.calculateConnectionTheme(allDefinedCenters),
          Description: this.getConnectionDescription(allDefinedCenters),
          Link: ''
        },
        RelationshipChannels: this.categorizeRelationshipChannels(chart1.channels, chart2.channels)
      }
    };
  }

  calculateCompositeDefinition(definedCenters) {
    const definedCount = definedCenters.length;
    if (definedCount >= 7) return 'Single Definition';
    if (definedCount >= 4) return 'Split Definition';
    if (definedCount >= 2) return 'Triple Split Definition';
    return 'No Definition';
  }

  calculateConnectionTheme(definedCenters) {
    const openCount = 9 - definedCenters.length;
    return `${definedCenters.length} - ${openCount}, ${this.getConnectionType(definedCenters.length)}`;
  }

  getConnectionType(definedCount) {
    if (definedCount >= 8) return 'Almost Complete';
    if (definedCount >= 6) return 'Highly Defined';
    if (definedCount >= 4) return 'Balanced';
    return 'Open and Flowing';
  }

  getConnectionDescription(definedCenters) {
    const definedCount = definedCenters.length;
    const openCount = 9 - definedCount;
    
    if (definedCount >= 8) {
      return `With ${definedCount} defined centers and ${openCount} open center${openCount !== 1 ? 's' : ''}, this is a very stable and self-contained connection. The ${openCount === 1 ? 'one open center creates a specific area' : 'open centers create specific areas'} where growth and learning can occur together. Balance independence with focused sharing around ${openCount === 1 ? 'this open center' : 'these open centers'}.`;
    }
    
    return `With ${definedCount} defined centers and ${openCount} open centers, this connection offers opportunities for mutual learning and growth.`;
  }

  categorizeRelationshipChannels(channels1, channels2) {
    const shared = channels1.filter(c => channels2.includes(c));
    const unique1 = channels1.filter(c => !channels2.includes(c));
    const unique2 = channels2.filter(c => !channels1.includes(c));
    
    return {
      Companionship: {
        Name: 'Companionship Channels',
        Id: 'Companionship Channels',
        List: shared.map(channel => ({
          Option: `Channel of ${channelDefinitions[channel] || 'Unknown'} (${channel})`,
          Description: '',
          Description2: null,
          Link: '',
          Gates: channel.split('-').map(Number)
        }))
      },
      Dominance: {
        Name: 'Dominance Channels',
        Id: 'Dominance Channels',
        List: unique1.slice(0, 3).map(channel => ({
          Option: `Channel of ${channelDefinitions[channel] || 'Unknown'} (${channel})`,
          Description: '',
          Description2: null,
          Link: '',
          Gates: channel.split('-').map(Number)
        }))
      },
      Compromise: {
        Name: 'Compromise Channels',
        Id: 'Compromise Channels',
        List: unique2.slice(0, 3).map(channel => ({
          Option: `Channel of ${channelDefinitions[channel] || 'Unknown'} (${channel})`,
          Description: '',
          Description2: null,
          Link: '',
          Gates: channel.split('-').map(Number)
        }))
      },
      Electromagnetic: {
        Name: 'Electromagnetic Channels',
        Id: 'Electromagnetic Channels',
        List: []
      }
    };
  }
}

module.exports = new HDKitCalculator();