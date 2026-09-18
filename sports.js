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

  box.innerHTML = matches.map(match => {
    const status = String(
      match.status ||
      match.match_status ||
      match.state ||
      ""
    ).toLowerCase();

    let statusHTML = "";

    if (
      status.includes("live") ||
      status.includes("playing") ||
      status.includes("progress")
    ) {
      statusHTML = `<span class="live-badge">🔴 LIVE</span>`;
    } else if (
      status.includes("finished") ||
      status.includes("ended") ||
      status.includes("final")
    ) {
      statusHTML = `<span class="finished-badge">✓ FINISHED</span>`;
    } else {
      statusHTML = `<span class="upcoming-badge">UPCOMING</span>`;
    }

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

    return `
      <div class="match-card">

        <div class="match-sport">
          🏆 ${match.sport.toUpperCase()}
        </div>

        <div class="match-teams">

          <div class="match-team">
            🏟️ ${home}
          </div>

          <div class="match-score">
            ${homeScore} : ${awayScore}
          </div>

          <div class="match-team">
            🏟️ ${away}
          </div>

        </div>

        <div class="match-status">
          ${statusHTML}
        </div>

      </div>
    `;
  }).join("");
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
