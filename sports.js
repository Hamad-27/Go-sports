console.log("GoSport sports.js is running!");

const SPORTS = ["football", "cricket", "basketball", "tennis"];

async function loadLiveSports() {
  const box = document.getElementById("liveMatches");

  if (!box) return;

  box.innerHTML = "<p>🔄 Loading matches...</p>";

  let allMatches = [];

  for (const sport of SPORTS) {
    try {
      const response = await fetch(
        `https://sportscore.com/api/widget/matches/?sport=${sport}&limit=10`
      );

      if (!response.ok) {
        console.log(sport + " failed:", response.status);
        continue;
      }

      const data = await response.json();

      if (Array.isArray(data.matches)) {
        allMatches.push(
          ...data.matches.map(match => ({
            ...match,
            sport: sport
          }))
        );
      }

    } catch (error) {
      console.log(sport + " error:", error);
    }
  }

  displayMatches(allMatches);
}

function displayMatches(matches) {
  const box = document.getElementById("liveMatches");

  if (!matches.length) {
    box.innerHTML = "<p>⚪ No matches available right now.</p>";
    return;
  }

  box.innerHTML = matches.map(match => {

    const homeName = match.home?.name || "Home Team";
    const awayName = match.away?.name || "Away Team";

    const homeLogo = match.home?.logo || "";
    const awayLogo = match.away?.logo || "";

    return `
      <div class="match-card">

        <div class="match-sport">
          🏆 ${match.sport.toUpperCase()}
        </div>

        <div class="match-teams">

          <div class="match-team">
            ${
              homeLogo
                ? `<img src="${homeLogo}" alt="${homeName}" width="50" height="50">`
                : "⚽"
            }
            <div>${homeName}</div>
          </div>

          <div class="match-score">
            ${match.home_score ?? "-"} : ${match.away_score ?? "-"}
          </div>

          <div class="match-team">
            ${
              awayLogo
                ? `<img src="${awayLogo}" alt="${awayName}" width="50" height="50">`
                : "⚽"
            }
            <div>${awayName}</div>
          </div>

        </div>

        <div class="match-status">
          ${match.status || "UPCOMING"}
        </div>

      </div>
    `;

  }).join("");
}

loadLiveSports();

setInterval(loadLiveSports, 60000);
