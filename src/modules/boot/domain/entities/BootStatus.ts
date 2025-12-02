export class BootStatus {
  constructor(
    public progress: number = 0,
    public message: string = 'Inicializando...'
  ) {}
}
