import { Request, Response } from 'express';
import mapStatusHTTP from '../utils/mapStatusHTTP';
import MatchService from '../services/MatchService';

export default class MatchController {
  constructor(
    private matchService = new MatchService(),
  ) {}

  public async findAll(req: Request, res: Response) {
    const { inProgress } = req.query as { inProgress?: string };

    const result = inProgress === 'true' || inProgress === 'false'
      ? await this.matchService.findByProgress(inProgress === 'true')
      : await this.matchService.findAll();

    const { status, data } = result;

    return res.status(mapStatusHTTP(status)).json(data);
  }

  public async finishMatch(req: Request, res: Response) {
    const { id } = req.params;

    const { status, data } = await this.matchService.finishMatch(Number(id));
    return res.status(mapStatusHTTP(status)).json(data);
  }

  public async updateMatch(req: Request, res: Response) {
    const { id } = req.params;
    const { homeTeamGoals, awayTeamGoals } = req.body;

    const { status, data } = await this.matchService
      .updateMatch(Number(id), homeTeamGoals, awayTeamGoals);
    return res.status(mapStatusHTTP(status)).json(data);
  }

  public async createMatch(req: Request, res: Response) {
    req.body.inProgress = true;

    const { status, data } = await this.matchService.createMatch(req.body);
    return res.status(mapStatusHTTP(status)).json(data);
  }
}
