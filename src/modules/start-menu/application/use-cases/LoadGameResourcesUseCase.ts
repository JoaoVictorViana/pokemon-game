import { BootLoaderService } from '../../domain/services/BootLoaderService'

export class LoadGameResourcesUseCase {
  constructor(private service: BootLoaderService) {}

  async execute(update: (p: number, m: string) => void) {
    await this.service.runAll(update)
  }
}
