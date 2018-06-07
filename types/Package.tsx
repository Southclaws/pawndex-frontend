export interface Package {
    user: string;
    repo: string;
    dependencies?: string[];
    classification: "full" | "basic" | "buried";
    stars: number;
    updated: Date;
    topics: string[];
    tags: string[];
}
