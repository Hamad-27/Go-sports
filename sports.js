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

  if (!matches || matches.length === 0) {
    box.innerHTML = "<p>No matches available right now.</p>";
    return;
  }

  box.innerHTML = matches.map(match => {

    const home = match.home?.name || "Home Team";
    const away = match.away?.name || "Away Team";

    const homeLogo = match.home?.logo || "";
    const awayLogo = match.away?.logo || "";

    const homeScore = match.home?.score ?? "-";
    const awayScore = match.away?.score ?? "-";

    const status = String(
      match.status || ""
    ).toLowerCase();

    let statusHTML = `<span class="upcoming-badge">UPCOMING</span>`;

    if (
      status.includes("live") ||
      status.includes("playing") ||
      status.includes("progress")
    ) {
      statusHTML = `<span class="live-badge">🔴 LIVE</span>`;
    }

    if (
      status.includes("finished") ||
      status.includes("ended") ||
      status.includes("final")
    ) {
      statusHTML = `<span class="finished-badge">✓ FINISHED</span>`;
    }

    return `
      <div class="match-card">

        <div class="match-sport">
          🏆 ${match.sport.toUpperCase()}
        </div>

        <div class="match-teams">

          <div class="match-team">
            ${homeLogo ? `<img src="${homeLogo}" alt="${home}" width="50">` : ""}
            <div>${home}</div>
          </div>

          <div class="match-score">
            ${homeScore} : ${awayScore}
          </div>

          <div class="match-team">
            ${awayLogo ? `<img src="${awayLogo}" alt="${away}" width="50">` : ""}
            <div>${away}</div>
          </div>

        </div>

        <div class="match-status">
          ${statusHTML}
        </div>

      </div>
    `;

  }).join("");
}
