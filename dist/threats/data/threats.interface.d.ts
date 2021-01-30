export interface IocField {
    parameter: string;
    info: string;
    dangerous: boolean;
}
export interface Malware {
    parameter: string;
    path: string;
    fileName: string;
    fileExtenssion: string;
    associatedHash: string;
    info: string;
}
export interface ThreatFiled {
    parameter: string;
    info: string;
}
export interface Ioc {
    ipv4: IocField[];
    ipv6: IocField[];
    domain: IocField[];
    url: IocField[];
    registryKey: IocField[];
    md5: IocField[];
    sha1: IocField[];
    sha256: IocField[];
    sha512: IocField[];
    ssdeep: IocField[];
    email: IocField[];
}
export interface Threat {
    threadUID: string;
    name: string;
    cve: ThreatFiled[];
    cwe: ThreatFiled[];
    software: Malware[];
    malware: Malware[];
    threatActor: ThreatFiled[];
    industry: ThreatFiled[];
    mitreAattack: ThreatFiled[];
    county: ThreatFiled[];
    city: ThreatFiled[];
    timeStamp: ThreatFiled[];
    ioc: Ioc;
    document: string;
    rating: string;
    comment: string;
}
