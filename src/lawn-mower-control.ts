import { GridPosition, Instruction, LawnMowerPosition, Orientation } from "./types";

/* LawnMowerControl manipulates mowers position and orientation.
It does not parses or handles raw data, in order to be easily testable */
export class LawnMowerControl {
    private maxPosition!: GridPosition;
    private mowerPositions: LawnMowerPosition[] = [];
    private routes: string[] = [];
    private moveMap: Map<Orientation, Function> = new Map;

    /* Lawn Mower Control init can be run multiple times,
    with different grid and different mowers and routes */
    public initControl(maxPosition: GridPosition, startPositions: LawnMowerPosition[], routes: string[]){
        this.maxPosition = maxPosition || new GridPosition(1, 1);
        this.mowerPositions = startPositions;
        this.routes = routes;
        /* Build map for moves in each direction.
        This avoids using a bug-prone if-else or switch-case,
        andis also faster in each instruction */
        this.moveMap.set(Orientation.N, (position: LawnMowerPosition) => {
            if(position.y < this.maxPosition.y){
                return position.y++;
            }
        });
        this.moveMap.set(Orientation.E, (position: LawnMowerPosition) => {
            if(position.x < this.maxPosition.x){
                return position.x++;
            }
        });
        this.moveMap.set(Orientation.S, (position: LawnMowerPosition) => {
            if(position.y > 0){
                return position.y--;
            }
        });
        this.moveMap.set(Orientation.W, (position: LawnMowerPosition) => {
            if(position.x > 0){
                return position.x--;
            }
        });
    }

    /* Move all mowers with their respective routes,
    and return the mowers' respective final positions */
    public executeMowersRoutes() : LawnMowerPosition[] {
        for(let i = 0; i < this.mowerPositions.length; i++){
            [...this.routes[i]].forEach(routeInstruction => {
                this.executeSingleInstruction(this.mowerPositions[i], routeInstruction);
            })
        }
        return this.mowerPositions;
    }

    private executeSingleInstruction(mowerPosition: LawnMowerPosition, instruction: string){
        if(Instruction[instruction] == Instruction.F){
            this.moveMowerForward(mowerPosition);
        }
        else {
            this.rotateMower(mowerPosition, instruction);
        }
    }

    /* Move mower to the next position,
    given its current coordinates and orientation */
    private moveMowerForward(mowerPosition: LawnMowerPosition){
        this.moveMap.get(mowerPosition.orientation)?.call(this, mowerPosition);
    }

    /* Rotate mower in a given position,
    either clockwise (+1) or counterclockwise (-1) */
    private rotateMower(mowerPosition: LawnMowerPosition, rotateDirection: string) {
        const OrientationCount = 4;
        const newOrientation = (rotateDirection == Instruction.R) ? mowerPosition.orientation + 1 : mowerPosition.orientation - 1;
        mowerPosition.orientation = newOrientation < 0 ? newOrientation + OrientationCount : newOrientation % OrientationCount;
    }
}