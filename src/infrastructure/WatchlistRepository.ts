import { max, eq } from 'drizzle-orm';
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
    return watchlist;
  }

  async addWatchlistItem(userId: number, movieId: number, watchlistId?: number) {
    let newWatchlistItem: InsertWatchlist;
    let maxId = await this.databaseAdapter.getClient().select({ max: max(watchlistsTable.id) }).from(watchlistsTable);
    let newId = maxId[0].max + 1;
    if (typeof watchlistId !== undefined) {
      newWatchlistItem = { id: newId, watchlistId: watchlistId, userId: userId, movieId: movieId };  
    } else {
      let maxWatchlistId = await this.databaseAdapter.getClient().select({ max: max(watchlistsTable.watchlistId) }).from(watchlistsTable).where(eq(watchlistsTable.userId, 1));
      newWatchlistItem = { id: newId, watchlistId: maxWatchlistId[0].max + 1, userId: userId, movieId: movieId };  
    }
    await this.databaseAdapter.getClient().insert(watchlistsTable).values(newWatchlistItem);
  }
}