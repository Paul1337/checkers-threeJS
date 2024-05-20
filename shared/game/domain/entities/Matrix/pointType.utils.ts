import { PointType } from './Matrix.entity';

export const pointTypesOpposite = (pointType1: PointType, pointType2: PointType) => {
    return (
        (pointType1 === PointType.Black && pointType2 === PointType.White) ||
        (pointType1 === PointType.White && pointType2 === PointType.Black)
    );
};
