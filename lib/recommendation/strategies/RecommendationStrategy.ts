import { AttractionData } from "../type";
import { TravelPreference } from "../TravelPreference";

/** Strategy pattern: the common contract for every matching rule 
 * Abstraction: RecommendDationService only knows this type
 * Polymorphism: each subclass overrides methods with its own rule **/

export abstract class RecommendationStrategy {
    // Short label shown in results
    abstract readonly name: string;

    // True when the traveller selected something for this criterion
    abstract appliesTo(preference: TravelPreference): boolean;

    // 1 when the attraction matches this criterion, 0 when it does not
    abstract score(attraction: AttractionData, preference: TravelPreference): number;
}