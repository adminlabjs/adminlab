import { random, randomColor, randomDate, randomString } from "./utils";
import { randomCity, randomProvince, randomTeam } from "./city";

export type Item = ReturnType<typeof mockData>;

export const mockData = (id: number, user_name = randomString()) => {
	const created_at = randomDate();
	const city = randomCity();
	const province = randomProvince(city);

	return {
		id,
		user_name,
		is_online: Math.random() > 0.5 ? 1 : 0,
		progress: Math.random() * 100,
		level: Math.random() > 0.5 ? 1 : Math.random() > 0.5 ? 2 : 3,
		created_at: randomDate(),
		updated_at: randomDate(created_at),
		link: `http://www.baidu.com/s?wd=${user_name}`,
		color: randomColor(),
		avatar: "https://picsum.photos/50/50?t=" + Math.random(),
		image: "https://picsum.photos/160/90?t=" + Math.random(),
		last_login_time: randomDate(),
		city,
		province,
		team: randomTeam(province),
		is_deleted: Math.random() > 0.65 ? 1 : 0,
	}
}

export const generateData = (count: number) => {
	const data: Item[] = [];	

	for(let i = 0; i < count; i++) {
		data.push(mockData(i + 1));
	}

	// todo: 解决 id 与 created_at的冲突
	return data.sort((a, b) => a.id > b.id ? -1 : a.id === b.id ? 0 : 1);
}
