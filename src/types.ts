export interface Movie {
  // New fields from provided JSON
  _id: string;
  video_url: string;
  image: string;
  title: string;
  description: string;
  release_date: string;
  genre: string[];
  runtime: string;
  type: string;
  tags: string[];
  like_count: number;
  cast: string[];
  country: string;
  created_at: string;
  updated_at: string;
  __v: number;
  
  // Original fields for backward compatibility
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Type: string;
  
  // Optional fields that might exist
  Genre?: string;
  videoUrl?: string;
}