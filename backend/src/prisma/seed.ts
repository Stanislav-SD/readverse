import { PrismaClient, Role, Status, Visibility } from '@prisma/client';
import { hashPassword } from '../services/authServices';

const prisma = new PrismaClient();

async function main() {
  console.log(`🌱 Start seeding ...`);

  // --- Seed User ---
  const adminPassword = await hashPassword('1234');
  const adminUser = await prisma.user.upsert({
    where: { Id: 1 },
    update: {
      Username: 'PGE Elita',
      Email: 'PGE.Elita.Varna@pge.varna',
      Password: adminPassword,
      Role: Role.ADMIN,
      Status: Status.ONLINE,
      Visibility: Visibility.PUBLIC,
    },
    create: {
      Id: 1,
      Username: 'Stanislav',
      Email: 'stanislav.dechev.sd@gmail.com',
      Password: adminPassword,
      Role: Role.ADMIN,
      Status: Status.ONLINE,
      Visibility: Visibility.PUBLIC,
      CreatedAt: new Date('2025-04-27T15:32:28.102Z'),
    },
  });
  console.log(`👤 Upserted admin user: ${adminUser.Username}`);

  const genresData = [
    { Id: 120, Name: '19th Century' }, { Id: 121, Name: '20th Century' },
    { Id: 92, Name: 'Action' }, { Id: 76, Name: 'Adventure' },
    { Id: 20, Name: 'Adventurous' }, { Id: 96, Name: 'Anime' },
    { Id: 111, Name: 'Autobiography' }, { Id: 78, Name: 'Biography' },
    { Id: 81, Name: 'Bulgarian Literature' }, { Id: 99, Name: 'Business' },
    { Id: 118, Name: 'Childrens' }, { Id: 80, Name: 'Christian' },
    { Id: 85, Name: 'Classics' }, { Id: 97, Name: 'Comedy' },
    { Id: 22, Name: 'contemporary' }, { Id: 95, Name: 'Crime' },
    { Id: 16, Name: 'Dark' }, { Id: 83, Name: 'Drama' },
    { Id: 103, Name: 'Economics' }, { Id: 88, Name: 'Fantasy' },
    { Id: 14, Name: 'Fiction' }, { Id: 73, Name: 'Finance' },
    { Id: 17, Name: 'Funny' }, { Id: 23, Name: 'Graphic novel' },
    { Id: 91, Name: 'Harem' }, { Id: 106, Name: 'Health' },
    { Id: 82, Name: 'Historical' }, { Id: 77, Name: 'Historical Fiction' },
    { Id: 24, Name: 'Horror' }, { Id: 116, Name: 'Humor' },
    { Id: 98, Name: 'Japan' }, { Id: 86, Name: 'Japanese Literature' },
    { Id: 105, Name: 'Leadership' }, { Id: 87, Name: 'Light Novel' },
    { Id: 18, Name: 'Lighthearted' }, { Id: 119, Name: 'Literature' },
    { Id: 90, Name: 'Magic' }, { Id: 113, Name: 'Management' },
    { Id: 89, Name: 'Manga' }, { Id: 110, Name: 'Memoir' },
    { Id: 115, Name: 'Mental Health' }, { Id: 112, Name: 'Military Fiction' },
    { Id: 102, Name: 'Money' }, { Id: 15, Name: 'Music' },
    { Id: 25, Name: 'Mystery' }, { Id: 100, Name: 'Nonfiction' },
    { Id: 93, Name: 'Novel' }, { Id: 74, Name: 'Personal Development' },
    { Id: 108, Name: 'Philosophy' }, { Id: 114, Name: 'Pholosophy' },
    { Id: 104, Name: 'Productivity' }, { Id: 79, Name: 'Psychology' },
    { Id: 21, Name: 'Reflective' }, { Id: 84, Name: 'Romance' },
    { Id: 109, Name: 'Science' }, { Id: 101, Name: 'Self Help' },
    { Id: 19, Name: 'Short stories' }, { Id: 107, Name: 'Spirituality' },
    { Id: 94, Name: 'Suspense' }, { Id: 75, Name: 'Thriller' },
    { Id: 117, Name: 'War' }
  ];

  console.log(`📚 Seeding/Updating ${genresData.length} genres...`);
  for (const genre of genresData) {
    await prisma.genre.upsert({
      where: { Id: genre.Id },
      update: { Name: genre.Name },
      create: { Id: genre.Id, Name: genre.Name },
    });
  }
  console.log(`📚 Genres seeded/updated.`);


  const getGenreConnectOrCreate = (genreNames: string[]) => {
    return genreNames.map(name => ({
      where: { Name: name },
      create: { Name: name }
    }));
  }

  console.log(`📚 Seeding/Updating books...`);

  const booksData = [
    { Id: 3, Title: 'Глина', Image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1605534770i/55906316.jpg', Author: 'Виктория Бешлийска', Published: new Date('2020-01-01T00:00:00.000Z'), Pages: 368, Description: 'Създадена от огъня на думите...', ISBN10: '', ISBN13: '', Genres: ['Fiction', 'Historical Fiction', 'Bulgarian Literature', 'Novel'] },
    { Id: 4, Title: 'Сърце', Image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1665068814i/62894783.jpg', Author: 'Виктория Бешлийска', Published: new Date('2022-10-11T00:00:00.000Z'), Pages: 376, Description: 'Роман, който носи магията на „Глина“...', ISBN10: '', ISBN13: '', Genres: ['Fiction', 'Historical Fiction', 'Bulgarian Literature'] },
    { Id: 5, Title: 'Нишка', Image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1720786245i/216406241.jpg', Author: 'Виктория Бешлийска', Published: new Date('2024-07-25T00:00:00.000Z'), Pages: 480, Description: 'Утрото на Видовден изправя Мария...', ISBN10: '', ISBN13: '', Genres: ['Fiction', 'Bulgarian Literature'] },
    { Id: 6, Title: 'Словник', Image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1635956036i/59530498.jpg', Author: 'Виктория Бешлийска', Published: new Date('2021-01-01T00:00:00.000Z'), Pages: 328, Description: 'Словник – твоето място за думи...', ISBN10: '', ISBN13: '', Genres: ['Bulgarian Literature'] },
    { Id: 7, Title: 'Angels & Demons', Image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1696691404i/960.jpg', Author: 'Dan Brown', Published: new Date('2000-05-01T00:00:00.000Z'), Pages: 736, Description: 'An ancient secret brotherhood...', ISBN10: '', ISBN13: '', Genres: ['Fiction', 'Mystery', 'Thriller', 'Adventure', 'Historical Fiction', 'Novel', 'Suspense', 'Crime'] },
    { Id: 8, Title: 'The da Vinci Code', Image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1597799084i/55019204.jpg', Author: 'Dan Brown', Published: new Date('2003-01-01T00:00:00.000Z'), Pages: 480, Description: 'While in Paris on business...', ISBN10: '', ISBN13: '', Genres: ['Fiction', 'Mystery', 'Thriller', 'Adventure', 'Novel', 'Suspense', 'Crime'] },
    { Id: 9, Title: 'Deception Point', Image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1551277487i/976.jpg', Author: 'Dan Brown', Published: new Date('2001-01-01T00:00:00.000Z'), Pages: 556, Description: 'A shocking scientific discovery...', ISBN10: '', ISBN13: '', Genres: ['Fiction', 'Mystery', 'Thriller', 'Adventure', 'Novel', 'Suspense', 'Crime', 'Action'] },
    { Id: 10, Title: 'Digital Fortress', Image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1360095966i/11125.jpg', Author: 'Dan Brown', Published: new Date('1998-02-01T00:00:00.000Z'), Pages: 510, Description: 'When the NSA\'s invincible code-breaking machine...', ISBN10: '', ISBN13: '', Genres: ['Fiction', 'Mystery', 'Thriller', 'Adventure', 'Novel', 'Suspense', 'Crime', 'Action'] },
    { Id: 11, Title: 'The Lost Symbol', Image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1534070883i/6411961.jpg', Author: 'Dan Brown', Published: new Date('2009-09-15T00:00:00.000Z'), Pages: 509, Description: 'What was lost will be found...', ISBN10: '', ISBN13: '', Genres: ['Fiction', 'Mystery', 'Thriller', 'Adventure', 'Novel', 'Suspense', 'Crime'] },
    { Id: 12, Title: 'Inferno', Image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1534070896i/17212231.jpg', Author: 'Dan Brown', Published: new Date('2013-05-14T00:00:00.000Z'), Pages: 463, Description: 'With these words echoing in his head...', ISBN10: '', ISBN13: '', Genres: ['Fiction', 'Mystery', 'Thriller', 'Adventure', 'Novel', 'Suspense', 'Crime'] },
    { Id: 13, Title: 'Mushoku Tensei: Jobless Reincarnation Vol. 1', Image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1558730957i/46007235.jpg', Author: 'Rifujin na Magonote', Published: new Date('2014-01-23T00:00:00.000Z'), Pages: 222, Description: 'Kicked out by his family...', ISBN10: '', ISBN13: '', Genres: ['Fiction', 'Romance', 'Japanese Literature', 'Light Novel', 'Fantasy', 'Manga', 'Magic', 'Harem', 'Anime', 'Novel'] },
    { Id: 14, Title: 'Mushoku Tensei: Jobless Reincarnation Vol. 2', Image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1551760712i/44279081.jpg', Author: ' Rifujin na Magonote', Published: new Date('2019-05-23T00:00:00.000Z'), Pages: 256, Description: 'Rudeus is shipped off to Roa...', ISBN10: '', ISBN13: '', Genres: ['Fiction', 'Romance', 'Fantasy', 'Manga', 'Magic', 'Harem', 'Adventure'] },
    { Id: 15, Title: 'Mushoku Tensei: Jobless Reincarnation Vol. 3', Image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1558837608i/46015507.jpg', Author: ' Rifujin na Magonote', Published: new Date('2014-05-22T00:00:00.000Z'), Pages: 283, Description: 'THE ROAD TO ADVENTURE...', ISBN10: '', ISBN13: '', Genres: ['Fiction', 'Japanese Literature', 'Light Novel', 'Fantasy', 'Manga', 'Magic', 'Harem', 'Adventure', 'Novel'] },
    { Id: 16, Title: 'Mushoku Tensei: Jobless Reincarnation Vol. 4', Image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1565312687l/51064441.jpg', Author: 'Rifujin na Magonote', Published: new Date('2014-08-22T00:00:00.000Z'), Pages: 239, Description: 'EYES OF THE DEMON...', ISBN10: '', ISBN13: '', Genres: ['Fiction', 'Japanese Literature', 'Light Novel', 'Fantasy', 'Manga', 'Magic', 'Harem', 'Adventure', 'Novel'] },
    { Id: 17, Title: 'Mushoku Tensei: Jobless Reincarnation Vol. 5', Image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1567624797l/52839631.jpg', Author: 'Rifujin na Magonote', Published: new Date('2014-10-23T00:00:00.000Z'), Pages: 252, Description: 'FATHER VS. SON...', ISBN10: '', ISBN13: '', Genres: ['Fiction', 'Romance', 'Japanese Literature', 'Light Novel', 'Fantasy', 'Manga', 'Magic', 'Harem', 'Adventure', 'Novel'] },
    { Id: 18, Title: 'Mushoku Tensei: Jobless Reincarnation Vol. 6', Image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1585971763i/52927271.jpg', Author: 'Rifujin na Magonote', Published: new Date('2015-02-24T00:00:00.000Z'), Pages: 245, Description: 'A tip from the enigmatic Man God...', ISBN10: '', ISBN13: '', Genres: ['Fiction', 'Romance', 'Japanese Literature', 'Light Novel', 'Fantasy', 'Manga', 'Magic', 'Novel', 'Comedy'] },
    { Id: 19, Title: 'Mushoku Tensei: Jobless Reincarnation Vol. 7', Image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1590955482i/53710643.jpg', Author: 'Rifujin na Magonote', Published: new Date('2015-08-25T00:00:00.000Z'), Pages: 259, Description: 'THE MOTHER OF ALL ADVENTURES...', ISBN10: '', ISBN13: '', Genres: ['Fiction', 'Romance', 'Japanese Literature', 'Light Novel', 'Fantasy', 'Manga', 'Magic', 'Adventure', 'Novel'] },
    { Id: 20, Title: 'Mushoku Tensei: Jobless Reincarnation Vol. 8', Image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1595193782i/54596458.jpg', Author: ' Rifujin na Magonote', Published: new Date('2015-10-23T00:00:00.000Z'), Pages: 246, Description: 'BACK TO SCHOOL...', ISBN10: '', ISBN13: '', Genres: ['Fiction', 'Japanese Literature', 'Light Novel', 'Fantasy', 'Manga', 'Magic', 'Harem', 'Adventure', 'Action'] },
    { Id: 21, Title: 'Mushoku Tensei: Jobless Reincarnation Vol. 9', Image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1610169473i/56600216.jpg', Author: ' Rifujin na Magonote', Published: new Date('2016-01-25T00:00:00.000Z'), Pages: 252, Description: 'BLAST FROM THE PAST!...', ISBN10: '', ISBN13: '', Genres: ['Fiction', 'Romance', 'Japanese Literature', 'Light Novel', 'Fantasy', 'Manga', 'Magic', 'Adventure', 'Novel'] },
    { Id: 22, Title: 'Mushoku Tensei: Jobless Reincarnation Vol. 10', Image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1613330778i/57060452.jpg', Author: 'Rifujin na Magonote', Published: new Date('2016-03-25T00:00:00.000Z'), Pages: 205, Description: 'WEDDED BLISS—OR BANE?!...', ISBN10: '', ISBN13: '', Genres: ['Fiction', 'Japanese Literature', 'Light Novel', 'Fantasy', 'Manga', 'Magic', 'Harem', 'Adventure', 'Novel'] },
    { Id: 24, Title: 'Mushoku Tensei: Jobless Reincarnation Vol. 11', Image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1614562303i/57238646.jpg', Author: 'Rifujin na Magonote', Published: new Date('2016-05-25T00:00:00.000Z'), Pages: 299, Description: 'LITTLE SISTERS MAKE BIG PROBLEMS!...', ISBN10: '', ISBN13: '', Genres: ['Fiction', 'Japanese Literature', 'Light Novel', 'Fantasy', 'Manga', 'Magic', 'Adventure', 'Novel'] },
    { Id: 25, Title: 'Mushoku Tensei: Jobless Reincarnation Vol. 12', Image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1620425222i/57974989.jpg', Author: ' Rifujin na Magonote', Published: new Date('2016-08-25T00:00:00.000Z'), Pages: 255, Description: 'Rudeus and Paul must descend...', ISBN10: '', ISBN13: '', Genres: ['Fiction', 'Japanese Literature', 'Light Novel', 'Fantasy', 'Manga', 'Harem', 'Adventure', 'Novel', 'Japan'] },
    { Id: 26, Title: 'Mushoku Tensei: Jobless Reincarnation Vol. 13', Image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1631160001i/58954637.jpg', Author: 'Rifujin na Magonote', Published: new Date('2016-12-22T00:00:00.000Z'), Pages: 278, Description: 'Putting loss and grief behind them...', ISBN10: '', ISBN13: '', Genres: ['Fiction', 'Japanese Literature', 'Light Novel', 'Fantasy', 'Manga', 'Harem', 'Adventure', 'Novel', 'Anime'] },
    { Id: 27, Title: 'Mushoku Tensei: Jobless Reincarnation Vol. 14', Image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1635738407i/59505481.jpg', Author: 'Rifujin na Magonote', Published: new Date('2017-04-25T00:00:00.000Z'), Pages: 255, Description: 'CASTLE IN THE SKY...', ISBN10: '', ISBN13: '', Genres: ['Fiction', 'Japanese Literature', 'Light Novel', 'Fantasy', 'Manga', 'Harem', 'Adventure', 'Novel'] },
    { Id: 28, Title: 'Mushoku Tensei: Jobless Reincarnation Vol. 15', Image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1638320925i/59732827.jpg', Author: 'Rifujin na Magonote', Published: new Date('2017-07-25T00:00:00.000Z'), Pages: 275, Description: 'Rudeus\'s brief meeting...', ISBN10: '', ISBN13: '', Genres: ['Fiction', 'Japanese Literature', 'Light Novel', 'Fantasy', 'Manga', 'Harem', 'Adventure', 'Novel', 'Japan'] },
    { Id: 29, Title: 'Mushoku Tensei: Jobless Reincarnation Vol. 16', Image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1646949383i/60588209.jpg', Author: 'Rifujin na Magonote', Published: new Date('2017-10-25T00:00:00.000Z'), Pages: 261, Description: 'Now officially Dragon God Orsted\'s underling...', ISBN10: '', ISBN13: '', Genres: ['Fiction', 'Japanese Literature', 'Light Novel', 'Fantasy', 'Manga', 'Harem', 'Adventure', 'Novel'] },
    { Id: 30, Title: 'Mushoku Tensei: Jobless Reincarnation Vol. 17', Image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1653236975i/61146070.jpg', Author: 'Rifujin na Magonote', Published: new Date('2018-01-25T00:00:00.000Z'), Pages: 272, Description: 'Rudeus plunges into the political fray...', ISBN10: '', ISBN13: '', Genres: ['Fiction', 'Romance', 'Japanese Literature', 'Light Novel', 'Fantasy', 'Manga', 'Harem', 'Adventure', 'Novel'] },
    { Id: 31, Title: 'Mushoku Tensei: Jobless Reincarnation Vol. 18', Image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1722018075i/61438641.jpg', Author: 'Rifujin na Magonote', Published: new Date('2018-05-25T00:00:00.000Z'), Pages: 273, Description: 'In the years since Ariel took the throne...', ISBN10: '', ISBN13: '', Genres: ['Fiction', 'Japanese Literature', 'Light Novel', 'Fantasy', 'Manga', 'Harem', 'Adventure', 'Novel'] },
    { Id: 32, Title: 'Mushoku Tensei: Jobless Reincarnation Vol. 19', Image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1663447088i/62619874.jpg', Author: 'Rifujin na Magonote', Published: new Date('2018-08-25T00:00:00.000Z'), Pages: 323, Description: 'The Shirone Kingdom summons Zanoba home...', ISBN10: '', ISBN13: '', Genres: ['Fiction', 'Japanese Literature', 'Light Novel', 'Fantasy', 'Manga', 'Harem', 'Adventure', 'Novel', 'Japan'] },
    { Id: 33, Title: 'Mushoku Tensei: Jobless Reincarnation Vol. 20', Image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1670304676i/64133349.jpg', Author: ' Rifujin na Magonote', Published: new Date('2019-01-25T00:00:00.000Z'), Pages: 251, Description: 'TUGGED ALONG BY FAMILY TIES...', ISBN10: '', ISBN13: '', Genres: ['Fiction', 'Japanese Literature', 'Light Novel', 'Fantasy', 'Manga', 'Harem', 'Adventure', 'Novel'] },
    { Id: 34, Title: 'Mushoku Tensei: Jobless Reincarnation Vol. 21', Image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1675384758i/96176895.jpg', Author: 'Rifujin na Magonote', Published: new Date('2019-03-25T00:00:00.000Z'), Pages: 256, Description: 'Zenith—Rudeus’s mother—has been kidnapped...', ISBN10: '', ISBN13: '', Genres: ['Fiction', 'Japanese Literature', 'Light Novel', 'Fantasy', 'Manga', 'Harem', 'Adventure', 'Novel'] },
    { Id: 35, Title: 'Mushoku Tensei: Jobless Reincarnation Vol. 23', Image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1685269341i/157869790.jpg', Author: 'Rifujin na Magonote', Published: new Date('2020-06-25T00:00:00.000Z'), Pages: 222, Description: 'PERUGIUS\'S DIVINE TRIAL...', ISBN10: '', ISBN13: '', Genres: ['Fiction', 'Japanese Literature', 'Light Novel', 'Fantasy', 'Manga', 'Novel'] },
    { Id: 36, Title: 'Mushoku Tensei: Jobless Reincarnation Vol. 24', Image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1692816443i/197715671.jpg', Author: ' Rifujin na Magonote', Published: new Date('2020-12-25T00:00:00.000Z'), Pages: 192, Description: 'Rudeus arrives at Irel City...', ISBN10: '', ISBN13: '', Genres: ['Fiction', 'Japanese Literature', 'Light Novel', 'Fantasy', 'Manga', 'Harem', 'Adventure', 'Novel'] },
    { Id: 37, Title: 'Mushoku Tensei: Jobless Reincarnation, Vol. 22', Image: 'https://covers.openlibrary.org/b/id/14710771-L.jpg', Author: ' Rifujin na Magonote', Published: new Date('2019-07-25T00:00:00.000Z'), Pages: 380, Description: 'A SECRET, UNVEILED...', ISBN10: '', ISBN13: '', Genres: ['Fiction', 'Japanese Literature', 'Light Novel', 'Fantasy', 'Manga', 'Harem', 'Adventure', 'Novel'] },
    { Id: 38, Title: 'Rich Dad, Poor Dad', Image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1388211242i/69571.jpg', Author: 'Robert T. Kiyosaki', Published: new Date('1997-04-08T00:00:00.000Z'), Pages: 195, Description: 'Rich Dad Poor Dad is Robert\'s story...', ISBN10: '', ISBN13: '', Genres: ['Finance', 'Personal Development', 'Business', 'Nonfiction', 'Self Help', 'Money', 'Economics'] },
    { Id: 39, Title: 'Atomic Habits: An Easy & Proven Way to Build Good Habits & Break Bad Ones', Image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1655988385i/40121378.jpg', Author: 'James Clear', Published: new Date('2018-10-18T00:00:00.000Z'), Pages: 319, Description: 'No matter your goals, Atomic Habits offers...', ISBN10: '', ISBN13: '', Genres: ['Personal Development', 'Psychology', 'Nonfiction', 'Self Help', 'Business', 'Productivity', 'Leadership', 'Health'] },
    { Id: 40, Title: 'The Silva Mind Control Method', Image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1369395259i/184955.jpg', Author: 'José Silva', Published: new Date('1977-01-01T00:00:00.000Z'), Pages: 176, Description: 'Since The Silva Mind Control Method...', ISBN10: '', ISBN13: '', Genres: ['Personal Development', 'Psychology', 'Nonfiction', 'Self Help', 'Productivity', 'Health', 'Spirituality', 'Philosophy', 'Science'] },
    { Id: 41, Title: 'Can\'t Hurt Me: Master Your Mind and Defy the Odds', Image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1536184191i/41721428.jpg', Author: 'David Goggins', Published: new Date('2018-11-15T00:00:00.000Z'), Pages: 366, Description: 'New York Times Best Seller...', ISBN10: '', ISBN13: '', Genres: ['Personal Development', 'Psychology', 'Nonfiction', 'Self Help', 'Biography', 'Leadership', 'Memoir', 'Autobiography', 'Military Fiction'] },
    { Id: 42, Title: 'The Psychology of Money', Image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1581527774i/41881472.jpg', Author: 'Morgan Housel', Published: new Date('2020-01-01T00:00:00.000Z'), Pages: 242, Description: 'Doing well with money isn\'t necessarily...', ISBN10: '', ISBN13: '', Genres: ['Finance', 'Personal Development', 'Psychology', 'Nonfiction', 'Self Help', 'Business', 'Money', 'Economics'] },
    { Id: 43, Title: 'Deep Work: Rules for Focused Success in a Distracted World', Image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1447957962i/25744928.jpg', Author: 'Cal Newport', Published: new Date('2016-01-05T00:00:00.000Z'), Pages: 296, Description: 'One of the most valuable skills...', ISBN10: '', ISBN13: '', Genres: ['Personal Development', 'Psychology', 'Nonfiction', 'Self Help', 'Business', 'Productivity', 'Leadership', 'Philosophy', 'Management'] },
    { Id: 44, Title: 'Thinking, Fast and Slow', Image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1317793965i/11468377.jpg', Author: 'Daniel Kahneman', Published: new Date('2011-10-25T00:00:00.000Z'), Pages: 499, Description: 'In the highly anticipated Thinking, Fast and Slow...', ISBN10: '', ISBN13: '', Genres: ['Personal Development', 'Psychology', 'Nonfiction', 'Self Help', 'Business', 'Productivity', 'Leadership', 'Pholosophy'] }, // Note: Pholosophy typo from dump
    { Id: 45, Title: 'Think and Grow Rich', Image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1463241782i/30186948.jpg', Author: 'Napoleon Hill', Published: new Date('1937-01-01T00:00:00.000Z'), Pages: 233, Description: 'Think and Grow Rich is a guide to success...', ISBN10: '', ISBN13: '', Genres: ['Finance', 'Personal Development', 'Psychology', 'Nonfiction', 'Self Help', 'Business', 'Money', 'Philosophy'] },
    { Id: 46, Title: 'The Power of Habit: Why We Do What We Do in Life and Business', Image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1545854312i/12609433.jpg', Author: 'Charles Duhigg', Published: new Date('2012-04-25T00:00:00.000Z'), Pages: 375, Description: 'A young woman walks into a laboratory...', ISBN10: '', ISBN13: '', Genres: ['Personal Development', 'Psychology', 'Nonfiction', 'Self Help', 'Business', 'Productivity', 'Leadership', 'Science'] },
    { Id: 47, Title: 'The Subtle Art of Not Giving a F*ck: A Counterintuitive Approach to Living a Good Life', Image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1465761302i/28257707.jpg', Author: 'Mark Manson', Published: new Date('2016-01-01T00:00:00.000Z'), Pages: 212, Description: 'In this generation-defining self-help guide...', ISBN10: '', ISBN13: '9780062457738', Genres: ['Personal Development', 'Psychology', 'Nonfiction', 'Self Help', 'Philosophy', 'Mental Health', 'Humor'] },
    { Id: 48, Title: 'Unstressable: A Practical Guide to Stress-Free Living', Image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1699655861i/126919418.jpg', Author: ' Mo Gawdat', Published: new Date('2024-04-30T00:00:00.000Z'), Pages: 359, Description: 'Mo Gawdat is an engineer...', ISBN10: '', ISBN13: '', Genres: ['Personal Development', 'Nonfiction', 'Self Help', 'Health'] },
    { Id: 49, Title: 'Рана', Image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1697139793i/199562695.jpg', Author: 'Захари Карабашлиев', Published: new Date('2023-10-23T00:00:00.000Z'), Pages: 328, Description: 'Какво е саможертвата?...', ISBN10: '', ISBN13: '', Genres: ['Fiction', 'Historical Fiction', 'Bulgarian Literature', 'Historical', 'Drama', 'War'] },
    { Id: 50, Title: 'Жажда', Image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1543662832i/43067312.jpg', Author: 'Захари Карабашлиев', Published: new Date('2018-11-28T00:00:00.000Z'), Pages: 112, Description: 'Млад мъж се събужда...', ISBN10: '', ISBN13: '', Genres: ['Fiction', 'Short stories', 'Bulgarian Literature'] },
    { Id: 51, Title: 'Бай Ганьо', Image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1277825130i/6251113.jpg', Author: 'Алеко Константинов', Published: new Date('1894-01-01T00:00:00.000Z'), Pages: 176, Description: 'Няма дете, което да не е чувало...', ISBN10: '', ISBN13: '', Genres: ['Fiction', 'Bulgarian Literature', 'Historical', 'Classics', 'Novel', 'Humor'] },
    { Id: 52, Title: 'Ян Бибиян', Image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1226042359i/5525957.jpg', Author: 'Елин Пелин', Published: new Date('1933-01-01T00:00:00.000Z'), Pages: 197, Description: 'Ян Бибиян е първият български фантастичен роман...', ISBN10: '', ISBN13: '', Genres: ['Fiction', 'Bulgarian Literature', 'Fantasy', 'Classics', 'Novel', 'Childrens'] },
    { Id: 53, Title: 'Под игото', Image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1226045632i/3310284.jpg', Author: 'Иван Вазов', Published: new Date('1888-01-01T00:00:00.000Z'), Pages: 528, Description: '„Под игото“ е първият български роман...', ISBN10: '', ISBN13: '', Genres: ['Fiction', 'Historical Fiction', 'Bulgarian Literature', 'Historical', 'Classics', 'Novel', 'Literature', '19th Century'] },
    { Id: 54, Title: 'Железният светилник', Image: 'https://covers.openlibrary.org/b/id/13767935-M.jpg', Author: 'Димитър Талев', Published: new Date('1952-01-01T00:00:00.000Z'), Pages: 368, Description: '„В образа на Стоян Глаушев аз съм искал...', ISBN10: '', ISBN13: '', Genres: ['Fiction', 'Historical Fiction', 'Bulgarian Literature', 'Historical', 'Classics', '20th Century'] },
    { Id: 55, Title: 'Тютюн', Image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1366473906i/2124105.jpg', Author: 'Димитър Димов', Published: new Date('1951-01-01T00:00:00.000Z'), Pages: 616, Description: 'Първо издание на оригинала...', ISBN10: '', ISBN13: '', Genres: ['Fiction', 'Historical Fiction', 'Bulgarian Literature', 'Historical', 'Classics', 'Novel', '20th Century'] },
    { Id: 56, Title: 'Крадецът на праскови', Image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1282842450i/3687146.jpg', Author: 'Емилиян Станев', Published: new Date('1948-01-01T00:00:00.000Z'), Pages: 336, Description: 'В книгата са включени повестта...', ISBN10: '', ISBN13: '', Genres: ['Fiction', 'Romance', 'Bulgarian Literature', 'Historical', 'Classics', '20th Century'] },
  ];

  for (const book of booksData) {
    await prisma.book.upsert({
      where: { Id: book.Id },
      update: {
        Title: book.Title,
        Image: book.Image,
        Author: book.Author,
        Published: book.Published,
        Pages: book.Pages,
        Description: book.Description,
        ISBN10: book.ISBN10,
        ISBN13: book.ISBN13,
        Genre: {
          set: [],
          connectOrCreate: getGenreConnectOrCreate(book.Genres)
        }
      },
      create: {
        Id: book.Id,
        Title: book.Title,
        Image: book.Image,
        Author: book.Author,
        Published: book.Published,
        Pages: book.Pages,
        Description: book.Description,
        ISBN10: book.ISBN10,
        ISBN13: book.ISBN13,
        Genre: {
          connectOrCreate: getGenreConnectOrCreate(book.Genres)
        }
      },
    });
  }
  console.log(`📚 All ${booksData.length} books seeded/updated.`);

  const bookIdForRelations = 53;
  const userIdForRelations = 1;

  console.log(`📚 Seeding/Updating GeneralShelf entry...`);
  await prisma.generalShelf.upsert({
    where: { Id: 1 },
    update: { Shelf: 'READING', UserId: userIdForRelations, BookId: bookIdForRelations, },
    create: { Id: 1, Shelf: 'READING', UserId: userIdForRelations, BookId: bookIdForRelations, }
  });
  console.log(`📚 GeneralShelf entry seeded/updated.`);

  console.log(`⏱️ Seeding/Updating BookStat entry...`);
  const bookStat = await prisma.bookStat.upsert({
    where: { Id: 1 },
    update: { UserId: userIdForRelations, BookId: bookIdForRelations, ReadTime: 10, StartedAt: new Date('2025-04-28T19:14:59.796Z'), FinishedAt: null, },
    create: { Id: 1, UserId: userIdForRelations, BookId: bookIdForRelations, ReadTime: 10, StartedAt: new Date('2025-04-28T19:14:59.796Z'), FinishedAt: null, }
  });
  console.log(`⏱️ BookStat entry seeded/updated.`);

  console.log(`📊 Seeding/Updating ReadingSessionStat entry...`);
  await prisma.readingSessionStat.upsert({
    where: { Id: 1 },
    update: { ReadTime: 10, Pages: 126, BookStatId: bookStat.Id, CreatedAt: new Date('2025-04-28T19:15:41.410Z'), UserId: userIdForRelations, },
    create: { Id: 1, ReadTime: 10, Pages: 126, BookStatId: bookStat.Id, CreatedAt: new Date('2025-04-28T19:15:41.410Z'), UserId: userIdForRelations, }
  });
  console.log(`📊 ReadingSessionStat entry seeded/updated.`);

  console.warn('🚨 WARNING: Seeding RefreshTokens from dump. This is generally insecure and not recommended.');
  const refreshTokenUserId = 1;
  const refreshTokenDeviceId = '03cb62c7ff6e4b5cb76c4cc5bae4a281ec0200f22141ee6d7832124512a23697';
  await prisma.refreshTokens.upsert({
    where: { Id: 4 },
    update: { UserId: refreshTokenUserId, Token: '1db7327088c4367038d7ecee26fba4e0dde59a7e809cff451ba709afccc6a2a3', DeviceId: refreshTokenDeviceId, CreatedAt: new Date('2025-04-28T19:19:50.525Z'), ExpiresAt: new Date('2025-05-28T19:19:50.524Z'), },
    create: { Id: 4, UserId: refreshTokenUserId, Token: '1db7327088c4367038d7ecee26fba4e0dde59a7e809cff451ba709afccc6a2a3', DeviceId: refreshTokenDeviceId, CreatedAt: new Date('2025-04-28T19:19:50.525Z'), ExpiresAt: new Date('2025-05-28T19:19:50.524Z'), }
  });
  console.log(`🔑 RefreshToken entry seeded/updated (USE WITH CAUTION).`);
  
  console.log(`✅ Seeding finished.`);
}

main()
.catch((e) => {
  console.error('❌ Seeding failed:', e);
  process.exit(1);
})
.finally(async () => {
  await prisma.$disconnect();
});