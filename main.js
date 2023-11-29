require('dotenv').config( { path: '.env' } );
const fs = require("fs");
async function getGameStats() {
    const response = await fetch(`http://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=730&key=${process.env.STEAM_KEY}&steamid=${process.env.STEAM_ID64}`)
    return await response.json();
}

getGameStats().then(r => {
    fs.readFile('./stats.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
        }

        const totalMatchesWon = r?.playerstats.stats[127].value;
        const totalMatchesPlayed = r?.playerstats.stats[128].value;

        const stats = JSON.parse(data);

        const zeroMatchesWon = stats[4].value;
        const zeroMatchesPlayed = stats[5].value;

        const totalWonMatchesAfterTheReset = totalMatchesWon - zeroMatchesWon;
        const totalPlayedMatchesAfterTheReset = totalMatchesPlayed - zeroMatchesPlayed;

        const zeroTotalKills = stats[0].value;
        const zeroTotalDeaths = stats[1].value;

        const totalKills = r?.playerstats.stats[0].value;
        const totalDeaths = r?.playerstats.stats[1].value;

        const totalKillsAfterTheReset = totalKills - zeroTotalKills;
        const totalDeathsAfterTheReset = totalDeaths - zeroTotalDeaths;

        const kd = totalKillsAfterTheReset / totalDeathsAfterTheReset;
        const winRate = (totalWonMatchesAfterTheReset / totalPlayedMatchesAfterTheReset) * 100;

        console.log(`K/D: ${kd.toFixed(2)} | Win Rate: ${winRate.toFixed(2)}%`);
    })
})