import { BootLoaderService } from '../../domain/services/BootLoaderService'
import { BootStatus } from '../../domain/entities/BootStatus'

export class LoadGameResourcesUseCase {
  constructor(private service: BootLoaderService) {}

  async execute(update: (p: number, m: string) => void) {
    const bootStatus = new BootStatus()

    update(bootStatus.progress, bootStatus.message)
    await this.service.runAll(update)
  }
}
