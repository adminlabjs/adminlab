import { random, wrap } from "./utils";
import { generateData, mockData } from "./generator";
import type { Item } from "./generator";

export type DataItem = Item;

export const useMockApi = () => {
  const pageSize = random(20, 30);
  const pageCount = random(10, 100);

  const total = pageCount * pageSize;
  const listData = generateData(total);
  let currentId = total;
  let fetchDelay: number;

  return {
    fetch: (params: { page: number; pageSize: number } & Partial<DataItem>) => {
      return wrap(() => {
        const { page, pageSize, id, user_name, city, province, team, link } = params;

        const _listData = listData.slice().filter((item) => {
          return ![
            id ? item.id === Number(id) : true,
            user_name ? item.user_name.indexOf(user_name) > -1 : true,
            city ? item.city === city : true,
            province ? item.province === province : true,
            team ? item.team === team : true,
            link ? item.link.indexOf(link) > -1 : true,
          ].includes(false);
        });

        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        const data = _listData.slice(start, end);

        return {
          listData: data,
          total: _listData.length,
        };
      }, fetchDelay);
    },

    delete: (id: number) => {
      return wrap(() => {
        const index = listData.findIndex((item) => item.id === id);
        if (index > -1) {
          listData.splice(index, 1);
        }
      });
    },

    update: (data: Item) => {
      return wrap(() => {
        const index = listData.findIndex((item) => item.id === data.id);
        if (index > -1) {
          listData[index] = Object.assign(data, {
            updated_at: Date.now(),
          });
        }
      });
    },

    create: (data: Item) => {
      data = Object.assign({}, data);
      data.id = ++currentId;
      const mock = mockData(-1, data.user_name);
      const user = Object.assign(mock, data);

      return wrap(() => {
        listData.unshift(user);
      });
    },

    setFetchDelay: (n: number) => {
      fetchDelay = n;
    }
  };
};
