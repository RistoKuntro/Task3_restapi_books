import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL as string,
  }),
});

async function main() {
  console.log("Seeding database...");

  await prisma.review.deleteMany();
  await prisma.bookGenre.deleteMany();
  await prisma.book.deleteMany();
  await prisma.author.deleteMany();
  await prisma.publisher.deleteMany();
  await prisma.genre.deleteMany();

  const [softwareEng, programming, architecture, bestPractices, designPatterns] =
    await prisma.$transaction([
      prisma.genre.create({ data: { name: "Software Engineering" } }),
      prisma.genre.create({ data: { name: "Programming" } }),
      prisma.genre.create({ data: { name: "Architecture" } }),
      prisma.genre.create({ data: { name: "Best Practices" } }),
      prisma.genre.create({ data: { name: "Design Patterns" } }),
    ]);

  const [prenticeHall, addisonWesley, , pragmatic] =
    await prisma.$transaction([
      prisma.publisher.create({ data: { name: "Prentice Hall", country: "USA", foundedYear: 1913, website: "https://www.pearson.com" } }),
      prisma.publisher.create({ data: { name: "Addison-Wesley", country: "USA", foundedYear: 1942, website: "https://www.pearson.com" } }),
      prisma.publisher.create({ data: { name: "O'Reilly Media", country: "USA", foundedYear: 1978, website: "https://www.oreilly.com" } }),
      prisma.publisher.create({ data: { name: "Pragmatic Bookshelf", country: "USA", foundedYear: 2003, website: "https://pragprog.com" } }),
    ]);

  const [robertMartin, martinFowler, erichGamma, kentBeck, joshuaBloch, andrewHunt] =
    await prisma.$transaction([
      prisma.author.create({ data: { firstName: "Robert", lastName: "Martin", birthYear: 1952, nationality: "American", biography: "Software engineer and author." } }),
      prisma.author.create({ data: { firstName: "Martin", lastName: "Fowler", birthYear: 1963, nationality: "British", biography: "Chief Scientist at ThoughtWorks." } }),
      prisma.author.create({ data: { firstName: "Erich", lastName: "Gamma", birthYear: 1961, nationality: "Swiss", biography: "Co-author of Design Patterns." } }),
      prisma.author.create({ data: { firstName: "Kent", lastName: "Beck", birthYear: 1961, nationality: "American", biography: "Creator of Extreme Programming." } }),
      prisma.author.create({ data: { firstName: "Joshua", lastName: "Bloch", birthYear: 1961, nationality: "American", biography: "Former lead designer of Java." } }),
      prisma.author.create({ data: { firstName: "Andrew", lastName: "Hunt", birthYear: 1964, nationality: "American", biography: "Co-author of The Pragmatic Programmer." } }),
    ]);

  const cleanCode = await prisma.book.create({
    data: {
      title: "Clean Code", isbn: "9780132350884", publishedYear: 2008,
      pageCount: 464, language: "English",
      description: "A handbook of agile software craftsmanship.",
      authorId: robertMartin.id, publisherId: prenticeHall.id,
      genres: { create: [{ genreId: softwareEng.id }, { genreId: bestPractices.id }] },
    },
  });

  const cleanArchitecture = await prisma.book.create({
    data: {
      title: "Clean Architecture", isbn: "9780134494166", publishedYear: 2017,
      pageCount: 432, language: "English",
      description: "A craftsman's guide to software structure.",
      authorId: robertMartin.id, publisherId: prenticeHall.id,
      genres: { create: [{ genreId: softwareEng.id }, { genreId: architecture.id }] },
    },
  });

  const refactoring = await prisma.book.create({
    data: {
      title: "Refactoring", isbn: "9780201485677", publishedYear: 1999,
      pageCount: 448, language: "English",
      description: "Improving the design of existing code.",
      authorId: martinFowler.id, publisherId: addisonWesley.id,
      genres: { create: [{ genreId: softwareEng.id }, { genreId: bestPractices.id }] },
    },
  });

  const designPatternsBook = await prisma.book.create({
    data: {
      title: "Design Patterns", isbn: "9780201633610", publishedYear: 1994,
      pageCount: 395, language: "English",
      description: "Elements of reusable object-oriented software.",
      authorId: erichGamma.id, publisherId: addisonWesley.id,
      genres: { create: [{ genreId: designPatterns.id }, { genreId: programming.id }] },
    },
  });

  const tdd = await prisma.book.create({
    data: {
      title: "Test-Driven Development", isbn: "9780321146533", publishedYear: 2002,
      pageCount: 240, language: "English",
      description: "By example, a guide to TDD.",
      authorId: kentBeck.id, publisherId: addisonWesley.id,
      genres: { create: [{ genreId: softwareEng.id }, { genreId: bestPractices.id }] },
    },
  });

  const effectiveJava = await prisma.book.create({
    data: {
      title: "Effective Java", isbn: "9780134685991", publishedYear: 2001,
      pageCount: 412, language: "English",
      description: "Best practices for the Java platform.",
      authorId: joshuaBloch.id, publisherId: addisonWesley.id,
      genres: { create: [{ genreId: programming.id }, { genreId: bestPractices.id }] },
    },
  });

  const pragmaticProgrammer = await prisma.book.create({
    data: {
      title: "The Pragmatic Programmer", isbn: "9780135957059", publishedYear: 1999,
      pageCount: 352, language: "English",
      description: "From journeyman to master.",
      authorId: andrewHunt.id, publisherId: pragmatic.id,
      genres: { create: [{ genreId: softwareEng.id }, { genreId: bestPractices.id }] },
    },
  });

  const poeaa = await prisma.book.create({
    data: {
      title: "Patterns of Enterprise Application Architecture", isbn: "9780321127426", publishedYear: 2002,
      pageCount: 560, language: "English",
      description: "A catalog of patterns for enterprise software.",
      authorId: martinFowler.id, publisherId: addisonWesley.id,
      genres: { create: [{ genreId: architecture.id }, { genreId: designPatterns.id }] },
    },
  });

  await prisma.review.createMany({
    data: [
      { bookId: cleanCode.id, userName: "alice", rating: 5, comment: "Must read for every developer!" },
      { bookId: cleanCode.id, userName: "bob", rating: 4, comment: "Very practical advice." },
      { bookId: cleanCode.id, userName: "carol", rating: 5, comment: "Changed how I write code." },
      { bookId: cleanArchitecture.id, userName: "dave", rating: 5, comment: "Excellent architecture concepts." },
      { bookId: cleanArchitecture.id, userName: "eve", rating: 4, comment: "Dense but worth it." },
      { bookId: refactoring.id, userName: "frank", rating: 5, comment: "A classic. Essential reading." },
      { bookId: designPatternsBook.id, userName: "grace", rating: 5, comment: "Gang of Four - timeless." },
      { bookId: designPatternsBook.id, userName: "henry", rating: 3, comment: "Hard to read but valuable." },
      { bookId: tdd.id, userName: "irene", rating: 5, comment: "TDD made simple." },
      { bookId: pragmaticProgrammer.id, userName: "jack", rating: 5, comment: "Pragmatic and practical." },
      { bookId: pragmaticProgrammer.id, userName: "kate", rating: 4, comment: "Great tips for daily work." },
      { bookId: effectiveJava.id, userName: "leo", rating: 5, comment: "Best Java book ever written." },
    ],
  });

  console.log("Seed done!");
  console.log(`Authors:    ${await prisma.author.count()}`);
  console.log(`Publishers: ${await prisma.publisher.count()}`);
  console.log(`Genres:     ${await prisma.genre.count()}`);
  console.log(`Books:      ${await prisma.book.count()}`);
  console.log(`Reviews:    ${await prisma.review.count()}`);
}

main()
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });