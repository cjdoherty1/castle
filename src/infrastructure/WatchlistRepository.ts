import { eq } from 'drizzle-orm';
import { InsertWatchlist, SelectWatchlist, watchlistsTable } from "./schemas/watchlistsSchema"
import { moviesTable } from './schemas/moviesSchema';
import { DatabaseAdapter } from './DatabaseAdapter';
import { Watchlist } from '../business/watchlist/Watchlist';



// --- MAKE USER ID A GLOBAL VARIABLE ---

export class WatchlistRepository {
    private databaseAdapter;

    constructor(databaseAdapter: DatabaseAdapter) {
        this.databaseAdapter = databaseAdapter;
    }

    async getWatchlistByWatchListId(id: SelectWatchlist['watchlistId']): Promise<
    Watchlist
  > {
    const response = await this.databaseAdapter.getClient().select({
      id: moviesTable.movieId,
      title: moviesTable.title,
      director: moviesTable.director
    }).from(watchlistsTable).innerJoin(moviesTable, eq(watchlistsTable.movieId, moviesTable.movieId)).where(eq(watchlistsTable.watchlistId, id));

    let watchlist = new Watchlist(id, response);
    console.log(watchlist)
    return watchlist;
  }

  async addWatchlistItem(userId: number, watchlistId: number, movieId: number) {
    const newWatchlistItem: InsertWatchlist = { watchlistId: watchlistId, userId: userId, movieId: movieId };  
    await this.databaseAdapter.getClient().insert(watchlistsTable).values(newWatchlistItem);
  }
}