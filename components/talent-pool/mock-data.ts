import { TalentCardProps } from "./talent-card";

export const MOCK_TALENTS: Omit<TalentCardProps, 'isSelected' | 'onSelect' | 'onToggleFavorite'>[] = [
  {
    id: "1",
    role: "Data Science",
    location_code: "D.C 8542",
    totalScore: 90,
    skillsAssessed: ["TensorFlow", "Keras", "Node.js", "Angular", "Deep Learning"],
    experience: "4–5 Years",
    company: "Zenith Systems",
    availability: "Immediate",
    location: "Mumbai, MH",
    assessmentTaken: ["#JAV-0292T-T5", "#JAV-0292T-T6", "#JAV-0292T-T8"],
    about: "I am a detail-oriented QA professional with expertise in automation testing, API validation, and modern testing tools. I enjoy improving product reliability, collaborating with teams, and building efficient test strategies to enhance overall user experience. API validation, and I am a detail-oriented QA professional with expertise in automation testing, API validation, and modern testing tools. I enjoy improving product reliability, collaborating with teams, and building efficient test strategies to enhance overall user experience. API validation, and I am a detail-oriented QA professional with expertise in automation testing, API validation, and modern testing tools. I enjoy improving product reliability, collaborating with teams, and building efficient test strategies to enhance overall user experience. API validation, and",
    isFavorite: false,
  },
  {
    id: "2",
    role: "Mobile Development",
    location_code: "D.C 8542",
    totalScore: 100,
    skillsAssessed: ["Swift", "Kotlin", "React Native", "Java", "Flutter"],
    experience: "6–7 Years",
    company: "Apex Innovations",
    availability: "Immediate",
    location: "Bangalore, KA",
    assessmentTaken: ["#JAV-0292T-T5", "#JAV-0292T-T6", "#JAV-0292T-T8"],
    about: "I am a detail-oriented QA professional with expertise in automation testing, API validation, and modern testing tools. I enjoy improving product reliability, collaborating with teams, and building efficient test strategies to enhance overall user experience. API validation, and",
    isFavorite: false,
  },
  {
    id: "3",
    role: "Product Management",
    location_code: "D.C 8542",
    totalScore: 60,
    skillsAssessed: ["Jira", "Trello", "Agile", "Scrum", "Roadmap"],
    experience: "4–5 Years",
    company: "Nova Solutions",
    availability: "Immediate",
    location: "Chennai, TN",
    assessmentTaken: ["#JAV-0292T-T5", "#JAV-0292T-T6", "#JAV-0292T-T8"],
    about: "I am a detail-oriented QA professional with expertise in automation testing, API validation, and modern testing tools. I enjoy improving product reliability, collaborating with teams, and building efficient test strategies to enhance overall user experience. API validation, and",
    isFavorite: false,
  },
  {
    id: "4",
    role: "Data Engineering",
    location_code: "D.C 8542",
    totalScore: 90,
    skillsAssessed: ["Python", "SQL", "Spark", "Hadoop", "AWS"],
    experience: "0–1 Years",
    company: "Stellar Dynamics",
    availability: "Immediate",
    location: "Hyderabad, TS",
    assessmentTaken: ["#JAV-0292T-T5", "#JAV-0292T-T6", "#JAV-0292T-T8"],
    about: "I am a detail-oriented QA professional with expertise in automation testing, API validation, and modern testing tools. I enjoy improving product reliability, collaborating with teams, and building efficient test strategies to enhance overall user experience. API validation, and",
    isFavorite: false,
  },
  {
    id: "5",
    role: "Machine Learning",
    location_code: "D.C 8542",
    totalScore: 40,
    skillsAssessed: ["PyTorch", "Scikit-learn", "Pandas", "NumPy", "OpenCV"],
    experience: "13–15 Years",
    company: "Quantum Leap Inc",
    availability: "Immediate",
    location: "Kolkata, WB",
    assessmentTaken: ["#JAV-0292T-T5", "#JAV-0292T-T6", "#JAV-0292T-T8"],
    about: "I am a detail-oriented QA professional with expertise in automation testing, API validation, and modern testing tools. I enjoy improving product reliability, collaborating with teams, and building efficient test strategies to enhance overall user experience. API validation, and",
    isFavorite: false,
  },
  {
    id: "6",
    role: "UI/UX Design",
    location_code: "D.C 8542",
    totalScore: 80,
    skillsAssessed: ["Figma", "Sketch", "Adobe XD", "Prototyping", "Wireframing"],
    experience: "16+ Years",
    company: "Binary Stream Corp",
    availability: "Immediate",
    location: "Delhi, DL",
    assessmentTaken: ["#JAV-0292T-T5", "#JAV-0292T-T6", "#JAV-0292T-T8"],
    about: "I am a detail-oriented QA professional with expertise in automation testing, API validation, and modern testing tools. I enjoy improving product reliability, collaborating with teams, and building efficient test strategies to enhance overall user experience. API validation, and",
    isFavorite: false,
  },
];

export const MOCK_FILTERS = [
  {
    title: "Location",
    items: [
      { id: "mumbai", value: "Mumbai" },
      { id: "bangalore", value: "Bangalore" },
      { id: "delhi", value: "Delhi" },
      { id: "chennai", value: "Chennai" },
      { id: "hyderabad", value: "Hyderabad" },
      { id: "kolkata", value: "Kolkata" },
    ]
  },
  {
    title: "Favorite Talent",
    items: [
      { id: "favorites", value: "Show Favorites Only" },
    ]
  },
  {
    title: "Technology",
    items: [
      { id: "python", value: "Python" },
      { id: "java", value: "Java" },
      { id: "javascript", value: "JavaScript" },
      { id: "swift", value: "Swift" },
      { id: "kotlin", value: "Kotlin" },
    ]
  },
  {
    title: "Years of Experience",
    items: [
      { id: "0-1", value: "0-1 Years" },
      { id: "1-3", value: "1-3 Years" },
      { id: "4-5", value: "4-5 Years" },
      { id: "6-10", value: "6-10 Years" },
      { id: "10+", value: "10+ Years" },
    ]
  },
  {
    title: "Skill Assessed",
    items: [
      { id: "react", value: "React" },
      { id: "node", value: "Node.js" },
      { id: "aws", value: "AWS" },
      { id: "docker", value: "Docker" },
    ]
  }
];
