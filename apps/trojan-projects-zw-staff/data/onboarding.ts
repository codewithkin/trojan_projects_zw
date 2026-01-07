export interface ServiceTag {
  id: string;
  name: string;
  icon: string;
}

export const serviceTags: ServiceTag[] = [
  { id: "solar", name: "Solar Installation", icon: "Sun" },
  { id: "cctv", name: "CCTV & Security", icon: "Camera" },
  { id: "electrical", name: "Electrical Work", icon: "Zap" },
  { id: "water", name: "Water Systems", icon: "Droplet" },
  { id: "welding", name: "Welding Services", icon: "Flame" },
  { id: "borehole", name: "Borehole Drilling", icon: "Drill" },
  { id: "plumbing", name: "Plumbing", icon: "Wrench" },
  { id: "aircon", name: "Air Conditioning", icon: "Wind" },
  { id: "gate", name: "Gate Automation", icon: "DoorOpen" },
  { id: "maintenance", name: "Maintenance", icon: "Settings" },
  { id: "other", name: "Something Else", icon: "MoreHorizontal" },
];

export const zimbabweLocations = [
  "Harare",
  "Bulawayo",
  "Mutare",
  "Gweru",
  "Kwekwe",
  "Kadoma",
  "Masvingo",
  "Chinhoyi",
  "Norton",
  "Marondera",
  "Ruwa",
  "Chitungwiza",
  "Bindura",
  "Beitbridge",
  "Redcliff",
  "Victoria Falls",
  "Hwange",
  "Chegutu",
  "Kariba",
  "Karoi",
  "Other",
];

export interface UserPreferences {
  interests: string[];
  location: string;
}
