import type {
  Player,
  Match,
  User,
  Location,
} from "@/types";

export const MOCK_LOCATIONS: Location[] = [
  {
    id: "loc-1",
    name: "Barangay Central Indoor Court",
    address: "Poblacion District",
    courtType: "indoor",
    latitude: 8.4822,
    longitude: 124.6472,
    imageUrl:
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80",
    createdAt: "2026-08-01T08:00:00Z",
  },
  {
    id: "loc-2",
    name: "Metropolitan Sports Complex",
    address: "University Belt",
    courtType: "outdoor",
    latitude: 8.4772,
    longitude: 124.6425,
    imageUrl:
      "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=800&q=80",
    createdAt: "2026-08-01T08:00:00Z",
  },
  {
    id: "loc-3",
    name: "Sunset Ridge Pickleball Club",
    address: "Heights Boulevard",
    courtType: "outdoor",
    latitude: 8.4891,
    longitude: 124.6533,
    imageUrl:
      "https://images.unsplash.com/photo-1534158914592-062992fbe900?auto=format&fit=crop&w=800&q=80",
    createdAt: "2026-08-05T10:00:00Z",
  },
];

export const MOCK_PLAYERS: Player[] = [
  {
    id: "a1111111-1111-1111-1111-111111111111",
    slug: "alex-perez",
    displayName: "Alex Perez",
    avatarUrl:
      "https://api.dicebear.com/7.x/bottts/svg?seed=Alex",
    createdAt: "2026-08-01T10:00:00Z",
    stats: {
      totalMatches: 22,
      wins: 18,
      losses: 4,
      winRate: 81.8,
      rating: 1486,
      rank: "Platinum",
    },
  },
  {
    id: "b2222222-2222-2222-2222-222222222222",
    slug: "jordan-lee",
    displayName: "Jordan Lee",
    avatarUrl:
      "https://api.dicebear.com/7.x/bottts/svg?seed=Jordan",
    createdAt: "2026-08-01T10:00:00Z",
    stats: {
      totalMatches: 19,
      wins: 9,
      losses: 10,
      winRate: 47.4,
      rating: 1088,
      rank: "Silver",
    },
  },
  {
    id: "c3333333-3333-3333-3333-333333333333",
    slug: "sam-chen",
    displayName: "Sam Chen",
    avatarUrl:
      "https://api.dicebear.com/7.x/bottts/svg?seed=Sam",
    createdAt: "2026-08-02T14:30:00Z",
    stats: {
      totalMatches: 27,
      wins: 23,
      losses: 4,
      winRate: 85.2,
      rating: 1624,
      rank: "Diamond",
    },
  },
  {
    id: "d4444444-4444-4444-4444-444444444444",
    slug: "taylor-rivera",
    displayName: "Taylor Rivera",
    avatarUrl:
      "https://api.dicebear.com/7.x/bottts/svg?seed=Taylor",
    createdAt: "2026-08-03T09:15:00Z",
    stats: {
      totalMatches: 24,
      wins: 14,
      losses: 10,
      winRate: 58.3,
      rating: 1267,
      rank: "Gold",
    },
  },
  {
    id: "e5555555-5555-5555-5555-555555555555",
    slug: "morgan-vance",
    displayName: "Morgan Vance",
    avatarUrl:
      "https://api.dicebear.com/7.x/bottts/svg?seed=Morgan",
    createdAt: "2026-08-04T11:45:00Z",
    stats: {
      totalMatches: 25,
      wins: 20,
      losses: 5,
      winRate: 80.0,
      rating: 1542,
      rank: "Platinum",
    },
  },
  {
    id: "f6666666-6666-6666-6666-666666666666",
    slug: "casey-smith",
    displayName: "Casey Smith",
    avatarUrl:
      "https://api.dicebear.com/7.x/bottts/svg?seed=Casey",
    createdAt: "2026-08-05T16:20:00Z",
    stats: {
      totalMatches: 21,
      wins: 11,
      losses: 10,
      winRate: 52.4,
      rating: 1164,
      rank: "Silver",
    },
  },
  {
    id: "g7777777-7777-7777-7777-777777777777",
    slug: "riley-davis",
    displayName: "Riley Davis",
    avatarUrl:
      "https://api.dicebear.com/7.x/bottts/svg?seed=Riley",
    createdAt: "2026-08-06T13:00:00Z",
    stats: {
      totalMatches: 31,
      wins: 24,
      losses: 7,
      winRate: 77.4,
      rating: 1438,
      rank: "Platinum",
    },
  },
  {
    id: "h8888888-8888-8888-8888-888888888888",
    slug: "avery-martinez",
    displayName: "Avery Martinez",
    avatarUrl:
      "https://api.dicebear.com/7.x/bottts/svg?seed=Avery",
    createdAt: "2026-08-07T08:30:00Z",
    stats: {
      totalMatches: 4,
      wins: 2,
      losses: 2,
      winRate: 50.0,
      rating: 1000,
      rank: "Silver",
    },
  },
];

export const MOCK_MATCHES: Match[] = [
  {
    id: "m1111111-1111-1111-1111-111111111111",
    location: MOCK_LOCATIONS[0],
    matchType: "singles",
    team1Score: 11,
    team2Score: 8,
    playedAt: "2026-08-18T14:30:00Z",
    winningTeam: 1,
    team1: [
      {
        id: "a1111111-1111-1111-1111-111111111111",
        displayName: "Alex Perez",
        avatarUrl:
          "https://api.dicebear.com/7.x/bottts/svg?seed=Alex",
      },
    ],
    team2: [
      {
        id: "b2222222-2222-2222-2222-222222222222",
        displayName: "Jordan Lee",
        avatarUrl:
          "https://api.dicebear.com/7.x/bottts/svg?seed=Jordan",
      },
    ],
  },
  {
    id: "m2222222-2222-2222-2222-222222222222",
    location: MOCK_LOCATIONS[1],
    matchType: "doubles",
    team1Score: 11,
    team2Score: 9,
    playedAt: "2026-08-19T10:15:00Z",
    winningTeam: 1,
    team1: [
      {
        id: "e5555555-5555-5555-5555-555555555555",
        displayName: "Morgan Vance",
        avatarUrl:
          "https://api.dicebear.com/7.x/bottts/svg?seed=Morgan",
      },
      {
        id: "c3333333-3333-3333-3333-333333333333",
        displayName: "Sam Chen",
        avatarUrl:
          "https://api.dicebear.com/7.x/bottts/svg?seed=Sam",
      },
    ],
    team2: [
      {
        id: "d4444444-4444-4444-4444-444444444444",
        displayName: "Taylor Rivera",
        avatarUrl:
          "https://api.dicebear.com/7.x/bottts/svg?seed=Taylor",
      },
      {
        id: "f6666666-6666-6666-6666-666666666666",
        displayName: "Casey Smith",
        avatarUrl:
          "https://api.dicebear.com/7.x/bottts/svg?seed=Casey",
      },
    ],
  },
  {
    id: "m3333333-3333-3333-3333-333333333333",
    location: MOCK_LOCATIONS[0],
    matchType: "singles",
    team1Score: 7,
    team2Score: 11,
    playedAt: "2026-08-19T16:45:00Z",
    winningTeam: 2,
    team1: [
      {
        id: "a1111111-1111-1111-1111-111111111111",
        displayName: "Alex Perez",
        avatarUrl:
          "https://api.dicebear.com/7.x/bottts/svg?seed=Alex",
      },
    ],
    team2: [
      {
        id: "g7777777-7777-7777-7777-777777777777",
        displayName: "Riley Davis",
        avatarUrl:
          "https://api.dicebear.com/7.x/bottts/svg?seed=Riley",
      },
    ],
  },
  {
    id: "m4444444-4444-4444-4444-444444444444",
    location: MOCK_LOCATIONS[2],
    matchType: "doubles",
    team1Score: 12,
    team2Score: 10,
    playedAt: "2026-08-20T11:00:00Z",
    winningTeam: 1,
    team1: [
      {
        id: "c3333333-3333-3333-3333-333333333333",
        displayName: "Sam Chen",
        avatarUrl:
          "https://api.dicebear.com/7.x/bottts/svg?seed=Sam",
      },
      {
        id: "g7777777-7777-7777-7777-777777777777",
        displayName: "Riley Davis",
        avatarUrl:
          "https://api.dicebear.com/7.x/bottts/svg?seed=Riley",
      },
    ],
    team2: [
      {
        id: "b2222222-2222-2222-2222-222222222222",
        displayName: "Jordan Lee",
        avatarUrl:
          "https://api.dicebear.com/7.x/bottts/svg?seed=Jordan",
      },
      {
        id: "d4444444-4444-4444-4444-444444444444",
        displayName: "Taylor Rivera",
        avatarUrl:
          "https://api.dicebear.com/7.x/bottts/svg?seed=Taylor",
      },
    ],
  },
  {
    id: "m5555555-5555-5555-5555-555555555555",
    location: MOCK_LOCATIONS[1],
    matchType: "singles",
    team1Score: 11,
    team2Score: 4,
    playedAt: "2026-08-20T18:20:00Z",
    winningTeam: 1,
    team1: [
      {
        id: "e5555555-5555-5555-5555-555555555555",
        displayName: "Morgan Vance",
        avatarUrl:
          "https://api.dicebear.com/7.x/bottts/svg?seed=Morgan",
      },
    ],
    team2: [
      {
        id: "f6666666-6666-6666-6666-666666666666",
        displayName: "Casey Smith",
        avatarUrl:
          "https://api.dicebear.com/7.x/bottts/svg?seed=Casey",
      },
    ],
  },
];

export const MOCK_USERS: User[] = [
  {
    id: "u-mod-01",
    email: "mod@pickleball.com",
    displayName: "Admin Coach",
    role: "moderator",
    avatarUrl:
      "https://api.dicebear.com/7.x/bottts/svg?seed=Admin",
  },
  {
    id: "u-guest-01",
    email: "player@pickleball.com",
    displayName: "Alex Perez",
    role: "guest",
    avatarUrl:
      "https://api.dicebear.com/7.x/bottts/svg?seed=Alex",
  },
];