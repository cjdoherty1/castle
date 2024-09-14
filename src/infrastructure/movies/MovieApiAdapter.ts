import fetch from 'node-fetch';
import { NetworkError } from '../../business/Errors';
import { MultiMediaSearchResult } from '../../business/movies/MultiMediaSearchResult';

const MOVIE_API_BASE_URL = 'https://api.themoviedb.org/3/';

interface SearchMultiMediaParams {
    searchQuery: string; 
    page: number;
}

export class MovieApiAdapter {
    async searchMultiMedia(
        { searchQuery, page }: SearchMultiMediaParams
    ): Promise<MultiMediaSearchResult[]> {
        try {
            console.log('Searching multi media from TMDB API with query', { searchQuery: searchQuery, page: page });
            const params = new URLSearchParams({
                query: searchQuery,
                include_adult: 'true',
                page: page.toString(),
            });
            const url = `${MOVIE_API_BASE_URL}search/multi?${params.toString()}`;

            const response: Response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders(),
            })

            if (!response.ok) {
                console.error('Failed to reach TMDB API', { 
                    statusCode: response.status,
                    status: response.statusText,
                 })
                throw new NetworkError(`'Failed to reach TMDB API - ${response.status} ${response.statusText}`);
            }

            const searchResults = await response.json();
            const multiMediaSearchResults = searchResults['results'].map(
                searchResult => this.convertSearchResultToMultiMediaSearchResult(searchResult)
            );

            console.log('Successfully retrieved search results from TMDB API', { numberOfResults: multiMediaSearchResults.length })

            return multiMediaSearchResults;
        } catch (e) {
            console.log('Failed to search for multi media', { error: e })
            throw e;
        }
    }

    private convertSearchResultToMultiMediaSearchResult(searchResult): MultiMediaSearchResult {
        return new MultiMediaSearchResult(
            {
                id: searchResult['id'],
                title: searchResult['title'],
                overview: searchResult['overview'],
                mediaType: searchResult['media_type'],
                posterPath: searchResult['poster_path'],
                releaseDate: searchResult['release_date'],
            }
        )
    }

    private getHeaders() {
        return {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_API_READ_ACCESS_TOKEN}`,
        }
    }
}