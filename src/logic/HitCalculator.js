import {rlist} from 'randgen'
import CONST from '../const/const'

var honestCalculator = function () {
	return true;
}

var manipulatedConditionCalculator = function () {
	return rlist([false, true, false]);
}

export default new class HitCalculator {
	isHitShouldBeCounted() {
		switch (CONST.CONDITION) {
			case CONST.CONDITIONS.NOT_MANIPULATED:
				return honestCalculator();
			case CONST.CONDITIONS.MANIPULATED:
				return manipulatedConditionCalculator();
		}
	}
}
