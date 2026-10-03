export interface UserProfile {
  userId: string;
  name: string;
  email: string;
  riskTier: 'LOW' | 'MEDIUM' | 'HIGH';
  txn_count: number;
  mean_amount: number;
  std_amount: number;
  known_devices: string[];
  known_locations: string[];
  accountCreated: string;
  phone: string;
}

// User profiles loaded from customer transaction history dataset
export const USER_PROFILES_RAW: Record<string, Omit<UserProfile, 'userId' | 'name' | 'email' | 'riskTier' | 'accountCreated' | 'phone'>> = {
  "U00372": {
    "txn_count": 83,
    "mean_amount": 830.78,
    "std_amount": 1250.35,
    "known_devices": ["android-b", "ios-a", "unk-3729", "unk-4674", "web-chrome", "web-edge"],
    "known_locations": ["Bengaluru", "Chennai", "Delhi", "Hyderabad", "Jaipur", "Nagpur"]
  },
  "U00634": {
    "txn_count": 79,
    "mean_amount": 1674.93,
    "std_amount": 1741.99,
    "known_devices": ["android-a", "android-b", "ios-a", "unk-2785", "web-chrome", "web-edge"],
    "known_locations": ["Bengaluru", "Delhi", "Jaipur", "Mumbai", "Nagpur", "Pune"]
  },
  "U00566": {
    "txn_count": 78,
    "mean_amount": 5936.95,
    "std_amount": 9626.92,
    "known_devices": ["ios-a", "ios-b", "unk-1491", "web-chrome", "web-edge"],
    "known_locations": ["Bengaluru", "Chennai", "Delhi", "Hyderabad", "Jaipur", "Mumbai", "Nagpur", "Pune"]
  },
  "U00165": {
    "txn_count": 78,
    "mean_amount": 2748.37,
    "std_amount": 2753.54,
    "known_devices": ["android-a", "android-b", "ios-a", "web-chrome", "web-edge"],
    "known_locations": ["Bengaluru", "Chennai", "Hyderabad", "Jaipur", "Mumbai", "Nagpur", "Pune"]
  },
  "U01035": {
    "txn_count": 77,
    "mean_amount": 4101.62,
    "std_amount": 5164.97,
    "known_devices": ["android-a", "android-b", "ios-a", "ios-b", "unk-2892", "unk-4467", "web-chrome"],
    "known_locations": ["Bengaluru", "Chennai", "Hyderabad", "Jaipur", "Mumbai", "Nagpur"]
  },
  "U01197": {
    "txn_count": 76,
    "mean_amount": 2064.23,
    "std_amount": 2528.16,
    "known_devices": ["android-a", "android-b", "ios-a", "unk-4330", "unk-8930"],
    "known_locations": ["Bengaluru", "Chennai", "Delhi", "Jaipur", "Nagpur"]
  },
  "U00282": {
    "txn_count": 75,
    "mean_amount": 4567.14,
    "std_amount": 6348.14,
    "known_devices": ["android-a", "android-b", "ios-a", "web-chrome", "web-edge"],
    "known_locations": ["Chennai", "Delhi", "Hyderabad", "Jaipur", "Nagpur", "Pune"]
  },
  "U00490": {
    "txn_count": 74,
    "mean_amount": 1689.11,
    "std_amount": 4403.82,
    "known_devices": ["android-a", "ios-a", "ios-b", "web-edge"],
    "known_locations": ["Bengaluru", "Chennai", "Delhi", "Jaipur", "Mumbai", "Pune"]
  },
  "U01128": {
    "txn_count": 73,
    "mean_amount": 8154.1,
    "std_amount": 8137.27,
    "known_devices": ["android-a", "ios-a", "ios-b", "unk-2423", "web-edge"],
    "known_locations": ["Bengaluru", "Chennai", "Delhi", "Hyderabad", "Jaipur", "Mumbai", "Pune"]
  },
  "U00322": {
    "txn_count": 73,
    "mean_amount": 4389.86,
    "std_amount": 5333.05,
    "known_devices": ["android-a", "android-b", "ios-b", "unk-6687", "web-chrome", "web-edge"],
    "known_locations": ["Bengaluru", "Chennai", "Delhi", "Hyderabad", "Jaipur", "Mumbai", "Nagpur", "Pune"]
  },
  "U00311": {
    "txn_count": 72,
    "mean_amount": 11034.24,
    "std_amount": 26582.71,
    "known_devices": ["android-a", "ios-a", "web-chrome", "web-edge"],
    "known_locations": ["Bengaluru", "Chennai", "Delhi", "Nagpur", "Pune"]
  },
  "U00930": {
    "txn_count": 72,
    "mean_amount": 3114.35,
    "std_amount": 2578.21,
    "known_devices": ["android-a", "ios-b", "web-chrome"],
    "known_locations": ["Bengaluru", "Hyderabad", "Jaipur", "Nagpur", "Pune"]
  },
  "U01172": {
    "txn_count": 71,
    "mean_amount": 3233.93,
    "std_amount": 2993.1,
    "known_devices": ["android-a", "android-b", "ios-b", "web-chrome", "web-edge"],
    "known_locations": ["Chennai", "Delhi", "Hyderabad", "Jaipur", "Mumbai"]
  },
  "U01027": {
    "txn_count": 71,
    "mean_amount": 1552.16,
    "std_amount": 1613.68,
    "known_devices": ["android-b", "ios-b", "unk-9039", "unk-9060", "web-chrome", "web-edge"],
    "known_locations": ["Bengaluru", "Delhi", "Hyderabad", "Jaipur", "Mumbai", "Nagpur", "Pune"]
  },
  "U00750": {
    "txn_count": 70,
    "mean_amount": 6193.4,
    "std_amount": 6752.99,
    "known_devices": ["android-a", "ios-a", "ios-b", "web-chrome", "web-edge"],
    "known_locations": ["Bengaluru", "Chennai", "Delhi", "Hyderabad", "Jaipur", "Mumbai", "Nagpur", "Pune"]
  },
  "U00410": {
    "txn_count": 70,
    "mean_amount": 3611.19,
    "std_amount": 4631.63,
    "known_devices": ["android-a", "ios-a", "ios-b", "unk-644", "unk-8297", "web-edge"],
    "known_locations": ["Bengaluru", "Chennai", "Delhi", "Hyderabad", "Jaipur", "Mumbai", "Nagpur", "Pune"]
  },
  "U01129": {
    "txn_count": 69,
    "mean_amount": 4653.86,
    "std_amount": 4482.53,
    "known_devices": ["android-a", "ios-a", "ios-b", "unk-3486", "web-chrome", "web-edge"],
    "known_locations": ["Delhi", "Hyderabad", "Jaipur", "Mumbai", "Pune"]
  },
  "U01088": {
    "txn_count": 69,
    "mean_amount": 2408.13,
    "std_amount": 2600.43,
    "known_devices": ["android-a", "android-b", "ios-b", "web-chrome", "web-edge"],
    "known_locations": ["Bengaluru", "Chennai", "Delhi", "Hyderabad", "Jaipur", "Pune"]
  },
  "U01155": {
    "txn_count": 69,
    "mean_amount": 6146.31,
    "std_amount": 10293.58,
    "known_devices": ["android-a", "android-b", "ios-a", "ios-b"],
    "known_locations": ["Bengaluru", "Chennai", "Delhi", "Hyderabad", "Jaipur", "Nagpur", "Pune"]
  },
  "U00982": {
    "txn_count": 69,
    "mean_amount": 1073.32,
    "std_amount": 982.53,
    "known_devices": ["android-a", "android-b", "ios-a", "ios-b", "unk-3229", "web-chrome"],
    "known_locations": ["Chennai", "Delhi", "Hyderabad", "Jaipur", "Pune"]
  },
  "U00179": {
    "txn_count": 69,
    "mean_amount": 4470.16,
    "std_amount": 5025.2,
    "known_devices": ["android-a", "android-b", "ios-a", "unk-4815", "web-chrome"],
    "known_locations": ["Bengaluru", "Chennai", "Delhi", "Hyderabad", "Jaipur", "Mumbai", "Nagpur", "Pune"]
  },
  "U00577": {
    "txn_count": 68,
    "mean_amount": 2355.9,
    "std_amount": 4258.63,
    "known_devices": ["android-a", "ios-a", "ios-b", "unk-3410", "unk-658", "web-edge"],
    "known_locations": ["Chennai", "Delhi", "Hyderabad", "Mumbai", "Nagpur", "Pune"]
  },
  "U00946": {
    "txn_count": 68,
    "mean_amount": 1645.86,
    "std_amount": 2058.33,
    "known_devices": ["android-a", "ios-a", "ios-b", "unk-6560", "web-chrome", "web-edge"],
    "known_locations": ["Bengaluru", "Chennai", "Delhi", "Hyderabad", "Jaipur", "Mumbai", "Nagpur", "Pune"]
  },
  "U00451": {
    "txn_count": 68,
    "mean_amount": 1738.37,
    "std_amount": 1748.22,
    "known_devices": ["android-a", "ios-a", "ios-b", "unk-3559", "web-chrome", "web-edge"],
    "known_locations": ["Bengaluru", "Chennai", "Delhi", "Jaipur", "Mumbai", "Nagpur", "Pune"]
  },
  "U00745": {
    "txn_count": 68,
    "mean_amount": 4921.92,
    "std_amount": 5777.09,
    "known_devices": ["android-b", "ios-a", "ios-b", "web-chrome", "web-edge"],
    "known_locations": ["Bengaluru", "Chennai", "Delhi", "Hyderabad", "Mumbai", "Nagpur", "Pune"]
  },
  "U00383": {
    "txn_count": 68,
    "mean_amount": 8216.59,
    "std_amount": 11781.53,
    "known_devices": ["android-a", "android-b", "web-chrome", "web-edge"],
    "known_locations": ["Bengaluru", "Chennai", "Delhi", "Hyderabad", "Mumbai", "Nagpur", "Pune"]
  },
  "U00069": {
    "txn_count": 68,
    "mean_amount": 2158.44,
    "std_amount": 3192.14,
    "known_devices": ["ios-a", "ios-b", "unk-3907", "unk-7896", "unk-9347", "web-chrome", "web-edge"],
    "known_locations": ["Bengaluru", "Chennai", "Delhi", "Hyderabad", "Jaipur", "Mumbai", "Nagpur", "Pune"]
  },
  "U00013": {
    "txn_count": 68,
    "mean_amount": 1385.33,
    "std_amount": 1994.14,
    "known_devices": ["android-a", "ios-a", "ios-b", "web-chrome", "web-edge"],
    "known_locations": ["Chennai", "Jaipur", "Mumbai", "Nagpur", "Pune"]
  },
  "U00409": {
    "txn_count": 67,
    "mean_amount": 2212.6,
    "std_amount": 1512.39,
    "known_devices": ["android-a", "android-b", "ios-a", "unk-5674", "web-edge"],
    "known_locations": ["Bengaluru", "Chennai", "Delhi", "Hyderabad", "Jaipur", "Nagpur", "Pune"]
  },
  "U01006": {
    "txn_count": 67,
    "mean_amount": 5214.36,
    "std_amount": 5776.87,
    "known_devices": ["android-a", "android-b", "ios-a", "ios-b", "unk-7103", "web-chrome", "web-edge"],
    "known_locations": ["Bengaluru", "Delhi", "Hyderabad", "Jaipur", "Mumbai", "Nagpur", "Pune"]
  },
  "U00385": {
    "txn_count": 66,
    "mean_amount": 4847.13,
    "std_amount": 4624.02,
    "known_devices": ["android-a", "android-b", "ios-a", "unk-7546", "web-edge"],
    "known_locations": ["Bengaluru", "Chennai", "Hyderabad", "Mumbai", "Nagpur", "Pune"]
  },
  "U00579": {
    "txn_count": 66,
    "mean_amount": 6785.07,
    "std_amount": 8935.81,
    "known_devices": ["android-a", "android-b", "ios-a", "ios-b", "web-chrome", "web-edge"],
    "known_locations": ["Bengaluru", "Chennai", "Delhi", "Hyderabad", "Jaipur", "Nagpur", "Pune"]
  },
  "U00581": {
    "txn_count": 66,
    "mean_amount": 3840.41,
    "std_amount": 6530.81,
    "known_devices": ["android-a", "ios-a", "unk-2762", "web-chrome", "web-edge"],
    "known_locations": ["Bengaluru", "Chennai", "Delhi", "Hyderabad", "Mumbai", "Nagpur"]
  },
  "U00054": {
    "txn_count": 66,
    "mean_amount": 14386.93,
    "std_amount": 17935.95,
    "known_devices": ["android-a", "android-b", "unk-64", "web-chrome"],
    "known_locations": ["Chennai", "Hyderabad", "Jaipur", "Mumbai", "Nagpur", "Pune"]
  },
  "U00617": {
    "txn_count": 66,
    "mean_amount": 3372.06,
    "std_amount": 3033.98,
    "known_devices": ["android-b", "ios-a", "ios-b", "web-chrome", "web-edge"],
    "known_locations": ["Bengaluru", "Chennai", "Delhi", "Mumbai", "Nagpur", "Pune"]
  },
  "U00878": {
    "txn_count": 66,
    "mean_amount": 5211.5,
    "std_amount": 10697.5,
    "known_devices": ["android-a", "android-b", "ios-a", "ios-b", "unk-9581", "web-chrome", "web-edge"],
    "known_locations": ["Bengaluru", "Chennai", "Delhi", "Hyderabad", "Jaipur", "Mumbai", "Nagpur", "Pune"]
  },
  "U00208": {
    "txn_count": 66,
    "mean_amount": 6404.14,
    "std_amount": 14031.57,
    "known_devices": ["android-b", "ios-a", "ios-b", "unk-7718", "web-chrome"],
    "known_locations": ["Bengaluru", "Chennai", "Delhi", "Hyderabad", "Nagpur", "Pune"]
  },
  "U00589": {
    "txn_count": 66,
    "mean_amount": 2779.06,
    "std_amount": 2772.85,
    "known_devices": ["android-a", "android-b", "ios-a", "ios-b", "unk-1986", "unk-5677", "web-chrome", "web-edge"],
    "known_locations": ["Chennai", "Hyderabad", "Mumbai", "Nagpur"]
  },
  "U00230": {
    "txn_count": 66,
    "mean_amount": 7215.82,
    "std_amount": 7654.33,
    "known_devices": ["android-a", "android-b", "ios-a", "ios-b", "unk-1227", "web-edge"],
    "known_locations": ["Bengaluru", "Chennai", "Jaipur", "Pune"]
  },
  "U00154": {
    "txn_count": 65,
    "mean_amount": 737.01,
    "std_amount": 894.07,
    "known_devices": ["android-b", "ios-a", "ios-b", "unk-6001", "web-chrome", "web-edge"],
    "known_locations": ["Bengaluru", "Chennai", "Delhi", "Hyderabad", "Jaipur", "Mumbai", "Nagpur", "Pune"]
  },
  "U01072": {
    "txn_count": 65,
    "mean_amount": 4220.41,
    "std_amount": 3711.66,
    "known_devices": ["android-b", "ios-a", "ios-b", "web-chrome"],
    "known_locations": ["Bengaluru", "Chennai", "Jaipur", "Mumbai", "Pune"]
  },
  "U00820": {
    "txn_count": 65,
    "mean_amount": 6272.09,
    "std_amount": 12449.15,
    "known_devices": ["android-a", "android-b", "ios-a", "ios-b", "unk-8852", "web-chrome", "web-edge"],
    "known_locations": ["Bengaluru", "Chennai", "Delhi", "Hyderabad", "Jaipur", "Mumbai", "Pune"]
  },
  "U00962": {
    "txn_count": 65,
    "mean_amount": 2785.92,
    "std_amount": 2202.71,
    "known_devices": ["android-b", "ios-a", "ios-b", "unk-3027", "web-chrome"],
    "known_locations": ["Bengaluru", "Chennai", "Delhi", "Hyderabad", "Jaipur", "Mumbai", "Nagpur", "Pune"]
  },
  "U00035": {
    "txn_count": 64,
    "mean_amount": 1583.95,
    "std_amount": 2781.0,
    "known_devices": ["android-b", "ios-a", "ios-b", "unk-6894", "web-chrome", "web-edge"],
    "known_locations": ["Bengaluru", "Chennai", "Delhi", "Jaipur", "Mumbai", "Nagpur", "Pune"]
  },
  "U00393": {
    "txn_count": 64,
    "mean_amount": 2106.48,
    "std_amount": 1890.36,
    "known_devices": ["android-a", "ios-a", "ios-b", "unk-3604", "unk-8202", "web-chrome", "web-edge"],
    "known_locations": ["Bengaluru", "Hyderabad", "Jaipur", "Mumbai", "Nagpur", "Pune"]
  },
  "U01090": {
    "txn_count": 64,
    "mean_amount": 1527.35,
    "std_amount": 2536.55,
    "known_devices": ["android-b", "ios-b", "web-chrome", "web-edge"],
    "known_locations": ["Bengaluru", "Chennai", "Hyderabad", "Jaipur", "Mumbai", "Nagpur", "Pune"]
  },
  "U01055": {
    "txn_count": 64,
    "mean_amount": 867.76,
    "std_amount": 987.87,
    "known_devices": ["android-a", "android-b", "ios-a", "ios-b", "web-chrome", "web-edge"],
    "known_locations": ["Bengaluru", "Chennai", "Delhi", "Hyderabad", "Jaipur", "Mumbai", "Nagpur"]
  },
  "U00342": {
    "txn_count": 64,
    "mean_amount": 3961.94,
    "std_amount": 3717.98,
    "known_devices": ["android-a", "android-b", "ios-b", "unk-3542", "web-chrome", "web-edge"],
    "known_locations": ["Bengaluru", "Delhi", "Hyderabad", "Jaipur", "Pune"]
  },
  "U01126": {
    "txn_count": 64,
    "mean_amount": 3713.96,
    "std_amount": 3433.72,
    "known_devices": ["android-b", "ios-a", "unk-9774", "web-chrome", "web-edge"],
    "known_locations": ["Bengaluru", "Chennai", "Delhi", "Hyderabad", "Mumbai", "Nagpur", "Pune"]
  },
  "U01068": {
    "txn_count": 63,
    "mean_amount": 4055.09,
    "std_amount": 5533.51,
    "known_devices": ["android-a", "android-b", "ios-b", "web-chrome"],
    "known_locations": ["Bengaluru", "Chennai", "Delhi", "Hyderabad", "Jaipur", "Mumbai", "Nagpur"]
  },
  "U00506": {
    "txn_count": 63,
    "mean_amount": 2304.94,
    "std_amount": 2480.04,
    "known_devices": ["android-b", "ios-b", "web-chrome", "web-edge"],
    "known_locations": ["Bengaluru", "Delhi", "Hyderabad", "Jaipur", "Mumbai", "Nagpur", "Pune"]
  },
  "U00000": {
    "txn_count": 52,
    "mean_amount": 1287.61,
    "std_amount": 1432.08,
    "known_devices": ["android-a", "android-b", "ios-a", "web-chrome", "web-edge"],
    "known_locations": ["Delhi", "Mumbai", "Nagpur", "Pune"]
  }
};

const SAMPLE_NAMES = [
  "Aarav Sharma", "Priya Patel", "Vikram Malhotra", "Ananya Rao", "Rohan Verma", 
  "Neha Deshmukh", "Aditi Kulkarni", "Sanjay Singhania", "Divya Menon", "Arjun Reddy",
  "Meera Iyer", "Kabir Sen", "Sunita Nair", "Karan Johar", "Tanvi Joshi", 
  "Rajesh Bhatt", "Pooja Hegde", "Amitabh Roy", "Shreya Ghoshal", "Devendra Fadnavis"
];

// Enrich raw profiles with synthetic identity metadata for realistic display
export const USER_PROFILES: UserProfile[] = Object.entries(USER_PROFILES_RAW).map(([userId, data], idx) => {
  const name = SAMPLE_NAMES[idx % SAMPLE_NAMES.length];
  const email = `${name.toLowerCase().replace(' ', '.')}${idx + 10}@example.com`;
  const riskTier: 'LOW' | 'MEDIUM' | 'HIGH' = data.mean_amount > 8000 ? 'MEDIUM' : 'LOW';
  
  return {
    userId,
    name,
    email,
    riskTier,
    txn_count: data.txn_count,
    mean_amount: data.mean_amount,
    std_amount: data.std_amount,
    known_devices: data.known_devices,
    known_locations: data.known_locations,
    accountCreated: `2024-${String((idx % 12) + 1).padStart(2, '0')}-${String((idx % 28) + 1).padStart(2, '0')}`,
    phone: `+91 98${String(10000000 + idx * 7919).slice(0, 8)}`
  };
});

export const USER_PROFILES_MAP = new Map<string, UserProfile>(
  USER_PROFILES.map(u => [u.userId, u])
);

export function getUserProfile(userId: string): UserProfile {
  return USER_PROFILES_MAP.get(userId) || {
    userId,
    name: "Standard Customer",
    email: `${userId.toLowerCase()}@client.com`,
    riskTier: 'LOW',
    txn_count: 50,
    mean_amount: 2500,
    std_amount: 2500,
    known_devices: ["android-a", "web-chrome"],
    known_locations: ["Bengaluru", "Mumbai"],
    accountCreated: "2024-01-15",
    phone: "+91 9876543210"
  };
}
