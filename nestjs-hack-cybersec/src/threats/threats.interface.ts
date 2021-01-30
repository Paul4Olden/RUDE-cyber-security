export interface IocField {
  parametr: string; //Это всегда строка, будь то айпи, урл или что-то еще
  paragraph: string; //Это стринг в котором будет параграф из дока в котором нашлось это название
  dangerous: boolean; //Истина если в параграфе в котором найден параметр содержиться кейворд
}

export interface ThreatFiled {
  parametr: string; //Это всегда строка, будь то айпи, урл или что-то еще
  paragraph: string; //Это стринг в котором будет параграф из дока в котором нашлось это название
}

export interface Ioc {
  ipv4: IocField[]; 
  ipv6: IocField[];
  domain: IocField[];
  url: IocField[];
  registryKey: IocField[];
  filePath: IocField[];
  md5: IocField[];
  sha1: IocField[];
  sha256: IocField[];
  sha512: IocField[];
  ssdeep: IocField[];
  email: IocField[];
}

export interface Threat {
  name: string;
  cve: ThreatFiled[];
  cwe: ThreatFiled[];
  software: ThreatFiled[];
  malware: ThreatFiled[];
  threatActor: ThreatFiled[];
  industry: ThreatFiled[];
  mitreAattack: ThreatFiled[];
  county: ThreatFiled[];
  city: ThreatFiled[];
  timeStamp: ThreatFiled[];
  ioc: Ioc;
  document: string;// вернет отформатированный тхт документ, не уверен надо ли это
  rating: string; // от 0 до 10
}
