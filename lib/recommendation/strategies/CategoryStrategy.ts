import { TravelPreference } from "../TravelPreference";
import { AttractionData } from "../type";
import { RecommendationStrategy } from "./RecommendationStrategy";

/** Matches attractions that belong to any of the categpries the traveller selected **/
export class CategoryStrategy extends RecommendationStrategy
{
    readonly name = "category";

    appliesTo(preference: TravelPreference): boolean 
    {
        return preference.categories.length > 0;    
    }

    score(attraction: AttractionData, preference: TravelPreference): number 
    {
        return preference.categories.includes(attraction.category) ? 1 : 0;    
    }
}