export const processUnixTimestamp = (val: any) => {
	if (typeof val === "number") {
		if (val.toString().length === 10) {
			return val * 1000;
		}
	}

	return val;
}

export const filter = <T = any>(ary: T[], predicate: (value: T, index: number) => boolean): {
	match: T[];
	mismatch: T[];
} => {
	const match: T[] = [];
	const mismatch: T[] = [];

	for(let i = 0; i < ary.length; i++) {
		const val = ary[i];
		predicate(val, i) ? match.push(val) : mismatch.push(val)
	}

	return {
		match,
		mismatch,
	}
}
