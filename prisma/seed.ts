import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function addSlugs() {
    const allColleges = await prisma.college.findMany({
        select: {
            id: true,
            name: true
        }
    })

    for (const college of allColleges) {
        // Create slug using native JS methods
        const slug = college.name
            .toLowerCase()           // convert to lowercase
            .trim()                  // remove leading/trailing whitespace
            .replace(/[^\w\s-]/g, '')  // remove special characters
            .replace(/[\s_-]+/g, '-')  // replace spaces/underscores with single hyphen
            .replace(/^-+|-+$/g, '');  // remove leading/trailing hyphens

        await prisma.college.update({
            where: {
                id: college.id
            },
            data: { 
                slug: slug
            }
        })

        console.log(`Updated slug for ${college.name}: ${slug}`)
    }

    console.log('Slug update completed')
}

// Add a main function to run the script
async function main() {
    try {
        await addSlugs()
    } catch (error) {
        console.error('Error updating slugs:', error)
    } finally {
        await prisma.$disconnect()
    }
}

// Call the main function
main()