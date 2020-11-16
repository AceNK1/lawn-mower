import { LawnMowerControl } from '../src/lawn-mower-control';
import { GridPosition, LawnMowerPosition, Orientation } from '../src/types';

let control: LawnMowerControl;

beforeAll(() => {
    control = new LawnMowerControl();
});

test('Should move mower east by 1', () => {
    const max = new GridPosition(1,1);
    const route = 'F';
    const mower = new LawnMowerPosition(Orientation.E, 0, 0);
    control.initControl(max, [mower], [route]);
    const result = control.executeMowersRoutes();
    expect(result[0].x).toBe(1);
});

test('Should rotate north to south clockwise', () => {
    const max = new GridPosition(0,0);
    const route = 'RR';
    const mower = new LawnMowerPosition(Orientation.N, 0, 0);
    control.initControl(max, [mower], [route]);
    const result = control.executeMowersRoutes();
    expect(result[0].orientation).toBe(Orientation.S);
});

test('Should rotate north to south counterclockwise', () => {
    const max = new GridPosition(0,0);
    const route = 'LL';
    const mower = new LawnMowerPosition(Orientation.N, 0, 0);
    control.initControl(max, [mower], [route]);
    const result = control.executeMowersRoutes();
    expect(result[0].orientation).toBe(Orientation.S);
});

test('Should not move mower out of bounds', () => {
    const max = new GridPosition(2,0);
    const route = 'FFF';
    const mower = new LawnMowerPosition(Orientation.E, 0, 0);
    control.initControl(max, [mower], [route]);
    const result = control.executeMowersRoutes();
    expect(result[0].orientation).not.toBe(3)
})

test('Should move mower from upper right corner to lower left corner', () => {
    const max = new GridPosition(2,2);
    const route = 'FLFRFLF';
    const mower = new LawnMowerPosition(Orientation.W, 2, 2);
    control.initControl(max, [mower], [route]);
    const result = control.executeMowersRoutes();
    expect(result[0].x).toBe(0);
    expect(result[0].y).toBe(0);
});

test('Should move 3 mowers', () => {
    const max = new GridPosition(1,1);
    const routes = ['F', 'F', 'F'];
    const mowers = [new LawnMowerPosition(Orientation.W, 1, 0),
                    new LawnMowerPosition(Orientation.E, 0, 1),
                    new LawnMowerPosition(Orientation.N, 1, 0)];
    control.initControl(max, mowers, routes);
    const result = control.executeMowersRoutes();
    expect(result[0].x).toBe(0);
    expect(result[1].x).toBe(1);
    expect(result[2].y).toBe(1);
});