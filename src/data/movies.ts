import { Movie } from '../types';

// Trending Movies
export const trendingMovies: Movie[] = [
  {
    imdbID: 't1',
    Title: 'The Avengers',
    Year: '2012',
    Poster: 'https://m.media-amazon.com/images/M/MV5BZTBhNjkzNzAtMjI3OC00NzQyLWIyNWItMzlkYmVmOGQxYTI1XkEyXkFqcGc@._V1_.jpg',
    Type: 'movie',
    Genre: 'Action, Adventure'
  },
  {
    imdbID: 't2',
    Title: 'Inception',
    Year: '2010',
    Poster: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg',
    Type: 'movie',
    Genre: 'Sci-Fi, Action'
  },
  {
    imdbID: 't3',
    Title: 'The Dark Knight',
    Year: '2008',
    Poster: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg',
    Type: 'movie',
    Genre: 'Action, Crime, Drama'
  },
  {
    imdbID: 't4',
    Title: 'Interstellar',
    Year: '2014',
    Poster: 'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg',
    Type: 'movie',
    Genre: 'Adventure, Drama, Sci-Fi'
  },
  {
    imdbID: 't5',
    Title: 'Pulp Fiction',
    Year: '1994',
    Poster: 'https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg',
    Type: 'movie',
    Genre: 'Crime, Drama'
  },
  {
    imdbID: 't6',
    Title: 'The Shawshank Redemption',
    Year: '1994',
    Poster: 'https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg',
    Type: 'movie',
    Genre: 'Drama'
  }
];

// Popular Movies
export const popularMovies: Movie[] = [
  {
    imdbID: 'p1',
    Title: 'Dune',
    Year: '2021',
    Poster: 'https://m.media-amazon.com/images/M/MV5BN2FjNmEyNWMtYzM0ZS00NjIyLTg5YzYtYThlMGVjNzE1OGViXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg',
    Type: 'movie',
    Genre: 'Action, Adventure, Drama'
  },
  {
    imdbID: 'p2',
    Title: 'No Time to Die',
    Year: '2021',
    Poster: 'https://m.media-amazon.com/images/M/MV5BYWQ2NzQ1NjktMzNkNS00MGY1LTgwMmMtYTllYTI5YzNmMmE0XkEyXkFqcGdeQXVyMjM4NTM5NDY@._V1_.jpg',
    Type: 'movie',
    Genre: 'Action, Adventure, Thriller'
  },
  {
    imdbID: 'p3',
    Title: 'The Batman',
    Year: '2022',
    Poster: 'https://m.media-amazon.com/images/M/MV5BMDdmMTBiNTYtMDIzNi00NGVlLWIzMDYtZTk3MTQ3NGQxZGEwXkEyXkFqcGdeQXVyMzMwOTU5MDk@._V1_.jpg',
    Type: 'movie',
    Genre: 'Action, Crime, Drama'
  },
  {
    imdbID: 'p4',
    Title: 'Top Gun: Maverick',
    Year: '2022',
    Poster: 'https://m.media-amazon.com/images/M/MV5BZWYzOGEwNTgtNWU3NS00ZTQ0LWJkODUtMmVhMjIwMjA1ZmQwXkEyXkFqcGdeQXVyMjkwOTAyMDU@._V1_.jpg',
    Type: 'movie',
    Genre: 'Action, Drama'
  },
  {
    imdbID: 'p5',
    Title: 'Spider-Man: No Way Home',
    Year: '2021',
    Poster: 'https://m.media-amazon.com/images/M/MV5BZWMyYzFjYTYtNTRjYi00OGExLWE2YzgtOGRmYjAxZTU3NzBiXkEyXkFqcGdeQXVyMzQ0MzA0NTM@._V1_.jpg',
    Type: 'movie',
    Genre: 'Action, Adventure, Fantasy'
  },
  {
    imdbID: 'p6',
    Title: 'The Matrix Resurrections',
    Year: '2021',
    Poster: 'https://m.media-amazon.com/images/M/MV5BMGJkNDJlZWUtOGM1Ny00YjNkLThiM2QtY2ZjMzQxMTIxNWNmXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_.jpg',
    Type: 'movie',
    Genre: 'Action, Sci-Fi'
  }
];

// Web Series
export const webSeries: Movie[] = [
  {
    imdbID: 'w1',
    Title: 'Stranger Things',
    Year: '2016-',
    Poster: 'https://m.media-amazon.com/images/M/MV5BMDZkYmVhNjMtNWU4MC00MDQxLWE3MjYtZGMzZWI1ZjhlOWJmXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg',
    Type: 'series',
    Genre: 'Drama, Fantasy, Horror'
  },
  {
    imdbID: 'w2',
    Title: 'The Witcher',
    Year: '2019-',
    Poster: 'https://m.media-amazon.com/images/M/MV5BN2FiOWU4YzYtMzZiOS00MzcyLTlkOGEtOTgwZmEwMzAxMzA3XkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg',
    Type: 'series',
    Genre: 'Action, Adventure, Fantasy'
  },
  {
    imdbID: 'w3',
    Title: 'Breaking Bad',
    Year: '2008-2013',
    Poster: 'https://m.media-amazon.com/images/M/MV5BYmQ4YWMxYjUtNjZmYi00MDQ1LWFjMjMtNjA5ZDdiYjdiODU5XkEyXkFqcGdeQXVyMTMzNDExODE5._V1_.jpg',
    Type: 'series',
    Genre: 'Crime, Drama, Thriller'
  },
  {
    imdbID: 'w4',
    Title: 'Game of Thrones',
    Year: '2011-2019',
    Poster: 'https://m.media-amazon.com/images/M/MV5BYTRiNDQwYzAtMzVlZS00NTI5LWJjYjUtMzkwNTUzMWMxZTllXkEyXkFqcGdeQXVyNDIzMzcwNjc@._V1_.jpg',
    Type: 'series',
    Genre: 'Action, Adventure, Drama'
  },
  {
    imdbID: 'w5',
    Title: 'The Mandalorian',
    Year: '2019-',
    Poster: 'https://m.media-amazon.com/images/M/MV5BZjRlMzM3N2MtOTZiZC00NzQ4LWI2NDMtZmZiMWMwYmM2OTU4XkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_.jpg',
    Type: 'series',
    Genre: 'Action, Adventure, Fantasy'
  },
  {
    imdbID: 'w6',
    Title: 'Money Heist',
    Year: '2017-2021',
    Poster: 'https://m.media-amazon.com/images/M/MV5BODI0ZTljYTMtODQ1NC00NmI0LTk1YWUtN2FlNDM1MDExMDlhXkEyXkFqcGdeQXVyMTM0NTUzNDIy._V1_.jpg',
    Type: 'series',
    Genre: 'Action, Crime, Drama'
  }
];

// Function to search movies by term
export const searchMovies = (searchTerm: string): Movie[] => {
  const term = searchTerm.toLowerCase();
  const allMovies = [...trendingMovies, ...popularMovies, ...webSeries];
  
  return allMovies.filter(movie => 
    movie.Title.toLowerCase().includes(term) || 
    movie.Year.toLowerCase().includes(term) ||
    (movie.Genre && movie.Genre.toLowerCase().includes(term))
  );
}; 