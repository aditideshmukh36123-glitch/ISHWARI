import { FraudScopeEngine, ScoreResult } from '../services/riskEngine';

export interface AlertQueueItem {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  amount: number;
  location: string;
  device_id: string;
  hour: number;
  txn_count_10min: number;
  seconds_since_prev: number;
  status: 'PENDING_REVIEW' | 'CONFIRMED_FRAUD' | 'APPROVED' | 'FALSE_POSITIVE';
  scoreResult: ScoreResult;
}

export const INITIAL_ALERTS: AlertQueueItem[] = [
  {
    id: "TXN-90218",
    timestamp: "2 mins ago",
    userId: "U00372",
    userName: "Aarav Sharma",
    amount: 85000,
    location: "Delhi",
    device_id: "unknown-device-882",
    hour: 2,
    txn_count_10min: 7,
    seconds_since_prev: 45,
    status: 'PENDING_REVIEW',
    scoreResult: FraudScopeEngine.score({
      userId: "U00372",
      amount: 85000,
      hour: 2,
      location: "Delhi",
      device_id: "unknown-device-882",
      txn_count_10min: 7,
      seconds_since_prev: 45
    })
  },
  {
    id: "TXN-90217",
    timestamp: "6 mins ago",
    userId: "U00634",
    userName: "Priya Patel",
    amount: 1450,
    location: "Bengaluru",
    device_id: "android-a",
    hour: 14,
    txn_count_10min: 1,
    seconds_since_prev: 4800,
    status: 'APPROVED',
    scoreResult: FraudScopeEngine.score({
      userId: "U00634",
      amount: 1450,
      hour: 14,
      location: "Bengaluru",
      device_id: "android-a",
      txn_count_10min: 1,
      seconds_since_prev: 4800
    })
  },
  {
    id: "TXN-90216",
    timestamp: "12 mins ago",
    userId: "U00566",
    userName: "Vikram Malhotra",
    amount: 185000,
    location: "Dubai",
    device_id: "unk-9941",
    hour: 3,
    txn_count_10min: 4,
    seconds_since_prev: 110,
    status: 'PENDING_REVIEW',
    scoreResult: FraudScopeEngine.score({
      userId: "U00566",
      amount: 185000,
      hour: 3,
      location: "Dubai",
      device_id: "unk-9941",
      txn_count_10min: 4,
      seconds_since_prev: 110
    })
  },
  {
    id: "TXN-90215",
    timestamp: "15 mins ago",
    userId: "U00165",
    userName: "Ananya Rao",
    amount: 3200,
    location: "Mumbai",
    device_id: "ios-a",
    hour: 16,
    txn_count_10min: 2,
    seconds_since_prev: 360,
    status: 'APPROVED',
    scoreResult: FraudScopeEngine.score({
      userId: "U00165",
      amount: 3200,
      hour: 16,
      location: "Mumbai",
      device_id: "ios-a",
      txn_count_10min: 2,
      seconds_since_prev: 360
    })
  },
  {
    id: "TXN-90214",
    timestamp: "21 mins ago",
    userId: "U01035",
    userName: "Rohan Verma",
    amount: 120,
    location: "Hyderabad",
    device_id: "unk-bot-12",
    hour: 1,
    txn_count_10min: 9,
    seconds_since_prev: 18,
    status: 'PENDING_REVIEW',
    scoreResult: FraudScopeEngine.score({
      userId: "U01035",
      amount: 120,
      hour: 1,
      location: "Hyderabad",
      device_id: "unk-bot-12",
      txn_count_10min: 9,
      seconds_since_prev: 18
    })
  },
  {
    id: "TXN-90213",
    timestamp: "28 mins ago",
    userId: "U00282",
    userName: "Aditi Kulkarni",
    amount: 4200,
    location: "Pune",
    device_id: "web-chrome",
    hour: 11,
    txn_count_10min: 1,
    seconds_since_prev: 9200,
    status: 'APPROVED',
    scoreResult: FraudScopeEngine.score({
      userId: "U00282",
      amount: 4200,
      hour: 11,
      location: "Pune",
      device_id: "web-chrome",
      txn_count_10min: 1,
      seconds_since_prev: 9200
    })
  },
  {
    id: "TXN-90212",
    timestamp: "35 mins ago",
    userId: "U00490",
    userName: "Sanjay Singhania",
    amount: 42000,
    location: "London",
    device_id: "unk-9912",
    hour: 4,
    txn_count_10min: 5,
    seconds_since_prev: 55,
    status: 'CONFIRMED_FRAUD',
    scoreResult: FraudScopeEngine.score({
      userId: "U00490",
      amount: 42000,
      hour: 4,
      location: "London",
      device_id: "unk-9912",
      txn_count_10min: 5,
      seconds_since_prev: 55
    })
  },
  {
    id: "TXN-90211",
    timestamp: "42 mins ago",
    userId: "U01128",
    userName: "Divya Menon",
    amount: 9200,
    location: "Jaipur",
    device_id: "web-edge",
    hour: 18,
    txn_count_10min: 1,
    seconds_since_prev: 15400,
    status: 'APPROVED',
    scoreResult: FraudScopeEngine.score({
      userId: "U01128",
      amount: 9200,
      hour: 18,
      location: "Jaipur",
      device_id: "web-edge",
      txn_count_10min: 1,
      seconds_since_prev: 15400
    })
  },
  {
    id: "TXN-90210",
    timestamp: "50 mins ago",
    userId: "U00311",
    userName: "Sunita Nair",
    amount: 68000,
    location: "Delhi",
    device_id: "web-chrome",
    hour: 15,
    txn_count_10min: 2,
    seconds_since_prev: 720,
    status: 'APPROVED',
    scoreResult: FraudScopeEngine.score({
      userId: "U00311",
      amount: 68000,
      hour: 15,
      location: "Delhi",
      device_id: "web-chrome",
      txn_count_10min: 2,
      seconds_since_prev: 720
    })
  },
  {
    id: "TXN-90209",
    timestamp: "1 hour ago",
    userId: "U00930",
    userName: "Karan Johar",
    amount: 19500,
    location: "Kolkata",
    device_id: "unk-4581",
    hour: 2,
    txn_count_10min: 3,
    seconds_since_prev: 240,
    status: 'FALSE_POSITIVE',
    scoreResult: FraudScopeEngine.score({
      userId: "U00930",
      amount: 19500,
      hour: 2,
      location: "Kolkata",
      device_id: "unk-4581",
      txn_count_10min: 3,
      seconds_since_prev: 240
    })
  }
];
