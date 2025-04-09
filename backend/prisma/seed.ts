import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 1. Nettoyage de la base de données
  await prisma.borrowRecord.deleteMany({})
  await prisma.categoryOnBook.deleteMany({})
  await prisma.book.deleteMany({})
  await prisma.category.deleteMany({})
  await prisma.user.deleteMany({})

  // 2. Création de quelques utilisateurs
  const user1 = await prisma.user.create({
    data: {
      email: 'alice@example.com',
      name: 'Alice',
      password: 'hashed_password_1', // Remplacez par un hash dans un vrai contexte
    },
  })

  const user2 = await prisma.user.create({
    data: {
      email: 'bob@example.com',
      name: 'Bob',
      password: 'hashed_password_2',
    },
  })

  // 3. Création de catégories
  const categoriesData = [
    { name: 'Fiction', description: 'Littérature de fiction' },
    { name: 'Non-Fiction', description: 'Littérature documentaire' },
    { name: 'Science-Fiction', description: 'Romans de science-fiction' },
  ]

  const categories = await Promise.all(
    categoriesData.map((cat) =>
      prisma.category.create({ data: cat })
    )
  )

  // 4. Création de 10 livres
  const booksData = [
    {
      title: '1984',
      author: 'George Orwell',
      isbn: '9780451524935',
      description: 'Un roman dystopique',
      coverImageUrl: 'https://example.com/1984.jpg',
      publicationYear: 1949,
      publisher: 'Secker & Warburg',
      pageCount: 328,
      language: 'Anglais',
      userId: user1.id,
      isAvailable: true,
    },
    {
      title: 'Le Meilleur des mondes',
      author: 'Aldous Huxley',
      isbn: '9782070360024',
      description: 'Un futur où le bonheur est manufacturé',
      coverImageUrl: 'https://example.com/meilleurdesmondes.jpg',
      publicationYear: 1932,
      publisher: 'Chatto & Windus',
      pageCount: 311,
      language: 'Français',
      userId: user1.id,
      isAvailable: true,
    },
    {
      title: 'Dune',
      author: 'Frank Herbert',
      isbn: '9780441013593',
      description: 'Une épopée de science-fiction se déroulant sur une planète désertique',
      coverImageUrl: 'https://example.com/dune.jpg',
      publicationYear: 1965,
      publisher: 'Chilton Books',
      pageCount: 412,
      language: 'Anglais',
      userId: user2.id,
      isAvailable: true,
    },
    {
      title: 'Fahrenheit 451',
      author: 'Ray Bradbury',
      isbn: '9781451673319',
      description: 'Un monde où les livres sont interdits',
      coverImageUrl: 'https://example.com/fahrenheit451.jpg',
      publicationYear: 1953,
      publisher: 'Ballantine Books',
      pageCount: 194,
      language: 'Anglais',
      userId: user1.id,
      isAvailable: true,
    },
    {
      title: 'L’étranger',
      author: 'Albert Camus',
      isbn: '9782070360025',
      description: 'Roman existentiel et absurde',
      coverImageUrl: 'https://example.com/letranger.jpg',
      publicationYear: 1942,
      publisher: 'Gallimard',
      pageCount: 123,
      language: 'Français',
      userId: user2.id,
      isAvailable: true,
    },
    {
      title: 'Harry Potter à l\'école des sorciers',
      author: 'J.K. Rowling',
      isbn: '9780747532743',
      description: 'Premier tome des aventures d\'Harry Potter',
      coverImageUrl: 'https://example.com/harrypotter1.jpg',
      publicationYear: 1997,
      publisher: 'Bloomsbury',
      pageCount: 223,
      language: 'Anglais',
      userId: user1.id,
      isAvailable: true,
    },
    {
      title: 'Le Seigneur des anneaux : La communauté de l’anneau',
      author: 'J.R.R. Tolkien',
      isbn: '9780261102354',
      description: 'Première partie de l’épopée du Seigneur des Anneaux',
      coverImageUrl: 'https://example.com/lotr1.jpg',
      publicationYear: 1954,
      publisher: 'Allen & Unwin',
      pageCount: 423,
      language: 'Anglais',
      userId: user2.id,
      isAvailable: true,
    },
    {
      title: 'L’Attrape-cœurs',
      author: 'J.D. Salinger',
      isbn: '9780316769488',
      description: 'Roman sur l’adolescence et la rébellion',
      coverImageUrl: 'https://example.com/attrapecoeurs.jpg',
      publicationYear: 1951,
      publisher: 'Little, Brown and Company',
      pageCount: 277,
      language: 'Anglais',
      userId: user1.id,
      isAvailable: true,
    },
    {
      title: 'La Peste',
      author: 'Albert Camus',
      isbn: '9782070360427',
      description: 'Roman allégorique sur une épidémie',
      coverImageUrl: 'https://example.com/lapeste.jpg',
      publicationYear: 1947,
      publisher: 'Gallimard',
      pageCount: 308,
      language: 'Français',
      userId: user2.id,
      isAvailable: true,
    },
    {
      title: 'Moby Dick',
      author: 'Herman Melville',
      isbn: '9780142437247',
      description: 'La quête obsessionnelle d\'un capitaine pour chasser une baleine',
      coverImageUrl: 'https://example.com/mobydick.jpg',
      publicationYear: 1851,
      publisher: 'Harper & Brothers',
      pageCount: 635,
      language: 'Anglais',
      userId: user1.id,
      isAvailable: true,
    },
  ]

  const createdBooks = await Promise.all(
    booksData.map(book =>
      prisma.book.create({ data: book })
    )
  )

  // 5. Assigner des catégories aux livres via la table de jointure
  // Pour simplifier, on va répartir les catégories de manière cyclique sur les livres
  for (let i = 0; i < createdBooks.length; i++) {
    const book = createdBooks[i]
    // Choix cyclique d'une catégorie parmi les 3 créées
    const category = categories[i % categories.length]
    await prisma.categoryOnBook.create({
      data: {
        bookId: book.id,
        categoryId: category.id,
      },
    })
  }

  // 6. Création d’un ou plusieurs enregistrements d’emprunt pour quelques livres
  // On va créer des enregistrements pour 3 livres
  await prisma.borrowRecord.create({
    data: {
      borrowedTo: 'Charlie',
      borrowedDate: new Date('2025-01-10'),
      dueDate: new Date('2025-02-10'),
      notes: 'Emprunt pour étude',
      bookId: createdBooks[0].id,
      userId: user1.id,
    },
  })

  await prisma.borrowRecord.create({
    data: {
      borrowedTo: 'Dana',
      borrowedDate: new Date('2025-03-05'),
      dueDate: new Date('2025-04-05'),
      returnedDate: new Date('2025-04-02'),
      notes: 'Retour anticipé',
      bookId: createdBooks[3].id,
      userId: user2.id,
    },
  })

  await prisma.borrowRecord.create({
    data: {
      borrowedTo: 'Eve',
      borrowedDate: new Date('2025-02-20'),
      dueDate: new Date('2025-03-20'),
      notes: 'Emprunt de longue durée',
      bookId: createdBooks[6].id,
      userId: user1.id,
    },
  })

  console.log('Seed data created successfully.')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
