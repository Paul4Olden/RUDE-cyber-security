import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const config: AxiosRequestConfig = {
  baseURL: 'http://90.153.37.24:3001',
  timeout: 10000,
}

export const instance: AxiosInstance = axios.create(config);

interface IGetReport {
  data: Threat;
}

interface ICreateReport {
  data: Threat;
}

interface IAPI {
  getReport: (id: string) => Promise<IGetReport>;
  createReport: (formdata: FormData) => Promise<ICreateReport>;
}


export const API: IAPI = {
  createReport: (formData) => {
    console.log(formData)
    return instance.post("/threats/upload",
      formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  getReport: (id) => instance.get(`/threats/${id}`)
}

export interface IocField {
  parametr: string; //Это всегда строка, будь то айпи, урл или что-то еще
  info: string; //Это стринг в котором будет параграф из дока в котором нашлось это название
  dangerous: boolean; //Вредоносный ли урл, емейл или домен. Для файлов и хэшей всегда правда
}

export interface Malware {
  parametr: string; // Имя (чаще всего будет как и название файла)
  path: string; // Путь к файлу
  fileName: string; // Имя фалйа
  fileExtenssion: string; // Расширение файла
  associatedHash: string; // Хэш файла если будет найден в том же предложении что и файл
  info: string; //Это стринг в котором будет параграф из дока в котором нашлось это название
}

export interface ThreatFiled {
  parametr: string; //Это всегда строка, будь то айпи, урл или что-то еще
  info: string; //Это стринг в котором будет параграф из дока в котором нашлось это название
}

export interface Ioc {
  ipv4: IocField[]; //масив всех найденых айпи
  ipv6: IocField[]; //масив всех найденых айпи
  domain: IocField[]; //все найденые домены
  url: IocField[]; // все найденые урлы
  registryKey: IocField[]; // все найденые ключи регистра
  md5: IocField[]; // все найденные хеш суммы
  sha1: IocField[]; // все найденные хеш суммы
  sha256: IocField[]; // все найденные хеш суммы
  sha512: IocField[]; // все найденные хеш суммы
  ssdeep: IocField[]; // все найденные хеш суммы
  email: IocField[]; // все найденные емейлы
  [key: string]: IocField[];
}

export interface Threat {
  name: string; //Прост строка парсится из названия или первой строки файла
  cve: ThreatFiled[]; // Всей найденные све (чаще всего будет только 1)
  cwe: ThreatFiled[]; // Все найденые све 
  software: Malware[]; // Все зараженные софты (не факт что сможем отличать вредоносов от софтвейр)
  malware: Malware[]; // Все вредоносы и инфа по ним
  threatActor: ThreatFiled[]; // Киберпреступные групировки и ссылки на параграфы где их имена встречались
  industry: ThreatFiled[]; // Индустрии и параграфы где они указаны
  mitreAattack: ThreatFiled[]; // Атаки и параграфы где они указаны
  county: ThreatFiled[]; // Страны и параграфы где они указаны
  city: ThreatFiled[]; // Города (опционально)
  timeStamp: ThreatFiled[]; // Тут сложнее, но как минимум будет список дат и параграфы где они указаны
  ioc: Ioc; // Иоки которые найденны в документе
  document: string;// вернет отформатированный тхт документ, не уверен надо ли это
  rating: string; // от 0 до 10
  threadUID: string;
}

