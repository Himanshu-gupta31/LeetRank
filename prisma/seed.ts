const { PrismaClient } = require('@prisma/client')
//@ts-ignore
const prisma = new PrismaClient()

async function main() {
  const iits = [
    {
      name: "Indian Institute of Technology Kharagpur",
      area: "Kharagpur",
      state: "West Bengal",
      country: "India"
    },
    {
      name: "Indian Institute of Technology Bombay",
      area: "Powai",
      state: "Maharashtra",
      country: "India"
    },
    {
      name: "Indian Institute of Technology Madras",
      area: "Chennai",
      state: "Tamil Nadu",
      country: "India"
    },
    {
      name: "Indian Institute of Technology Kanpur",
      area: "Kanpur",
      state: "Uttar Pradesh",
      country: "India"
    },
    {
      name: "Indian Institute of Technology Delhi",
      area: "Hauz Khas",
      state: "Delhi",
      country: "India"
    },
    {
      name: "Indian Institute of Technology Guwahati",
      area: "Guwahati",
      state: "Assam",
      country: "India"
    },
    {
      name: "Indian Institute of Technology Roorkee",
      area: "Roorkee",
      state: "Uttarakhand",
      country: "India"
    },
    {
      name: "Indian Institute of Technology Hyderabad",
      area: "Kandi",
      state: "Telangana",
      country: "India"
    },
    {
      name: "Indian Institute of Technology Gandhinagar",
      area: "Gandhinagar",
      state: "Gujarat",
      country: "India"
    },
    {
      name: "Indian Institute of Technology Ropar",
      area: "Rupnagar",
      state: "Punjab",
      country: "India"
    },
    {
      name: "Indian Institute of Technology Bhubaneswar",
      area: "Bhubaneswar",
      state: "Odisha",
      country: "India"
    },
    {
      name: "Indian Institute of Technology Jodhpur",
      area: "Jodhpur",
      state: "Rajasthan",
      country: "India"
    },
    {
      name: "Indian Institute of Technology Patna",
      area: "Patna",
      state: "Bihar",
      country: "India"
    },
    {
      name: "Indian Institute of Technology Indore",
      area: "Indore",
      state: "Madhya Pradesh",
      country: "India"
    },
    {
      name: "Indian Institute of Technology Mandi",
      area: "Mandi",
      state: "Himachal Pradesh",
      country: "India"
    },
    {
      name: "Indian Institute of Technology Varanasi",
      area: "Varanasi",
      state: "Uttar Pradesh",
      country: "India"
    },
    {
      name: "Indian Institute of Technology Palakkad",
      area: "Palakkad",
      state: "Kerala",
      country: "India"
    },
    {
      name: "Indian Institute of Technology Tirupati",
      area: "Tirupati",
      state: "Andhra Pradesh",
      country: "India"
    },
    {
      name: "Indian Institute of Technology Bhilai",
      area: "Bhilai",
      state: "Chhattisgarh",
      country: "India"
    },
    {
      name: "Indian Institute of Technology Goa",
      area: "Ponda",
      state: "Goa",
      country: "India"
    },
    {
      name: "Indian Institute of Technology Jammu",
      area: "Jammu",
      state: "Jammu and Kashmir",
      country: "India"
    },
    {
      name: "Indian Institute of Technology Dharwad",
      area: "Dharwad",
      state: "Karnataka",
      country: "India"
    },
    {
      name: "Indian Institute of Technology (BHU) Varanasi",
      area: "Varanasi",
      state: "Uttar Pradesh",
      country: "India"
    }
  ];

  console.log('Starting to seed IITs...');
  
  try {
    for (const iit of iits) {
      await prisma.college.create({
        data: iit
      });
    }
    console.log('Successfully seeded', iits.length, 'IITs');
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