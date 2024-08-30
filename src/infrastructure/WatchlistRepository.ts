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

  async addWatchlistItem(watchlistId: number, movieId: number) {
    //NEED TO ADD SOMETHING THAT PREVENTS ADDING A MOVIE THAT IS ALREADY ON THE LIST, or maybe that should be on the front end?
    const newWatchlistItem: InsertWatchlist = { id: 7, watchlistId: watchlistId, userId: 1, movieId: movieId };  //CHANGE USERID TO USE GLOBAL USER ID VARIABLE. ALSO CHANGE id
    await this.databaseAdapter.getClient().insert(watchlistsTable).values(newWatchlistItem);
  }
}