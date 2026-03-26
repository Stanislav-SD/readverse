// GraphQL Schema
const typeDefs = `
  scalar JSON

  type User {
    Id: Int!
    Username: String!
    Email: String!
    Role: String!
    Status: String!
    Visibility: String!
    LastActive: String
    CreatedAt: String!
  }
  type Genre {
    Name: String
  }
  type Book {
    Id: Int
    Title: String
    Image: String
    Author: String
    Published: String
    Pages: Int
    Description: String
    Genre: [Genre]
  }
  type Stats {
    WeekRead: [Int]
    CurrentReading: Int
    PagesRead: Int
    PagesReadForMonth: JSON
  }
  type FriendRequest {
    Id: Int
    FriendId: Int
    Username: String
    Status: String
  }
  type Friend {
    Id: Int
    UserId: Int
    FriendId: Int
    Username: String
    Status: String
    Visibility: String
    LastActive: String
  }
  type SearchUser {
    Id: Int
    Username: String
  }
  type LibBook {
    Book: Book
    ReadTime: Int
    Pages: Int
    TimeLeftToFinishBook: Float
  }
  type LibraryBook {
    Shelf: String
    Books: [LibBook]
  }
  type topBookGenre {
    Genre: String,
    Books: [Book]
  }
  type GenreDb {
    Id: Int
    Name: String
  }
  type Badges {
    Id: Int!
    Image: String!
    Label: String!
    Quest: String!
    Conditions: JSON!
  }
  type UserBadge {
    UserId: Int!
    BadgeId: Int!
    EarnedAt: String
    Badge: Badges
  }

  type Query {
    me: User
    getBooks(take: Int, top: Boolean!, genre: String): [Book]
    getUsers: [SearchUser]
    getBook(id: Int): Book
    getGenres: [GenreDb]
    getStats: Stats
    getFriends: [Friend!]!
    getFriendRequests: [FriendRequest!]!
    getLibraryBooks: [LibraryBook!]!
    getBadges: [Badges!]!
    getUserBadges: [UserBadge!]!
    topGenreRecommendations(take: Int): topBookGenre!
  }

  type Mutation {
    register(username: String!, email: String!, password: String!): String
    login(email: String!, password: String!, refresh: Boolean!): String
    logout: Boolean
    refreshToken: String
    enable2FA: String
    disable2FA(token: String!): String
    verify2FA(token: String!): String

    updateStatus(status: String!): Boolean
    setVisibility(visibility: String!): Boolean!
    
    sendFriendRequest(friendId: Int!): Boolean!
    unsendFriendRequest(friendId: Int!): Boolean!
    acceptFriendRequest(friendId: Int!): Boolean!
    rejectFriendRequest(friendId: Int!): Boolean!
    removeFriend(friendId: Int!): Boolean!
    
    addBook(Title: String!, Image: String!, Author: String!, Pages: Int!, Genre: [String], Published: String, Description: String, ISBN10: String, ISBN13: String): Boolean
    updateBook(BookId: Int!, Title: String!, CoverImage: String!, Image: String!, Author: String!, Genre: String!, Published: String!, Pages: Int!): String
    deleteBook(BookId: Int!): String

    addBadge(Image: String!, Label: String!, Quest: String!, Conditions: JSON!): Boolean
    updateBadge(Id: Int!, Image: String, Label: String, Quest: String, Conditions: JSON): Boolean
    removeBadge(Id: Int!): Boolean

    addBookToShelf(BookId: Int!, Shelf: String!): String
    updateBookInShelf(Id: Int!, Shelf: String!): String
    removeBookFromShelf(Id: Int!): String

    saveNewReadingSession(BookId: Int!, Time: Int!, Pages: Int!): String
    updateBookSession(Id: Int!, Time: Int!, Pages: Int!): String
    removeReadingSession(Id: Int!): String
    removeMicroReadingSession(Id: Int!): String
  }

  type Subscription {
    statusChanged: User!
  }
`;
//googleLogin(token: String!): String

export default typeDefs;