import { useState, useEffect, useContext, Dispatch, SetStateAction } from "react"
import { MapLayersContext, MapLayersContextType } from '../contexts/mapLayersContext'
import { MapMouseEvent, EventData } from 'mapbox-gl'
import { useQuery } from 'react-query';

import { fetchStationData } from "../api/api.ts"