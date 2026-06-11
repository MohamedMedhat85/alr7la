// Dummy data
const trendingPlaces = [
  {
    id: 1,
    name: "Rome",
    image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/3e/f4/f0/photo2jpg.jpg?w=2200&h=800&s=1",
    activities: [
      "Rome's secret catacombs",
      "Pizza making classes",
      "Explore Rome by night"
    ]
  },
  {
    id: 2,
    name: "Oahu",
    image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/3e/f4/f0/photo2jpg.jpg?w=2200&h=800&s=1",
    activities: [
      "Marine wildlife adventures",
      "A taste of Oahu food & culture",
      "Surf Hawaii's iconic waves"
    ]
  },
  {
    id: 3,
    name: "New York City",
    image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/3e/f4/f0/photo2jpg.jpg?w=2200&h=800&s=1",
    activities: [
      "NYC art & museums",
      "Broadway shows & NYC stages",
      "NY pizza crawls"
    ]
  },
  {
    id: 4,
    name: "Las Vegas",
    image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/3e/f4/f0/photo2jpg.jpg?w=2200&h=800&s=1",
    activities: [
      "Emerald cave by kayak",
      "Magical Vegas entertainment",
      "Red Rock adventures"
    ]
  }
];

const recommendedTours = [
  {
    id: 1,
    title: "Day Tour to Santorini Island from Heraklion Crete",
    locationTag: "Crete",
    image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/3e/f4/f0/photo2jpg.jpg?w=2200&h=800&s=1",
    rating: 3.9,
    reviews: 97,
    price: 197
  },
  {
    id: 2,
    title: "Guided Tour in Knossos Palace",
    locationTag: "Crete",
    image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/3e/f4/f0/photo2jpg.jpg?w=2200&h=800&s=1",
    rating: 5.0,
    reviews: 51,
    price: 59
  },
  {
    id: 3,
    title: "Chania Old City Discovery",
    locationTag: "Crete",
    image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/3e/f4/f0/photo2jpg.jpg?w=2200&h=800&s=1",
    rating: 4.8,
    reviews: 44,
    price: 47
  },
  {
    id: 4,
    title: "Explore Chania's Old Town through the eyes of a local",
    locationTag: "Crete",
    image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/3e/f4/f0/photo2jpg.jpg?w=2200&h=800&s=1",
    rating: 4.7,
    reviews: 57,
    price: 110
  }
];

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // Get trending places
  getTrendingPlaces: async () => {
    // Simulate network request
    await delay(500);
    return trendingPlaces;
  },
  
  // Get recommended tours
  getRecommendedTours: async (filter = null) => {
    await delay(700);
    if (filter) {
      return recommendedTours.filter(tour => 
        tour.locationTag.toLowerCase() === filter.toLowerCase()
      );
    }
    return recommendedTours;
  },
  
  // Get popular experiences
  getPopularExperiences: async () => {
    await delay(600);
    // For now, reuse the recommendedTours data with slight modifications
    return recommendedTours.map(tour => ({
      ...tour,
      price: Math.floor(tour.price * 0.9) // 10% discount for example
    }));
  },
  
  // Search function
  searchDestinations: async (query) => {
    await delay(800);
    if (!query) return [];
    
    const lowerQuery = query.toLowerCase();
    return trendingPlaces.filter(place => 
      place.name.toLowerCase().includes(lowerQuery) ||
      place.activities.some(activity => activity.toLowerCase().includes(lowerQuery))
    );
  }
};