const express = require('express');
const router = express.Router();
const moment = require('moment-timezone');
const HDKit = require('../lib/hdkit-calculator');

// Single Human Design Chart endpoint
router.get('/hd-data', async (req, res) => {
  try {
    const { date, timezone } = req.query;
    
    // Validation
    if (!date || !timezone) {
      return res.status(400).json({
        error: 'Missing required parameters',
        message: 'Both date and timezone parameters are required',
        example: '/api/hd-data?date=1988-07-22T17:06:00&timezone=Europe/London'
      });
    }

    // Validate date format
    const birthMoment = moment.tz(date, timezone);
    if (!birthMoment.isValid()) {
      return res.status(400).json({
        error: 'Invalid date or timezone',
        message: 'Please provide a valid ISO date and timezone',
        example: 'date=1988-07-22T17:06:00&timezone=Europe/London'
      });
    }

    // Calculate Human Design chart
    const chartData = await HDKit.calculateChart({
      birthTime: birthMoment.toDate(),
      timezone: timezone,
      latitude: 51.5074, // Default to London - in production, get from location service
      longitude: -0.1278
    });

    // Format response to match humandesign.ai API structure
    const response = {
      Properties: {
        BirthDateLocal: birthMoment.format('Do MMMM YYYY @ HH:mm'),
        BirthDateLocal12: birthMoment.format('Do MMMM YYYY @ hh:mm A'),
        BirthDateUtc: birthMoment.utc().format('Do MMMM YYYY @ HH:mm'),
        BirthDateUtc12: birthMoment.utc().format('Do MMMM YYYY @ hh:mm A'),
        Age: moment().diff(birthMoment, 'years'),
        DesignDateUtc: birthMoment.clone().subtract(88, 'days').utc().format('Do MMMM YYYY @ HH:mm'),
        DesignDateUtc12: birthMoment.clone().subtract(88, 'days').utc().format('Do MMMM YYYY @ hh:mm A'),
        ...chartData.properties
      },
      ChartUrl: 'sage.humandesign.ai',
      Personality: chartData.personality,
      Design: chartData.design,
      UnconsciousCenters: chartData.unconsciousCenters,
      ConsciousCenters: chartData.consciousCenters,
      DefinedCenters: chartData.definedCenters,
      OpenCenters: chartData.openCenters,
      Channels: chartData.channels,
      Gates: chartData.gates,
      Planets: chartData.planets,
      Variables: chartData.variables,
      Tooltips: chartData.tooltips
    };

    res.json(response);
    
  } catch (error) {
    console.error('Error calculating HD chart:', error);
    res.status(500).json({
      error: 'Chart calculation failed',
      message: 'Unable to calculate Human Design chart',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Relationship/Composite Chart endpoint
router.get('/hd-data-composite', async (req, res) => {
  try {
    const { date, timezone, date1, timezone1 } = req.query;
    
    // Validation
    if (!date || !timezone || !date1 || !timezone1) {
      return res.status(400).json({
        error: 'Missing required parameters',
        message: 'All parameters are required: date, timezone, date1, timezone1',
        example: '/api/hd-data-composite?date=1988-07-22T17:06:00&timezone=Europe/London&date1=1990-03-15T09:30:00&timezone1=America/New_York'
      });
    }

    // Validate dates
    const birthMoment1 = moment.tz(date, timezone);
    const birthMoment2 = moment.tz(date1, timezone1);
    
    if (!birthMoment1.isValid() || !birthMoment2.isValid()) {
      return res.status(400).json({
        error: 'Invalid date or timezone',
        message: 'Please provide valid ISO dates and timezones for both individuals'
      });
    }

    // Calculate individual charts
    const chart1 = await HDKit.calculateChart({
      birthTime: birthMoment1.toDate(),
      timezone: timezone,
      latitude: 51.5074,
      longitude: -0.1278
    });

    const chart2 = await HDKit.calculateChart({
      birthTime: birthMoment2.toDate(),
      timezone: timezone1,
      latitude: 40.7128,
      longitude: -74.0060
    });

    // Calculate composite/relationship chart
    const composite = HDKit.calculateComposite(chart1, chart2);

    // Format response to match humandesign.ai API structure
    const response = {
      "0": {
        Properties: {
          BirthDateLocal: birthMoment1.format('Do MMMM YYYY @ HH:mm'),
          BirthDateLocal12: birthMoment1.format('Do MMMM YYYY @ hh:mm A'),
          BirthDateUtc: birthMoment1.utc().format('Do MMMM YYYY @ HH:mm'),
          BirthDateUtc12: birthMoment1.utc().format('Do MMMM YYYY @ hh:mm A'),
          Age: moment().diff(birthMoment1, 'years'),
          ...chart1.properties
        },
        ChartUrl: 'sage.humandesign.ai',
        ...chart1
      },
      "1": {
        Properties: {
          BirthDateLocal: birthMoment2.format('Do MMMM YYYY @ HH:mm'),
          BirthDateLocal12: birthMoment2.format('Do MMMM YYYY @ hh:mm A'),
          BirthDateUtc: birthMoment2.utc().format('Do MMMM YYYY @ HH:mm'),
          BirthDateUtc12: birthMoment2.utc().format('Do MMMM YYYY @ hh:mm A'),
          Age: moment().diff(birthMoment2, 'years'),
          ...chart2.properties
        },
        ChartUrl: 'sage.humandesign.ai',
        ...chart2
      },
      Combined: composite
    };

    res.json(response);
    
  } catch (error) {
    console.error('Error calculating composite chart:', error);
    res.status(500).json({
      error: 'Composite chart calculation failed',
      message: 'Unable to calculate relationship chart',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;