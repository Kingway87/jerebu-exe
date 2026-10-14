# Test fixtures

Real responses from the live evidence sources, captured during Experiment 003 so that the tests check the parsers against what the sources actually send, not against invented data.

**These files are test inputs only.** The site never displays them. They are snapshots from 14–15 October 2026 and must never be shown as current conditions.

Each `*.json`, `*.csv` or `*.txt` file has a matching `*.provenance.json` that records the exact URL, the retrieval time (UTC), the HTTP status, and how the sample was selected. Nothing was edited, except where a provenance file says a fixture was derived (for example, the header-only FIRMS file, which keeps only the real header row).

| Fixture | Source | Licence and attribution |
| --- | --- | --- |
| `live/datagovsg-psi.json`, `live/datagovsg-pm25.json` | National Environment Agency, via the data.gov.sg real-time API | Contains information from Pollutant Standards Index (PSI) and PM2.5 accessed on 15 October 2026 from data.gov.sg, which is made available under the terms of the [Singapore Open Data Licence version 1.0](https://data.gov.sg/open-data-licence). |
| `live/datagovsg-wind-direction.json`, `live/datagovsg-wind-speed.json`, `live/datagovsg-rainfall.json` | Meteorological Service Singapore (NEA), via data.gov.sg | Contains information from Wind Direction across Singapore, Wind Speed across Singapore and Rainfall across Singapore accessed on 15 October 2026 from data.gov.sg, which is made available under the terms of the [Singapore Open Data Licence version 1.0](https://data.gov.sg/open-data-licence). |
| `live/firms-noaa20-sea-24h-subset.csv`, `live/firms-header-only.csv` | NASA FIRMS, VIIRS 375 m NRT active fires (NOAA-20) | We acknowledge the use of data and/or imagery from NASA's Fire Information for Resource Management System (FIRMS) (https://earthdata.nasa.gov/firms), part of NASA's Land, Atmosphere Near real-time Capability for Earth observations (LANCE) (https://earthdata.nasa.gov/lance) and NASA's Earth Science Data and Information System (ESDIS). Product: doi:10.5067/FIRMS/VIIRS/VJ114IMGT_NRT.002. [Data use guidance and disclaimer](https://www.earthdata.nasa.gov/data/tools/firms). |
| `live/firms-area-invalid-key.txt` | NASA FIRMS area API: the error body returned to a deliberately invalid key | As above. |
| `live/datagovmy-forecast-states.json` | Malaysian Meteorological Department, via the data.gov.my Weather API | Forecast: MET Malaysia, via data.gov.my, licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). |

The FIRMS samples are a small subset of a 23,043-row file, chosen by the rule written in their provenance file: rows outside and inside the map window, and inside it, rows of each confidence class.

To capture new fixtures, request the URL in the provenance file once, save the body unchanged, and write a new provenance file with the retrieval time. Do not hand-edit values: a test that needs a different value should change it in the test code, where the change is visible.
