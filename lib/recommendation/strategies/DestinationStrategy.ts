import { TravelPreference } from "../TravelPreference";
import { AttractionData } from "../type";
import { RecommendationStrategy } from "./RecommendationStrategy";

/** Matches attractions that belong to any of the destinations the traveller selected **/
export class DestinationStrategy extends RecommendationStrategy
{
    readonly name = "destination";

    appliesTo(preference: TravelPreference): boolean 
    {
        return preference.destinationIds.length > 0;    
    }

    score(attraction: AttractionData, preference: TravelPreference): number 
    {
        return preference.destinationIds.includes(attraction.destinationId) ? 1 : 0;    
    }
}