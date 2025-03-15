# YooScreaming - Movie Website

A modern movie website built with React, TypeScript, and Tailwind CSS.

## Local Movie Images Setup

This project uses local movie images instead of fetching them from an API. Follow these steps to add your own movie images:

1. Place your movie poster images in the `public/images` directory
2. Name your images according to the movie titles in the data file (e.g., `avengers.jpg`, `inception.jpg`, etc.)
3. Update the `src/data/movies.ts` file with your own movie data if needed

### Required Images

The following images are referenced in the code:

#### Movie Posters
- `/images/avengers.jpg`
- `/images/inception.jpg`
- `/images/dark-knight.jpg`
- `/images/interstellar.jpg`
- `/images/pulp-fiction.jpg`
- `/images/shawshank.jpg`
- `/images/dune.jpg`
- `/images/no-time-to-die.jpg`
- `/images/batman.jpg`
- `/images/top-gun.jpg`
- `/images/spiderman.jpg`
- `/images/matrix.jpg`
- `/images/stranger-things.jpg`
- `/images/witcher.jpg`
- `/images/breaking-bad.jpg`
- `/images/got.jpg`
- `/images/mandalorian.jpg`
- `/images/money-heist.jpg`

#### Other Images
- `/images/hero-banner.svg` (or replace with your own hero banner image)
- `/images/movie-placeholder.svg` (used as a fallback for missing posters)

## Development

1. Install dependencies:
```
npm install
```

2. Start the development server:
```
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Customization

You can customize the movie data by editing the `src/data/movies.ts` file. Add your own movies, update existing ones, or remove movies you don't want to display.
