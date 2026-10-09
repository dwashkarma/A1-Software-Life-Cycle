import { AttractionData, RecommendedAttraction, RecommendedDestination } from "./type";
import { TravelPreference } from "./TravelPreference";
import { DestinationStrategy } from "./strategies/DestinationStrategy";
import { CategoryStrategy } from "./strategies/CategoryStrategy";
import { RecommendationStrategy } from "./strategies/RecommendationStrategy";

const round2 = (n:number): number => Math.round(n * 100) / 100;

/** Ranks attractions using interchangeable strategies
 * The service works with the abstract RecommendationStrategy type only
 * Pass a new different list to the constructor to add or replace a rule without changing this class**/
export class RecommendationService
{
    constructor(
        private readonly strategies: RecommendationStrategy[] = [
            new DestinationStrategy(), 
            new CategoryStrategy(),
        ],
    ) {}

    /** === Attraction ranking === 
     * Scores every attraction, drops the ones that match nothing and sorts the rest
     * Only strategys the traveller selected a value for are applied
     * Score = average of the applied strategies, so a double match (1) ranks above a single match (0.5)**/
    rank( attractions: AttractionData[], preference: TravelPreference,): RecommendedAttraction[]
    {
        const activeStrategies = this.strategies.filter((strategy) => strategy.appliesTo(preference));
        if (activeStrategies.length === 0) return [];

        // score each attraction
        const result: RecommendedAttraction[] = [];
        for (const attraction of attractions)
        {
            let totalScore = 0;
            const matchedStrategies: string[] = [];

            for (const strategy of activeStrategies)
            {
                // Polymorphism: each strategy applies its own rule through the same call
                const score = strategy.score(attraction, preference);

                totalScore += score;

                if (score > 0)
                {
                    matchedStrategies.push(strategy.name);
                }
            }

            // Calculate the average score
            const averageScore = round2(totalScore/ activeStrategies.length);

            // Keep only attractions that match a preference
            if (averageScore > 0)
            {
                result.push({
                    attraction: attraction,
                    score: averageScore,
                    matched: matchedStrategies,
                });
            }
        }

        // Sort by score, highest first, then by name
        result.sort((a, b) => {
            if (a.score !== b.score)
            {
                return b.score - a.score;
            }

            return a.attraction.name.localeCompare(b.attraction.name);
        });

        return result;
    }
}