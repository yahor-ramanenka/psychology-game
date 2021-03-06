let CONSTANTS = {
	SCREEN: {
		WIDTH: 800,
		HEIGHT: 600
	},
	MOVEMENT: {
		X: {
			MEAN: 1.8,
			DEVIATION: 0.2
		},
		Y: {
			MEAN: 1.8,
			DEVIATION: 0.2
		},
		TIME: {
			MEAN: 0.8,
			DEVIATION: 0.3
		}
	},
	TIME: {
		PAUSE_BEFORE_NEXT_SHOT: 1000
	},
	CONDITIONS: {
		MANIPULATED: 2,
		NOT_MANIPULATED: 1
	},
	MAX_TURNS: 50,
	SERVICE_URL: "http://e4.aitigo.de/ajax/g1stat.php",
	HIT_TYPES: {
		MISS: 0,
		HIT: 1,
		MISS_SIMULATED: 2
	}
}
CONSTANTS.CONDITION = CONSTANTS.CONDITIONS.MANIPULATED;

export default CONSTANTS
