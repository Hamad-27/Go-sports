console.log("GoSport sports.js is running!");

const SPORTS = ["football", "cricket", "basketball", "tennis"];

async function getMatches(sport) {
  const url =
    `https://sportscore.com/api/widget/matches/?sport=${sport}&limit=10`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("API error: " + response.status);
  }

  return await response.json();
}

async function loadLiveSports() {
  const box = document.getElementById("liveMatches");

  if (!box) return;

  box.innerHTML = "<p>🔄 Loading matches...</p>";

  try {
    const results = await Promise.all(
      SPORTS.map(sport => getMatches(sport))
    );

    let allMatches = [];

    results.forEach((data, index) => {
      if (data && Array.isArray(data.matches)) {
        allMatches.push(
          ...data.matches.map(match => ({
            ...match,
            sport: SPORTS[index]
          }))
        );
      }
    });

    displayMatches(allMatches);

  } catch (error) {
    console.error("GoSport error:", error);

    box.innerHTML = `
      <div class="match-card">
        <h3>⚠️ Matches could not load</h3>
        <p>Please refresh the page and try again.</p>
      </div>
    `;
  }
}

function displayMatches(matches) {
  const box = document.getElementById("liveMatches");

  if (!matches.length) {
    box.innerHTML = "<p>No matches available right now.</p>";
    return;
  }

  box.innerHTML = matches.map(match => {

    const home =
      match.home_team ||
      match.homeTeam ||
      match.home?.name ||
      match.teams?.home?.name ||
      "Home Team";

    const away =
      match.away_team ||
      match.awayTeam ||
      match.away?.name ||
      match.teams?.away?.name ||
      "Away Team";

    const homeScore =
      match.home_score ??
      match.homeScore ??
      match.scores?.home ??
      "-";

    const awayScore =
      match.away_score ??
      match.awayScore ??
      match.scores?.away ??
      "-";

    const status = String(
      match.status ||
      match.match_status ||
      match.state ||
      ""
    ).toLowerCase();

    let statusHTML = "UPCOMING";

    if (
      status.includes("live") ||
      status.includes("playing") ||
      status.includes("progress")
    ) {
      statusHTML = '<span class="live-badge">🔴 LIVE</span>';
    } else if (
      status.includes("finished") ||
      status.includes("ended") ||
      status.includes("final")
    ) {
      statusHTML = '<span class="finished-badge">✓ FINISHED</span>';
    }

    return `
      <div class="match-card">

        <div class="match-sport">
          🏆 ${match.sport.toUpperCase()}
        </div>

        <div class="match-teams">

          <div class="match-team">
            ${home}
          </div>

          <div class="match-score">
            ${homeScore} : ${awayScore}
          </div>

          <div class="match-team">
            ${away}
          </div>

        </div>

        <div class="match-status">
          ${statusHTML}
        </div>

      </div>
    `;

  }).join("");
}

loadLiveSports();

setInterval(loadLiveSports, 60000);
