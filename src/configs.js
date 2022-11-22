var isPreview = true;
var viewHostnames = [];
if (viewHostnames.indexOf(window.location.hostname) !== -1) {
  isPreview = false;
}

const configs = {
  local: process.env.NODE_ENV === 'development',
  prod: process.env.REACT_APP_PROD === 'true',
  baseUrl: process.env.REACT_APP_BASE_URL || '',
  apiUrl: process.env.REACT_APP_API_URL || '',
  viewMode: !isPreview,
  previewMode: isPreview,
  googleApiKey: process.env.REACT_APP_GOOGLE_API_KEY || '',
  mapBoxToken: process.env.REACT_APP_MAPBOX_TOKEN || '',
  gaTrackingId: process.env.REACT_APP_GA_TRACKING_ID || '',
  singleTour: process.env.REACT_APP_SINGLE_TOUR === 'true',
  tourJson: process.env.REACT_APP_TOUR_JSON || '',
  mapRoute: 'map-navigation',
  socialRoute: 'follow-us',
  crossfadeSpeed: 2,
  zoom: {
    min: process.env.REACT_APP_MIN_FOV || 30,
    max: process.env.REACT_APP_MAX_FOV || 120,
  },
};

export default configs;
