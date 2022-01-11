import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    const games = await this.repository
      .createQueryBuilder("game")
      .where("game.title ILIKE :param", { param: `%${param}%` })
      .getMany();
    return games;
  }

  async countAllGames(): Promise<[{ count: string }]> {
    const gamesCount = 
      await this.repository.query(`
        SELECT 
          COUNT (*) 
        FROM games
    `);

    return gamesCount;
  }

  async findUsersByGameId(game_id: string): Promise<User[]> {
    const game = await this.repository
      .createQueryBuilder("game")
      .leftJoinAndSelect("game.users", "user")
      .where("game.id = :game_id", { game_id })
      .getOne();

    if (!game) {
      throw new Error('Game not found');
    }

    return game.users;
  }
}
