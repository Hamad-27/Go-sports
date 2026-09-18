const SPORTS = ["football", "cricket", "basketball", "tennis"];

async function loadLiveSports() {
  for (const sport of SPORTS) {
    try {
      const url =
        `https://sportscore.com/api/widget/matches/?sport=${sport}&limit=20`;

      const response = await fetch(url);
      const data = await response.json();

      console.log(sport, data.matches);
    } catch (error) {
      console.error("Error loading " + sport + ":", error);
    }
  }
}

// Load immediately
loadLiveSports();

// Refresh automatically every 60 seconds
setInterval(loadLiveSports, 60000);
