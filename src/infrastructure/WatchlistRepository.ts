import { max, eq, sql } from 'drizzle-orm';
import { InsertWatchlist, SelectWatchlist, watchlistsTable } from "./schemas/watchlistsSchema"
import { InsertWatchlistItem, SelectWatchlistItem, watchlistItemsTable } from './schemas/watchlistItemsSchema';
import { moviesTable } from './schemas/moviesSchema';
import { DatabaseAdapter } from './DatabaseAdapter';
import { Watchlist } from '../business/watchlist/Watchlist';



// --- MAKE USER ID A GLOBAL VARIABLE ---

export class WatchlistRepository {
    private databaseAdapter;

    constructor(databaseAdapter: DatabaseAdapter) {
        this.databaseAdapter = databaseAdapter;
    }

    async getWatchlistByWatchListId(id: SelectWatchlist['id']): Promise<
    Watchlist
  > {
    const response = await this.databaseAdapter.getClient().select({
      watchlistName: watchlistsTable.watchlistName,
      movieId: moviesTable.movieId,
      title: moviesTable.title,
      director: moviesTable.director
    }).from(watchlistsTable).innerJoin(watchlistItemsTable, eq(watchlistsTable.id, watchlistItemsTable.watchlistId)).innerJoin(moviesTable, eq(watchlistItemsTable.movieId, moviesTable.movieId)).where(eq(watchlistsTable.id, id));
    let watchlist = new Watchlist(id, response);
    return watchlist;
  }

  async addWatchlistItem(watchlistId: number, movieId: number) {
    let newWatchlistItem: InsertWatchlist;
    let maxId = await this.databaseAdapter.getClient().select({ max: max(watchlistItemsTable.id) }).from(watchlistItemsTable);
    let newId = maxId[0].max + 1;
    newWatchlistItem = { id: newId, watchlistId: watchlistId, movieId: movieId };  
    await this.databaseAdapter.getClient().insert(watchlistItemsTable).values(newWatchlistItem);
  }
}