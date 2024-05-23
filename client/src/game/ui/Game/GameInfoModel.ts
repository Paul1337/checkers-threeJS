import { PointType } from '@shared/game/domain/entities/Matrix/Matrix.entity';
import { types } from 'mobx-state-tree';

export const GameInfo = types
    .model({
        myTurn: false,
        myColor: PointType.White,
    })
    .actions(self => ({
        setMyTurn(myTurn: boolean) {
            self.myTurn = myTurn;
        },
        setMyColor(myColor: PointType) {
            self.myColor = myColor;
        },
    }));
