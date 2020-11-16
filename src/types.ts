export class GridPosition {
    constructor(public x: number, public y: number) {}
}

export class LawnMowerPosition extends GridPosition{
    constructor(public orientation: Orientation, public x: number, public y: number) {
        super(x, y);
    }
}

export enum Orientation {
    N,
    E,
    S,
    W
}

export enum Instruction {
    F = 'F',
    R = 'R',
    L = 'L'
}
