export class IngresoEgreso {
  constructor(
    public description: string,
    public monto: string,
    public tipo: string,
    public uid?: string
  ) {}
}
