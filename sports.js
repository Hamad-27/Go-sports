const SPORTS = ["football", "cricket", "basketball", "tennis"];

async function loadLiveSports() {
  const box = document.getElementById("liveMatches");

  if (!box) return;

  box.innerHTML = "<p>Loading matches...</p>";

  let allMatches = [];

  for (const sport of SPORTS) {
    try {
      const url =
        `https://sportscore.com/api/widget/matches/?sport=${sport}&limit=20`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.matches) {
        allMatches = allMatches.concat(
          data.matches.map(match => ({
            ...match,
            sport: sport
          }))
        );
      }
    } catch (error) {
      console.error("Error loading " + sport, error);
    }
  }

  displayMatches(allMatches);
}

function displayMatches(matches) {
  const box = document.getElementById("liveMatches");

  if (!matches || matches.length === 0) {
    box.innerHTML = "<p>No matches available right now.</p>";
    return;
  }

  box.innerHTML = matches.map(match => `
    <div class="match-card">
      <small>🏆 ${match.sport.toUpperCase()}</small>
      <div>
        <strong>${match.home_team || "Home"}</strong>
        <span>
          ${match.home_score ?? "-"} : ${match.away_score ?? "-"}
        </span>
        <strong>${match.away_team || "Away"}</strong>
      </div>
    </div>
  `).join("");
}

loadLiveSports();

setInterval(loadLiveSports, 60000);
