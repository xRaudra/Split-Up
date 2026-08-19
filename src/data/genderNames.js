// Best-effort, offline first-name -> gender lookup. Deliberately not
// exhaustive and not a network call (an external gender-detection API would
// mean sending the user's name to a third party, which contradicts the
// "nothing is sent anywhere" promise on the Profile screen). Unknown names
// fall back to the initials avatar - see Avatar.jsx.

const MALE_NAMES = [
  'aarav', 'aarush', 'aayush', 'abhay', 'abhinav', 'abhishek', 'aditya', 'akash',
  'akshay', 'amit', 'anand', 'anil', 'ankit', 'ansh', 'arjun', 'arnav', 'arun',
  'aryan', 'ashish', 'ashwin', 'atharv', 'avinash', 'ayaan', 'bharat', 'chirag',
  'daksh', 'darshan', 'dev', 'dhruv', 'divyansh', 'gaurav', 'girish', 'harsh',
  'harshit', 'hemant', 'himanshu', 'ishaan', 'jatin', 'kabir', 'kanav', 'karan',
  'karthik', 'kartik', 'kaushal', 'kiran', 'kishore', 'krish', 'krishna',
  'kunal', 'lakshay', 'love', 'madhav', 'mahesh', 'manav', 'manish', 'manoj',
  'mayank', 'mohit', 'mukesh', 'naveen', 'neel', 'nikhil', 'nitin', 'om',
  'pankaj', 'parth', 'pranav', 'prateek', 'pratik', 'praveen', 'pulkit',
  'raghav', 'rahul', 'raj', 'rajat', 'rajesh', 'rakesh', 'raman', 'ranbir',
  'ravi', 'ritesh', 'ritik', 'rohan', 'rohit', 'rudra', 'sagar', 'sahil',
  'sameer', 'sandeep', 'sanjay', 'sarthak', 'satish', 'saurabh', 'shaurya',
  'shivam', 'shubham', 'siddharth', 'sohail', 'somesh', 'sourav', 'suraj',
  'suresh', 'tanay', 'tarun', 'tejas', 'utkarsh', 'uttam', 'varun', 'vedant',
  'vibhor', 'vihaan', 'vijay', 'vikas', 'vikram', 'vimal', 'vinay', 'vinod',
  'vipul', 'vishal', 'vivaan', 'vivek', 'yash', 'yashwant', 'yogesh', 'zaid',
  'aditya', 'aman', 'ayush', 'darsh', 'faisal', 'imran', 'irfan', 'jayesh',
  'aiden', 'alex', 'andrew', 'anthony', 'benjamin', 'brian', 'chris', 'daniel',
  'david', 'ethan', 'james', 'john', 'joseph', 'joshua', 'liam', 'mark',
  'matthew', 'michael', 'noah', 'oliver', 'ryan', 'samuel', 'thomas', 'william',
];

const FEMALE_NAMES = [
  'aadhya', 'aanya', 'aashi', 'aditi', 'aishwarya', 'akansha', 'alia', 'amrita',
  'ananya', 'anika', 'anjali', 'ankita', 'anushka', 'anvi', 'aparna', 'arpita',
  'avni', 'bhavna', 'bhavya', 'charvi', 'deepa', 'deepika', 'diksha', 'disha',
  'divya', 'esha', 'gauri', 'geeta', 'gunjan', 'gunika', 'harshita', 'ishani',
  'ishita', 'jaya', 'jyoti', 'kajal', 'kanika', 'kavya', 'khushi', 'kiara',
  'kirti', 'komal', 'kritika', 'kusum', 'lakshmi', 'lavanya', 'madhuri',
  'mahima', 'malini', 'mansi', 'manvi', 'meera', 'meghna', 'mira', 'mona',
  'myra', 'nandini', 'natasha', 'navya', 'neha', 'nidhi', 'niharika', 'nikita',
  'nisha', 'nitya', 'oorja', 'pallavi', 'palak', 'parul', 'payal', 'pooja',
  'poorvi', 'prachi', 'pragya', 'pranjal', 'preeti', 'priya', 'priyanka',
  'radhika', 'rashi', 'reet', 'reeva', 'rekha', 'riya', 'ritika', 'ruchi',
  'sakshi', 'sana', 'sanya', 'sarika', 'saumya', 'shalini', 'shanaya', 'shefali',
  'shikha', 'shivani', 'shreya', 'shruti', 'simran', 'sneha', 'sonali', 'sonia',
  'srishti', 'suhani', 'sunita', 'swati', 'tanvi', 'tanya', 'trisha', 'urvi',
  'vaishnavi', 'vanshika', 'varsha', 'vidya', 'vinita', 'yashika', 'yashvi',
  'zara', 'zoya',
  'alice', 'amanda', 'amy', 'angela', 'anna', 'ashley', 'barbara', 'chloe',
  'donna', 'elizabeth', 'emily', 'emma', 'grace', 'hannah', 'jennifer', 'jessica',
  'julia', 'karen', 'kimberly', 'laura', 'linda', 'lisa', 'lucy', 'maria',
  'mary', 'megan', 'michelle', 'nancy', 'natalie', 'olivia', 'patricia',
  'rachel', 'rebecca', 'sara', 'sarah', 'sophia', 'susan',
];

const MALE_SET = new Set(MALE_NAMES);
const FEMALE_SET = new Set(FEMALE_NAMES);

export function detectGender(fullName) {
  const firstName = String(fullName).trim().split(' ')[0].toLowerCase();
  if (MALE_SET.has(firstName)) return 'male';
  if (FEMALE_SET.has(firstName)) return 'female';
  return null;
}
