export const processUnixTimestamp = (val: any) => {
	if (typeof val === "number") {
		if (val.toString().length === 10) {
			return val * 1000;
		}
	}

	return val;
}
