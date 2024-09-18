interface PersonSearchResultParams {
    knownFor: MovieSearchResult[];
}

export class PersonSearchResult {
    readonly knownFor: MovieSearchResult[]

    constructor({
        knownFor
    }: PersonSearchResultParams) {
        this.knownFor = knownFor;
    }
}

interface MovieSearchResultParams {
    movieId: number;
    title: string;
    overview: string;
    posterPath: string;
    releaseDate: string;
}

export class MovieSearchResult {
    readonly movieId: number;
    readonly title: string;
    readonly overview: string;
    readonly posterPath: string;
    readonly releaseDate: string;

    constructor({movieId, title, overview, posterPath, releaseDate}: MovieSearchResultParams) {
        this.movieId = movieId;
        this.title = title;
        this.overview = overview;
        this.posterPath = posterPath;
        this.releaseDate = releaseDate;
    }
}

export type MultiMediaSearchResult = MovieSearchResult | PersonSearchResult;