import { CHANNEL_PARTNERS } from '../data/partners';
import { ChannelPartner, NearestPartnerMatch, PincodeLookupResult } from '../types';

export interface LocationCoordinates {
  name: string;
  state: string;
  latitude: number;
  longitude: number;
  pincodePrefix: string;
}

/**
 * Comprehensive mapping of known district and regional centers across India
 */
export const KNOWN_LOCATIONS: Record<string, LocationCoordinates> = {
  // Jharkhand
  giridih: { name: 'Giridih', state: 'Jharkhand', latitude: 24.1856, longitude: 86.3072, pincodePrefix: '815' },
  ranchi: { name: 'Ranchi', state: 'Jharkhand', latitude: 23.3441, longitude: 85.3096, pincodePrefix: '834' },
  dhanbad: { name: 'Dhanbad', state: 'Jharkhand', latitude: 23.7957, longitude: 86.4304, pincodePrefix: '826' },
  bokaro: { name: 'Bokaro', state: 'Jharkhand', latitude: 23.6693, longitude: 86.1511, pincodePrefix: '827' },
  hazaribagh: { name: 'Hazaribagh', state: 'Jharkhand', latitude: 23.9961, longitude: 85.3621, pincodePrefix: '825' },
  jamshedpur: { name: 'Jamshedpur', state: 'Jharkhand', latitude: 22.8046, longitude: 86.2029, pincodePrefix: '831' },
  deoghar: { name: 'Deoghar', state: 'Jharkhand', latitude: 24.4826, longitude: 86.7000, pincodePrefix: '814' },
  dumka: { name: 'Dumka', state: 'Jharkhand', latitude: 24.2690, longitude: 87.2474, pincodePrefix: '814' },
  palamu: { name: 'Palamu / Daltonganj', state: 'Jharkhand', latitude: 24.0384, longitude: 84.0722, pincodePrefix: '822' },

  // Bihar
  patna: { name: 'Patna', state: 'Bihar', latitude: 25.5941, longitude: 85.1376, pincodePrefix: '800' },
  gaya: { name: 'Gaya', state: 'Bihar', latitude: 24.7955, longitude: 85.0002, pincodePrefix: '823' },
  muzaffarpur: { name: 'Muzaffarpur', state: 'Bihar', latitude: 26.1209, longitude: 85.3647, pincodePrefix: '842' },
  bhagalpur: { name: 'Bhagalpur', state: 'Bihar', latitude: 25.2425, longitude: 86.9842, pincodePrefix: '812' },
  darbhanga: { name: 'Darbhanga', state: 'Bihar', latitude: 26.1542, longitude: 85.8918, pincodePrefix: '846' },
  purnia: { name: 'Purnia', state: 'Bihar', latitude: 25.7771, longitude: 87.4753, pincodePrefix: '854' },

  // Uttar Pradesh
  lucknow: { name: 'Lucknow', state: 'Uttar Pradesh', latitude: 26.8467, longitude: 80.9462, pincodePrefix: '226' },
  varanasi: { name: 'Varanasi', state: 'Uttar Pradesh', latitude: 25.3176, longitude: 82.9739, pincodePrefix: '221' },
  kanpur: { name: 'Kanpur', state: 'Uttar Pradesh', latitude: 26.4499, longitude: 80.3319, pincodePrefix: '208' },
  agra: { name: 'Agra', state: 'Uttar Pradesh', latitude: 27.1767, longitude: 78.0081, pincodePrefix: '282' },
  prayagraj: { name: 'Prayagraj / Allahabad', state: 'Uttar Pradesh', latitude: 25.4358, longitude: 81.8463, pincodePrefix: '211' },
  noida: { name: 'Noida / Ghaziabad', state: 'Uttar Pradesh', latitude: 28.5355, longitude: 77.3910, pincodePrefix: '201' },
  gorakhpur: { name: 'Gorakhpur', state: 'Uttar Pradesh', latitude: 26.7606, longitude: 83.3732, pincodePrefix: '273' },
  meerut: { name: 'Meerut', state: 'Uttar Pradesh', latitude: 28.9845, longitude: 77.7064, pincodePrefix: '250' },

  // Delhi & NCR
  delhi: { name: 'New Delhi', state: 'Delhi', latitude: 28.6139, longitude: 77.2090, pincodePrefix: '110' },
  gurugram: { name: 'Gurugram', state: 'Haryana', latitude: 28.4595, longitude: 77.0266, pincodePrefix: '122' },
  faridabad: { name: 'Faridabad', state: 'Haryana', latitude: 28.4089, longitude: 77.3178, pincodePrefix: '121' },
  chandigarh: { name: 'Chandigarh', state: 'Punjab', latitude: 30.7333, longitude: 76.7794, pincodePrefix: '160' },
  ludhiana: { name: 'Ludhiana', state: 'Punjab', latitude: 30.9010, longitude: 75.8573, pincodePrefix: '141' },

  // Maharashtra
  mumbai: { name: 'Mumbai', state: 'Maharashtra', latitude: 19.0760, longitude: 72.8777, pincodePrefix: '400' },
  pune: { name: 'Pune', state: 'Maharashtra', latitude: 18.5204, longitude: 73.8567, pincodePrefix: '411' },
  nagpur: { name: 'Nagpur', state: 'Maharashtra', latitude: 21.1458, longitude: 79.0882, pincodePrefix: '440' },
  nashik: { name: 'Nashik', state: 'Maharashtra', latitude: 19.9975, longitude: 73.7898, pincodePrefix: '422' },
  aurangabad: { name: 'Chhatrapati Sambhaji Nagar', state: 'Maharashtra', latitude: 19.8762, longitude: 75.3433, pincodePrefix: '431' },

  // Rajasthan
  jaipur: { name: 'Jaipur', state: 'Rajasthan', latitude: 26.9124, longitude: 75.7873, pincodePrefix: '302' },
  jodhpur: { name: 'Jodhpur', state: 'Rajasthan', latitude: 26.2389, longitude: 73.0243, pincodePrefix: '342' },
  udaipur: { name: 'Udaipur', state: 'Rajasthan', latitude: 24.5854, longitude: 73.7125, pincodePrefix: '313' },
  kota: { name: 'Kota', state: 'Rajasthan', latitude: 25.2138, longitude: 75.8648, pincodePrefix: '324' },

  // Madhya Pradesh
  bhopal: { name: 'Bhopal', state: 'Madhya Pradesh', latitude: 23.2599, longitude: 77.4126, pincodePrefix: '462' },
  indore: { name: 'Indore', state: 'Madhya Pradesh', latitude: 22.7196, longitude: 75.8577, pincodePrefix: '452' },
  gwalior: { name: 'Gwalior', state: 'Madhya Pradesh', latitude: 26.2183, longitude: 78.1828, pincodePrefix: '474' },
  jabalpur: { name: 'Jabalpur', state: 'Madhya Pradesh', latitude: 23.1815, longitude: 79.9864, pincodePrefix: '482' },

  // West Bengal
  kolkata: { name: 'Kolkata', state: 'West Bengal', latitude: 22.5726, longitude: 88.3639, pincodePrefix: '700' },
  howrah: { name: 'Howrah', state: 'West Bengal', latitude: 22.5958, longitude: 88.2636, pincodePrefix: '711' },
  asansol: { name: 'Asansol / Durgapur', state: 'West Bengal', latitude: 23.6739, longitude: 86.9524, pincodePrefix: '713' },
  siliguri: { name: 'Siliguri', state: 'West Bengal', latitude: 26.7271, longitude: 88.3953, pincodePrefix: '734' },

  // Gujarat
  ahmedabad: { name: 'Ahmedabad', state: 'Gujarat', latitude: 23.0225, longitude: 72.5714, pincodePrefix: '380' },
  surat: { name: 'Surat', state: 'Gujarat', latitude: 21.1702, longitude: 72.8311, pincodePrefix: '395' },
  vadodara: { name: 'Vadodara', state: 'Gujarat', latitude: 22.3072, longitude: 73.1812, pincodePrefix: '390' },
  rajkot: { name: 'Rajkot', state: 'Gujarat', latitude: 22.3039, longitude: 70.8022, pincodePrefix: '360' },

  // Odisha
  bhubaneswar: { name: 'Bhubaneswar', state: 'Odisha', latitude: 20.2961, longitude: 85.8245, pincodePrefix: '751' },
  cuttack: { name: 'Cuttack', state: 'Odisha', latitude: 20.4625, longitude: 85.8828, pincodePrefix: '753' },
  rourkela: { name: 'Rourkela', state: 'Odisha', latitude: 22.2604, longitude: 84.8536, pincodePrefix: '769' },

  // South
  bengaluru: { name: 'Bengaluru', state: 'Karnataka', latitude: 12.9716, longitude: 77.5946, pincodePrefix: '560' },
  mysuru: { name: 'Mysuru', state: 'Karnataka', latitude: 12.2958, longitude: 76.6394, pincodePrefix: '570' },
  hyderabad: { name: 'Hyderabad', state: 'Telangana', latitude: 17.3850, longitude: 78.4867, pincodePrefix: '500' },
  warangal: { name: 'Warangal', state: 'Telangana', latitude: 17.9689, longitude: 79.5941, pincodePrefix: '506' },
  chennai: { name: 'Chennai', state: 'Tamil Nadu', latitude: 13.0827, longitude: 80.2707, pincodePrefix: '600' },
  coimbatore: { name: 'Coimbatore', state: 'Tamil Nadu', latitude: 11.0168, longitude: 76.9558, pincodePrefix: '641' },
  thiruvananthapuram: { name: 'Thiruvananthapuram', state: 'Kerala', latitude: 8.5241, longitude: 76.9366, pincodePrefix: '695' },
  kochi: { name: 'Kochi / Ernakulam', state: 'Kerala', latitude: 9.9312, longitude: 76.2673, pincodePrefix: '682' },
  guwahati: { name: 'Guwahati', state: 'Assam', latitude: 26.1445, longitude: 91.7362, pincodePrefix: '781' }
};

/**
 * Built-in PIN code dictionary for instant resolution of thousands of Indian PINs
 */
const PINCODE_MAP: Record<
  string,
  { district: string; city: string; state: string; latitude: number; longitude: number; postOffice?: string }
> = {
  // Giridih & Jharkhand key postal codes
  '815301': { district: 'Giridih', city: 'Giridih H.O', state: 'Jharkhand', latitude: 24.1856, longitude: 86.3072, postOffice: 'Giridih Head Office' },
  '815316': { district: 'Giridih', city: 'Pachamba', state: 'Jharkhand', latitude: 24.2045, longitude: 86.2764, postOffice: 'Pachamba S.O' },
  '815302': { district: 'Giridih', city: 'Beniadih / Coal Board', state: 'Jharkhand', latitude: 24.1950, longitude: 86.2900, postOffice: 'Beniadih S.O' },
  '815312': { district: 'Giridih', city: 'Dumri', state: 'Jharkhand', latitude: 24.0322, longitude: 86.0121, postOffice: 'Dumri S.O' },
  '815318': { district: 'Giridih', city: 'Jamua', state: 'Jharkhand', latitude: 24.3644, longitude: 86.1442, postOffice: 'Jamua S.O' },
  '815311': { district: 'Giridih', city: 'Bagodar', state: 'Jharkhand', latitude: 24.0833, longitude: 85.8333, postOffice: 'Bagodar S.O' },
  '815313': { district: 'Giridih', city: 'Gawan', state: 'Jharkhand', latitude: 24.6167, longitude: 85.9167, postOffice: 'Gawan S.O' },
  '815314': { district: 'Giridih', city: 'Tisri', state: 'Jharkhand', latitude: 24.5667, longitude: 86.0500, postOffice: 'Tisri S.O' },
  '815315': { district: 'Giridih', city: 'Bengabad', state: 'Jharkhand', latitude: 24.3000, longitude: 86.3833, postOffice: 'Bengabad S.O' },
  '815317': { district: 'Giridih', city: 'Sariya', state: 'Jharkhand', latitude: 24.1700, longitude: 85.8900, postOffice: 'Surya Nagar Sariya' },

  // Ranchi
  '834001': { district: 'Ranchi', city: 'Ranchi G.P.O', state: 'Jharkhand', latitude: 23.3688, longitude: 85.3249, postOffice: 'Ranchi GPO' },
  '834002': { district: 'Ranchi', city: 'Doranda / Morabadi', state: 'Jharkhand', latitude: 23.3854, longitude: 85.3341, postOffice: 'Doranda H.O' },
  '834004': { district: 'Ranchi', city: 'Hatia / HEC', state: 'Jharkhand', latitude: 23.3100, longitude: 85.3100, postOffice: 'Hatia Colony' },
  '834008': { district: 'Ranchi', city: 'Bariatu', state: 'Jharkhand', latitude: 23.4000, longitude: 85.3600, postOffice: 'Bariatu S.O' },
  '835217': { district: 'Ranchi', city: 'Mesra (BIT)', state: 'Jharkhand', latitude: 23.4241, longitude: 85.4385, postOffice: 'Mesra B.O' },

  // Dhanbad & Bokaro
  '826001': { district: 'Dhanbad', city: 'Dhanbad H.O', state: 'Jharkhand', latitude: 23.7957, longitude: 86.4304, postOffice: 'Dhanbad Head Office' },
  '826004': { district: 'Dhanbad', city: 'ISM Dhanbad', state: 'Jharkhand', latitude: 23.8142, longitude: 86.4412, postOffice: 'Indian School of Mines' },
  '827001': { district: 'Bokaro', city: 'Bokaro Steel City', state: 'Jharkhand', latitude: 23.6693, longitude: 86.1511, postOffice: 'B.S.City H.O' },
  '825301': { district: 'Hazaribagh', city: 'Hazaribagh H.O', state: 'Jharkhand', latitude: 23.9961, longitude: 85.3621, postOffice: 'Hazaribagh H.O' },
  '831001': { district: 'East Singhbhum', city: 'Jamshedpur', state: 'Jharkhand', latitude: 22.8046, longitude: 86.2029, postOffice: 'Jamshedpur H.O' },
  '814112': { district: 'Deoghar', city: 'Deoghar H.O', state: 'Jharkhand', latitude: 24.4826, longitude: 86.7000, postOffice: 'Deoghar H.O' },

  // Bihar
  '800001': { district: 'Patna', city: 'Patna G.P.O', state: 'Bihar', latitude: 25.6093, longitude: 85.1235, postOffice: 'Patna GPO' },
  '800004': { district: 'Patna', city: 'Patna City', state: 'Bihar', latitude: 25.5900, longitude: 85.2200, postOffice: 'Patna City S.O' },
  '800013': { district: 'Patna', city: 'Bailey Road / Digha', state: 'Bihar', latitude: 25.6200, longitude: 85.0900, postOffice: 'Digha Ghat S.O' },
  '801503': { district: 'Patna', city: 'Danapur Cantt', state: 'Bihar', latitude: 25.6300, longitude: 85.0400, postOffice: 'Danapur Cantt' },
  '823001': { district: 'Gaya', city: 'Gaya H.O', state: 'Bihar', latitude: 24.7955, longitude: 85.0002, postOffice: 'Gaya H.O' },
  '842001': { district: 'Muzaffarpur', city: 'Muzaffarpur H.O', state: 'Bihar', latitude: 26.1209, longitude: 85.3647, postOffice: 'Muzaffarpur H.O' },
  '812001': { district: 'Bhagalpur', city: 'Bhagalpur H.O', state: 'Bihar', latitude: 25.2425, longitude: 86.9842, postOffice: 'Bhagalpur H.O' },
  '846004': { district: 'Darbhanga', city: 'Darbhanga H.O', state: 'Bihar', latitude: 26.1542, longitude: 85.8918, postOffice: 'Darbhanga H.O' },

  // Uttar Pradesh
  '226001': { district: 'Lucknow', city: 'Lucknow G.P.O', state: 'Uttar Pradesh', latitude: 26.8467, longitude: 80.9462, postOffice: 'Lucknow GPO' },
  '226005': { district: 'Lucknow', city: 'Alambagh', state: 'Uttar Pradesh', latitude: 26.8122, longitude: 80.9022, postOffice: 'Alambagh S.O' },
  '226010': { district: 'Lucknow', city: 'Gomti Nagar', state: 'Uttar Pradesh', latitude: 26.8500, longitude: 81.0000, postOffice: 'Gomti Nagar S.O' },
  '221001': { district: 'Varanasi', city: 'Varanasi Cantt', state: 'Uttar Pradesh', latitude: 25.3280, longitude: 82.9800, postOffice: 'Varanasi Cantt H.O' },
  '221002': { district: 'Varanasi', city: 'Varanasi City H.O', state: 'Uttar Pradesh', latitude: 25.3176, longitude: 82.9739, postOffice: 'Varanasi H.O' },
  '208001': { district: 'Kanpur', city: 'Kanpur H.O', state: 'Uttar Pradesh', latitude: 26.4499, longitude: 80.3319, postOffice: 'Kanpur H.O' },
  '282001': { district: 'Agra', city: 'Agra Fort', state: 'Uttar Pradesh', latitude: 27.1767, longitude: 78.0081, postOffice: 'Agra Fort H.O' },
  '201301': { district: 'Gautam Buddha Nagar', city: 'Noida Sector 1', state: 'Uttar Pradesh', latitude: 28.5800, longitude: 77.3200, postOffice: 'Noida H.O' },
  '201001': { district: 'Ghaziabad', city: 'Ghaziabad H.O', state: 'Uttar Pradesh', latitude: 28.6692, longitude: 77.4538, postOffice: 'Ghaziabad H.O' },
  '211001': { district: 'Prayagraj', city: 'Allahabad H.O', state: 'Uttar Pradesh', latitude: 25.4358, longitude: 81.8463, postOffice: 'Allahabad H.O' },
  '273001': { district: 'Gorakhpur', city: 'Gorakhpur H.O', state: 'Uttar Pradesh', latitude: 26.7606, longitude: 83.3732, postOffice: 'Gorakhpur H.O' },

  // Delhi
  '110001': { district: 'New Delhi', city: 'Connaught Place', state: 'Delhi', latitude: 28.6315, longitude: 77.2167, postOffice: 'New Delhi GPO' },
  '110055': { district: 'Central Delhi', city: 'Pahar Ganj / Karol Bagh', state: 'Delhi', latitude: 28.6433, longitude: 77.2105, postOffice: 'Swami Ram Tirth Nagar' },
  '110092': { district: 'East Delhi', city: 'Laxmi Nagar', state: 'Delhi', latitude: 28.6300, longitude: 77.2700, postOffice: 'Laxmi Nagar S.O' },
  '110016': { district: 'South Delhi', city: 'Hauz Khas', state: 'Delhi', latitude: 28.5400, longitude: 77.2000, postOffice: 'Hauz Khas S.O' },
  '110034': { district: 'North West Delhi', city: 'Pitampura', state: 'Delhi', latitude: 28.7000, longitude: 77.1300, postOffice: 'Saraswati Vihar S.O' },

  // Maharashtra
  '400001': { district: 'Mumbai', city: 'Fort / GPO', state: 'Maharashtra', latitude: 18.9400, longitude: 72.8350, postOffice: 'Mumbai GPO' },
  '400051': { district: 'Mumbai Suburban', city: 'Bandra Kurla Complex (BKC)', state: 'Maharashtra', latitude: 19.0664, longitude: 72.8653, postOffice: 'Bandra East S.O' },
  '411001': { district: 'Pune', city: 'Pune H.O', state: 'Maharashtra', latitude: 18.5204, longitude: 73.8567, postOffice: 'Pune H.O' },
  '411005': { district: 'Pune', city: 'Shivajinagar', state: 'Maharashtra', latitude: 18.5314, longitude: 73.8446, postOffice: 'Shivaji Nagar S.O' },
  '440001': { district: 'Nagpur', city: 'Nagpur G.P.O', state: 'Maharashtra', latitude: 21.1458, longitude: 79.0882, postOffice: 'Nagpur GPO' },

  // Rajasthan
  '302001': { district: 'Jaipur', city: 'Jaipur G.P.O', state: 'Rajasthan', latitude: 26.9124, longitude: 75.7873, postOffice: 'Jaipur GPO' },
  '302005': { district: 'Jaipur', city: 'Sahkar Marg / Bapu Nagar', state: 'Rajasthan', latitude: 26.9022, longitude: 75.7958, postOffice: 'Bapu Nagar S.O' },
  '342001': { district: 'Jodhpur', city: 'Jodhpur H.O', state: 'Rajasthan', latitude: 26.2389, longitude: 73.0243, postOffice: 'Jodhpur H.O' },

  // Madhya Pradesh
  '462001': { district: 'Bhopal', city: 'Bhopal G.P.O', state: 'Madhya Pradesh', latitude: 23.2599, longitude: 77.4126, postOffice: 'Bhopal GPO' },
  '462003': { district: 'Bhopal', city: 'TT Nagar / Arera Colony', state: 'Madhya Pradesh', latitude: 23.2332, longitude: 77.4343, postOffice: 'T.T. Nagar H.O' },
  '452001': { district: 'Indore', city: 'Indore G.P.O', state: 'Madhya Pradesh', latitude: 22.7196, longitude: 75.8577, postOffice: 'Indore GPO' },

  // West Bengal
  '700001': { district: 'Kolkata', city: 'Kolkata G.P.O', state: 'West Bengal', latitude: 22.5726, longitude: 88.3639, postOffice: 'Kolkata GPO' },
  '700064': { district: 'Kolkata / North 24 Parganas', city: 'Salt Lake Sector 1', state: 'West Bengal', latitude: 22.5855, longitude: 88.4184, postOffice: 'Bikash Bhawan S.O' },
  '700091': { district: 'Kolkata', city: 'Salt Lake Sector 5', state: 'West Bengal', latitude: 22.5780, longitude: 88.4320, postOffice: 'Salt Lake Electronics S.O' },

  // Gujarat
  '380001': { district: 'Ahmedabad', city: 'Ahmedabad G.P.O', state: 'Gujarat', latitude: 23.0225, longitude: 72.5714, postOffice: 'Ahmedabad GPO' },
  '380006': { district: 'Ahmedabad', city: 'Ellisbridge', state: 'Gujarat', latitude: 23.0258, longitude: 72.5699, postOffice: 'Ellisbridge S.O' },
  '395003': { district: 'Surat', city: 'Surat H.O', state: 'Gujarat', latitude: 21.1702, longitude: 72.8311, postOffice: 'Surat H.O' },

  // Odisha
  '751001': { district: 'Khurda / Bhubaneswar', city: 'Bhubaneswar G.P.O', state: 'Odisha', latitude: 20.2961, longitude: 85.8245, postOffice: 'Bhubaneswar GPO' },
  '753001': { district: 'Cuttack', city: 'Cuttack G.P.O', state: 'Odisha', latitude: 20.4625, longitude: 85.8828, postOffice: 'Cuttack GPO' },

  // Punjab, Haryana & Chandigarh
  '160017': { district: 'Chandigarh', city: 'Sector 17', state: 'Punjab', latitude: 30.7398, longitude: 76.7827, postOffice: 'Sector 17 H.O' },
  '141001': { district: 'Ludhiana', city: 'Ludhiana H.O', state: 'Punjab', latitude: 30.9010, longitude: 75.8573, postOffice: 'Ludhiana H.O' },
  '122001': { district: 'Gurugram', city: 'Gurgaon H.O', state: 'Haryana', latitude: 28.4595, longitude: 77.0266, postOffice: 'Gurgaon H.O' },

  // South
  '560001': { district: 'Bengaluru Urban', city: 'Bengaluru G.P.O', state: 'Karnataka', latitude: 12.9791, longitude: 77.5913, postOffice: 'Bengaluru GPO' },
  '500001': { district: 'Hyderabad', city: 'Hyderabad G.P.O', state: 'Telangana', latitude: 17.3850, longitude: 78.4867, postOffice: 'Hyderabad GPO' },
  '500004': { district: 'Hyderabad', city: 'Masab Tank / Khairatabad', state: 'Telangana', latitude: 17.3984, longitude: 78.4482, postOffice: 'Khairatabad H.O' },
  '600001': { district: 'Chennai', city: 'Chennai G.P.O', state: 'Tamil Nadu', latitude: 13.0827, longitude: 80.2707, postOffice: 'Chennai GPO' },
  '600101': { district: 'Chennai', city: 'Anna Nagar / Teynampet', state: 'Tamil Nadu', latitude: 13.0336, longitude: 80.2458, postOffice: 'Anna Nagar S.O' },
  '695001': { district: 'Thiruvananthapuram', city: 'Trivandrum G.P.O', state: 'Kerala', latitude: 8.5241, longitude: 76.9366, postOffice: 'Trivandrum GPO' },
  '781001': { district: 'Kamrup Metro', city: 'Guwahati G.P.O', state: 'Assam', latitude: 26.1800, longitude: 91.7500, postOffice: 'Guwahati GPO' },
  '781006': { district: 'Kamrup Metro', city: 'Sixmile / Khanapara', state: 'Assam', latitude: 26.1445, longitude: 91.7362, postOffice: 'Dispur S.O' }
};

// In-memory cache for API lookup
const PINCODE_API_CACHE = new Map<string, PincodeLookupResult>();

/**
 * Haversine formula to calculate great-circle distance between two coordinates in km
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Synchronously look up a 6-digit PIN code against our built-in offline database
 */
export function lookupPincodeSync(pincode: string): PincodeLookupResult | null {
  const cleanPin = pincode.replace(/\D/g, '').trim();
  if (cleanPin.length < 3) return null;

  // 1. Direct 6-digit exact match
  if (PINCODE_MAP[cleanPin]) {
    const data = PINCODE_MAP[cleanPin];
    return {
      pincode: cleanPin,
      district: data.district,
      city: data.city,
      state: data.state,
      latitude: data.latitude,
      longitude: data.longitude,
      postOfficeName: data.postOffice,
      source: 'local_database'
    };
  }

  // 2. Check channel partner exact pincodes
  const partnerMatch = CHANNEL_PARTNERS.find((p) => p.pincode === cleanPin);
  if (partnerMatch) {
    return {
      pincode: cleanPin,
      district: partnerMatch.district,
      city: partnerMatch.district,
      state: partnerMatch.state,
      latitude: partnerMatch.latitude,
      longitude: partnerMatch.longitude,
      postOfficeName: `${partnerMatch.district} Head Office`,
      source: 'local_database'
    };
  }

  // 3. Check 3-digit prefix mapping
  for (const loc of Object.values(KNOWN_LOCATIONS)) {
    if (cleanPin.startsWith(loc.pincodePrefix)) {
      return {
        pincode: cleanPin,
        district: loc.name,
        city: loc.name,
        state: loc.state,
        latitude: loc.latitude,
        longitude: loc.longitude,
        postOfficeName: `${loc.name} Region`,
        source: 'prefix_estimate'
      };
    }
  }

  // 4. State prefix heuristic (1st digit of Indian PIN code)
  const firstDigit = cleanPin.charAt(0);
  const stateByZone: Record<string, { state: string; district: string; lat: number; lon: number }> = {
    '1': { state: 'Delhi / Haryana / Punjab', district: 'Delhi NCR', lat: 28.6139, lon: 77.2090 },
    '2': { state: 'Uttar Pradesh / Uttarakhand', district: 'Lucknow', lat: 26.8467, lon: 80.9462 },
    '3': { state: 'Rajasthan / Gujarat', district: 'Jaipur', lat: 26.9124, lon: 75.7873 },
    '4': { state: 'Maharashtra / Madhya Pradesh', district: 'Mumbai / Bhopal', lat: 19.0760, lon: 72.8777 },
    '5': { state: 'Telangana / Andhra Pradesh / Karnataka', district: 'Hyderabad / Bengaluru', lat: 17.3850, lon: 78.4867 },
    '6': { state: 'Tamil Nadu / Kerala', district: 'Chennai / Kochi', lat: 13.0827, lon: 80.2707 },
    '7': { state: 'West Bengal / Odisha / North East', district: 'Kolkata', lat: 22.5726, lon: 88.3639 },
    '8': { state: 'Jharkhand / Bihar', district: cleanPin.startsWith('815') ? 'Giridih' : cleanPin.startsWith('834') ? 'Ranchi' : cleanPin.startsWith('800') ? 'Patna' : 'Jharkhand / Bihar', lat: 24.1856, lon: 86.3072 }
  };

  if (cleanPin.length === 6 && stateByZone[firstDigit]) {
    const zone = stateByZone[firstDigit];
    return {
      pincode: cleanPin,
      district: zone.district,
      city: zone.district,
      state: zone.state,
      latitude: zone.lat,
      longitude: zone.lon,
      source: 'prefix_estimate'
    };
  }

  return null;
}

/**
 * Asynchronously lookup a 6-digit PIN code using local database + official India Post Postal API
 */
export async function lookupPincode(pincode: string): Promise<PincodeLookupResult | null> {
  const cleanPin = pincode.replace(/\D/g, '').trim();
  if (cleanPin.length !== 6) {
    return lookupPincodeSync(cleanPin);
  }

  // Check memory cache
  if (PINCODE_API_CACHE.has(cleanPin)) {
    return PINCODE_API_CACHE.get(cleanPin)!;
  }

  // Check local database first
  const localMatch = lookupPincodeSync(cleanPin);
  if (localMatch && localMatch.source === 'local_database') {
    PINCODE_API_CACHE.set(cleanPin, localMatch);
    return localMatch;
  }

  // Try live Postal Pincode API with timeout
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const response = await fetch(`https://api.postalpincode.in/pincode/${cleanPin}`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
        const po = data[0].PostOffice[0];
        const district = po.District || po.Block || 'District';
        const state = po.State || 'State';
        const poName = po.Name;

        // Estimate coordinates from known district or fallback
        const knownMatch = resolveLocation(district) || resolveLocation(state);
        const lat = knownMatch ? knownMatch.latitude : (localMatch?.latitude || 24.1856);
        const lon = knownMatch ? knownMatch.longitude : (localMatch?.longitude || 86.3072);

        const result: PincodeLookupResult = {
          pincode: cleanPin,
          district: district,
          city: po.Block && po.Block !== district ? `${po.Block}, ${district}` : district,
          state: state,
          latitude: lat,
          longitude: lon,
          postOfficeName: poName,
          source: 'postal_api'
        };

        PINCODE_API_CACHE.set(cleanPin, result);
        return result;
      }
    }
  } catch {
    // Fall back safely on error or timeout
  }

  if (localMatch) {
    PINCODE_API_CACHE.set(cleanPin, localMatch);
    return localMatch;
  }

  return null;
}

/**
 * Find coordinates and label by place name or pincode
 */
export function resolveLocation(query: string): { latitude: number; longitude: number; resolvedName: string } | null {
  const cleanQuery = query.toLowerCase().trim();
  if (!cleanQuery) return null;

  // 1. Check if it's a 6-digit PIN code
  const pinMatch = cleanQuery.match(/\b\d{6}\b/);
  if (pinMatch) {
    const res = lookupPincodeSync(pinMatch[0]);
    if (res) {
      return {
        latitude: res.latitude,
        longitude: res.longitude,
        resolvedName: `${res.district}, ${res.state} (PIN: ${res.pincode})`
      };
    }
  }

  // 2. Check known location names
  for (const [key, loc] of Object.entries(KNOWN_LOCATIONS)) {
    if (cleanQuery.includes(key) || loc.name.toLowerCase().includes(cleanQuery)) {
      return { latitude: loc.latitude, longitude: loc.longitude, resolvedName: `${loc.name}, ${loc.state}` };
    }
  }

  // 3. Check exact pincode matches in CHANNEL_PARTNERS
  const matchedPartner = CHANNEL_PARTNERS.find((p) => p.pincode === cleanQuery || cleanQuery.includes(p.pincode));
  if (matchedPartner) {
    return {
      latitude: matchedPartner.latitude,
      longitude: matchedPartner.longitude,
      resolvedName: `${matchedPartner.district} (PIN: ${matchedPartner.pincode})`
    };
  }

  // 4. Check pincode prefix
  for (const loc of Object.values(KNOWN_LOCATIONS)) {
    if (cleanQuery.startsWith(loc.pincodePrefix)) {
      return { latitude: loc.latitude, longitude: loc.longitude, resolvedName: `${loc.name} (${cleanQuery})` };
    }
  }

  return null;
}

/**
 * Intelligent Algorithm to Suggest the Single Nearest Authorized Institution based on Scheme & Location/PIN
 */
export function getNearestPartnerForScheme(
  schemeId: string,
  userLocation: {
    latitude?: number;
    longitude?: number;
    district?: string;
    state?: string;
    pincode?: string;
  }
): NearestPartnerMatch | null {
  if (!CHANNEL_PARTNERS.length) return null;

  // Filter partners that support this scheme (or all if not specified)
  let eligiblePartners = CHANNEL_PARTNERS.filter((p) =>
    schemeId === 'all' ? true : p.supportedSchemeIds.includes(schemeId)
  );

  // Fallback to all active partners if none specific found
  if (eligiblePartners.length === 0) {
    eligiblePartners = CHANNEL_PARTNERS;
  }

  // Resolve user coordinates
  let userLat = userLocation.latitude;
  let userLon = userLocation.longitude;
  let locName = userLocation.district || '';

  if ((userLat === undefined || userLon === undefined) && userLocation.pincode) {
    const pinRes = lookupPincodeSync(userLocation.pincode);
    if (pinRes) {
      userLat = pinRes.latitude;
      userLon = pinRes.longitude;
      locName = `${pinRes.district}, ${pinRes.state}`;
    }
  }

  if (userLat === undefined || userLon === undefined) {
    const locRes = resolveLocation(userLocation.district || userLocation.state || 'Giridih');
    if (locRes) {
      userLat = locRes.latitude;
      userLon = locRes.longitude;
      locName = locRes.resolvedName;
    } else {
      // Default to Giridih center coordinates
      userLat = 24.1856;
      userLon = 86.3072;
      locName = 'Giridih, Jharkhand';
    }
  }

  // Rank eligible partners by geodesic distance and district match
  const ranked = eligiblePartners.map((partner) => {
    const distanceKm = calculateDistanceKm(userLat!, userLon!, partner.latitude, partner.longitude);
    const isDistrictMatch = Boolean(
      userLocation.district && partner.district.toLowerCase() === userLocation.district.toLowerCase()
    );

    return {
      partner,
      distanceKm,
      isDistrictMatch,
      userLocationName: locName || `${partner.district}, ${partner.state}`
    };
  });

  // Sort: First by district match priority if within reasonable distance, then absolute distance in km
  ranked.sort((a, b) => {
    if (a.isDistrictMatch && !b.isDistrictMatch && a.distanceKm < 50) return -1;
    if (!a.isDistrictMatch && b.isDistrictMatch && b.distanceKm < 50) return 1;
    return a.distanceKm - b.distanceKm;
  });

  return ranked[0] || null;
}

/**
 * Search and rank channel partners with distance calculation
 */
export function searchChannelPartners(params: {
  schemeId?: string;
  partnerType?: string;
  userCoords?: { latitude: number; longitude: number };
  searchQuery?: string;
  district?: string;
  state?: string;
  onlyActive?: boolean;
}): ChannelPartner[] {
  const { schemeId, partnerType, userCoords, searchQuery, district, state, onlyActive } = params;

  let results = [...CHANNEL_PARTNERS];

  // 1. Filter by scheme support if specified
  if (schemeId && schemeId !== 'all') {
    results = results.filter((p) => p.supportedSchemeIds.includes(schemeId));
  }

  // 2. Filter by partner type (SCA, Bank, RRB, NBFC)
  if (partnerType && partnerType !== 'all') {
    results = results.filter((p) => p.type === partnerType);
  }

  // 3. Filter by district or state
  if (district && district !== 'all') {
    results = results.filter((p) => p.district.toLowerCase() === district.toLowerCase());
  }

  if (state && state !== 'all') {
    results = results.filter((p) => p.state.toLowerCase() === state.toLowerCase());
  }

  // 4. Text query filter
  if (searchQuery && searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.branchName.toLowerCase().includes(q) ||
        p.district.toLowerCase().includes(q) ||
        p.state.toLowerCase().includes(q) ||
        p.pincode.includes(q) ||
        p.address.toLowerCase().includes(q) ||
        p.typeLabel.toLowerCase().includes(q)
    );
  }

  if (onlyActive) {
    results = results.filter((p) => p.activeStatus === 'Active');
  }

  // 5. Calculate distance and sort
  if (userCoords) {
    results = results.map((p) => {
      const dist = calculateDistanceKm(userCoords.latitude, userCoords.longitude, p.latitude, p.longitude);
      return {
        ...p,
        distanceKm: dist
      };
    });

    results.sort((a, b) => (a.distanceKm || 99999) - (b.distanceKm || 99999));
  }

  return results;
}
