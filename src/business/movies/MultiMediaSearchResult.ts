interface MultiMediaSearchResultParams {
    id: number;
    title: string;
    overview: string;
    mediaType: string;
    posterPath: string;
    releaseDate: string;
}

export class MultiMediaSearchResult {
    readonly id: number;
    readonly title: string;
    readonly overview: string;
    readonly mediaType: string;
    readonly posterPath: string;
    readonly releaseDate: string;

    constructor({
        id,
        title,
        overview,
        mediaType,
        posterPath,
        releaseDate,
    }: MultiMediaSearchResultParams) {
        this.id = id;
        this.title = title;
        this.overview = overview;
        this.mediaType = mediaType;
        this.posterPath = posterPath;
        this.releaseDate = releaseDate;
    }
}
