/** Encapsulation: the lists are readonly and are cleaned once in the constructor. An empty preference can never be created**/
export class TravelPreference 
{
    readonly destinationIds: readonly string[];
    readonly categories: readonly string[];

    constructor(destinationIds: string[] = [], categories: string[] = []) 
    {
        this.destinationIds = TravelPreference.clean(destinationIds);
        this.categories = TravelPreference.clean(categories);

        if (this.destinationIds.length == 0 && this.categories.length == 0) 
        {
            throw new Error("Select at least one destination or category");
        }
    }

    /** Removes blanks values and duplicates **/
    private static clean(values: string[]): string[]
    {
        const result: string[] = [];

        for (const value of values) 
        {
            const trimmedValue = String(value).trim();

            if (trimmedValue.length > 0 && !result.includes(trimmedValue))
            {
                result.push(trimmedValue);
            }
        }
        
        return result;
    }
}

