export class MovieReview {
    readonly reviewId: string;
    readonly score: number;
    readonly review: string;

    constructor(reviewId: string, score: number, review: string = '') {
        this.reviewId = reviewId;
        this.score = score;
        this.review = review;
    }
}

export class AddMovieReview {
    readonly userId: string;
    readonly score: number;
    readonly review: string;
    readonly movieId: number;

    constructor(userId: string, score: number, review: string = '', movieId: number) {
        this.userId = userId;
        this.score = score;
        this.review = review;
        this.movieId = movieId;
    }
}

