/* =========================================================
   Bison Mentor Match — Data & Matching Logic
   Mock alumni/student profiles + matching algorithm
   ========================================================= */

// Shared option lists (also used by the quiz)
const MENTORSHIP_FOCUS_OPTIONS = [
  'Networking',
  'Career Development',
  'Leadership Training',
  'General Advising/Coaching',
  'Sponsorship'
]

const HOBBY_OPTIONS = [
  'Art', 'Running', 'Skating', 'Reading', 'Gaming', 'Cooking',
  'Photography', 'Music', 'Hiking', 'Dancing', 'Writing', 'Fitness',
  'Travel', 'Volunteering', 'Fashion', 'Sports', 'Podcasting', 'Other'
]

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'District of Columbia', 'Florida', 'Georgia',
  'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
  'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
  'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
  'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island',
  'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
]

// Alumni profiles — matched to students
const ALUMNI_PROFILES = [
  {
    id: 'a1',
    name: 'Dr. Marcus Johnson',
    email: 'mjohnson@example.com',
    phone: '202-555-0101',
    graduationYear: 2010,
    major: 'Computer Science',
    currentJob: 'Senior Software Engineer at Google',
    interests: ['Software Engineering', 'Artificial Intelligence', 'Tech Entrepreneurship'],
    mentorshipFocus: ['Career Development', 'Networking', 'Sponsorship'],
    homeState: 'Georgia',
    currentState: 'California',
    hobbies: ['Running', 'Gaming', 'Photography'],
    availability: '1/week'
  },
  {
    id: 'a2',
    name: 'Ashley Carter, Esq.',
    email: 'acarter@example.com',
    phone: '202-555-0102',
    graduationYear: 2015,
    major: 'Political Science',
    currentJob: 'Attorney at Williams & Connolly LLP',
    interests: ['Law', 'Public Policy', 'Civil Rights', 'Government'],
    mentorshipFocus: ['Leadership Training', 'General Advising/Coaching', 'Networking'],
    homeState: 'Illinois',
    currentState: 'District of Columbia',
    hobbies: ['Reading', 'Writing', 'Volunteering'],
    availability: '2/month'
  },
  {
    id: 'a3',
    name: 'Dr. Jasmine Washington',
    email: 'jwashington@example.com',
    phone: '202-555-0103',
    graduationYear: 2012,
    major: 'Biology',
    currentJob: "Pediatric Resident at Children's National Hospital",
    interests: ['Medicine', 'Healthcare', 'Research', 'Public Health'],
    mentorshipFocus: ['General Advising/Coaching', 'Career Development'],
    homeState: 'Maryland',
    currentState: 'District of Columbia',
    hobbies: ['Hiking', 'Cooking', 'Fitness'],
    availability: '1/month'
  },
  {
    id: 'a4',
    name: 'Trevor Brooks',
    email: 'tbrooks@example.com',
    phone: '202-555-0104',
    graduationYear: 2018,
    major: 'Finance',
    currentJob: 'Investment Banking Associate at Goldman Sachs',
    interests: ['Finance', 'Investment Banking', 'Corporate Strategy', 'Wealth Management'],
    mentorshipFocus: ['Career Development', 'Networking', 'Sponsorship'],
    homeState: 'New York',
    currentState: 'New York',
    hobbies: ['Fitness', 'Travel', 'Sports'],
    availability: '1/week'
  },
  {
    id: 'a5',
    name: 'Imani Robinson',
    email: 'irobinson@example.com',
    phone: '202-555-0105',
    graduationYear: 2016,
    major: 'Communications',
    currentJob: 'Director of PR at Edelman',
    interests: ['Public Relations', 'Media', 'Marketing', 'Brand Strategy'],
    mentorshipFocus: ['Networking', 'Leadership Training', 'Career Development'],
    homeState: 'Texas',
    currentState: 'New York',
    hobbies: ['Fashion', 'Photography', 'Dancing'],
    availability: '2/month'
  },
  {
    id: 'a6',
    name: 'Andre Mitchell',
    email: 'amitchell@example.com',
    phone: '202-555-0106',
    graduationYear: 2014,
    major: 'Mechanical Engineering',
    currentJob: 'Aerospace Engineer at Lockheed Martin',
    interests: ['Engineering', 'Aerospace', 'Robotics', 'Project Management'],
    mentorshipFocus: ['General Advising/Coaching', 'Career Development'],
    homeState: 'Ohio',
    currentState: 'Colorado',
    hobbies: ['Gaming', 'Hiking', 'Music'],
    availability: '1/month'
  },
  {
    id: 'a7',
    name: 'Nia Williams',
    email: 'nwilliams@example.com',
    phone: '202-555-0107',
    graduationYear: 2019,
    major: 'Computer Science',
    currentJob: 'Product Manager at Microsoft',
    interests: ['Product Management', 'UX Design', 'Tech', 'Artificial Intelligence'],
    mentorshipFocus: ['Career Development', 'Leadership Training', 'Networking'],
    homeState: 'Virginia',
    currentState: 'Washington',
    hobbies: ['Art', 'Running', 'Travel'],
    availability: '2/month'
  },
  {
    id: 'a8',
    name: 'Marcus Hayes',
    email: 'mhayes@example.com',
    phone: '202-555-0108',
    graduationYear: 2011,
    major: 'Finance',
    currentJob: 'CFO at BlackTech Ventures',
    interests: ['Finance', 'Startup Funding', 'Entrepreneurship', 'Venture Capital'],
    mentorshipFocus: ['Sponsorship', 'Networking', 'Leadership Training'],
    homeState: 'California',
    currentState: 'California',
    hobbies: ['Travel', 'Fitness', 'Podcasting'],
    availability: '1/week'
  },
  {
    id: 'a9',
    name: 'Brianna Lee',
    email: 'blee@example.com',
    phone: '202-555-0109',
    graduationYear: 2017,
    major: 'Psychology',
    currentJob: 'Clinical Therapist in private practice',
    interests: ['Mental Health', 'Psychology', 'Counseling', 'Healthcare'],
    mentorshipFocus: ['General Advising/Coaching', 'Leadership Training'],
    homeState: 'North Carolina',
    currentState: 'Georgia',
    hobbies: ['Reading', 'Volunteering', 'Dancing'],
    availability: '1/month'
  },
  {
    id: 'a10',
    name: 'Devin Clark',
    email: 'dclark@example.com',
    phone: '202-555-0110',
    graduationYear: 2013,
    major: 'Marketing',
    currentJob: 'Head of Marketing at Spotify',
    interests: ['Marketing', 'Digital Media', 'Music Industry', 'Brand Strategy'],
    mentorshipFocus: ['Networking', 'Career Development', 'Sponsorship'],
    homeState: 'Michigan',
    currentState: 'New York',
    hobbies: ['Music', 'Podcasting', 'Photography'],
    availability: '2/month'
  }
]

// Student profiles — matched to alumni
const STUDENT_PROFILES = [
  {
    id: 's1',
    name: 'Jaylen Harris',
    email: 'jharris@bison.howard.edu',
    phone: '202-555-0201',
    graduationYear: 2027,
    major: 'Computer Science',
    careerGoals: 'Become a software engineer at a major tech company',
    interests: ['Software Engineering', 'Artificial Intelligence', 'Tech Entrepreneurship'],
    mentorshipFocus: ['Career Development', 'Networking', 'Sponsorship'],
    homeState: 'Georgia',
    currentState: 'District of Columbia',
    hobbies: ['Gaming', 'Running', 'Music'],
    availability: '1/week'
  },
  {
    id: 's2',
    name: 'Amaya Foster',
    email: 'afoster@bison.howard.edu',
    phone: '202-555-0202',
    graduationYear: 2026,
    major: 'Political Science',
    careerGoals: 'Attend law school and practice civil rights law',
    interests: ['Law', 'Public Policy', 'Civil Rights', 'Government'],
    mentorshipFocus: ['Leadership Training', 'General Advising/Coaching', 'Networking'],
    homeState: 'Illinois',
    currentState: 'District of Columbia',
    hobbies: ['Reading', 'Writing', 'Volunteering'],
    availability: '2/month'
  },
  {
    id: 's3',
    name: 'Chris Thompson',
    email: 'cthompson@bison.howard.edu',
    phone: '202-555-0203',
    graduationYear: 2028,
    major: 'Biology',
    careerGoals: 'Go to medical school and become a pediatrician',
    interests: ['Medicine', 'Healthcare', 'Research', 'Public Health'],
    mentorshipFocus: ['General Advising/Coaching', 'Career Development'],
    homeState: 'Maryland',
    currentState: 'District of Columbia',
    hobbies: ['Hiking', 'Fitness', 'Cooking'],
    availability: '1/month'
  },
  {
    id: 's4',
    name: 'Taylor Simmons',
    email: 'tsimmons@bison.howard.edu',
    phone: '202-555-0204',
    graduationYear: 2027,
    major: 'Finance',
    careerGoals: 'Break into investment banking on Wall Street',
    interests: ['Finance', 'Investment Banking', 'Corporate Strategy', 'Wealth Management'],
    mentorshipFocus: ['Career Development', 'Networking', 'Sponsorship'],
    homeState: 'New Jersey',
    currentState: 'District of Columbia',
    hobbies: ['Fitness', 'Sports', 'Travel'],
    availability: '1/week'
  },
  {
    id: 's5',
    name: 'Zuri Bennett',
    email: 'zbennett@bison.howard.edu',
    phone: '202-555-0205',
    graduationYear: 2026,
    major: 'Communications',
    careerGoals: 'Work in public relations and brand management',
    interests: ['Public Relations', 'Media', 'Marketing', 'Brand Strategy'],
    mentorshipFocus: ['Networking', 'Leadership Training', 'Career Development'],
    homeState: 'Texas',
    currentState: 'District of Columbia',
    hobbies: ['Fashion', 'Dancing', 'Photography'],
    availability: '2/month'
  },
  {
    id: 's6',
    name: 'Malik Davis',
    email: 'mdavis@bison.howard.edu',
    phone: '202-555-0206',
    graduationYear: 2028,
    major: 'Mechanical Engineering',
    careerGoals: 'Design aerospace systems and work in space tech',
    interests: ['Engineering', 'Aerospace', 'Robotics', 'Project Management'],
    mentorshipFocus: ['General Advising/Coaching', 'Career Development'],
    homeState: 'Ohio',
    currentState: 'District of Columbia',
    hobbies: ['Gaming', 'Hiking', 'Music'],
    availability: '1/month'
  },
  {
    id: 's7',
    name: 'Sydney Moore',
    email: 'smoore@bison.howard.edu',
    phone: '202-555-0207',
    graduationYear: 2027,
    major: 'Computer Science',
    careerGoals: 'Become a product manager in the tech industry',
    interests: ['Product Management', 'UX Design', 'Tech', 'Artificial Intelligence'],
    mentorshipFocus: ['Career Development', 'Leadership Training', 'Networking'],
    homeState: 'Virginia',
    currentState: 'District of Columbia',
    hobbies: ['Art', 'Running', 'Travel'],
    availability: '2/month'
  },
  {
    id: 's8',
    name: 'Jordan Smith',
    email: 'jsmith@bison.howard.edu',
    phone: '202-555-0208',
    graduationYear: 2026,
    major: 'Finance',
    careerGoals: 'Launch a startup and raise venture capital',
    interests: ['Finance', 'Startup Funding', 'Entrepreneurship', 'Venture Capital'],
    mentorshipFocus: ['Sponsorship', 'Networking', 'Leadership Training'],
    homeState: 'California',
    currentState: 'District of Columbia',
    hobbies: ['Travel', 'Fitness', 'Podcasting'],
    availability: '1/week'
  },
  {
    id: 's9',
    name: 'Aaliyah Brooks',
    email: 'abrooks@bison.howard.edu',
    phone: '202-555-0209',
    graduationYear: 2028,
    major: 'Psychology',
    careerGoals: 'Become a licensed clinical psychologist',
    interests: ['Mental Health', 'Psychology', 'Counseling', 'Healthcare'],
    mentorshipFocus: ['General Advising/Coaching', 'Leadership Training'],
    homeState: 'North Carolina',
    currentState: 'District of Columbia',
    hobbies: ['Reading', 'Volunteering', 'Dancing'],
    availability: '1/month'
  },
  {
    id: 's10',
    name: 'Brandon Lewis',
    email: 'blewis@bison.howard.edu',
    phone: '202-555-0210',
    graduationYear: 2027,
    major: 'Marketing',
    careerGoals: 'Lead marketing at a major media or music company',
    interests: ['Marketing', 'Digital Media', 'Music Industry', 'Brand Strategy'],
    mentorshipFocus: ['Networking', 'Career Development', 'Sponsorship'],
    homeState: 'Michigan',
    currentState: 'District of Columbia',
    hobbies: ['Music', 'Podcasting', 'Photography'],
    availability: '2/month'
  }
]

// Availability ranking — more frequent = higher commitment
const AVAILABILITY_RANK = {
  '1/week': 3,
  '2/month': 2,
  '1/month': 1
}

// Check if two availability levels are compatible
function availabilityCompatible(a, b) {
  return Math.abs(AVAILABILITY_RANK[a] - AVAILABILITY_RANK[b]) <= 2
}

// Count shared items between two arrays
function sharedItems(arrA, arrB) {
  const setB = new Set(arrB || [])
  return (arrA || []).filter((i) => setB.has(i))
}

// Core matching algorithm
// Scoring:
//   major match ............ 40 pts
//   interest overlap ........ 5 pts per shared interest
//   mentorship focus overlap  8 pts per shared focus area
//   availability compat ..... 15 pts
//   same current state ...... 10 pts
//   same home state ......... 8 pts
//   hobby overlap ........... 4 pts per shared hobby
//   career alignment ........ 5 pts per interest keyword found in career/job text
function computeMatches(userProfile, pool) {
  return pool
    .map((profile) => {
      let score = 0
      const reasons = []

      // Major match — biggest weight
      if (userProfile.major === profile.major) {
        score += 40
        reasons.push('Same major: ' + profile.major)
      }

      // Interest overlap
      const sharedInt = sharedItems(userProfile.interests, profile.interests)
      if (sharedInt.length > 0) {
        score += sharedInt.length * 5
        reasons.push(
          sharedInt.length + ' shared interest' + (sharedInt.length > 1 ? 's' : '') + ': ' + sharedInt.join(', ')
        )
      }

      // Mentorship focus overlap — what they want help with / help on
      const sharedFocus = sharedItems(userProfile.mentorshipFocus, profile.mentorshipFocus)
      if (sharedFocus.length > 0) {
        score += sharedFocus.length * 8
        reasons.push('Shared focus: ' + sharedFocus.join(', '))
      }

      // Availability compatibility
      if (availabilityCompatible(userProfile.availability, profile.availability)) {
        score += 15
        reasons.push('Compatible availability (' + profile.availability + ')')
      }

      // Location — current state
      if (userProfile.currentState && userProfile.currentState === profile.currentState) {
        score += 10
        reasons.push('Both in ' + profile.currentState)
      }

      // Location — home state
      if (userProfile.homeState && userProfile.homeState === profile.homeState) {
        score += 8
        reasons.push('Both from ' + profile.homeState)
      }

      // Hobby overlap
      const sharedHob = sharedItems(userProfile.hobbies, profile.hobbies)
      if (sharedHob.length > 0) {
        score += sharedHob.length * 4
        reasons.push('Shared hobb' + (sharedHob.length > 1 ? 'ies' : 'y') + ': ' + sharedHob.join(', '))
      }

      // Career alignment — check if career/job text mentions profile interests
      const careerText = (userProfile.careerGoals || userProfile.currentJob || '').toLowerCase()
      const profileText = (profile.currentJob || profile.careerGoals || '').toLowerCase()
      profile.interests.forEach((interest) => {
        if (
          careerText.includes(interest.toLowerCase()) ||
          profileText.includes(interest.toLowerCase())
        ) {
          score += 5
        }
      })

      return Object.assign({}, profile, { matchScore: score, matchReasons: reasons })
    })
    .filter((m) => m.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
}

// Make available globally
window.ALUMNI_PROFILES = ALUMNI_PROFILES
window.STUDENT_PROFILES = STUDENT_PROFILES
window.MENTORSHIP_FOCUS_OPTIONS = MENTORSHIP_FOCUS_OPTIONS
window.HOBBY_OPTIONS = HOBBY_OPTIONS
window.US_STATES = US_STATES
window.computeMatches = computeMatches
