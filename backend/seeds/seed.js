const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const UserModel = require('../models/userModel');
const MovieModel = require('../models/movieModel');
const ReviewModel = require('../models/reviewModel');

const seedData = async () => {
  try {
    console.log('🌱 Starting database seed...\n');

    // Create tables
    await UserModel.createTable();
    console.log('✅ Users table created');

    await MovieModel.createTable();
    console.log('✅ Movies table created');

    await ReviewModel.createTable();
    console.log('✅ Reviews table created');

    // Clear existing data
    await pool.query('DELETE FROM reviews;');
    await pool.query('DELETE FROM movies;');
    await pool.query('DELETE FROM users;');
    console.log('🗑️  Cleared existing data\n');

    // Seed admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await UserModel.create({
      username: 'admin',
      email: 'admin@moviehub.com',
      password: adminPassword,
      role: 'admin',
    });
    console.log('👤 Admin user created: admin@moviehub.com / admin123');

    // Seed regular user
    const userPassword = await bcrypt.hash('user123', 10);
    const user = await UserModel.create({
      username: 'johndoe',
      email: 'john@example.com',
      password: userPassword,
      role: 'user',
    });
    console.log('👤 Test user created: john@example.com / user123\n');

    // Seed movies
    const movies = [
      {
        title: 'The Shawshank Redemption',
        description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
        genre: 'Drama',
        release_year: 1994,
        director: 'Frank Darabont',
        cast_members: 'Tim Robbins, Morgan Freeman, Bob Gunton',
        poster_url: 'https://m.media-amazon.com/images/M/MV5BMDAyY2FhYjctNDc5OS00MDNlLThiMGUtY2UxYWVkNGY2ZjljXkEyXkFqcGc@._V1_.jpg',
        trailer_url: 'https://www.youtube.com/embed/PLl99DlL6b4',
        duration: 142,
      },
      {
        title: 'The Dark Knight',
        description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
        genre: 'Action',
        release_year: 2008,
        director: 'Christopher Nolan',
        cast_members: 'Christian Bale, Heath Ledger, Aaron Eckhart',
        poster_url: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg',
        trailer_url: 'https://www.youtube.com/embed/EXeTwQWrcwY',
        duration: 152,
      },
      {
        title: 'Inception',
        description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
        genre: 'Sci-Fi',
        release_year: 2010,
        director: 'Christopher Nolan',
        cast_members: 'Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page',
        poster_url: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg',
        trailer_url: 'https://www.youtube.com/embed/YoHD9XEInc0',
        duration: 148,
      },
      {
        title: 'Pulp Fiction',
        description: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
        genre: 'Crime',
        release_year: 1994,
        director: 'Quentin Tarantino',
        cast_members: 'John Travolta, Uma Thurman, Samuel L. Jackson',
        poster_url: 'https://m.media-amazon.com/images/M/MV5BYTViYTE3ZGQtNDBlMC00ZTAyLTkyODMtZGRiZDg0MjA2YThkXkEyXkFqcGc@._V1_.jpg',
        trailer_url: 'https://www.youtube.com/embed/s7EdQ4FqbhY',
        duration: 154,
      },
      {
        title: 'Interstellar',
        description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
        genre: 'Sci-Fi',
        release_year: 2014,
        director: 'Christopher Nolan',
        cast_members: 'Matthew McConaughey, Anne Hathaway, Jessica Chastain',
        poster_url: 'https://m.media-amazon.com/images/M/MV5BYzdjMDAxZGItMjI2My00ODA1LTlkNzItOWFjMDU5ZDJlYWY3XkEyXkFqcGc@._V1_.jpg',
        trailer_url: 'https://www.youtube.com/embed/zSWdZVtXT7E',
        duration: 169,
      },
      {
        title: 'The Matrix',
        description: 'When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth: the life he knows is the elaborate deception of an evil cyber-intelligence.',
        genre: 'Sci-Fi',
        release_year: 1999,
        director: 'The Wachowskis',
        cast_members: 'Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss',
        poster_url: 'https://m.media-amazon.com/images/M/MV5BN2NmN2VhMTQtMDNiOS00NDlhLTliMjgtODE2ZDYxZjlhYjVjXkEyXkFqcGc@._V1_.jpg',
        trailer_url: 'https://www.youtube.com/embed/vKQi3bBA1y8',
        duration: 136,
      },
      {
        title: 'Forrest Gump',
        description: 'The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75.',
        genre: 'Drama',
        release_year: 1994,
        director: 'Robert Zemeckis',
        cast_members: 'Tom Hanks, Robin Wright, Gary Sinise',
        poster_url: 'https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNjU1YjA0XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg',
        trailer_url: 'https://www.youtube.com/embed/bLvqoHBptjg',
        duration: 142,
      },
      {
        title: 'The Godfather',
        description: 'The aging patriarch of an organized crime dynasty in postwar New York City transfers control of his clandestine empire to his reluctant youngest son.',
        genre: 'Crime',
        release_year: 1972,
        director: 'Francis Ford Coppola',
        cast_members: 'Marlon Brando, Al Pacino, James Caan',
        poster_url: 'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg',
        trailer_url: 'https://www.youtube.com/embed/UaVTIH8mujA',
        duration: 175,
      },
      {
        title: 'Avengers: Endgame',
        description: 'After the devastating events of Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more to reverse Thanos\' actions and restore balance.',
        genre: 'Action',
        release_year: 2019,
        director: 'Anthony Russo, Joe Russo',
        cast_members: 'Robert Downey Jr., Chris Evans, Mark Ruffalo',
        poster_url: 'https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_.jpg',
        trailer_url: 'https://www.youtube.com/embed/TcMBFSGVi1c',
        duration: 181,
      },
      {
        title: 'Parasite',
        description: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
        genre: 'Thriller',
        release_year: 2019,
        director: 'Bong Joon Ho',
        cast_members: 'Song Kang-ho, Lee Sun-kyun, Cho Yeo-jeong',
        poster_url: 'https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_.jpg',
        trailer_url: 'https://www.youtube.com/embed/5xH0HfJHsaY',
        duration: 132,
      },
    ];

    const createdMovies = [];
    for (const movieData of movies) {
      const movie = await MovieModel.create(movieData);
      createdMovies.push(movie);
    }
    console.log(`🎬 ${createdMovies.length} movies seeded\n`);

    // Seed some reviews
    const reviews = [
      { user_id: user.id, movie_id: createdMovies[0].id, rating: 5, comment: 'An absolute masterpiece. One of the greatest films ever made. The story of hope and perseverance is timeless.' },
      { user_id: user.id, movie_id: createdMovies[1].id, rating: 5, comment: 'Heath Ledger\'s Joker is legendary. The best superhero movie ever made, bar none.' },
      { user_id: user.id, movie_id: createdMovies[2].id, rating: 4, comment: 'Mind-bending and visually stunning. Nolan at his finest. The ending still keeps me thinking.' },
      { user_id: admin.id, movie_id: createdMovies[0].id, rating: 5, comment: 'Get busy living, or get busy dying. This film changed my perspective on life.' },
      { user_id: admin.id, movie_id: createdMovies[4].id, rating: 5, comment: 'A beautiful blend of science and emotion. The docking scene is cinema at its peak.' },
      { user_id: user.id, movie_id: createdMovies[5].id, rating: 4, comment: 'Revolutionary filmmaking. Changed the way we see action movies forever.' },
      { user_id: admin.id, movie_id: createdMovies[7].id, rating: 5, comment: 'The definitive gangster film. Brando is phenomenal. An offer you can\'t refuse indeed.' },
      { user_id: user.id, movie_id: createdMovies[9].id, rating: 5, comment: 'Brilliantly crafted social commentary. Every scene is perfectly planned. Deserved every Oscar.' },
    ];

    for (const reviewData of reviews) {
      await ReviewModel.create(reviewData);
    }

    // Update movie ratings
    for (const movie of createdMovies) {
      await MovieModel.updateRating(movie.id);
    }
    console.log(`⭐ ${reviews.length} reviews seeded with ratings updated\n`);

    console.log('✅ Database seeding complete!');
    console.log('\n📋 Login credentials:');
    console.log('   Admin: admin@moviehub.com / admin123');
    console.log('   User:  john@example.com / user123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedData();
