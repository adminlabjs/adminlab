import { wrap, random, randomDate } from "./utils";

const CITY_MAP = {
  北京: "密云区，延庆区，朝阳区，丰台区，石景山区，海淀区，门头沟区，房山区，通州区，顺义区，昌平区，大兴区，怀柔区，平谷区，东城区，西城区".split(
    "，"
  ),
  上海: "黄浦区、徐汇区、长宁区、静安区、普陀区 、虹口区、杨浦区、浦东新区、闵行区、宝山区、嘉定区、金山区、松江区、青浦区、奉贤区、崇明区".split(
    "、"
  ),
  深圳: "福田区、罗湖区、南山区、盐田区、宝安区、龙岗区、坪山区、龙华区、光明区、大鹏新区".split(
    "、"
  ),
};

const cities = Object.keys(CITY_MAP);

const getProvinces = (cityName: string) => {
  return CITY_MAP[cityName] || [];
};

const getTeams = (province: string) => {
  const str = "abcdefghij".toUpperCase();

  return new Array(10).fill("").map((_, i) => `${province}_${str[i]}组`);
};

export const randomCity = () => {
  const i = random(0, cities.length - 1);
  return cities[i];
};

export const randomProvince = (cityName: string) => {
  const provinces = getProvinces(cityName);
  const i = random(0, provinces.length - 1);
  return provinces[i];
};

export const randomTeam = (province: string) => {
  const teams = getTeams(province);
  const i = random(0, teams.length - 1);
  return teams[i];
};

export const loadCities = (): Promise<string[]> => {
  return wrap(() => cities);
};

export const loadProvinces = (cityName: string): Promise<string[]> => {
  return wrap(() => getProvinces(cityName));
};

export const loadTeams = (province: string) => {
  return wrap(() => getTeams(province))
};
