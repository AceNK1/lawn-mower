import fs from 'fs';
import path from 'path';
import { LawnMowerControl } from './lawn-mower-control';
import { GridPosition, LawnMowerPosition, Orientation } from './types';
const fsPromise = fs.promises;

export class LawnHandler {
    private lawnMowerControl: LawnMowerControl = new LawnMowerControl();
    /* Parses raw mowers data from input file,
    initiates Lawn Control with parsed data,
    executes mowers routes and writes the formatted positions to file */
    public parseAndExecute(inputPath: string, outputFile: string) {
        const fileData = this.readFile(inputPath).then(data => {
            if(data){
                console.log('Lawn mowers input:\n' + data);
                if(this.tryParseControlData(data)){
                    const endPositions = this.lawnMowerControl.executeMowersRoutes();
                    const result = this.stringifyResult(endPositions);
                    console.log('Lawn mowers output:\n' + result);
                    this.writeFile(outputFile, result);
                }
            }
        });
    }
    private tryParseControlData(fileData: string): boolean {
        const lines = fileData.split(/\r?\n/);
        if(lines.length <= 1) {
            console.log('Insufficient data');
            return false;
        }
        try {
            const maxPosValues = lines[0].split(' ');
            const maxPosition = new GridPosition(+maxPosValues[0], +maxPosValues[1]);
            const routes: string[] = [];
            const mowersPos: LawnMowerPosition[] = [];
            for(let i = 1; i < lines.length; i++){
                const mowerPos = lines[i].split(' ');
                mowersPos.push(new LawnMowerPosition(Orientation[mowerPos[2]], +mowerPos[0], +mowerPos[1]));
                routes.push(lines[++i]);
            }
            this.lawnMowerControl.initControl(maxPosition, mowersPos, routes);
            return true;
        }
        catch (e) {
            console.log('Error while parsing data: ' + e);
            return false;
        }
    }

    private stringifyResult(positions: LawnMowerPosition[]) : string {
        let result = '';
        positions.forEach(pos => {
            result = result.concat(`${pos.x} ${pos.y} ${Orientation[pos.orientation]}\n`);
        })
        return result;
    }

    private async readFile(filePath: string) {
        const resolvedPath = path.join(__dirname, filePath);
        try {
            return await fsPromise.readFile(resolvedPath, 'utf8');
        }
        catch (e) {
            console.log('Error while reading input file: ' + e);
        }
    }

    private async writeFile(filePath: string, data: string) {
        const resolvedPath = path.join(__dirname, filePath);
        try {
            return await fsPromise.writeFile(resolvedPath, data);
        }
        catch (e) {
            console.log('Error while writing to ouput file: ' + e);
        }
    }
}