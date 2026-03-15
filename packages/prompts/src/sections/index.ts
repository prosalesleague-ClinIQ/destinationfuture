import type { SectionKey } from "@destination-future/core";
import type { SectionPromptConfig, PromptContext } from "../types";

export const SECTION_PROMPTS: Record<SectionKey, SectionPromptConfig> = {
  identity_snapshot: {
    key: "identity_snapshot",
    title: "Identity Snapshot",
    systemInstructions: `You are a personality analysis expert. Given a person's name, date of birth, and birth location, produce a comprehensive identity snapshot. Be specific, insightful, and avoid generic platitudes. Ground every trait in observable behavior. Write in second person ("you"), direct and warm but not sycophantic. Every trait must include a brief behavioral example. Strengths should be described in terms of impact on others. Friction points should be honest without being harsh. The identity statement should feel like a personal tagline. The growth edge statement should feel like a challenge the person is ready for.`,
    userPromptTemplate: (ctx: PromptContext) => `Analyze the identity of ${ctx.firstName}${ctx.middleName ? ` ${ctx.middleName}` : ""}${ctx.lastName ? ` ${ctx.lastName}` : ""}.

Date of birth: ${ctx.dob}
Birth city: ${ctx.birthCity}${ctx.birthState ? `, ${ctx.birthState}` : ""}, ${ctx.birthCountry}
${ctx.currentCity ? `Current city: ${ctx.currentCity}${ctx.currentState ? `, ${ctx.currentState}` : ""}${ctx.currentCountry ? `, ${ctx.currentCountry}` : ""}` : ""}
${ctx.relationshipStatus ? `Relationship status: ${ctx.relationshipStatus}` : ""}
${ctx.careerField ? `Career field: ${ctx.careerField}` : ""}
${ctx.goals.length > 0 ? `Goals: ${ctx.goals.join(", ")}` : ""}
Output depth: ${ctx.outputDepth}

Produce the following:
1. **Name & Birth Summary** - A one-paragraph summary connecting their name meaning (if notable) and birth date/location to identity themes.
2. **5 Stable Traits** - Traits that are consistent across all environments. For each: trait name, description, and a concrete behavioral example.
3. **5 Context-Dependent Traits** - Traits that shift based on environment (e.g., at work vs. with friends). For each: trait name, the two modes it shifts between, and what triggers the shift.
4. **Top 3 Strengths** - Each with a name, description, and how it impacts others around them.
5. **Top 3 Friction Points** - Each with a name, description, and how it shows up in daily life. Be honest and constructive.
6. **Ranked Needs** - Rank these human needs from most to least dominant for this person: Certainty, Variety, Significance, Connection/Love, Growth, Contribution. For each, explain why it has that ranking.
7. **Identity Statement** - A single sentence that captures who this person is at their core. Make it feel like a personal tagline they would resonate with.
8. **Growth Edge Statement** - A single sentence describing the next evolution available to them. Frame it as a challenge they are ready for.`,
    outputSchema: {
      type: "object",
      properties: {
        nameBirthSummary: { type: "string" },
        stableTraits: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              description: { type: "string" },
              example: { type: "string" },
            },
          },
          minItems: 5,
          maxItems: 5,
        },
        contextDependentTraits: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              modeA: { type: "string" },
              modeB: { type: "string" },
              trigger: { type: "string" },
            },
          },
          minItems: 5,
          maxItems: 5,
        },
        topStrengths: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              description: { type: "string" },
              impactOnOthers: { type: "string" },
            },
          },
          minItems: 3,
          maxItems: 3,
        },
        topFrictionPoints: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              description: { type: "string" },
              dailyManifestation: { type: "string" },
            },
          },
          minItems: 3,
          maxItems: 3,
        },
        rankedNeeds: {
          type: "array",
          items: {
            type: "object",
            properties: {
              need: { type: "string" },
              rank: { type: "number" },
              explanation: { type: "string" },
            },
          },
          minItems: 6,
          maxItems: 6,
        },
        identityStatement: { type: "string" },
        growthEdgeStatement: { type: "string" },
      },
    },
    version: "1.0.0",
  },

  numerology_core: {
    key: "numerology_core",
    title: "Numerology Core",
    systemInstructions: `You are an expert numerologist. The deterministic calculation engine has already computed the core numerology numbers. Your role is to take those pre-calculated values and provide rich narrative interpretation, risk analysis, opportunity identification, and best-response guidance. Show the full math breakdown for transparency (replicating the engine's steps), then layer on deep interpretive meaning. Write in second person. Be specific to the person, not generic number descriptions. Each number should feel like a personal revelation, not a textbook entry. Connect numbers to each other where they reinforce or create tension.`,
    userPromptTemplate: (ctx: PromptContext) => `Provide a full numerology reading for ${ctx.firstName}${ctx.middleName ? ` ${ctx.middleName}` : ""}${ctx.lastName ? ` ${ctx.lastName}` : ""}.

Date of birth: ${ctx.dob}
Output depth: ${ctx.outputDepth}

Pre-calculated numerology data from the deterministic engine:
${JSON.stringify(ctx.numerologyData, null, 2)}

Using the pre-calculated values above, provide the following for EACH number (Life Path, Birthday Number, Expression Number, Soul Urge Number, Personality Number, Maturity Number, Pinnacles, Challenges, Personal Year):

1. **Full Math Breakdown** - Show the step-by-step calculation that produced this number. This is for transparency so the user can verify.
2. **Interpretation** - What this number means specifically for ${ctx.firstName}. Go beyond textbook definitions. Connect it to their life context, name energy, and other numbers in their chart.
3. **Risk** - What goes wrong when this number's energy is out of balance or expressed negatively.
4. **Opportunity** - The highest expression of this number and what becomes possible when they lean into it.
5. **Best Response** - Practical advice for working with this number's energy day-to-day.

After all individual numbers, provide:
- **Number Interactions** - Where do numbers reinforce each other? Where do they create internal tension? What is the overall chart story?
- **Current Cycle Insight** - Based on their Personal Year, Pinnacles, and Challenges, what is the theme of their current life phase?`,
    outputSchema: {
      type: "object",
      properties: {
        lifePath: {
          type: "object",
          properties: {
            number: { type: "number" },
            mathBreakdown: { type: "string" },
            interpretation: { type: "string" },
            risk: { type: "string" },
            opportunity: { type: "string" },
            bestResponse: { type: "string" },
          },
        },
        birthdayNumber: {
          type: "object",
          properties: {
            number: { type: "number" },
            mathBreakdown: { type: "string" },
            interpretation: { type: "string" },
            risk: { type: "string" },
            opportunity: { type: "string" },
            bestResponse: { type: "string" },
          },
        },
        expressionNumber: {
          type: "object",
          properties: {
            number: { type: "number" },
            mathBreakdown: { type: "string" },
            interpretation: { type: "string" },
            risk: { type: "string" },
            opportunity: { type: "string" },
            bestResponse: { type: "string" },
          },
        },
        soulUrgeNumber: {
          type: "object",
          properties: {
            number: { type: "number" },
            mathBreakdown: { type: "string" },
            interpretation: { type: "string" },
            risk: { type: "string" },
            opportunity: { type: "string" },
            bestResponse: { type: "string" },
          },
        },
        personalityNumber: {
          type: "object",
          properties: {
            number: { type: "number" },
            mathBreakdown: { type: "string" },
            interpretation: { type: "string" },
            risk: { type: "string" },
            opportunity: { type: "string" },
            bestResponse: { type: "string" },
          },
        },
        maturityNumber: {
          type: "object",
          properties: {
            number: { type: "number" },
            mathBreakdown: { type: "string" },
            interpretation: { type: "string" },
            risk: { type: "string" },
            opportunity: { type: "string" },
            bestResponse: { type: "string" },
          },
        },
        pinnacles: {
          type: "array",
          items: {
            type: "object",
            properties: {
              pinnacleNumber: { type: "number" },
              ageRange: { type: "string" },
              interpretation: { type: "string" },
              risk: { type: "string" },
              opportunity: { type: "string" },
              bestResponse: { type: "string" },
            },
          },
        },
        challenges: {
          type: "array",
          items: {
            type: "object",
            properties: {
              challengeNumber: { type: "number" },
              ageRange: { type: "string" },
              interpretation: { type: "string" },
              risk: { type: "string" },
              opportunity: { type: "string" },
              bestResponse: { type: "string" },
            },
          },
        },
        personalYear: {
          type: "object",
          properties: {
            number: { type: "number" },
            year: { type: "number" },
            mathBreakdown: { type: "string" },
            interpretation: { type: "string" },
            risk: { type: "string" },
            opportunity: { type: "string" },
            bestResponse: { type: "string" },
          },
        },
        numberInteractions: { type: "string" },
        currentCycleInsight: { type: "string" },
      },
    },
    version: "1.0.0",
  },

  astrology_cosmology: {
    key: "astrology_cosmology",
    title: "Astrology & Cosmology Themes",
    systemInstructions: `You are an expert astrologer providing a cosmology-themed personality and energy reading. Combine traditional Western astrology with practical behavioral guidance. Write in second person. Be specific and actionable. Avoid vague mysticism - ground every insight in observable behavior and practical application. If birth time is not available, note that Moon sign, Rising sign, and house placements cannot be determined, but still provide full Sun-based analysis. When birth time IS available, expand significantly with Moon, Rising, and house-based themes. All planetary themes should be behavior-focused, not just trait lists.`,
    userPromptTemplate: (ctx: PromptContext) => `Provide a full astrological cosmology reading for ${ctx.firstName}.

Date of birth: ${ctx.dob}
Birth city: ${ctx.birthCity}${ctx.birthState ? `, ${ctx.birthState}` : ""}, ${ctx.birthCountry}
${ctx.birthTime ? `Birth time: ${ctx.birthTime}` : "Birth time: NOT PROVIDED (limit analysis to Sun-based themes)"}
Output depth: ${ctx.outputDepth}

${ctx.astrologyData ? `Pre-calculated astrology data:\n${JSON.stringify(ctx.astrologyData, null, 2)}` : ""}

Produce the following:

1. **Sun Sign Profile** - Sign, exact degree if possible, decan (1st, 2nd, or 3rd), and what the decan specifically modifies about the base sign energy.
2. **Element & Modality** - Their element (Fire/Earth/Air/Water) and modality (Cardinal/Fixed/Mutable). How these combine to shape their approach to life. Behavioral examples.
3. **Seasonal Energy Map** - How their energy naturally shifts across the four seasons. Which season they thrive in, which challenges them, and why.
4. **Planetary Behavior Themes** - For each of Mercury, Venus, Mars, Jupiter, and Saturn based on their likely sign placements:
   - Core behavioral theme
   - How it shows up in communication (Mercury), love (Venus), conflict (Mars), growth (Jupiter), discipline (Saturn)
   - Specific "DO" list (3-5 actions)
   - Specific "AVOID" list (3-5 pitfalls)

${ctx.birthTime ? `5. **Moon Sign Analysis** - Emotional baseline, comfort needs, stress response, what makes them feel safe.
6. **Rising Sign Analysis** - How others perceive them on first impression, the mask they wear, how it differs from their Sun.
7. **Expanded Chart Themes** - Key house placements and any notable aspects that shape their personality. Focus on the most impactful 3-5 aspects.` : "5. **Note** - Without birth time, Moon and Rising analysis cannot be provided. Recommend the user provide birth time for a complete reading."}`,
    outputSchema: {
      type: "object",
      properties: {
        sunSign: {
          type: "object",
          properties: {
            sign: { type: "string" },
            degree: { type: "string" },
            decan: { type: "number" },
            decanModification: { type: "string" },
          },
        },
        element: { type: "string" },
        modality: { type: "string" },
        elementModalityAnalysis: { type: "string" },
        seasonalEnergyMap: {
          type: "object",
          properties: {
            spring: { type: "string" },
            summer: { type: "string" },
            autumn: { type: "string" },
            winter: { type: "string" },
            bestSeason: { type: "string" },
            hardestSeason: { type: "string" },
          },
        },
        planetaryThemes: {
          type: "object",
          properties: {
            mercury: {
              type: "object",
              properties: {
                theme: { type: "string" },
                behavior: { type: "string" },
                doList: { type: "array", items: { type: "string" } },
                avoidList: { type: "array", items: { type: "string" } },
              },
            },
            venus: {
              type: "object",
              properties: {
                theme: { type: "string" },
                behavior: { type: "string" },
                doList: { type: "array", items: { type: "string" } },
                avoidList: { type: "array", items: { type: "string" } },
              },
            },
            mars: {
              type: "object",
              properties: {
                theme: { type: "string" },
                behavior: { type: "string" },
                doList: { type: "array", items: { type: "string" } },
                avoidList: { type: "array", items: { type: "string" } },
              },
            },
            jupiter: {
              type: "object",
              properties: {
                theme: { type: "string" },
                behavior: { type: "string" },
                doList: { type: "array", items: { type: "string" } },
                avoidList: { type: "array", items: { type: "string" } },
              },
            },
            saturn: {
              type: "object",
              properties: {
                theme: { type: "string" },
                behavior: { type: "string" },
                doList: { type: "array", items: { type: "string" } },
                avoidList: { type: "array", items: { type: "string" } },
              },
            },
          },
        },
        moonSign: {
          type: "object",
          properties: {
            sign: { type: "string" },
            emotionalBaseline: { type: "string" },
            comfortNeeds: { type: "string" },
            stressResponse: { type: "string" },
            safetyTriggers: { type: "string" },
          },
        },
        risingSign: {
          type: "object",
          properties: {
            sign: { type: "string" },
            firstImpression: { type: "string" },
            mask: { type: "string" },
            sunRisingDifference: { type: "string" },
          },
        },
        expandedChartThemes: {
          type: "array",
          items: {
            type: "object",
            properties: {
              aspect: { type: "string" },
              interpretation: { type: "string" },
            },
          },
        },
      },
    },
    version: "1.0.0",
  },

  location_analysis: {
    key: "location_analysis",
    title: "Location Analysis",
    systemInstructions: `You are a relocation strategist who combines personality analysis, numerology, astrology, and practical life design to recommend optimal cities. Be specific about neighborhoods, not just cities. Every recommendation must include a concrete reason tied to the person's profile, not generic city facts. Scores should be on a 1-10 scale. Risk factors must be honest. Onboarding tips should be actionable within the first 30 days of arrival. California cities should be the most detailed since they are the most accessible tier. Organize results by category, not by geography.`,
    userPromptTemplate: (ctx: PromptContext) => `Provide location recommendations for ${ctx.firstName}.

Date of birth: ${ctx.dob}
Birth city: ${ctx.birthCity}${ctx.birthState ? `, ${ctx.birthState}` : ""}, ${ctx.birthCountry}
${ctx.currentCity ? `Current city: ${ctx.currentCity}${ctx.currentState ? `, ${ctx.currentState}` : ""}${ctx.currentCountry ? `, ${ctx.currentCountry}` : ""}` : ""}
${ctx.relationshipStatus ? `Relationship status: ${ctx.relationshipStatus}` : ""}
${ctx.careerField ? `Career field: ${ctx.careerField}` : ""}
${ctx.goals.length > 0 ? `Goals: ${ctx.goals.join(", ")}` : ""}
Output depth: ${ctx.outputDepth}

For each of the following categories, recommend cities at three geographic tiers: California (3 cities), USA outside California (3 cities), and World (2 cities).

**Required Categories:**
1. **Reinvention** - Best cities for starting fresh, building a new identity, high anonymity + opportunity.
2. **Money** - Best cities for wealth building, career acceleration, entrepreneurship.
3. **Love** - Best cities for dating, meeting a long-term partner, romantic culture.
4. **Spiritual Growth** - Best cities for inner work, community, healing, and consciousness expansion.
5. **Community** - Best cities for finding your tribe, belonging, social integration.

**Optional Categories** (include if relevant to ${ctx.firstName}'s profile and goals):
6. **Family** - Best cities for raising a family or reconnecting with family values.
7. **Creativity** - Best cities for artistic expression, creative industries, inspiration.
8. **Shadow Work** - Best cities that force growth through challenge and self-confrontation.
9. **Short Trips** - Best weekend or short-trip destinations for recharging.

For EACH city recommendation, provide:
- **Score** (1-10): How well this city fits ${ctx.firstName} for this specific category.
- **Reason**: Why this city matches their profile (tie to traits, numbers, goals).
- **Risk**: The main downside or trap this city could present for them specifically.
- **Neighborhood Type**: The type of neighborhood they should target (e.g., "artsy walkable district," "quiet suburb near transit," "downtown high-rise corridor").
- **Onboarding Tip**: One specific action to take in the first 30 days to integrate.`,
    outputSchema: {
      type: "object",
      properties: {
        categories: {
          type: "array",
          items: {
            type: "object",
            properties: {
              category: { type: "string" },
              california: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    city: { type: "string" },
                    score: { type: "number" },
                    reason: { type: "string" },
                    risk: { type: "string" },
                    neighborhoodType: { type: "string" },
                    onboardingTip: { type: "string" },
                  },
                },
              },
              usa: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    city: { type: "string" },
                    score: { type: "number" },
                    reason: { type: "string" },
                    risk: { type: "string" },
                    neighborhoodType: { type: "string" },
                    onboardingTip: { type: "string" },
                  },
                },
              },
              world: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    city: { type: "string" },
                    score: { type: "number" },
                    reason: { type: "string" },
                    risk: { type: "string" },
                    neighborhoodType: { type: "string" },
                    onboardingTip: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
    version: "1.0.0",
  },

  current_city_analysis: {
    key: "current_city_analysis",
    title: "Current City Analysis",
    systemInstructions: `You are a life strategist evaluating a person's current city fit. Be brutally honest about ceiling analysis - do not sugarcoat if a city is limiting them. Use specific data points about the city (cost of living, industry presence, dating pool demographics, social culture). The stay vs. move projection should present both paths with equal rigor. Relocation timing should consider practical factors (lease cycles, job market seasonality, relationship status). Write in second person.`,
    userPromptTemplate: (ctx: PromptContext) => `Analyze ${ctx.firstName}'s current city fit.

Date of birth: ${ctx.dob}
Current city: ${ctx.currentCity || "NOT PROVIDED"}${ctx.currentState ? `, ${ctx.currentState}` : ""}${ctx.currentCountry ? `, ${ctx.currentCountry}` : ""}
${ctx.relationshipStatus ? `Relationship status: ${ctx.relationshipStatus}` : ""}
${ctx.careerField ? `Career field: ${ctx.careerField}` : ""}
${ctx.goals.length > 0 ? `Goals: ${ctx.goals.join(", ")}` : ""}
Output depth: ${ctx.outputDepth}

Produce the following:

1. **Ceiling Analysis** - For each dimension, rate the city's ceiling (1-10) and explain what the maximum achievable level looks like for ${ctx.firstName} here:
   - **Economic ceiling** - Income potential, career growth cap, entrepreneurship climate, cost-of-living ratio.
   - **Social ceiling** - Quality of social circle available, networking depth, community types, cultural fit.

2. **Comfort Zone Risk Assessment** - Is ${ctx.firstName} staying here out of comfort or genuine fit? What specific comfort-zone patterns does this city enable? What growth is being avoided by remaining?

3. **Growth Upside** - If ${ctx.firstName} fully committed to maximizing this city, what would the best-case scenario look like in 1, 3, and 5 years? Be specific.

4. **Dating & Social Analysis** - Demographics, dating culture, where to meet people, the social scene that matches their personality. What is working against them socially in this city, if anything?

5. **Stay vs. Move Projection** - Two parallel 3-year projections:
   - **Stay Path**: What life looks like if they optimize where they are. Best case and likely case.
   - **Move Path**: What life looks like if they relocate to a better-fit city. Best case and likely case. Which type of city would be the best target?

6. **Relocation Timing Strategy** - If relocation makes sense, when is the optimal window? Consider: current lease/mortgage, job market cycles, personal readiness signals, financial preparation steps, and a suggested timeline with milestones.`,
    outputSchema: {
      type: "object",
      properties: {
        ceilingAnalysis: {
          type: "object",
          properties: {
            economic: {
              type: "object",
              properties: {
                score: { type: "number" },
                analysis: { type: "string" },
              },
            },
            social: {
              type: "object",
              properties: {
                score: { type: "number" },
                analysis: { type: "string" },
              },
            },
          },
        },
        comfortZoneRisk: { type: "string" },
        growthUpside: {
          type: "object",
          properties: {
            oneYear: { type: "string" },
            threeYear: { type: "string" },
            fiveYear: { type: "string" },
          },
        },
        datingSocialAnalysis: { type: "string" },
        stayVsMoveProjection: {
          type: "object",
          properties: {
            stayPath: {
              type: "object",
              properties: {
                bestCase: { type: "string" },
                likelyCase: { type: "string" },
              },
            },
            movePath: {
              type: "object",
              properties: {
                bestCase: { type: "string" },
                likelyCase: { type: "string" },
                targetCityType: { type: "string" },
              },
            },
          },
        },
        relocationTimingStrategy: { type: "string" },
      },
    },
    version: "1.0.0",
  },

  soulmate_timing: {
    key: "soulmate_timing",
    title: "Soulmate Timing & Compatibility",
    systemInstructions: `You are a romantic timing and compatibility expert combining numerology, astrology, and behavioral psychology. Be specific about timing windows - use month ranges, not vague seasons. Archetypes should feel like real people, not abstract concepts. Green/red flags should be behavioral, not personality types. Meeting environments should be specific venues and contexts, not generic advice. The progression timeline should feel like a relationship roadmap. Be encouraging but honest about patterns that could sabotage love. Write in second person.`,
    userPromptTemplate: (ctx: PromptContext) => `Provide a soulmate timing and compatibility reading for ${ctx.firstName}.

Date of birth: ${ctx.dob}
${ctx.birthTime ? `Birth time: ${ctx.birthTime}` : ""}
${ctx.relationshipStatus ? `Relationship status: ${ctx.relationshipStatus}` : ""}
${ctx.currentCity ? `Current city: ${ctx.currentCity}${ctx.currentState ? `, ${ctx.currentState}` : ""}` : ""}
${ctx.goals.length > 0 ? `Goals: ${ctx.goals.join(", ")}` : ""}
Output depth: ${ctx.outputDepth}

Produce the following:

1. **3-Year Romantic Forecast** - Month-by-month energy overview for the next 3 years. Identify high-energy romantic windows, consolidation periods, and times to focus inward instead of dating.

2. **Strongest Love Windows** - The top 5 specific date ranges (month/year) in the next 3 years where romantic connection is most likely. For each: the window dates, why this period is charged, and what to do during it.

3. **3 Soulmate Archetypes** - Three distinct partner profiles that would be highly compatible with ${ctx.firstName}. For each: a vivid description (personality, energy, appearance vibe, career type), why they match, and where ${ctx.firstName} is most likely to encounter this type.

4. **Best Life Path Matches** - Top 5 Life Path numbers for compatibility, ranked. For each: why it works, the dynamic, and the potential friction point.

5. **Best Sun Sign Matches** - Top 5 Sun signs for compatibility, ranked. For each: why it works, the dynamic, and the potential friction point.

6. **Green Flags to Seek** - 10 specific behavioral green flags ${ctx.firstName} should look for in a partner. Not personality traits - observable behaviors.

7. **Red Flags to Watch** - 10 specific behavioral red flags that would be especially problematic for ${ctx.firstName}'s personality type. Explain why each is particularly dangerous for them.

8. **Meeting Environments** - 10 specific types of venues, events, apps, or contexts where ${ctx.firstName} is most likely to meet a compatible partner. Be specific (not just "go to a coffee shop").

9. **Progression Timeline** - Once ${ctx.firstName} meets someone promising, what does a healthy relationship progression look like for their personality? Month-by-month from first date to commitment. Include pacing advice and common mistakes to avoid.

10. **Staying vs. Moving Effect on Love** - How does ${ctx.firstName}'s current location affect their romantic prospects? What would change if they relocated? Be specific about the dating pool differences.`,
    outputSchema: {
      type: "object",
      properties: {
        threeYearForecast: { type: "string" },
        strongestLoveWindows: {
          type: "array",
          items: {
            type: "object",
            properties: {
              windowDates: { type: "string" },
              reason: { type: "string" },
              action: { type: "string" },
            },
          },
          minItems: 5,
          maxItems: 5,
        },
        soulmateArchetypes: {
          type: "array",
          items: {
            type: "object",
            properties: {
              description: { type: "string" },
              whyTheyMatch: { type: "string" },
              whereToFind: { type: "string" },
            },
          },
          minItems: 3,
          maxItems: 3,
        },
        bestLifePathMatches: {
          type: "array",
          items: {
            type: "object",
            properties: {
              lifePathNumber: { type: "number" },
              whyItWorks: { type: "string" },
              dynamic: { type: "string" },
              frictionPoint: { type: "string" },
            },
          },
        },
        bestSunSignMatches: {
          type: "array",
          items: {
            type: "object",
            properties: {
              sign: { type: "string" },
              whyItWorks: { type: "string" },
              dynamic: { type: "string" },
              frictionPoint: { type: "string" },
            },
          },
        },
        greenFlags: { type: "array", items: { type: "string" } },
        redFlags: { type: "array", items: { type: "string" } },
        meetingEnvironments: { type: "array", items: { type: "string" } },
        progressionTimeline: { type: "string" },
        stayingVsMovingEffect: { type: "string" },
      },
    },
    version: "1.0.0",
  },

  red_flags_patterns: {
    key: "red_flags_patterns",
    title: "Red Flags & Patterns",
    systemInstructions: `You are a relationship and behavioral pattern analyst with expertise in attachment theory, family systems, and CBT. Be compassionate but unflinchingly honest. Every pattern identified must include the trigger, the behavior, the short-term payoff, and the long-term cost. Constructive replacements must be specific and actionable, not vague advice like "communicate better." Write in second person. This section should feel like a caring but direct therapist's assessment.`,
    userPromptTemplate: (ctx: PromptContext) => `Analyze the behavioral and relational patterns for ${ctx.firstName}.

Date of birth: ${ctx.dob}
${ctx.relationshipStatus ? `Relationship status: ${ctx.relationshipStatus}` : ""}
${ctx.goals.length > 0 ? `Goals: ${ctx.goals.join(", ")}` : ""}
Output depth: ${ctx.outputDepth}

Produce the following:

1. **Relationship Patterns** - 5 recurring patterns likely to show up in ${ctx.firstName}'s romantic relationships. For each: the pattern name, how it starts, how it escalates, and how it typically ends.

2. **Personal Patterns** - 5 recurring patterns in ${ctx.firstName}'s personal life (career, friendships, self-care, decision-making). For each: the pattern name, the trigger, the behavior cycle, and the consequence.

3. **Emotional Triggers** - 8 specific emotional triggers that are likely to activate ${ctx.firstName}'s defensive or reactive behavior. For each: the trigger situation, the emotional response, and the behavioral reaction.

4. **Self-Sabotage Loops** - 5 self-sabotage loops. For each: the desire (what they want), the fear (what stops them), the sabotage behavior (what they do instead), the short-term payoff (why it feels good in the moment), and the long-term cost.

5. **Attachment Patterns** - Primary attachment style and how it manifests in: new relationships, established relationships, conflict, intimacy, and independence. Include the specific behaviors that signal each mode.

6. **Family-of-Origin Influences** - 5 likely family-of-origin dynamics that shaped ${ctx.firstName}'s current patterns. For each: the family dynamic, the belief it installed, and how it plays out in adult life.

7. **Constructive Replacements** - For each pattern and loop identified above, provide a specific replacement behavior. Each replacement must include: the trigger moment (when to deploy it), the new behavior (exactly what to do), and the script (exact words to say to themselves or others).`,
    outputSchema: {
      type: "object",
      properties: {
        relationshipPatterns: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              howItStarts: { type: "string" },
              howItEscalates: { type: "string" },
              howItEnds: { type: "string" },
            },
          },
        },
        personalPatterns: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              trigger: { type: "string" },
              behaviorCycle: { type: "string" },
              consequence: { type: "string" },
            },
          },
        },
        emotionalTriggers: {
          type: "array",
          items: {
            type: "object",
            properties: {
              situation: { type: "string" },
              emotionalResponse: { type: "string" },
              behavioralReaction: { type: "string" },
            },
          },
        },
        selfSabotageLoops: {
          type: "array",
          items: {
            type: "object",
            properties: {
              desire: { type: "string" },
              fear: { type: "string" },
              sabotageBehavior: { type: "string" },
              shortTermPayoff: { type: "string" },
              longTermCost: { type: "string" },
            },
          },
        },
        attachmentPatterns: {
          type: "object",
          properties: {
            primaryStyle: { type: "string" },
            newRelationships: { type: "string" },
            establishedRelationships: { type: "string" },
            conflict: { type: "string" },
            intimacy: { type: "string" },
            independence: { type: "string" },
          },
        },
        familyOfOriginInfluences: {
          type: "array",
          items: {
            type: "object",
            properties: {
              dynamic: { type: "string" },
              installedBelief: { type: "string" },
              adultManifestation: { type: "string" },
            },
          },
        },
        constructiveReplacements: {
          type: "array",
          items: {
            type: "object",
            properties: {
              forPattern: { type: "string" },
              triggerMoment: { type: "string" },
              newBehavior: { type: "string" },
              script: { type: "string" },
            },
          },
        },
      },
    },
    version: "1.0.0",
  },

  shadow_work: {
    key: "shadow_work",
    title: "Shadow Work & Healing",
    systemInstructions: `You are a clinical psychologist and shadow work facilitator with expertise in CBT, ACT, and exposure therapy. This section must be therapeutically sound. Cognitive distortions must use standard CBT terminology. Behavioral experiments must be safe, ethical, and graduated. The exposure ladder must follow proper desensitization principles (start at lowest anxiety, progress gradually). Emotional regulation protocols must be evidence-based. Boundary scripts must be word-for-word usable. The 30-day plan must be achievable for someone with moderate motivation. Write in second person. Be warm but clinically precise.`,
    userPromptTemplate: (ctx: PromptContext) => `Create a comprehensive shadow work and healing program for ${ctx.firstName}.

Date of birth: ${ctx.dob}
${ctx.relationshipStatus ? `Relationship status: ${ctx.relationshipStatus}` : ""}
${ctx.goals.length > 0 ? `Goals: ${ctx.goals.join(", ")}` : ""}
Output depth: ${ctx.outputDepth}

Produce the following:

1. **3 Pattern Loops** - Three core shadow patterns running in ${ctx.firstName}'s life. For each: the loop name, the trigger, the automatic thought, the emotional response, the behavioral reaction, and the reinforcement mechanism that keeps the loop running.

2. **10 Cognitive Distortions** - Ten cognitive distortions ${ctx.firstName} is most prone to (using standard CBT terminology: all-or-nothing thinking, catastrophizing, mind reading, emotional reasoning, etc.). For each distortion: a personalized example of how it shows up in their thinking, the distorted thought, and a balanced replacement thought.

3. **Thought Record Template** - A customized thought record template with columns for: situation, automatic thought, emotion (0-100), cognitive distortion identified, evidence for the thought, evidence against the thought, balanced thought, emotion after (0-100). Include 3 pre-filled example rows specific to ${ctx.firstName}'s likely scenarios.

4. **Core Belief Audit** - 5 likely core beliefs operating beneath the surface. For each: the belief, where it probably came from, how it distorts perception, and the healthier replacement belief with a bridging belief for the transition.

5. **8 Behavioral Experiments** - Eight experiments to test and challenge ${ctx.firstName}'s limiting beliefs. For each: the belief being tested, the experiment (specific action), the prediction (what they fear will happen), the actual likely outcome, and what to learn from it. Experiments must be safe and graduated in difficulty.

6. **10-Step Exposure Ladder** - A graduated exposure hierarchy for ${ctx.firstName}'s primary avoidance pattern. Start at SUDS (Subjective Units of Distress) 10-20 and progress to 80-90. For each step: the exposure, estimated SUDS level, duration to maintain exposure, coping strategy to use during, and success criteria.

7. **Emotional Regulation Protocols** - 5 evidence-based emotional regulation techniques personalized for ${ctx.firstName}. For each: the technique name, when to use it (which emotions/situations), step-by-step instructions, and a personalized script or mantra.

8. **Boundary Scripts** - 8 word-for-word boundary scripts for common situations ${ctx.firstName} likely faces. For each: the situation, the boundary script (exact words), the follow-up if the boundary is pushed, and the internal self-talk to maintain the boundary.

9. **30-Day Shadow Plan** - A day-by-day plan for 30 days of shadow work. Each day should have: a theme, a 10-15 minute exercise, a journaling prompt, and a micro-action. The plan should build progressively from self-awareness to integration.

10. **Weekly Evolution Log** - A template for weekly self-reflection with 10 questions ${ctx.firstName} should answer every Sunday to track their shadow work progress.`,
    outputSchema: {
      type: "object",
      properties: {
        patternLoops: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              trigger: { type: "string" },
              automaticThought: { type: "string" },
              emotionalResponse: { type: "string" },
              behavioralReaction: { type: "string" },
              reinforcement: { type: "string" },
            },
          },
          minItems: 3,
          maxItems: 3,
        },
        cognitiveDistortions: {
          type: "array",
          items: {
            type: "object",
            properties: {
              distortionType: { type: "string" },
              personalizedExample: { type: "string" },
              distortedThought: { type: "string" },
              balancedThought: { type: "string" },
            },
          },
          minItems: 10,
          maxItems: 10,
        },
        thoughtRecordTemplate: {
          type: "object",
          properties: {
            columns: { type: "array", items: { type: "string" } },
            exampleRows: { type: "array", items: { type: "object" } },
          },
        },
        coreBeliefAudit: {
          type: "array",
          items: {
            type: "object",
            properties: {
              belief: { type: "string" },
              origin: { type: "string" },
              perceptionDistortion: { type: "string" },
              replacementBelief: { type: "string" },
              bridgingBelief: { type: "string" },
            },
          },
          minItems: 5,
          maxItems: 5,
        },
        behavioralExperiments: {
          type: "array",
          items: {
            type: "object",
            properties: {
              beliefTested: { type: "string" },
              experiment: { type: "string" },
              prediction: { type: "string" },
              likelyOutcome: { type: "string" },
              lesson: { type: "string" },
            },
          },
          minItems: 8,
          maxItems: 8,
        },
        exposureLadder: {
          type: "array",
          items: {
            type: "object",
            properties: {
              step: { type: "number" },
              exposure: { type: "string" },
              sudsLevel: { type: "number" },
              duration: { type: "string" },
              copingStrategy: { type: "string" },
              successCriteria: { type: "string" },
            },
          },
          minItems: 10,
          maxItems: 10,
        },
        emotionalRegulationProtocols: {
          type: "array",
          items: {
            type: "object",
            properties: {
              technique: { type: "string" },
              whenToUse: { type: "string" },
              steps: { type: "array", items: { type: "string" } },
              script: { type: "string" },
            },
          },
          minItems: 5,
          maxItems: 5,
        },
        boundaryScripts: {
          type: "array",
          items: {
            type: "object",
            properties: {
              situation: { type: "string" },
              script: { type: "string" },
              followUp: { type: "string" },
              internalSelfTalk: { type: "string" },
            },
          },
          minItems: 8,
          maxItems: 8,
        },
        thirtyDayPlan: {
          type: "array",
          items: {
            type: "object",
            properties: {
              day: { type: "number" },
              theme: { type: "string" },
              exercise: { type: "string" },
              journalPrompt: { type: "string" },
              microAction: { type: "string" },
            },
          },
          minItems: 30,
          maxItems: 30,
        },
        weeklyEvolutionLog: {
          type: "array",
          items: { type: "string" },
          minItems: 10,
          maxItems: 10,
        },
      },
    },
    version: "1.0.0",
  },

  self_improvement: {
    key: "self_improvement",
    title: "Self-Improvement Roadmap",
    systemInstructions: `You are a personal development strategist. Every recommendation must be specific and actionable with clear start/stop criteria. Avoid generic advice. Habits should include implementation intentions (when/where/how). Boundaries must be specific to the person's likely situations. The growth path should have clear phases with graduation criteria. Write in second person. Be direct and motivating without being preachy.`,
    userPromptTemplate: (ctx: PromptContext) => `Create a self-improvement roadmap for ${ctx.firstName}.

Date of birth: ${ctx.dob}
${ctx.relationshipStatus ? `Relationship status: ${ctx.relationshipStatus}` : ""}
${ctx.careerField ? `Career field: ${ctx.careerField}` : ""}
${ctx.goals.length > 0 ? `Goals: ${ctx.goals.join(", ")}` : ""}
Output depth: ${ctx.outputDepth}

Produce the following:

1. **Emotional Upgrades** - 5 emotional skills ${ctx.firstName} needs to develop. For each: the skill, why it matters for them specifically, their current likely level (1-10), target level, and 3 specific practices to build it.

2. **Confidence Work** - 5 specific confidence-building actions tailored to ${ctx.firstName}'s personality type. For each: the action, why it works for their type, frequency, and the internal shift it produces.

3. **Mindset Upgrades** - 5 mindset shifts ${ctx.firstName} needs to make. For each: the current mindset, the upgraded mindset, the bridging thought (to ease the transition), and a daily reinforcement practice.

4. **Spiritual Development** - A personalized spiritual development path. Include: recommended practices (meditation style, journaling type, contemplation methods), recommended reading/resources (3-5 specific books or teachers), and a weekly spiritual routine.

5. **Habits to Build** - 7 habits to build. For each: the habit, the implementation intention (When I [cue], I will [routine], because [reward]), the minimum viable version (for low-energy days), and the 30-day ramp-up schedule.

6. **Habits to Stop** - 5 habits to stop or replace. For each: the habit, why it is harmful for ${ctx.firstName} specifically, the underlying need it meets, and the replacement behavior that meets the same need.

7. **Boundaries to Set** - 5 boundaries ${ctx.firstName} likely needs to establish or strengthen. For each: the boundary, who it applies to, the script for communicating it, and how to maintain it when tested.

8. **Daily Practices** - A complete daily routine structure including morning (first 60 min), midday (energy management), and evening (wind-down). Time-blocked with specific activities.

9. **Weekly Practices** - 5 weekly practices (specific day and time suggestions). For each: the practice, why it matters, duration, and what success looks like.

10. **Step-by-Step Growth Path** - A 4-phase growth path (each phase 4-6 weeks). For each phase: the focus, the 3 key actions, the graduation criteria (how to know you are ready for the next phase), and the expected internal shift.`,
    outputSchema: {
      type: "object",
      properties: {
        emotionalUpgrades: {
          type: "array",
          items: {
            type: "object",
            properties: {
              skill: { type: "string" },
              whyItMatters: { type: "string" },
              currentLevel: { type: "number" },
              targetLevel: { type: "number" },
              practices: { type: "array", items: { type: "string" } },
            },
          },
        },
        confidenceWork: {
          type: "array",
          items: {
            type: "object",
            properties: {
              action: { type: "string" },
              whyItWorks: { type: "string" },
              frequency: { type: "string" },
              internalShift: { type: "string" },
            },
          },
        },
        mindsetUpgrades: {
          type: "array",
          items: {
            type: "object",
            properties: {
              currentMindset: { type: "string" },
              upgradedMindset: { type: "string" },
              bridgingThought: { type: "string" },
              dailyReinforcement: { type: "string" },
            },
          },
        },
        spiritualDevelopment: {
          type: "object",
          properties: {
            practices: { type: "array", items: { type: "string" } },
            resources: { type: "array", items: { type: "string" } },
            weeklyRoutine: { type: "string" },
          },
        },
        habitsToBuild: {
          type: "array",
          items: {
            type: "object",
            properties: {
              habit: { type: "string" },
              implementationIntention: { type: "string" },
              minimumViableVersion: { type: "string" },
              rampUpSchedule: { type: "string" },
            },
          },
        },
        habitsToStop: {
          type: "array",
          items: {
            type: "object",
            properties: {
              habit: { type: "string" },
              whyHarmful: { type: "string" },
              underlyingNeed: { type: "string" },
              replacement: { type: "string" },
            },
          },
        },
        boundaries: {
          type: "array",
          items: {
            type: "object",
            properties: {
              boundary: { type: "string" },
              appliesTo: { type: "string" },
              script: { type: "string" },
              maintenance: { type: "string" },
            },
          },
        },
        dailyPractices: {
          type: "object",
          properties: {
            morning: { type: "string" },
            midday: { type: "string" },
            evening: { type: "string" },
          },
        },
        weeklyPractices: {
          type: "array",
          items: {
            type: "object",
            properties: {
              practice: { type: "string" },
              whyItMatters: { type: "string" },
              duration: { type: "string" },
              successLooksLike: { type: "string" },
            },
          },
        },
        growthPath: {
          type: "array",
          items: {
            type: "object",
            properties: {
              phase: { type: "number" },
              focus: { type: "string" },
              keyActions: { type: "array", items: { type: "string" } },
              graduationCriteria: { type: "string" },
              expectedShift: { type: "string" },
            },
          },
        },
      },
    },
    version: "1.0.0",
  },

  love_languages: {
    key: "love_languages",
    title: "Love Languages",
    systemInstructions: `You are a relationship expert specializing in Gary Chapman's Five Love Languages framework. Rank all five languages based on the person's personality profile. Explanations must be personal, not textbook descriptions. The "what to ask for" and "what to give" sections should contain specific, actionable examples. The "what to avoid" section should highlight common mistakes partners make with someone who has this ranking. Write in second person. Be warm and relatable.`,
    userPromptTemplate: (ctx: PromptContext) => `Analyze the love languages for ${ctx.firstName}.

Date of birth: ${ctx.dob}
${ctx.relationshipStatus ? `Relationship status: ${ctx.relationshipStatus}` : ""}
Output depth: ${ctx.outputDepth}

Rank the 5 Love Languages from #1 (most important) to #5 (least important) for ${ctx.firstName}:
- Words of Affirmation
- Acts of Service
- Receiving Gifts
- Quality Time
- Physical Touch

For EACH love language (in ranked order), provide:

1. **Rank & Language Name**
2. **Why This Ranking Fits** - Explain why this language sits at this position for ${ctx.firstName} based on their personality profile. Use specific behavioral examples.
3. **What to Ask For** - 5 specific things ${ctx.firstName} should ask a partner to do that speak this language. Be concrete (not "spend quality time" but "put your phone away during dinner and ask me about my day").
4. **What to Give** - 5 specific ways ${ctx.firstName} can express love to a partner through this language, even if it is not their own top language.
5. **What to Avoid** - 5 specific mistakes a partner could make that would feel like a violation of this love language. Explain why each is particularly hurtful for ${ctx.firstName}.

After all 5 rankings, provide:
- **Love Language Conflict Map** - How ${ctx.firstName}'s ranking could create friction with common partner rankings. Which combinations are hardest and how to bridge the gap.
- **Communication Script** - A script ${ctx.firstName} can use to explain their love language needs to a new partner without sounding demanding.`,
    outputSchema: {
      type: "object",
      properties: {
        rankings: {
          type: "array",
          items: {
            type: "object",
            properties: {
              rank: { type: "number" },
              language: { type: "string" },
              whyThisRanking: { type: "string" },
              whatToAskFor: { type: "array", items: { type: "string" } },
              whatToGive: { type: "array", items: { type: "string" } },
              whatToAvoid: { type: "array", items: { type: "string" } },
            },
          },
          minItems: 5,
          maxItems: 5,
        },
        conflictMap: { type: "string" },
        communicationScript: { type: "string" },
      },
    },
    version: "1.0.0",
  },

  career_money: {
    key: "career_money",
    title: "Career & Money",
    systemInstructions: `You are a career strategist and money psychologist. Recommendations must be grounded in real market demand and practical career paths. Role suggestions should be specific job titles, not vague categories. The money psychology section should reveal unconscious patterns without judgment. The 90-day plan should be week-by-week with specific deliverables. The 3-year arc should be ambitious but realistic. Sales and leadership styles should describe natural strengths, not idealized behaviors. Write in second person. Be strategic and direct.`,
    userPromptTemplate: (ctx: PromptContext) => `Create a career and money strategy for ${ctx.firstName}.

Date of birth: ${ctx.dob}
${ctx.careerField ? `Current career field: ${ctx.careerField}` : ""}
${ctx.budgetRange ? `Budget range: ${ctx.budgetRange}` : ""}
${ctx.currentCity ? `Current city: ${ctx.currentCity}${ctx.currentState ? `, ${ctx.currentState}` : ""}` : ""}
${ctx.goals.length > 0 ? `Goals: ${ctx.goals.join(", ")}` : ""}
Output depth: ${ctx.outputDepth}

Produce the following:

1. **Work Style Profile** - How ${ctx.firstName} naturally works: solo vs. team preference, structure vs. flexibility needs, communication style at work, decision-making approach, energy management (when they do their best work), and ideal work environment.

2. **Strength Stack** - The top 5 professional strengths that, combined, create ${ctx.firstName}'s unique value proposition. For each: the strength, how it manifests at work, and what makes it rare in combination with their other strengths.

3. **Top 10 Roles** - The 10 specific job titles/roles most aligned with ${ctx.firstName}'s profile. For each: role title, why it fits, expected salary range, growth trajectory, and the key skill to develop to excel in it.

4. **Top 5 Industries** - The 5 industries where ${ctx.firstName} would thrive most. For each: the industry, why it matches their energy, the entry point, and the 3-year potential.

5. **Risk Roles** - 5 roles or career paths that seem appealing but would likely burn ${ctx.firstName} out or frustrate them. For each: the role, why it seems attractive, and why it would ultimately fail.

6. **Sales Style** - ${ctx.firstName}'s natural sales approach. How they persuade, what sales environments suit them, their closing style, and what to avoid in sales situations.

7. **Leadership Style** - ${ctx.firstName}'s natural leadership approach. Their management strengths, blind spots, how they inspire, how they handle conflict as a leader, and the type of team they lead best.

8. **Money Psychology** - ${ctx.firstName}'s relationship with money. Their money story (likely beliefs inherited from family), spending patterns, saving patterns, earning ceiling beliefs, and 3 specific money mindset shifts to make.

9. **Positioning Strategy** - How ${ctx.firstName} should position themselves professionally. Their personal brand angle, LinkedIn headline suggestion, elevator pitch, and the narrative that makes them memorable.

10. **90-Day Execution Plan** - A week-by-week plan for the next 90 days to advance ${ctx.firstName}'s career. Each week should have: a focus area, 3 specific actions, and a measurable outcome.

11. **3-Year Career Arc** - Year 1 focus, Year 2 evolution, Year 3 destination. For each year: the primary goal, the key moves, the income target, and the identity shift.`,
    outputSchema: {
      type: "object",
      properties: {
        workStyle: {
          type: "object",
          properties: {
            soloVsTeam: { type: "string" },
            structureVsFlexibility: { type: "string" },
            communicationStyle: { type: "string" },
            decisionMaking: { type: "string" },
            energyManagement: { type: "string" },
            idealEnvironment: { type: "string" },
          },
        },
        strengthStack: {
          type: "array",
          items: {
            type: "object",
            properties: {
              strength: { type: "string" },
              manifestation: { type: "string" },
              rarityFactor: { type: "string" },
            },
          },
        },
        topRoles: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              whyItFits: { type: "string" },
              salaryRange: { type: "string" },
              growthTrajectory: { type: "string" },
              keySkillToDevelop: { type: "string" },
            },
          },
        },
        topIndustries: {
          type: "array",
          items: {
            type: "object",
            properties: {
              industry: { type: "string" },
              whyItMatches: { type: "string" },
              entryPoint: { type: "string" },
              threeYearPotential: { type: "string" },
            },
          },
        },
        riskRoles: {
          type: "array",
          items: {
            type: "object",
            properties: {
              role: { type: "string" },
              whyAttractive: { type: "string" },
              whyItFails: { type: "string" },
            },
          },
        },
        salesStyle: { type: "string" },
        leadershipStyle: { type: "string" },
        moneyPsychology: {
          type: "object",
          properties: {
            moneyStory: { type: "string" },
            spendingPatterns: { type: "string" },
            savingPatterns: { type: "string" },
            earningCeilingBeliefs: { type: "string" },
            mindsetShifts: { type: "array", items: { type: "string" } },
          },
        },
        positioning: {
          type: "object",
          properties: {
            brandAngle: { type: "string" },
            linkedInHeadline: { type: "string" },
            elevatorPitch: { type: "string" },
            memorableNarrative: { type: "string" },
          },
        },
        ninetyDayPlan: {
          type: "array",
          items: {
            type: "object",
            properties: {
              week: { type: "number" },
              focus: { type: "string" },
              actions: { type: "array", items: { type: "string" } },
              measurableOutcome: { type: "string" },
            },
          },
        },
        threeYearArc: {
          type: "object",
          properties: {
            yearOne: {
              type: "object",
              properties: {
                goal: { type: "string" },
                keyMoves: { type: "array", items: { type: "string" } },
                incomeTarget: { type: "string" },
                identityShift: { type: "string" },
              },
            },
            yearTwo: {
              type: "object",
              properties: {
                goal: { type: "string" },
                keyMoves: { type: "array", items: { type: "string" } },
                incomeTarget: { type: "string" },
                identityShift: { type: "string" },
              },
            },
            yearThree: {
              type: "object",
              properties: {
                goal: { type: "string" },
                keyMoves: { type: "array", items: { type: "string" } },
                incomeTarget: { type: "string" },
                identityShift: { type: "string" },
              },
            },
          },
        },
      },
    },
    version: "1.0.0",
  },

  hobbies_lifestyle: {
    key: "hobbies_lifestyle",
    title: "Hobbies & Lifestyle",
    systemInstructions: `You are a lifestyle design expert. Recommendations must be specific activities, not broad categories. Each hobby should include a "getting started" path. Activities to avoid should explain why they would drain or frustrate this specific person. Group recommendations by energy type (creative, skill-building, social, physical, contemplative). Write in second person. Be enthusiastic but authentic.`,
    userPromptTemplate: (ctx: PromptContext) => `Recommend hobbies and lifestyle activities for ${ctx.firstName}.

Date of birth: ${ctx.dob}
${ctx.currentCity ? `Current city: ${ctx.currentCity}${ctx.currentState ? `, ${ctx.currentState}` : ""}` : ""}
${ctx.stylePreference ? `Style preference: ${ctx.stylePreference}` : ""}
${ctx.goals.length > 0 ? `Goals: ${ctx.goals.join(", ")}` : ""}
Output depth: ${ctx.outputDepth}

Produce the following:

1. **Creative Hobbies** - 5 creative hobbies that match ${ctx.firstName}'s personality. For each: the hobby, why it fits their personality, getting started (first 3 steps), what to invest in initially (budget-friendly), and the long-term satisfaction arc.

2. **Skill-Building Hobbies** - 5 skill-based hobbies that would develop ${ctx.firstName}'s weaker areas while being enjoyable. For each: the hobby, the skill it develops, why it is enjoyable for their type, and a 30-day starter challenge.

3. **Social Hobbies** - 5 social activities that match their social energy and help build meaningful connections. For each: the activity, why it matches their social style, where to find groups, and how it builds relationships.

4. **Outdoor Activities** - 5 outdoor activities suited to their energy type and likely physical preferences. For each: the activity, why it suits them, best environment for it, and how to make it social vs. solo.

5. **Sports & Physical Activities** - 5 sports or physical activities. For each: the sport, why it matches their competitive/cooperative style, skill level entry point, and the personality benefit beyond fitness.

6. **Leisure & Relaxation** - 5 leisure activities for recharging. For each: the activity, why it recharges their specific personality type, ideal frequency, and how to protect this time from being overtaken by obligations.

7. **Art Mediums** - 3 art mediums ${ctx.firstName} would likely enjoy and find therapeutic. For each: the medium, why it resonates with their personality, a beginner project, and what emotional benefit it provides.

8. **Activities to Avoid or Limit** - 5 activities or hobbies that seem popular but would likely drain, frustrate, or bore ${ctx.firstName}. For each: the activity, why it seems appealing, and why it ultimately would not work for them.`,
    outputSchema: {
      type: "object",
      properties: {
        creativeHobbies: {
          type: "array",
          items: {
            type: "object",
            properties: {
              hobby: { type: "string" },
              whyItFits: { type: "string" },
              gettingStarted: { type: "array", items: { type: "string" } },
              initialInvestment: { type: "string" },
              satisfactionArc: { type: "string" },
            },
          },
        },
        skillHobbies: {
          type: "array",
          items: {
            type: "object",
            properties: {
              hobby: { type: "string" },
              skillDeveloped: { type: "string" },
              whyEnjoyable: { type: "string" },
              thirtyDayChallenge: { type: "string" },
            },
          },
        },
        socialHobbies: {
          type: "array",
          items: {
            type: "object",
            properties: {
              activity: { type: "string" },
              whyItMatches: { type: "string" },
              whereToFind: { type: "string" },
              relationshipBuilding: { type: "string" },
            },
          },
        },
        outdoorActivities: {
          type: "array",
          items: {
            type: "object",
            properties: {
              activity: { type: "string" },
              whyItSuits: { type: "string" },
              bestEnvironment: { type: "string" },
              socialVsSolo: { type: "string" },
            },
          },
        },
        sports: {
          type: "array",
          items: {
            type: "object",
            properties: {
              sport: { type: "string" },
              whyItMatches: { type: "string" },
              entryPoint: { type: "string" },
              personalityBenefit: { type: "string" },
            },
          },
        },
        leisure: {
          type: "array",
          items: {
            type: "object",
            properties: {
              activity: { type: "string" },
              whyItRecharges: { type: "string" },
              idealFrequency: { type: "string" },
              protectionStrategy: { type: "string" },
            },
          },
        },
        artMediums: {
          type: "array",
          items: {
            type: "object",
            properties: {
              medium: { type: "string" },
              whyItResonates: { type: "string" },
              beginnerProject: { type: "string" },
              emotionalBenefit: { type: "string" },
            },
          },
        },
        activitiesToAvoid: {
          type: "array",
          items: {
            type: "object",
            properties: {
              activity: { type: "string" },
              whyItSeemsAppealing: { type: "string" },
              whyItFails: { type: "string" },
            },
          },
        },
      },
    },
    version: "1.0.0",
  },

  fitness_psychology: {
    key: "fitness_psychology",
    title: "Fitness Psychology",
    systemInstructions: `You are a fitness psychologist and behavioral change specialist. This is NOT a workout program - it is a psychological framework for building sustainable exercise habits. Focus on the mental barriers, motivation patterns, and psychological tricks that work for this specific personality type. The workout template should be personality-aligned, not a generic gym split. Include no medical advice - focus on behavioral and psychological strategies. Write in second person.`,
    userPromptTemplate: (ctx: PromptContext) => `Create a fitness psychology plan for ${ctx.firstName}.

Date of birth: ${ctx.dob}
${ctx.goals.length > 0 ? `Goals: ${ctx.goals.join(", ")}` : ""}
Output depth: ${ctx.outputDepth}

Produce the following:

1. **Consistency Pitfalls** - 5 specific reasons ${ctx.firstName} is likely to fall off a fitness routine based on their personality type. For each: the pitfall, the trigger, the internal narrative that enables quitting, and the reframe.

2. **Motivation Style** - ${ctx.firstName}'s primary motivation driver (intrinsic vs. extrinsic, competition vs. self-improvement, social vs. solo, routine vs. variety). How to structure their fitness approach around this driver. What motivation strategies will backfire for their type.

3. **4-Day Training Template** - A 4-day-per-week training template aligned with their personality. For each day: the training focus, the personality reason for this choice (e.g., "Tuesday is your lowest energy day, so we keep it to mobility and light movement"), session duration, and the psychological anchor that makes it stick.

4. **Habit Stack** - 7 fitness-related habit stacks using the formula "After I [existing habit], I will [new fitness behavior]." Each must be tied to an existing habit ${ctx.firstName} likely already has.

5. **Emotional Trigger Management** - 5 emotional states that derail ${ctx.firstName}'s fitness consistency. For each: the emotion, how it disrupts their routine, the minimum viable fitness action to do instead of skipping entirely, and the self-talk script.

6. **Minimum Viable Day** - The absolute minimum fitness action ${ctx.firstName} should do on their worst days. This is the "never zero" protocol. Define it clearly: exact duration, exact movements, exact intensity, and why this specific minimum works for their personality.

7. **12-Week Progression** - A 12-week progressive plan divided into 3 phases (weeks 1-4, 5-8, 9-12). For each phase: the focus, the frequency, the intensity level, the psychological milestone, and the reward for completing the phase.`,
    outputSchema: {
      type: "object",
      properties: {
        consistencyPitfalls: {
          type: "array",
          items: {
            type: "object",
            properties: {
              pitfall: { type: "string" },
              trigger: { type: "string" },
              quittingNarrative: { type: "string" },
              reframe: { type: "string" },
            },
          },
        },
        motivationStyle: {
          type: "object",
          properties: {
            primaryDriver: { type: "string" },
            structureAdvice: { type: "string" },
            whatBackfires: { type: "string" },
          },
        },
        fourDayTemplate: {
          type: "array",
          items: {
            type: "object",
            properties: {
              day: { type: "string" },
              focus: { type: "string" },
              personalityReason: { type: "string" },
              duration: { type: "string" },
              psychologicalAnchor: { type: "string" },
            },
          },
          minItems: 4,
          maxItems: 4,
        },
        habitStack: {
          type: "array",
          items: {
            type: "object",
            properties: {
              existingHabit: { type: "string" },
              newFitnessBehavior: { type: "string" },
            },
          },
        },
        emotionalTriggerManagement: {
          type: "array",
          items: {
            type: "object",
            properties: {
              emotion: { type: "string" },
              howItDisrupts: { type: "string" },
              minimumViableAction: { type: "string" },
              selfTalkScript: { type: "string" },
            },
          },
        },
        minimumViableDay: {
          type: "object",
          properties: {
            duration: { type: "string" },
            movements: { type: "string" },
            intensity: { type: "string" },
            whyItWorks: { type: "string" },
          },
        },
        twelveWeekProgression: {
          type: "array",
          items: {
            type: "object",
            properties: {
              phase: { type: "string" },
              weeks: { type: "string" },
              focus: { type: "string" },
              frequency: { type: "string" },
              intensity: { type: "string" },
              psychologicalMilestone: { type: "string" },
              reward: { type: "string" },
            },
          },
          minItems: 3,
          maxItems: 3,
        },
      },
    },
    version: "1.0.0",
  },

  fashion_system: {
    key: "fashion_system",
    title: "Fashion System",
    systemInstructions: `You are a personal stylist and fashion psychologist. Style archetypes must be a blend (e.g., "60% Classic, 30% Natural, 10% Dramatic"), not a single label. Color palettes must include specific hex codes. The capsule wardrobe must be practical and buildable on a real budget. Outfit suggestions should be complete head-to-toe with specific item descriptions. Metal recommendations should be tied to their coloring and energy. Write in second person. Be specific about fabrics, fits, and silhouettes.`,
    userPromptTemplate: (ctx: PromptContext) => `Create a personal fashion system for ${ctx.firstName}.

Date of birth: ${ctx.dob}
${ctx.stylePreference ? `Style preference: ${ctx.stylePreference}` : ""}
${ctx.budgetRange ? `Budget range: ${ctx.budgetRange}` : ""}
Output depth: ${ctx.outputDepth}

Produce the following:

1. **Style Archetype Blend** - ${ctx.firstName}'s style archetype as a percentage blend of: Classic, Natural, Dramatic, Romantic, Gamine, Creative. Explain why each percentage fits their personality and energy. Include the overall vibe in one sentence.

2. **Color Palette** - A personalized color palette with:
   - 5 core neutrals (with hex codes)
   - 5 accent colors (with hex codes)
   - 3 power colors (with hex codes) - for days when they need to make an impact
   - 3 colors to avoid (with hex codes) - colors that would drain their energy or clash with their archetype
   - For each color: the name, hex code, and when/how to wear it.

3. **Metal Recommendation** - Gold, silver, rose gold, or mixed metals. Why this metal suits them. How to incorporate it in jewelry, watches, belt buckles, and accessories.

4. **Capsule Wardrobe** - A 30-piece capsule wardrobe. For each piece: the item description (specific fabric, cut, color from their palette), why it earns a spot, and what it pairs with. Organize by category: tops (8), bottoms (6), outerwear (4), shoes (5), accessories (7).

5. **Outfit: Casual Day** - A complete head-to-toe casual outfit with specific items, colors, and accessories. Include the vibe it projects.

6. **Outfit: Date Night** - A complete head-to-toe date night outfit. Include the vibe it projects and what it communicates to a potential partner.

7. **Outfit: Work/Professional** - A complete head-to-toe work outfit. Include the vibe it projects and how it positions them in a professional context.

8. **Outfit: Event/Going Out** - A complete head-to-toe event outfit. Include the vibe it projects and the confidence boost it provides.`,
    outputSchema: {
      type: "object",
      properties: {
        styleArchetypeBlend: {
          type: "object",
          properties: {
            classic: { type: "number" },
            natural: { type: "number" },
            dramatic: { type: "number" },
            romantic: { type: "number" },
            gamine: { type: "number" },
            creative: { type: "number" },
            explanation: { type: "string" },
            overallVibe: { type: "string" },
          },
        },
        colorPalette: {
          type: "object",
          properties: {
            coreNeutrals: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  hex: { type: "string" },
                  howToWear: { type: "string" },
                },
              },
            },
            accentColors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  hex: { type: "string" },
                  howToWear: { type: "string" },
                },
              },
            },
            powerColors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  hex: { type: "string" },
                  howToWear: { type: "string" },
                },
              },
            },
            colorsToAvoid: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  hex: { type: "string" },
                  reason: { type: "string" },
                },
              },
            },
          },
        },
        metalRecommendation: {
          type: "object",
          properties: {
            metal: { type: "string" },
            reason: { type: "string" },
            incorporationGuide: { type: "string" },
          },
        },
        capsuleWardrobe: {
          type: "object",
          properties: {
            tops: { type: "array", items: { type: "object" } },
            bottoms: { type: "array", items: { type: "object" } },
            outerwear: { type: "array", items: { type: "object" } },
            shoes: { type: "array", items: { type: "object" } },
            accessories: { type: "array", items: { type: "object" } },
          },
        },
        outfitCasual: { type: "object" },
        outfitDate: { type: "object" },
        outfitWork: { type: "object" },
        outfitEvent: { type: "object" },
      },
    },
    version: "1.0.0",
  },

  shopping_links: {
    key: "shopping_links",
    title: "Shopping Links",
    systemInstructions: `You are a personal shopping assistant. Provide two tiers: value (budget-friendly) and premium. Item suggestions must be specific enough to search for but not tied to specific products that may go out of stock. Search phrases should be ready to paste into Amazon, Google Shopping, and retailer sites. Organize by wardrobe category. Write in second person.`,
    userPromptTemplate: (ctx: PromptContext) => `Create a shopping guide for ${ctx.firstName}.

Date of birth: ${ctx.dob}
${ctx.stylePreference ? `Style preference: ${ctx.stylePreference}` : ""}
${ctx.budgetRange ? `Budget range: ${ctx.budgetRange}` : ""}
Output depth: ${ctx.outputDepth}

Produce the following:

1. **Value Tier** - 15 specific item suggestions for building their wardrobe on a budget. For each: the item description, estimated price range, and why it is a priority purchase. Organize by category: basics (5), statement pieces (5), accessories (5).

2. **Premium Tier** - 10 investment pieces worth spending more on. For each: the item description, estimated price range, why it is worth the investment, and expected longevity.

3. **Retailer Search Phrases** - 10 ready-to-paste search phrases optimized for major retailers (Zara, H&M, Uniqlo, Nordstrom, etc.). Each phrase should find items that match ${ctx.firstName}'s style profile.

4. **Amazon Search Phrases** - 10 ready-to-paste Amazon search phrases. Each optimized for Amazon's search algorithm to surface relevant items.

5. **Google Shopping Phrases** - 10 ready-to-paste Google Shopping search phrases. Each optimized to find the best deals on items matching their style.`,
    outputSchema: {
      type: "object",
      properties: {
        valueTier: {
          type: "object",
          properties: {
            basics: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  item: { type: "string" },
                  priceRange: { type: "string" },
                  priority: { type: "string" },
                },
              },
            },
            statementPieces: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  item: { type: "string" },
                  priceRange: { type: "string" },
                  priority: { type: "string" },
                },
              },
            },
            accessories: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  item: { type: "string" },
                  priceRange: { type: "string" },
                  priority: { type: "string" },
                },
              },
            },
          },
        },
        premiumTier: {
          type: "array",
          items: {
            type: "object",
            properties: {
              item: { type: "string" },
              priceRange: { type: "string" },
              whyWorthIt: { type: "string" },
              longevity: { type: "string" },
            },
          },
        },
        retailerSearchPhrases: { type: "array", items: { type: "string" } },
        amazonSearchPhrases: { type: "array", items: { type: "string" } },
        googleShoppingPhrases: { type: "array", items: { type: "string" } },
      },
    },
    version: "1.0.0",
  },

  music_frequency: {
    key: "music_frequency",
    title: "Music & Frequency Guide",
    systemInstructions: `You are a music therapist and brainwave entrainment educator. Explain each brainwave state clearly and accessibly. Frequency pairings should be specific Hz ranges. Do NOT make any medical claims - frame everything as "may support," "traditionally associated with," or "users often report." Music expansion should be tied to the person's personality and emotional needs. Write in second person. Be educational without being clinical.`,
    userPromptTemplate: (ctx: PromptContext) => `Create a music and frequency guide for ${ctx.firstName}.

Date of birth: ${ctx.dob}
${ctx.musicPreference ? `Music preference: ${ctx.musicPreference}` : ""}
Output depth: ${ctx.outputDepth}

Produce the following:

1. **Brainwave State Explanations** - For each of the 5 brainwave states, provide:
   - **Delta (0.5-4 Hz)**: What it is, when it is active, what it supports, and how to access it through sound.
   - **Theta (4-8 Hz)**: What it is, when it is active, what it supports, and how to access it through sound.
   - **Alpha (8-13 Hz)**: What it is, when it is active, what it supports, and how to access it through sound.
   - **Beta (13-30 Hz)**: What it is, when it is active, what it supports, and how to access it through sound.
   - **Gamma (30-100 Hz)**: What it is, when it is active, what it supports, and how to access it through sound.

2. **Personalized Frequency Pairings** - For each emotional/functional state, recommend specific frequency ranges and music types for ${ctx.firstName}:
   - **Peace**: Frequency range, music type, listening duration, best time of day.
   - **Calm**: Frequency range, music type, listening duration, best time of day.
   - **Focus**: Frequency range, music type, listening duration, best time of day.
   - **Love/Heart Opening**: Frequency range, music type, listening duration, best time of day.
   - **Happiness/Energy**: Frequency range, music type, listening duration, best time of day.
   - **Sleep**: Frequency range, music type, listening duration, best time of day.

3. **Disclaimer** - Include a clear disclaimer that frequency and music recommendations are for entertainment, relaxation, and personal exploration purposes only and are not medical treatments.

4. **User-Specific Music Expansion** - Based on ${ctx.firstName}'s personality profile${ctx.musicPreference ? ` and stated music preference (${ctx.musicPreference})` : ""}, recommend:
   - 5 genres they should explore and why
   - 5 artists they would likely connect with and why
   - 3 types of soundscapes for different times of day
   - A personalized "sound diet" - how to use music throughout their day for optimal emotional regulation.`,
    outputSchema: {
      type: "object",
      properties: {
        brainwaveStates: {
          type: "object",
          properties: {
            delta: { type: "object" },
            theta: { type: "object" },
            alpha: { type: "object" },
            beta: { type: "object" },
            gamma: { type: "object" },
          },
        },
        frequencyPairings: {
          type: "object",
          properties: {
            peace: { type: "object" },
            calm: { type: "object" },
            focus: { type: "object" },
            love: { type: "object" },
            happiness: { type: "object" },
            sleep: { type: "object" },
          },
        },
        disclaimer: { type: "string" },
        musicExpansion: {
          type: "object",
          properties: {
            genres: { type: "array", items: { type: "object" } },
            artists: { type: "array", items: { type: "object" } },
            soundscapes: { type: "array", items: { type: "object" } },
            soundDiet: { type: "string" },
          },
        },
      },
    },
    version: "1.0.0",
  },

  spotify_pack: {
    key: "spotify_pack",
    title: "Spotify Pack",
    systemInstructions: `You are a music curator specializing in functional playlists. Each track must be a real, well-known song that can be found on Spotify. The Spotify search format must be exact: "track:Title artist:Artist". Purpose descriptions should explain WHY this specific track works for its intended function (focus, calm, mood lift, sleep) based on its BPM, instrumentation, and emotional quality. Write in second person.`,
    userPromptTemplate: (ctx: PromptContext) => `Create a Spotify pack for ${ctx.firstName}.

Date of birth: ${ctx.dob}
${ctx.musicPreference ? `Music preference: ${ctx.musicPreference}` : ""}
Output depth: ${ctx.outputDepth}

Curate exactly 10 tracks, distributed as follows:
- 3 Focus tracks (for deep work, studying, or creative flow)
- 3 Calm tracks (for winding down, anxiety reduction, or meditation)
- 2 Mood Lift tracks (for energy, confidence, or getting out of a funk)
- 2 Sleep tracks (for falling asleep or deep rest)

For EACH track, provide:
1. **Title** - The exact song title.
2. **Artist** - The exact artist name.
3. **Category** - Focus, Calm, Mood Lift, or Sleep.
4. **Purpose** - Why this specific track works for ${ctx.firstName} for this purpose. Reference the song's BPM, instrumentation, emotional quality, or lyrical theme.
5. **Spotify Search Format** - The exact search string to paste into Spotify: "track:[Title] artist:[Artist]"

After all 10 tracks, provide:
- **Listening Order Suggestion** - The recommended order to listen if playing all 10 as a single session.
- **When to Use Each Category** - Specific times of day or situations to queue up each category.`,
    outputSchema: {
      type: "object",
      properties: {
        tracks: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              artist: { type: "string" },
              category: {
                type: "string",
                enum: ["Focus", "Calm", "Mood Lift", "Sleep"],
              },
              purpose: { type: "string" },
              spotifySearch: { type: "string" },
            },
          },
          minItems: 10,
          maxItems: 10,
        },
        listeningOrder: { type: "array", items: { type: "string" } },
        whenToUse: {
          type: "object",
          properties: {
            focus: { type: "string" },
            calm: { type: "string" },
            moodLift: { type: "string" },
            sleep: { type: "string" },
          },
        },
      },
    },
    version: "1.0.0",
  },

  film_tv_profile: {
    key: "film_tv_profile",
    title: "Film & TV Profile",
    systemInstructions: `You are a film and television critic who specializes in matching viewing recommendations to personality types. Recommendations must be specific titles, not genres. The taste explanation should connect their personality traits to viewing preferences in a way that feels insightful. Each recommendation should explain what specifically about the film/show will resonate with this person. Write in second person. Be specific about scenes, themes, or character dynamics that will connect.`,
    userPromptTemplate: (ctx: PromptContext) => `Create a film and TV taste profile for ${ctx.firstName}.

Date of birth: ${ctx.dob}
${ctx.goals.length > 0 ? `Goals: ${ctx.goals.join(", ")}` : ""}
Output depth: ${ctx.outputDepth}

Produce the following:

1. **Taste Explanation** - A 2-3 paragraph analysis of ${ctx.firstName}'s likely film and TV taste. What draws them in: narrative complexity, visual beauty, emotional depth, humor style, character development, action, mystery, transformation arcs? What bores or repels them? What do they rewatch and why?

2. **5 Film Recommendations** - For each:
   - Title and year
   - Genre
   - Why it resonates with ${ctx.firstName}'s personality (be specific about themes, characters, or moments)
   - The emotional experience it provides
   - Best context to watch (alone, with a partner, with friends, etc.)

3. **5 TV Show Recommendations** - For each:
   - Title and year/run
   - Genre
   - Why it resonates with ${ctx.firstName}'s personality
   - The emotional experience it provides
   - Binge-worthiness rating (1-10) and ideal pacing (binge vs. one-per-day)`,
    outputSchema: {
      type: "object",
      properties: {
        tasteExplanation: { type: "string" },
        filmRecommendations: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              year: { type: "number" },
              genre: { type: "string" },
              whyItResonates: { type: "string" },
              emotionalExperience: { type: "string" },
              bestContext: { type: "string" },
            },
          },
          minItems: 5,
          maxItems: 5,
        },
        tvRecommendations: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              yearRun: { type: "string" },
              genre: { type: "string" },
              whyItResonates: { type: "string" },
              emotionalExperience: { type: "string" },
              bingeRating: { type: "number" },
              idealPacing: { type: "string" },
            },
          },
          minItems: 5,
          maxItems: 5,
        },
      },
    },
    version: "1.0.0",
  },

  seven_day_plan: {
    key: "seven_day_plan",
    title: "7-Day Starter Plan",
    systemInstructions: `You are a behavioral change specialist creating a gentle on-ramp to personal growth. Each day's micro-actions must take no more than 15-20 minutes total. Actions should be specific and completable, not vague. The 7 days should build on each other but each day should also stand alone if the person misses a day. Write in second person. Be encouraging and practical. Frame each action with WHY it matters for this specific person.`,
    userPromptTemplate: (ctx: PromptContext) => `Create a 7-day starter plan for ${ctx.firstName}.

Date of birth: ${ctx.dob}
${ctx.goals.length > 0 ? `Goals: ${ctx.goals.join(", ")}` : ""}
Output depth: ${ctx.outputDepth}

Create 7 days of micro-actions. Each day should have:

1. **Day Theme** - A one-line theme for the day (e.g., "Day 1: Awareness")
2. **Morning Micro-Action** (5 minutes) - A specific action to start the day. Include exact instructions.
3. **Midday Micro-Action** (5 minutes) - A specific action for the middle of the day. Include exact instructions.
4. **Evening Micro-Action** (5-10 minutes) - A specific action to close the day. Include exact instructions.
5. **Why This Matters** - One sentence explaining why this day's theme and actions are important for ${ctx.firstName} specifically.
6. **Completion Check** - A yes/no question ${ctx.firstName} can ask themselves to confirm they completed the day's work.

After all 7 days, include:
- **If You Miss a Day** - Instructions for what to do if they miss a day (do not restart, just pick up where they left off).
- **After the 7 Days** - What to do next. How this starter plan connects to the larger growth journey.`,
    outputSchema: {
      type: "object",
      properties: {
        days: {
          type: "array",
          items: {
            type: "object",
            properties: {
              dayNumber: { type: "number" },
              theme: { type: "string" },
              morningAction: { type: "string" },
              middayAction: { type: "string" },
              eveningAction: { type: "string" },
              whyItMatters: { type: "string" },
              completionCheck: { type: "string" },
            },
          },
          minItems: 7,
          maxItems: 7,
        },
        missedDayInstructions: { type: "string" },
        afterSevenDays: { type: "string" },
      },
    },
    version: "1.0.0",
  },

  thirty_day_plan: {
    key: "thirty_day_plan",
    title: "30-Day Plan",
    systemInstructions: `You are a behavioral change architect designing a structured 30-day transformation program. The four-week structure must follow proper change psychology: awareness before action, replacement before experimentation, experimentation before consolidation. Each week should have clear daily actions AND a weekly reflection. The scoreboard must include measurable metrics the person can track. Write in second person. Be structured and motivating.`,
    userPromptTemplate: (ctx: PromptContext) => `Create a 30-day transformation plan for ${ctx.firstName}.

Date of birth: ${ctx.dob}
${ctx.goals.length > 0 ? `Goals: ${ctx.goals.join(", ")}` : ""}
Output depth: ${ctx.outputDepth}

Structure the plan as follows:

**Week 1: Awareness (Days 1-7)**
- Theme: Observing patterns without trying to change them.
- For each day: a specific awareness exercise (journaling prompt, tracking task, or observation challenge), estimated time (10-15 min), and what to notice.
- Week 1 Reflection: 5 questions to answer at the end of the week.

**Week 2: Replacement (Days 8-14)**
- Theme: Introducing healthier alternatives to identified patterns.
- For each day: a specific replacement behavior to practice, the old behavior it replaces, how to handle the urge to revert, and a self-compassion script for slip-ups.
- Week 2 Reflection: 5 questions to answer at the end of the week.

**Week 3: Experiments (Days 15-21)**
- Theme: Testing new behaviors in real-world situations.
- For each day: a behavioral experiment to run, the hypothesis, what to observe, and how to log the result.
- Week 3 Reflection: 5 questions to answer at the end of the week.

**Week 4: Consolidation (Days 22-30)**
- Theme: Locking in the changes and building identity around the new behaviors.
- For each day: a consolidation action (identity reinforcement, habit anchoring, social accountability, future visualization).
- Day 30: A comprehensive self-assessment and celebration protocol.
- Week 4 Reflection: 5 questions to answer at the end of the week.

**Scoreboard Metrics** - 5 measurable metrics ${ctx.firstName} should track throughout the 30 days. For each: what to measure, how to measure it, the baseline (Day 1), and the target (Day 30).`,
    outputSchema: {
      type: "object",
      properties: {
        weekOne: {
          type: "object",
          properties: {
            theme: { type: "string" },
            days: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  day: { type: "number" },
                  exercise: { type: "string" },
                  time: { type: "string" },
                  whatToNotice: { type: "string" },
                },
              },
            },
            reflection: { type: "array", items: { type: "string" } },
          },
        },
        weekTwo: {
          type: "object",
          properties: {
            theme: { type: "string" },
            days: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  day: { type: "number" },
                  replacementBehavior: { type: "string" },
                  oldBehavior: { type: "string" },
                  urgeHandling: { type: "string" },
                  selfCompassionScript: { type: "string" },
                },
              },
            },
            reflection: { type: "array", items: { type: "string" } },
          },
        },
        weekThree: {
          type: "object",
          properties: {
            theme: { type: "string" },
            days: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  day: { type: "number" },
                  experiment: { type: "string" },
                  hypothesis: { type: "string" },
                  whatToObserve: { type: "string" },
                  logging: { type: "string" },
                },
              },
            },
            reflection: { type: "array", items: { type: "string" } },
          },
        },
        weekFour: {
          type: "object",
          properties: {
            theme: { type: "string" },
            days: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  day: { type: "number" },
                  consolidationAction: { type: "string" },
                },
              },
            },
            dayThirtyCelebration: { type: "string" },
            reflection: { type: "array", items: { type: "string" } },
          },
        },
        scoreboardMetrics: {
          type: "array",
          items: {
            type: "object",
            properties: {
              metric: { type: "string" },
              howToMeasure: { type: "string" },
              baseline: { type: "string" },
              target: { type: "string" },
            },
          },
          minItems: 5,
          maxItems: 5,
        },
      },
    },
    version: "1.0.0",
  },

  three_year_arc: {
    key: "three_year_arc",
    title: "3-Year Strategic Arc",
    systemInstructions: `You are a strategic life planner. The 3-year arc should feel like a business plan for someone's life - ambitious, structured, but flexible. Each year should have a clear theme and measurable goals. Leverage points should identify the highest-ROI actions. Risk warnings should be specific to the person's patterns, not generic life advice. Write in second person. Be visionary but grounded.`,
    userPromptTemplate: (ctx: PromptContext) => `Create a 3-year strategic arc for ${ctx.firstName}.

Date of birth: ${ctx.dob}
${ctx.currentCity ? `Current city: ${ctx.currentCity}${ctx.currentState ? `, ${ctx.currentState}` : ""}` : ""}
${ctx.careerField ? `Career field: ${ctx.careerField}` : ""}
${ctx.relationshipStatus ? `Relationship status: ${ctx.relationshipStatus}` : ""}
${ctx.goals.length > 0 ? `Goals: ${ctx.goals.join(", ")}` : ""}
Output depth: ${ctx.outputDepth}

Produce the following:

**Year 1: Foundation & Focus**
- Overall theme and one-sentence intention
- **Career**: Primary career goal, 3 quarterly milestones, key skill to develop, networking target
- **Love**: Relationship goal for the year, dating/partnership strategy, key relationship skill to build
- **Money**: Income target, savings target, one financial system to implement, spending habit to change
- **Identity**: The internal shift that needs to happen, the belief to install, the behavior that reinforces the new identity
- **Key Move**: The single most important action to take in Year 1

**Year 2: Structure & Scaling**
- Overall theme and one-sentence intention
- **Career**: How to build on Year 1, scaling strategy, leadership/influence goal, income growth target
- **Love**: Relationship deepening or partnership quality goals, communication upgrade
- **Money**: Investment strategy, passive income exploration, financial milestone
- **Identity**: The Year 2 identity evolution, how they are different from Year 1
- **Key Move**: The single most important action to take in Year 2

**Year 3: Expansion & Commitment**
- Overall theme and one-sentence intention
- **Career**: Long-term positioning, legacy project or major career move, mentorship/giving back
- **Love**: Relationship commitment level, family planning considerations if relevant, partnership depth
- **Money**: Wealth building phase, financial freedom progress, generosity targets
- **Identity**: The fully evolved version, how they carry themselves, what they stand for
- **Key Move**: The single most important action to take in Year 3

**Leverage Points** - 5 high-ROI actions that would accelerate the entire 3-year arc. For each: the action, why it has outsized impact, and when to deploy it.

**Risk Warnings** - 5 specific risks that could derail ${ctx.firstName}'s 3-year arc based on their personality patterns. For each: the risk, the trigger, the early warning sign, and the prevention strategy.`,
    outputSchema: {
      type: "object",
      properties: {
        yearOne: {
          type: "object",
          properties: {
            theme: { type: "string" },
            intention: { type: "string" },
            career: { type: "object" },
            love: { type: "object" },
            money: { type: "object" },
            identity: { type: "object" },
            keyMove: { type: "string" },
          },
        },
        yearTwo: {
          type: "object",
          properties: {
            theme: { type: "string" },
            intention: { type: "string" },
            career: { type: "object" },
            love: { type: "object" },
            money: { type: "object" },
            identity: { type: "object" },
            keyMove: { type: "string" },
          },
        },
        yearThree: {
          type: "object",
          properties: {
            theme: { type: "string" },
            intention: { type: "string" },
            career: { type: "object" },
            love: { type: "object" },
            money: { type: "object" },
            identity: { type: "object" },
            keyMove: { type: "string" },
          },
        },
        leveragePoints: {
          type: "array",
          items: {
            type: "object",
            properties: {
              action: { type: "string" },
              whyHighImpact: { type: "string" },
              whenToDeploy: { type: "string" },
            },
          },
          minItems: 5,
          maxItems: 5,
        },
        riskWarnings: {
          type: "array",
          items: {
            type: "object",
            properties: {
              risk: { type: "string" },
              trigger: { type: "string" },
              earlyWarningSign: { type: "string" },
              preventionStrategy: { type: "string" },
            },
          },
          minItems: 5,
          maxItems: 5,
        },
      },
    },
    version: "1.0.0",
  },

  holistic_blueprint: {
    key: "holistic_blueprint",
    title: "Holistic Life Blueprint",
    systemInstructions: `You are a holistic life strategist synthesizing all aspects of a person's profile into a unified life blueprint. This section should feel like the executive summary of their entire report. Needs should be ranked by urgency. Blockers should be specific and tied to patterns identified elsewhere. Healing moves should be actionable. North stars should be inspiring but achievable. Write in second person. Be comprehensive yet concise - this is a synthesis, not a repeat of other sections.`,
    userPromptTemplate: (ctx: PromptContext) => `Create a holistic life blueprint for ${ctx.firstName}.

Date of birth: ${ctx.dob}
${ctx.currentCity ? `Current city: ${ctx.currentCity}${ctx.currentState ? `, ${ctx.currentState}` : ""}` : ""}
${ctx.careerField ? `Career field: ${ctx.careerField}` : ""}
${ctx.relationshipStatus ? `Relationship status: ${ctx.relationshipStatus}` : ""}
${ctx.goals.length > 0 ? `Goals: ${ctx.goals.join(", ")}` : ""}
Output depth: ${ctx.outputDepth}

Produce the following:

1. **Executive Summary** - A 3-4 paragraph synthesis of who ${ctx.firstName} is, where they are in life, and where they are headed. This should feel like the opening of a personal strategic plan. Reference key themes from their numerology, astrology, and personality profile without repeating detailed analysis.

2. **Core Needs** - The top 5 unmet or partially met needs in ${ctx.firstName}'s life right now, ranked by urgency. For each: the need, current fulfillment level (1-10), why it is urgent, and the consequence of leaving it unaddressed for another year.

3. **Primary Blockers** - The top 5 things blocking ${ctx.firstName} from their next level. For each: the blocker, the root cause, how it manifests in daily life, and the first step to removing it.

4. **Healing Moves** - 5 specific healing actions ${ctx.firstName} should prioritize. For each: the action, what it heals, the expected timeline for results, and the sign that healing is working.

5. **Best Environments** - The 3 types of environments (physical, social, professional) where ${ctx.firstName} thrives most. For each: describe the environment, why it works, and how to create or find it.

6. **Relationship North Star** - A vivid description of ${ctx.firstName}'s ideal relationship dynamic. Not a description of the partner, but of the relationship itself: how it feels, how conflicts are handled, how growth happens together, and what the daily rhythm looks like.

7. **Career North Star** - A vivid description of ${ctx.firstName}'s ideal professional life. Not a job title, but the experience: what their days feel like, what impact they have, how they are compensated, and what their reputation is.

8. **Future Direction** - A closing vision statement. Where is ${ctx.firstName} headed if they follow this blueprint? Paint a picture of their life 3 years from now. Make it specific, vivid, and motivating. End with a single sentence call to action.`,
    outputSchema: {
      type: "object",
      properties: {
        executiveSummary: { type: "string" },
        coreNeeds: {
          type: "array",
          items: {
            type: "object",
            properties: {
              need: { type: "string" },
              fulfillmentLevel: { type: "number" },
              whyUrgent: { type: "string" },
              consequenceIfIgnored: { type: "string" },
            },
          },
          minItems: 5,
          maxItems: 5,
        },
        primaryBlockers: {
          type: "array",
          items: {
            type: "object",
            properties: {
              blocker: { type: "string" },
              rootCause: { type: "string" },
              dailyManifestation: { type: "string" },
              firstStep: { type: "string" },
            },
          },
          minItems: 5,
          maxItems: 5,
        },
        healingMoves: {
          type: "array",
          items: {
            type: "object",
            properties: {
              action: { type: "string" },
              whatItHeals: { type: "string" },
              timeline: { type: "string" },
              signOfProgress: { type: "string" },
            },
          },
          minItems: 5,
          maxItems: 5,
        },
        bestEnvironments: {
          type: "array",
          items: {
            type: "object",
            properties: {
              environmentType: { type: "string" },
              description: { type: "string" },
              whyItWorks: { type: "string" },
              howToFind: { type: "string" },
            },
          },
          minItems: 3,
          maxItems: 3,
        },
        relationshipNorthStar: { type: "string" },
        careerNorthStar: { type: "string" },
        futureDirection: { type: "string" },
      },
    },
    version: "1.0.0",
  },
};
