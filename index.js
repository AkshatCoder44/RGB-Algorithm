

function getRandomName() {
  const first = ["Alex", "Sam", "Jordan", "Chris", "Taylor", "Jamie", "Pat", "Drew", "Morgan", "Cameron"];
  const last = ["Lee", "Smith", "Walker", "Gray", "King", "Young", "Scott", "Green", "Hill", "Ward"];
  return first[Math.floor(Math.random() * first.length)] + " " + last[Math.floor(Math.random() * last.length)];
}

const behaviors = ["confident", "impulsive", "cautious", "random"];
const dealer = { balance: 0 };
let players = [];

for (let i = 0; i < 50; i++) {
  players.push({
    name: getRandomName(),
    balance: Math.floor(Math.random() * 1000 + 500),
    initialBalance: 0, // Will be set next
    behavior: behaviors[Math.floor(Math.random() * behaviors.length)],
    illusion: Math.floor(Math.random() * 100),
    iq: Math.floor(Math.random() * 80 + 50),
  });
  players[i].initialBalance = players[i].balance;
}

let round = 1;

function getBetAmount(player) {
  let baseBet;
  switch (player.behavior) {
    case "confident":
      baseBet = player.balance * 0.4;
      break;
    case "impulsive":
      baseBet = Math.random() * (player.balance * 0.6);
      break;
    case "cautious":
      baseBet = player.balance * 0.1;
      break;
    default:
      baseBet = Math.random() * (player.balance * 0.3);
  }

  // Adjust for IQ and illusion (risky or safe)
  if (player.iq < 80) baseBet *= 1.1;
  if (player.iq > 110) baseBet *= 0.8;

  if (player.illusion > 60 && Math.random() < 0.2) baseBet *= 1.5;

  return Math.floor(Math.min(Math.max(baseBet, 50), 200));
}

function simulateRound() {
  console.log(`\n🎲 Round ${round} --------------------------`);
  let bets = { big: [], small: [] };
  let totalBig = 0, totalSmall = 0;

  for (let player of players) {
    if (player.balance <= 0) continue;

    let bet = getBetAmount(player);
    let side = Math.random() < 0.5 ? "big" : "small";

    player.balance -= bet;
    if (side === "big") {
      bets.big.push({ player, bet });
      totalBig += bet;
    } else {
      bets.small.push({ player, bet });
      totalSmall += bet;
    }

    // Emotional deposit
    if (player.balance < 100 && Math.random() < player.illusion / 300) {
      let deposit = Math.floor(Math.random() * 400 + 100);
      player.balance += deposit;
    }
  }

  let result;
  if (totalBig === totalSmall) result = "dealer";
  else if (Math.random() < 0.3) result = totalBig > totalSmall ? "small" : "big";
  else result = totalBig < totalSmall ? "big" : "small";

  let losingAmount = 0;
  let winners = [];

  for (let side in bets) {
    for (let b of bets[side]) {
      if (side === result) {
        winners.push(b);
      } else {
        losingAmount += b.bet;
      }
    }
  }

  if (winners.length > 0) {
    let share = Math.floor((losingAmount * 0.9) / winners.length);
    for (let w of winners) {
      w.player.balance += w.bet + share;
    }
    dealer.balance += losingAmount * 0.1;
  } else {
    dealer.balance += losingAmount;
  }

  // Show result summary
  let winnerCount = winners.length;
  let positivePlayers = players.filter(p => p.balance > p.initialBalance).length;
  console.log(`✅ Winning side: ${result.toUpperCase()}`);
  console.log(`👥 Players up from initial: ${positivePlayers}/${players.length}`);
  console.log(`🏆 Players won this round: ${winnerCount}`);
  console.log(`🏦 Dealer balance: $${dealer.balance.toFixed(2)}`);

  round++;
}

// Run every 60 seconds (use 5000 for testing)
setInterval(simulateRound, 500);
