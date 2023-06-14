'use client';

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const URL = 'https://airplaneapikel1-production.up.railway.app/api/v1/airport';

export const fetchAirport = createAsyncThunk('airport/fetchAirport', async () => {
    try {
        const response = await axios.get(URL);
        return response.data.data.airport;
    } catch (error) {
        return error.message;
    }
});

const initialState = {
    airports: [],
    filteredFromAirport: [],
    filteredToAirport: [],
    displayFromAirport: '',
    displayToAirport: '',
    fetchAirportStatus: 'idle', //'idle' | 'loading' | 'succeeded' | 'failed'
    fetchAirportError: null,
    fromAirport: '', //for search from flight ticket
    toAirport: '', //for search to flight ticket
    isTwoWayNew: false,
    flightClass: 'Economy',

    one_way: {
        from: '',
        to: '',
        derpatureDateTime: '',
        arrivalDateTime: '',
    },
    two_way: {
        from: '',
        to: '',
        derpatureDateTime: '',
        // arrivalDateTime: '',
    },
    passengerType: {
        dewasa: 1,
        anak: 0,
        bayi: 0,
    },
    totalPassenger: 1,
};

export const airportSlice = createSlice({
    name: 'airport',
    initialState,
    reducers: {
        // For diff input comp
        filteredFromAirport: (state, action) => {
            const searchFromAirport = state.airports.filter((airport) =>
                airport.airport_location.toLowerCase().includes(action.payload.toLowerCase())
            );

            state.filteredFromAirport = searchFromAirport;
        },

        // For diff input comp
        filteredToAirport: (state, action) => {
            const searchToAirport = state.airports.filter((airport) =>
                airport.airport_location.toLowerCase().includes(action.payload.toLowerCase())
            );
            state.filteredToAirport = searchToAirport;
        },

        // define from airport (one only)
        setFromAirport: (state, action) => {
            const fromAirport = state.airports.filter((airport) => airport.airport_code === action.payload);

            state.fromAirport = fromAirport[0].airport_location;
            state.displayFromAirport = `${fromAirport[0].airport_location} (${fromAirport[0].airport_code})`;
        },

        // define to airport (one only)
        setToAirport: (state, action) => {
            const toAirport = state.airports.filter((airport) => airport.airport_code === action.payload);

            state.toAirport = toAirport[0].airport_location;
            state.displayToAirport = `${toAirport[0].airport_location} (${toAirport[0].airport_code})`;
        },

        // switch from/to position
        switchFromToAirportPosition: (state) => {
            const tempDisplay = state.displayFromAirport;
            state.displayFromAirport = state.displayToAirport;
            state.displayToAirport = tempDisplay;

            const tempCode = state.fromAirport;
            state.fromAirport = state.toAirport;
            state.toAirport = tempCode;
        },

        // define of flight Class
        setOneWayFrom: (state, action) => {
            const fromAirport = state.airports.filter((airport) => airport.airport_code === action.payload);

            if (state.isTwoWayNew) {
                state.two_way.to = fromAirport[0].airport_location;
            }

            state.one_way.from = fromAirport[0].airport_location;
            // state.one_way.to = action.payload.to;
        },
        setOneWayTo: (state, action) => {
            const toAirport = state.airports.filter((airport) => airport.airport_code === action.payload);

            if (state.isTwoWayNew) {
                state.two_way.from = toAirport[0].airport_location;
            }

            state.one_way.to = toAirport[0].airport_location;
            // state.one_way.to = action.payload.to;
        },
        setOneWaySwitch: (state) => {
            const temp = state.one_way.from;
            state.one_way.from = state.one_way.to;
            state.one_way.to = temp;

            if (state.isTwoWayNew) {
                const temp = state.two_way.from;
                state.two_way.from = state.two_way.to;
                state.two_way.to = temp;
            }
        },
        setTwoWay: (state) => {
            state.two_way.from = state.one_way.to;
            state.two_way.to = state.one_way.from;
        },
        setDisableTwoWay: (state) => {
            state.two_way.from = '';
            state.two_way.to = '';
        },
        setIsTwoWayNew: (state, action) => {
            if (!action.payload) {
                state.two_way.from = '';
                state.two_way.to = '';
                state.two_way.derpatureDateTime = '';
                state.isTwoWayNew = action.payload;
                return;
            }

            state.two_way.from = state.one_way.to;
            state.two_way.to = state.one_way.from;
            state.two_way.derpatureDateTime = state.one_way.arrivalDateTime;
            state.isTwoWayNew = action.payload;
        },
        //define datePickerCalenda
        setDerpatureDateTime: (state, action) => {
            state.one_way.derpatureDateTime = action.payload;
        },

        //define datePickerCalenda
        setArrivalDateTime: (state, action) => {
            if (state.isTwoWayNew) {
                state.two_way.derpatureDateTime = action.payload;
            }
            state.one_way.arrivalDateTime = action.payload;
        },
        // define of flight Class
        setFlightClass: (state, action) => {
            state.flightClass = action.payload;
        },
        addDewasaPassenger: (state) => {
            state.passengerType.dewasa += 1;
            state.totalPassenger += 1;
        },
        addAnakPassenger: (state) => {
            state.passengerType.anak += 1;
            state.totalPassenger += 1;
        },
        addBayiPassenger: (state) => {
            state.passengerType.bayi += 1;
            state.totalPassenger += 1;
        },

        minusDewasaPassenger: (state) => {
            if (state.passengerType.dewasa > 1) {
                state.passengerType.dewasa -= 1;
                state.totalPassenger -= 1;
            }
        },
        minusAnakPassenger: (state) => {
            if (state.passengerType.anak > 0) {
                state.passengerType.anak -= 1;
                state.totalPassenger -= 1;
            }
        },
        minusBayiPassenger: (state) => {
            if (state.passengerType.bayi > 0) {
                state.passengerType.bayi -= 1;
                state.totalPassenger -= 1;
            }
        },
    },
    extraReducers: (builder) => {
        // eslint-disable-next-line no-unused-vars
        builder.addCase(fetchAirport.pending, (state, action) => {
            state.fetchAirportStatus = 'loading';
        });
        builder.addCase(fetchAirport.fulfilled, (state, action) => {
            state.fetchAirportStatus = 'succeeded';
            state.airports = [...state.airports, ...action.payload];
        });
        builder.addCase(fetchAirport.rejected, (state, action) => {
            state.fetchAirportStatus = 'failed';
            state.fetchAirportError = action.error.message;
        });
    },
});

export const getAllAirport = (state) => state.airport.airports;
export const getAirportFetchError = (state) => state.airport.fetchAirportError;
export const getAirportFetchStatus = (state) => state.airport.fetchAirportStatus;
export const getFilteredFromAirport = (state) => state.airport.filteredFromAirport;
export const getFilteredToAirport = (state) => state.airport.filteredToAirport;
export const getDisplayFromAirport = (state) => state.airport.displayFromAirport;
export const getDisplayToAirport = (state) => state.airport.displayToAirport;
export const getLocationFromAirport = (state) => state.airport.fromAirport;
export const getLocationToAirport = (state) => state.airport.toAirport;
export const getOneWay = (state) => state.airport.one_way;
export const getTwoWay = (state) => state.airport.two_way;
export const getIsTwoWayNew = (state) => state.airport.isTwoWayNew;
export const getDerpatureDateTime = (state) => state.airport.one_way.derpatureDateTime;
export const getArrivalDateTime = (state) => state.airport.one_way.arrivalDateTime;
export const getFlightClass = (state) => state.airport.flightClass;
export const getTotalPassenger = (state) => state.airport.totalPassenger;
export const getDewasaPassenger = (state) => state.airport.passengerType.dewasa;
export const getAnakPassenger = (state) => state.airport.passengerType.anak;
export const getBayiPassenger = (state) => state.airport.passengerType.bayi;

export default airportSlice.reducer;