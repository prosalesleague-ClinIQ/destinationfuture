import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create demo user
  const passwordHash = await bcrypt.hash("demo1234", 12);
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@destinationfuture.app" },
    update: {},
    create: {
      email: "demo@destinationfuture.app",
      passwordHash,
      nickname: "DemoExplorer",
      firstName: "Alex",
      middleName: "Jordan",
      lastName: "Rivera",
      subscriptionTier: "PREMIUM",
      privacySettings: { anonymousLeaderboard: true, shareProfile: false },
    },
  });

  // Create demo profile
  await prisma.profile.upsert({
    where: { userId: demoUser.id },
    update: {},
    create: {
      userId: demoUser.id,
      dob: new Date("1992-07-15"),
      birthTime: "14:30",
      birthCity: "Los Angeles",
      birthState: "California",
      birthCountry: "United States",
      currentCity: "Austin",
      currentState: "Texas",
      currentCountry: "United States",
      relationshipStatus: "single",
      careerField: "Technology",
      budgetRange: "moderate",
      stylePreferencesJson: ["minimalist", "classic"],
      musicPreferencesJson: ["indie", "jazz", "ambient"],
      goalsJson: ["love", "career", "self_improvement", "relocation"],
    },
  });

  // Seed quests
  const quests = [
    { code: "onboard_complete", title: "Complete Your Profile", description: "Fill in all your birth and personal details to unlock deeper insights.", questType: "onboarding", xpReward: 100, unlockLevel: 1, modeScope: "all" },
    { code: "first_reflection", title: "First Daily Reflection", description: "Write your first daily reflection to start building self-awareness.", questType: "journaling", xpReward: 25, unlockLevel: 1, modeScope: "all" },
    { code: "identity_deep_dive", title: "Identity Deep Dive", description: "Generate and read your full Identity Snapshot section.", questType: "habit", xpReward: 50, unlockLevel: 1, modeScope: "single" },
    { code: "shadow_starter", title: "Shadow Work Starter", description: "Complete your first cognitive distortion exercise.", questType: "boundary", xpReward: 30, unlockLevel: 3, modeScope: "single" },
    { code: "city_research_1", title: "Explore a New City", description: "Research one city from your location recommendations.", questType: "city_research", xpReward: 25, unlockLevel: 3, modeScope: "single" },
    { code: "city_research_5", title: "City Explorer", description: "Research 5 cities from your location analysis.", questType: "city_research", xpReward: 75, unlockLevel: 3, modeScope: "single" },
    { code: "style_quest", title: "Define Your Style", description: "Generate your fashion system and save 3 outfit ideas.", questType: "style", xpReward: 30, unlockLevel: 4, modeScope: "single" },
    { code: "playlist_quest", title: "Build Your Playlist", description: "Generate your Spotify Pack and listen to all tracks.", questType: "playlist", xpReward: 25, unlockLevel: 4, modeScope: "single" },
    { code: "confidence_action", title: "Confidence Challenge", description: "Complete one confidence-building action from your self-improvement plan.", questType: "confidence", xpReward: 40, unlockLevel: 3, modeScope: "single" },
    { code: "seven_day_start", title: "7-Day Kickoff", description: "Complete Day 1 of your 7-Day Starter Plan.", questType: "habit", xpReward: 20, unlockLevel: 1, modeScope: "single" },
    { code: "seven_day_complete", title: "7-Day Champion", description: "Complete all 7 days of your starter plan.", questType: "habit", xpReward: 100, unlockLevel: 1, modeScope: "single" },
    { code: "thirty_day_start", title: "30-Day Journey Begins", description: "Start your 30-Day Plan and complete Week 1.", questType: "habit", xpReward: 50, unlockLevel: 5, modeScope: "single" },
    { code: "creativity_task", title: "Creative Expression", description: "Try one creative hobby from your Hobbies & Lifestyle report.", questType: "creativity", xpReward: 25, unlockLevel: 3, modeScope: "single" },
    { code: "boundary_practice", title: "Set a Boundary", description: "Use one boundary script from your Shadow Work section.", questType: "boundary", xpReward: 35, unlockLevel: 3, modeScope: "single" },
    { code: "conversation_prompt", title: "Deep Conversation", description: "Use a conversation prompt with your partner.", questType: "conversation", xpReward: 30, unlockLevel: 2, modeScope: "dual" },
    { code: "compatibility_checkin", title: "Compatibility Check-in", description: "Review your compatibility report with your partner.", questType: "compatibility_checkin", xpReward: 25, unlockLevel: 4, modeScope: "dual" },
    { code: "shared_goal", title: "Shared Goal Setting", description: "Set a shared goal with your partner based on compatibility insights.", questType: "shared_goal", xpReward: 40, unlockLevel: 4, modeScope: "dual" },
    { code: "home_environment", title: "Home Harmony", description: "Complete a home environment exercise with your family.", questType: "home", xpReward: 25, unlockLevel: 2, modeScope: "family" },
    { code: "family_bonding", title: "Family Bonding Quest", description: "Complete a bonding activity with your family.", questType: "bonding", xpReward: 30, unlockLevel: 2, modeScope: "family" },
    { code: "weekly_reflection", title: "Weekly Check-in", description: "Write a weekly evolution log entry.", questType: "journaling", xpReward: 30, unlockLevel: 2, modeScope: "all" },
  ];

  for (const quest of quests) {
    await prisma.quest.upsert({
      where: { code: quest.code },
      update: quest,
      create: quest,
    });
  }

  // Seed badges
  const badges = [
    { code: "pattern_breaker", title: "Pattern Breaker", description: "Complete 3 shadow work quests", icon: "Unlink", unlockRuleJson: { type: "quest_count", value: 3, filter: "shadow_work" } },
    { code: "city_explorer", title: "City Explorer", description: "Research 5 cities", icon: "Map", unlockRuleJson: { type: "quest_count", value: 5, filter: "city_research" } },
    { code: "shadow_worker", title: "Shadow Worker", description: "Complete the full shadow work module", icon: "Moon", unlockRuleJson: { type: "specific_action", value: 1, filter: "shadow_work_complete" } },
    { code: "aligned_builder", title: "Aligned Builder", description: "Reach 500 XP", icon: "Target", unlockRuleJson: { type: "xp_threshold", value: 500 } },
    { code: "love_decoder", title: "Love Decoder", description: "Complete all love-related sections", icon: "Heart", unlockRuleJson: { type: "section_count", value: 3, filter: "love" } },
    { code: "future_architect", title: "Future Architect", description: "Generate a full report", icon: "Compass", unlockRuleJson: { type: "specific_action", value: 1, filter: "full_report" } },
    { code: "quiet_power", title: "Quiet Power", description: "Maintain a 7-day reflection streak", icon: "Flame", unlockRuleJson: { type: "streak", value: 7 } },
    { code: "reinvention_mode", title: "Reinvention Mode", description: "Complete the reinvention preset", icon: "RefreshCw", unlockRuleJson: { type: "specific_action", value: 1, filter: "reinvention_complete" } },
    { code: "rhythm_keeper", title: "Rhythm Keeper", description: "Complete 10 daily reflections", icon: "Activity", unlockRuleJson: { type: "quest_count", value: 10, filter: "daily_reflection" } },
    { code: "consistency_builder", title: "Consistency Builder", description: "Maintain a 30-day streak", icon: "Award", unlockRuleJson: { type: "streak", value: 30 } },
  ];

  for (const badge of badges) {
    await prisma.badge.upsert({
      where: { code: badge.code },
      update: badge,
      create: badge,
    });
  }

  console.log("Seed complete!");
  console.log(`Created demo user: demo@destinationfuture.app / demo1234`);
  console.log(`Seeded ${quests.length} quests`);
  console.log(`Seeded ${badges.length} badges`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
