const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // Delete existing characters and re-seed
  await prisma.character.deleteMany();

  const characters = [
    {
      name: "Waldo",
      xMin: 51.563,
      xMax: 53.516,
      yMin: 46.224,
      yMax: 50.781,
      imageName: "waldo-beach-level1",
    },
    {
      name: "Wizard Whitebeard",
      xMin: 61.133,
      xMax: 63.086,
      yMin: 45.964,
      yMax: 52.735,
      imageName: "waldo-beach-level1",
    },
    {
      name: "Odlaw",
      xMin: 22.949,
      xMax: 25.293,
      yMin: 46.484,
      yMax: 52.604,
      imageName: "waldo-beach-level1",
    },
  ];

  for (const character of characters) {
    await prisma.character.create({ data: character });
  }

  console.log("Database seeded with characters:");
  console.table(characters);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
