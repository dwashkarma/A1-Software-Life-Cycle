/** An abstraction reduced to the fields the matching rules need **/
export interface AttractionData {
    id: string;
    name: string;
    category: string;
    destinationId: string;
}

/** An abstraction together with how well it matches the traveller's preference **/
export interface RecommendedAttraction {
    attraction: AttractionData;
    /** 0 to 1: average of the scores from every strategy that apply **/
    score: number;
    /** Name of strategies the attraction matched **/
    matched: string[];
}

/** A destination ranked from the attractions that matched inside it **/
export interface RecommendedDestination {
    destinationId: string;
    /** Sum of scores of its matching attractions **/
    score: number;
    /** How many attractions of this destination matched **/
    matchedCount: number;
}