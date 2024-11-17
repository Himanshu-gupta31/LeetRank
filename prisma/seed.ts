const { PrismaClient } = require('@prisma/client')
//@ts-ignore
const prisma = new PrismaClient()

async function main() {
  // First clear existing data
  await prisma.college.deleteMany({});
  
  const colleges = [
    // Rohini Area
    {
      name: "Rukmini Devi Institute of Advanced Studies (RDIAS)",
      area: "Rohini",
      state: "Delhi",
      country: "India"
    },
    {
      name: "Bhagwan Parshuram Institute of Technology",
      area: "Rohini",
      state: "Delhi",
      country: "India"
    },
    {
      name: "Delhi School of Professional Studies and Research (DSPSR)",
      area: "Rohini",
      state: "Delhi",
      country: "India"
    },
    {
      name: "Delhi Institute of Advanced Studies (DIAS)",
      area: "Rohini",
      state: "Delhi",
      country: "India"
    },
    {
      name: "Gitarattan International Business School",
      area: "Rohini",
      state: "Delhi",
      country: "India"
    },
    {
      name: "Maharaja Agrasen College",
      area: "Rohini",
      state: "Delhi",
      country: "India"
    },
    {
      name: "Maharaja Agrasen Institute of Management Studies",
      area: "Rohini",
      state: "Delhi",
      country: "India"
    },
    {
      name: "Maharaja Agrasen Institute of Technology",
      area: "Rohini",
      state: "Delhi",
      country: "India"
    },
    {
      name: "Sirifort Institute of Management Studies (SIMS)",
      area: "Rohini",
      state: "Delhi",
      country: "India"
    },
    {
      name: "Tecnia Institute of Advanced Studies",
      area: "Rohini",
      state: "Delhi",
      country: "India"
    },
    {
      name: "JIMS Rohini",  // Modified name to include area
      area: "Rohini",
      state: "Delhi",
      country: "India"
    },

    // Dwarka Area
    {
      name: "Banarsidas Chandiwala Institute of Management and Technology",
      area: "Dwarka",
      state: "Delhi",
      country: "India"
    },
    {
      name: "Lal Bahadur Institute of Management",
      area: "Dwarka",
      state: "Delhi",
      country: "India"
    },
    {
      name: "Trinity Institute of Professional Studies (TIPS)",
      area: "Dwarka",
      state: "Delhi",
      country: "India"
    },

    // Okhla Area
    {
      name: "BCI Institute of Hotel Management & Catering",  // Modified name
      area: "Okhla NSIC",
      state: "Delhi",
      country: "India"
    },
    {
      name: "BCI Institute of Information Technology",  // Modified name
      area: "Okhla NSIC",
      state: "Delhi",
      country: "India"
    },
    {
      name: "BCI Institute of Physiotherapy",  // Modified name
      area: "Okhla NSIC",
      state: "Delhi",
      country: "India"
    },

    // Greater Noida Area
    {
      name: "Delhi Technical Campus",
      area: "Greater Noida",
      state: "Delhi NCR",
      country: "India"
    },
    {
      name: "JIMS Greater Noida",  // Modified name to include area
      area: "Greater Noida",
      state: "Delhi NCR",
      country: "India"
    },
    {
      name: "KCC Institute Of Legal and Higher Education",
      area: "Greater Noida",
      state: "Delhi NCR",
      country: "India"
    },

    // Noida Area
    {
      name: "Delhi Metropolitan Education",
      area: "Sector 62, Noida",
      state: "Delhi NCR",
      country: "India"
    },

    // Sonipat Area
    {
      name: "B. M. Institute of Engineering & Technology",
      area: "Sonipat",
      state: "Haryana",
      country: "India"
    },
    {
      name: "Bhagwan Mahaveer College of Engineering and Management",
      area: "Sonipat District",
      state: "Haryana",
      country: "India"
    },

    // Other Delhi Areas
    {
      name: "Army College of Medical Sciences",
      area: "Delhi Cantonment",
      state: "Delhi",
      country: "India"
    },
    {
      name: "Bharati Vidyapeeth",
      area: "Paschim Vihar",
      state: "Delhi",
      country: "India"
    },
    {
      name: "Chandraprabhi Jain College of Higher Studies",
      area: "Narela",
      state: "Delhi",
      country: "India"
    },
    {
      name: "COMM-IT Career Academy",
      area: "Sheikh Sarai",
      state: "Delhi",
      country: "India"
    },
    {
      name: "Delhi Institute of Technology & Management",
      area: "Shastri Nagar",
      state: "Delhi",
      country: "India"
    },
    {
      name: "Fairfield Institute of Management and Technology",
      area: "Kapashera",
      state: "Delhi",
      country: "India"
    },
    {
      name: "Guru Nanak College",
      area: "Punjabi Bagh",
      state: "Delhi",
      country: "India"
    },
    {
      name: "Guru Ram Dass College",
      area: "Shahdara",
      state: "Delhi",
      country: "India"
    },
    {
      name: "Guru Tegh Bahadur Institute of Technology",
      area: "Hari Nagar",
      state: "Delhi",
      country: "India"
    },
    {
      name: "Ideal Institute of Management & Technology",
      area: "Vivek Vihar",
      state: "Delhi",
      country: "India"
    },
    {
      name: "Institute of Information Technology and Management",
      area: "Janakpuri",
      state: "Delhi",
      country: "India"
    },
    {
      name: "Institute of Innovation in Technology and Management",
      area: "Janakpuri",
      state: "Delhi",
      country: "India"
    },
    {
      name: "Maharaja Surajmal Institute",
      area: "Janakpuri",
      state: "Delhi",
      country: "India"
    },
    {
      name: "Maharaja Surajmal Institute of Technology",
      area: "Janakpuri",
      state: "Delhi",
      country: "India"
    },
    {
      name: "Management Education & Research Institute (MERI)",
      area: "Janakpuri",
      state: "Delhi",
      country: "India"
    },
    {
      name: "New Delhi Institute of Management (NDIM)",
      area: "Tughlakabad Institutional Area",
      state: "Delhi",
      country: "India"
    },
    {
      name: "Dr. Akhilesh Das Gupta Institute of Professional Studies",
      area: "Shastri Park",
      state: "Delhi",
      country: "India"
    },
    {
      name: "Vivekananda Institute of Professional Studies (VIPS)",
      area: "Pitampura",
      state: "Delhi",
      country: "India"
    },
    {
      name: "JIMS Vasant Kunj",  // Modified name to include area
      area: "Vasant Kunj",
      state: "Delhi",
      country: "India"
    },
    {
      name: "JIMS Kalkaji",  // Modified name to include area
      area: "Kalkaji",
      state: "Delhi",
      country: "India"
    },
    {
      name: "Kalka Institute of Education and Research",
      area: "Alakananda",
      state: "Delhi",
      country: "India"
    },
    {
      name: "Kasturi Ram College of Higher Education",
      area: "Narela",
      state: "Delhi",
      country: "India"
    },
    {
      name: "Lingaya's Lalita Devi Institute of Management & Sciences",
      area: "Mandi Village",
      state: "Delhi",
      country: "India"
    }
  ];

  console.log('Starting to seed...');
  
  try {
    for (const college of colleges) {
      await prisma.college.create({
        data: college
      });
    }
    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Error during seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });