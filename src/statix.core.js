"use strict"

import Statix from "./Statix.js";
import StatixDOM from "./StatixDOM.js";
import Utils from "./Utils.js";

import {
	G_STATIX_DATASET_ID
} from "../STRING.const.js";

const statix = { 
	CONST: { DATASET_ID: G_STATIX_DATASET_ID },
	Statix,
	StatixDOM,
	Utils 
};

export default statix;